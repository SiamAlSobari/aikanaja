import { t } from 'elysia'

// GET /erd/projects — List query params
export const ListProjectsQuery = t.Object({
  page: t.Optional(t.String()),
  limit: t.Optional(t.String()),
  sort: t.Optional(t.Union([t.Literal('name'), t.Literal('createdAt'), t.Literal('updatedAt')])),
  order: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')])),
  filter: t.Optional(t.Union([t.Literal('all'), t.Literal('active'), t.Literal('deleted'), t.Literal('shared')])),
  search: t.Optional(t.String()),
})

// POST /erd/projects — Create body
export const CreateProjectBody = t.Object({
  name: t.String({ minLength: 1, maxLength: 100 }),
  description: t.Optional(t.String({ maxLength: 500 })),
})

// PATCH /erd/projects/:id — Update body
export const UpdateProjectBody = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
  description: t.Optional(t.String({ maxLength: 500 })),
  schema: t.Optional(t.String()),
  visibility: t.Optional(t.Union([t.Literal('private'), t.Literal('public')])),
})

// Params dengan id
export const ProjectIdParams = t.Object({
  id: t.String(),
})
