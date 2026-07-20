import { Elysia } from 'elysia'
import { projectController } from './controllers/project.controller'
import { aiController } from './controllers/ai.controller'
import { versionController } from './controllers/version.controller'
import { shareController, publicShareController } from './controllers/share.controller'
import { adminController } from './controllers/admin.controller'
import { chatHistoryController } from './controllers/chat-history.controller'
import { virtualReviewHistoryController } from './controllers/virtual-review-history.controller'
import { templateController } from './controllers/template.controller'
import { auditLogController } from './controllers/audit-log.controller'

export const prdModule = new Elysia()
  .use(projectController)
  .use(aiController)
  .use(versionController)
  .use(shareController)
  .use(publicShareController)
  .use(adminController)
  .use(chatHistoryController)
  .use(virtualReviewHistoryController)
  .use(templateController)
  .use(auditLogController)
