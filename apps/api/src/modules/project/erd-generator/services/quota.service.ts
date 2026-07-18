import { prisma } from '../../../../lib/prisma'

interface QuotaInfo {
  count: number
  limit: number
  remaining: number
  isUnlimited: boolean
}

export class QuotaService {
  // Cek quota user bulan ini
  async checkQuota(userId: string): Promise<QuotaInfo> {
    const month = this.getCurrentMonth()

    const usage = await prisma.usage.findUnique({
      where: {
        userId_month: { userId, month },
      },
    })

    const count = usage?.count || 0
    const limit = usage?.limit || 10 // default: 10 (free plan)
    const isUnlimited = limit === -1 // -1 = unlimited

    return {
      count,
      limit,
      remaining: isUnlimited ? Infinity : Math.max(0, limit - count),
      isUnlimited,
    }
  }

  // Increment usage
  async incrementUsage(userId: string): Promise<void> {
    const month = this.getCurrentMonth()

    await prisma.usage.upsert({
      where: {
        userId_month: { userId, month },
      },
      update: {
        count: { increment: 1 },
      },
      create: {
        userId,
        month,
        count: 1,
        limit: 10, // default free plan
      },
    })
  }

  // Update limit (saat upgrade plan)
  async updateLimit(userId: string, limit: number): Promise<void> {
    const month = this.getCurrentMonth()

    await prisma.usage.upsert({
      where: {
        userId_month: { userId, month },
      },
      update: { limit },
      create: {
        userId,
        month,
        count: 0,
        limit,
      },
    })
  }

  // Format: "2026-07"
  private getCurrentMonth(): string {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }
}
