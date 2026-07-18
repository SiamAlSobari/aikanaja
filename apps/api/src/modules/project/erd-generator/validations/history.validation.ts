import { t } from 'elysia'

// POST /erd/projects/:id/history — Save version
export const SaveVersionBody = t.Object({
  schema: t.String(),
  description: t.Optional(t.String()),
})
