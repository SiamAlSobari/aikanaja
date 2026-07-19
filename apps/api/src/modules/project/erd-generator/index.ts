import { Elysia } from 'elysia'
import { projectController } from './controllers/project.controller'
import { schemaController } from './controllers/schema.controller'
import { exportController } from './controllers/export.controller'
import { billingController } from './controllers/billing.controller'
import { shareController, sharePublicController } from './controllers/share.controller'
import { historyController } from './controllers/history.controller'
import { chatController } from './controllers/chat.controller'
import { templatePublicController, templateController } from './controllers/template.controller'
import { adminController } from './controllers/admin.controller'
import { activityController } from './controllers/activity.controller'

export const erdModule = new Elysia()
  .use(projectController)
  .use(schemaController)
  .use(exportController)
  .use(billingController)
  .use(shareController)
  .use(sharePublicController)
  .use(historyController)
  .use(chatController)
  .use(templatePublicController)
  .use(templateController)
  .use(adminController)
  .use(activityController)
