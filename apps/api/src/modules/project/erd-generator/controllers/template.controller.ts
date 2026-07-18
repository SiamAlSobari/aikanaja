import { Elysia, t } from 'elysia'
import { authMiddleware, optionalAuthMiddleware } from '../../../../common/middlewares/auth.middleware'
import { TemplateService } from '../services/template.service'

const templateService = new TemplateService()

// Public routes (no auth)
export const templatePublicController = new Elysia({ prefix: '/erd/templates' })
  // GET /erd/templates — List templates
  .get('/', async ({ query }) => {
    return templateService.listTemplates(query.category)
  }, {
    query: t.Object({ category: t.Optional(t.String()) }),
  })

  // GET /erd/templates/:id — Get template detail
  .get('/:id', async ({ params }) => {
    return templateService.getTemplate(params.id)
  }, {
    params: t.Object({ id: t.String() }),
  })

// Protected routes (auth required)
export const templateController = new Elysia({ prefix: '/erd/templates' })
  .use(authMiddleware())

  // POST /erd/templates/:id/use — Create project from template
  .post('/:id/use', async ({ user, params, body }) => {
    return templateService.useTemplate(user.id, params.id, body.name)
  }, {
    params: t.Object({ id: t.String() }),
    body: t.Object({ name: t.Optional(t.String()) }),
  })
