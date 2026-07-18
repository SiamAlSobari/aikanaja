import { prisma } from '../../../../lib/prisma'
import { NotFoundException, BadRequestException } from 'elysia-http-exception'

type PlanTier = 'free' | 'pro' | 'team'

interface BillingInfo {
  plan: PlanTier
  status: string
  usage: { count: number; limit: number; remaining: number | string }
  payments: any[]
}

// Plan limits
const PLAN_LIMITS: Record<PlanTier, number> = {
  free: 10,
  pro: -1, // unlimited
  team: -1,
}

// Dana payment info (bisa dipindah ke env)
const PAYMENT_INFO = {
  danaNumber: '08826545202',
  whatsappUrl: 'https://wa.me/628826545202',
}

export class BillingService {
  /** Get billing info user (plan, usage, payment history) */
  async getBillingInfo(userId: string): Promise<BillingInfo> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    })

    if (!user) throw new NotFoundException('User not found')

    // Get usage bulan ini
    const month = this.getCurrentMonth()
    const usage = await prisma.usage.findUnique({
      where: { userId_month: { userId, month } },
    })

    const plan: PlanTier = this.getPlanFromRole(user.role)
    const limit = PLAN_LIMITS[plan]
    const count = usage?.count || 0
    const isUnlimited = limit === -1

    // Get payment history
    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    return {
      plan,
      status: 'active',
      usage: {
        count,
        limit: isUnlimited ? -1 : limit,
        remaining: isUnlimited ? 'unlimited' : Math.max(0, limit - count),
      },
      payments,
    }
  }

  /** Request upgrade (create pending payment) */
  async requestUpgrade(userId: string, plan: PlanTier) {
    if (plan === 'free') throw new BadRequestException('Cannot upgrade to free plan')

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, email: true },
    })

    if (!user) throw new NotFoundException('User not found')

    const currentPlan = this.getPlanFromRole(user.role)
    if (currentPlan === plan) {
      throw new BadRequestException(`Already on ${plan} plan`)
    }

    // Amount berdasarkan plan
    const amount = plan === 'pro' ? 99000 : 299000 // Rp 99rb / Rp 299rb

    const payment = await prisma.payment.create({
      data: {
        userId,
        plan,
        amount,
        method: 'dana',
        status: 'pending',
      },
    })

    return {
      payment,
      paymentInfo: PAYMENT_INFO,
      instructions: [
        `1. Transfer Rp ${amount.toLocaleString('id-ID')} ke Dana: ${PAYMENT_INFO.danaNumber}`,
        '2. Screenshot bukti transfer',
        `3. Chat WA: ${PAYMENT_INFO.whatsappUrl} dengan bukti + email: ${user.email}`,
        '4. Tunggu verifikasi (max 1x24 jam)',
      ],
    }
  }

  /** Verify payment (admin only) */
  async verifyPayment(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    })

    if (!payment) throw new NotFoundException('Payment not found')
    if (payment.status !== 'pending') {
      throw new BadRequestException('Payment is not pending')
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'verified', verifiedAt: new Date() },
    })

    // Update user plan (role)
    const newRole = payment.plan
    await prisma.user.update({
      where: { id: payment.userId },
      data: { role: newRole },
    })

    // Update usage limit
    const limit = PLAN_LIMITS[payment.plan as PlanTier]
    const month = this.getCurrentMonth()
    await prisma.usage.upsert({
      where: { userId_month: { userId: payment.userId, month } },
      update: { limit },
      create: { userId: payment.userId, month, count: 0, limit },
    })

    return { message: 'Payment verified and plan updated' }
  }

  /** Reject payment (admin only) */
  async rejectPayment(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    })

    if (!payment) throw new NotFoundException('Payment not found')
    if (payment.status !== 'pending') {
      throw new BadRequestException('Payment is not pending')
    }

    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'rejected' },
    })

    return { message: 'Payment rejected' }
  }

  /** Cancel subscription (back to free) */
  async cancelSubscription(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    })

    if (!user) throw new NotFoundException('User not found')

    const currentPlan = this.getPlanFromRole(user.role)
    if (currentPlan === 'free') {
      throw new BadRequestException('Already on free plan')
    }

    // Update role ke free
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'user' },
    })

    // Update usage limit ke free
    const month = this.getCurrentMonth()
    await prisma.usage.upsert({
      where: { userId_month: { userId, month } },
      update: { limit: PLAN_LIMITS.free },
      create: { userId, month, count: 0, limit: PLAN_LIMITS.free },
    })

    return { message: 'Subscription cancelled, back to free plan' }
  }

  // --- Helpers ---

  private getPlanFromRole(role: string): PlanTier {
    if (role === 'pro') return 'pro'
    if (role === 'team') return 'team'
    return 'free'
  }

  private getCurrentMonth(): string {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }
}
