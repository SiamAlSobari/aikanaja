import { Elysia, t } from 'elysia'
import { authMiddleware } from '../../../../common/middlewares/auth.middleware'
import { AuditLogService } from '../services/audit-log.service'

const auditLogService = new AuditLogService()

export const auditLogController = new Elysia({ prefix: '/prd/projects' })
  .use(authMiddleware())

  // GET /prd/projects/:id/audit-logs — Fetch audit trail history
  .get(
    '/:id/audit-logs',
    async ({ user, params, query }) => {
      const limit = query.limit ? Number(query.limit) : 50
      const data = await auditLogService.listAuditLogs(user.id, params.id, limit)
      return { success: true, data }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      query: t.Object({
        limit: t.Optional(t.Number()),
      }),
    }
  )
