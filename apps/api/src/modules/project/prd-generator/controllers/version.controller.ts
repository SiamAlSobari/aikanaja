import { Elysia, t } from 'elysia'
import { authMiddleware } from '../../../../common/middlewares/auth.middleware'
import { VersionService } from '../services/version.service'
import { BadRequestException } from 'elysia-http-exception'

const versionService = new VersionService()

export const versionController = new Elysia({ prefix: '/prd/projects' })
  .use(authMiddleware())

  // GET /prd/projects/:id/versions — List all snapshots for a project
  .get(
    '/:id/versions',
    async ({ user, params }) => {
      const data = await versionService.listVersions(user.id, params.id)
      return { success: true, data }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // POST /prd/projects/:id/versions — Create snapshot manually
  .post(
    '/:id/versions',
    async ({ user, params, body }) => {
      const data = await versionService.createVersionSnapshot(user.id, params.id, body)
      return { success: true, data }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        content: t.String({ minLength: 1 }),
        title: t.Optional(t.String()),
        qualityScore: t.Optional(t.Number()),
        storyPointsTotal: t.Optional(t.Number()),
      }),
    }
  )

  // GET /prd/projects/:id/versions/:versionId — Get single snapshot details
  .get(
    '/:id/versions/:versionId',
    async ({ user, params }) => {
      const data = await versionService.getVersion(user.id, params.id, params.versionId)
      return { success: true, data }
    },
    {
      params: t.Object({
        id: t.String(),
        versionId: t.String(),
      }),
    }
  )

  // GET /prd/projects/:id/diff?vA=versionIdA&vB=versionIdB — Compare 2 snapshots
  .get(
    '/:id/diff',
    async ({ user, params, query }) => {
      if (!query.vA || !query.vB) {
        throw new BadRequestException('Query parameters vA and vB are required')
      }
      const data = await versionService.getVersionDiff(user.id, params.id, query.vA, query.vB)
      return { success: true, data }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      query: t.Object({
        vA: t.String(),
        vB: t.String(),
      }),
    }
  )

  // POST /prd/projects/:id/versions/:versionId/restore — Restore specific snapshot
  .post(
    '/:id/versions/:versionId/restore',
    async ({ user, params }) => {
      const data = await versionService.restoreVersion(user.id, params.id, params.versionId)
      return { success: true, data }
    },
    {
      params: t.Object({
        id: t.String(),
        versionId: t.String(),
      }),
    }
  )
