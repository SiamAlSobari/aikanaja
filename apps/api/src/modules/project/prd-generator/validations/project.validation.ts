import { t } from 'elysia'

// GET /prd/projects — List query params
export const ListProjectsQuery = t.Object({
  page: t.Optional(t.String()),
  limit: t.Optional(t.String()),
  sort: t.Optional(t.Union([t.Literal('title'), t.Literal('createdAt'), t.Literal('updatedAt')])),
  order: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')])),
  filter: t.Optional(t.Union([t.Literal('all'), t.Literal('active'), t.Literal('deleted')])),
  search: t.Optional(t.String()),
})

// POST /prd/projects — Create body
export const CreateProjectBody = t.Object({
  title: t.String({ minLength: 1, maxLength: 100 }),
  description: t.Optional(t.String({ maxLength: 500 })),
  templateType: t.Optional(t.String()),
})

// PATCH /prd/projects/:id — Update body
export const UpdateProjectBody = t.Object({
  title: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
  description: t.Optional(t.String({ maxLength: 500 })),
  content: t.Optional(t.String()),
  templateType: t.Optional(t.String()),
  erdLinkId: t.Optional(t.String()),
})

// Params dengan id
export const ProjectIdParams = t.Object({
  id: t.String(),
})
