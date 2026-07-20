import { prisma } from '../../../../lib/prisma'
import { InternalServerErrorException } from 'elysia-http-exception'

export type PlanTier = 'free' | 'pro' | 'team'

export interface PrdQuotaCheckResult {
  allowed: boolean
  currentCount: number
  limit: number
  plan: PlanTier
  module: 'prd'
}

export class PrdBillingService {
  /** Format month key khusus PRD Generator: "YYYY-MM:prd" */
  private getPrdMonthKey(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}:prd`
  }

  /** Fetch active user plan tier */
  async getUserPlan(userId: string): Promise<PlanTier> {
    try {
      const activePayment = await prisma.payment.findFirst({
        where: {
          userId,
          status: 'verified',
        },
        orderBy: { createdAt: 'desc' },
        select: { plan: true },
      })

      if (activePayment?.plan === 'team') return 'team'
      if (activePayment?.plan === 'pro') return 'pro'

      return 'free'
    } catch (err) {
      console.error('[PrdBillingService.getUserPlan]', { userId, err })
      return 'free'
    }
  }

  /** Check monthly PRD generation quota for user */
  async checkQuota(userId: string): Promise<PrdQuotaCheckResult> {
    try {
      const monthKey = this.getPrdMonthKey()
      const plan = await this.getUserPlan(userId)

      const limit = plan === 'free' ? 10 : -1

      const usage = await prisma.usage.findUnique({
        where: {
          userId_month: { userId, month: monthKey },
        },
      })

      const currentCount = usage?.count || 0
      const allowed = limit === -1 || currentCount < limit

      return {
        allowed,
        currentCount,
        limit,
        plan,
        module: 'prd',
      }
    } catch (err) {
      console.error('[PrdBillingService.checkQuota]', { userId, err })
      throw new InternalServerErrorException('Failed to check PRD generation quota')
    }
  }

  /** Increment PRD usage count for current month */
  async incrementUsage(userId: string) {
    try {
      const monthKey = this.getPrdMonthKey()
      const plan = await this.getUserPlan(userId)
      const limit = plan === 'free' ? 10 : -1

      return await prisma.usage.upsert({
        where: {
          userId_month: { userId, month: monthKey },
        },
        update: {
          count: { increment: 1 },
        },
        create: {
          userId,
          month: monthKey,
          count: 1,
          limit,
        },
      })
    } catch (err) {
      console.error('[PrdBillingService.incrementUsage]', { userId, err })
      throw new InternalServerErrorException('Failed to record PRD usage')
    }
  }
}
