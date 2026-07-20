import { Elysia, t } from 'elysia'
import { authMiddleware } from '../../../../common/middlewares/auth.middleware'
import { ShareService } from '../services/share.service'

const shareService = new ShareService()

export const shareController = new Elysia({ prefix: '/prd' })
  // Protected route for generating share links
  .use(authMiddleware())
  .post(
    '/projects/:id/share',
    async ({ user, params, body }) => {
      const data = await shareService.generateShareLink(user.id, params.id, body?.expiresDays)
      return { success: true, data }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Optional(
        t.Object({
          expiresDays: t.Optional(t.Number()),
        })
      ),
    }
  )

export const publicShareController = new Elysia({ prefix: '/prd' })
  // Public read-only route for accessing shared PRDs (no auth required)
  .get(
    '/share/:shareToken',
    async ({ params }) => {
      const data = await shareService.getPublicProject(params.shareToken)
      return { success: true, data }
    },
    {
      params: t.Object({
        shareToken: t.String({ minLength: 1 }),
      }),
    }
  )
