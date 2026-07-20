import { Elysia, t } from 'elysia'
import { TemplateService } from '../services/template.service'

const templateService = new TemplateService()

export const templateController = new Elysia({ prefix: '/prd/templates' })
  // GET /prd/templates — List all preset templates
  .get(
    '/',
    async ({ query }) => {
      const data = await templateService.listTemplates(query.category)
      return { success: true, data }
    },
    {
      query: t.Object({
        category: t.Optional(t.String()),
      }),
    }
  )

  // GET /prd/templates/:id — Get single template details
  .get(
    '/:id',
    async ({ params }) => {
      const data = await templateService.getTemplate(params.id)
      return { success: true, data }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
