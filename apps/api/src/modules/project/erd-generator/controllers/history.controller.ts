import { Elysia, t } from 'elysia'
import { authMiddleware } from '../../../../common/middlewares/auth.middleware'
import { HistoryService } from '../services/history.service'
import { SaveVersionBody } from '../validations/history.validation'

const historyService = new HistoryService()

export const historyController = new Elysia({ prefix: '/erd/projects' })
  .use(authMiddleware())

  // GET /erd/projects/:id/history — List versions
  .get(
    '/:id/history',
    async ({ user, params }) => {
      return historyService.getVersions(user.id, params.id)
    },
    { params: t.Object({ id: t.String() }) }
  )

  // POST /erd/projects/:id/history — Save version
  .post(
    '/:id/history',
    async ({ user, params, body }) => {
      return historyService.saveVersion(user.id, params.id, body.schema, body.description)
    },
    { params: t.Object({ id: t.String() }), body: SaveVersionBody }
  )

  // GET /erd/projects/:id/history/:versionId — Get version detail
  .get(
    '/:id/history/:versionId',
    async ({ user, params }) => {
      return historyService.getVersion(user.id, params.id, params.versionId)
    },
    { params: t.Object({ id: t.String(), versionId: t.String() }) }
  )

  // POST /erd/projects/:id/history/:versionId/restore — Restore version
  .post(
    '/:id/history/:versionId/restore',
    async ({ user, params }) => {
      return historyService.restoreVersion(user.id, params.id, params.versionId)
    },
    { params: t.Object({ id: t.String(), versionId: t.String() }) }
  )
