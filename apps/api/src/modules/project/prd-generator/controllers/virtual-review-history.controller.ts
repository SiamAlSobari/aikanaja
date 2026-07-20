import { Elysia, t } from 'elysia'
import { authMiddleware } from '../../../../common/middlewares/auth.middleware'
import { VirtualReviewHistoryService } from '../services/virtual-review-history.service'

const virtualReviewHistoryService = new VirtualReviewHistoryService()

export const virtualReviewHistoryController = new Elysia({ prefix: '/prd/projects' })
  .use(authMiddleware())

  // GET /prd/projects/:id/virtual-reviews — List historical stakeholder reviews
  .get(
    '/:id/virtual-reviews',
    async ({ user, params }) => {
      const data = await virtualReviewHistoryService.listVirtualReviews(user.id, params.id)
      return { success: true, data }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // POST /prd/projects/:id/virtual-reviews — Save stakeholder review snapshot
  .post(
    '/:id/virtual-reviews',
    async ({ user, params, body }) => {
      const data = await virtualReviewHistoryService.saveVirtualReview(user.id, params.id, body)
      return { success: true, data }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        overallScore: t.Number(),
        techLeadScore: t.Number(),
        techLeadFeedback: t.Any(),
        qaScore: t.Number(),
        qaFeedback: t.Any(),
        productSponsorScore: t.Number(),
        productSponsorFeedback: t.Any(),
        recommendations: t.Optional(t.Any()),
      }),
    }
  )
