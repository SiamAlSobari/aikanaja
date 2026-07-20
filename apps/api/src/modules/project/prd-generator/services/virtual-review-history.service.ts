import { prisma } from '../../../../lib/prisma'
import { NotFoundException, ForbiddenException, InternalServerErrorException } from 'elysia-http-exception'

export interface SaveVirtualReviewDto {
  overallScore: number
  techLeadScore: number
  techLeadFeedback: Record<string, any> | string
  qaScore: number
  qaFeedback: Record<string, any> | string
  productSponsorScore: number
  productSponsorFeedback: Record<string, any> | string
  recommendations?: string[] | string
}

export class VirtualReviewHistoryService {
  /** Ensure user owns project */
  private async ensureOwnership(userId: string, projectId: string) {
    const project = await prisma.prdProject.findUnique({
      where: { id: projectId },
      select: { id: true, userId: true },
    })

    if (!project) throw new NotFoundException('Project not found')
    if (project.userId !== userId) throw new ForbiddenException('Access denied')

    return project
  }

  /** List historical Virtual Stakeholder Reviews for a project */
  async listVirtualReviews(userId: string, projectId: string) {
    try {
      await this.ensureOwnership(userId, projectId)

      const reviews = await prisma.prdVirtualReview.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
      })

      // Safely parse JSON strings
      const formatted = reviews.map((r) => ({
        ...r,
        techLeadFeedback: typeof r.techLeadFeedback === 'string' ? JSON.parse(r.techLeadFeedback) : r.techLeadFeedback,
        qaFeedback: typeof r.qaFeedback === 'string' ? JSON.parse(r.qaFeedback) : r.qaFeedback,
        productSponsorFeedback: typeof r.productSponsorFeedback === 'string' ? JSON.parse(r.productSponsorFeedback) : r.productSponsorFeedback,
        recommendations: r.recommendations ? (typeof r.recommendations === 'string' ? JSON.parse(r.recommendations) : r.recommendations) : [],
      }))

      return formatted
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[VirtualReviewHistoryService.listVirtualReviews]', { projectId, err })
      throw new InternalServerErrorException('Failed to fetch virtual review history')
    }
  }

  /** Save a Virtual Stakeholder Review snapshot */
  async saveVirtualReview(userId: string, projectId: string, data: SaveVirtualReviewDto) {
    try {
      await this.ensureOwnership(userId, projectId)

      const review = await prisma.prdVirtualReview.create({
        data: {
          projectId,
          overallScore: data.overallScore,
          techLeadScore: data.techLeadScore,
          techLeadFeedback: typeof data.techLeadFeedback === 'string' ? data.techLeadFeedback : JSON.stringify(data.techLeadFeedback),
          qaScore: data.qaScore,
          qaFeedback: typeof data.qaFeedback === 'string' ? data.qaFeedback : JSON.stringify(data.qaFeedback),
          productSponsorScore: data.productSponsorScore,
          productSponsorFeedback: typeof data.productSponsorFeedback === 'string' ? data.productSponsorFeedback : JSON.stringify(data.productSponsorFeedback),
          recommendations: data.recommendations ? (typeof data.recommendations === 'string' ? data.recommendations : JSON.stringify(data.recommendations)) : null,
        },
      })

      return review
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[VirtualReviewHistoryService.saveVirtualReview]', { projectId, err })
      throw new InternalServerErrorException('Failed to save virtual review snapshot')
    }
  }
}
