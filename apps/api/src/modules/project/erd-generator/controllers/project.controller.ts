import { Elysia, t } from 'elysia'
import { authMiddleware } from '../../../../common/middlewares/auth.middleware'
import { ProjectService } from '../services/project.service'
import {
  ListProjectsQuery,
  CreateProjectBody,
  UpdateProjectBody,
  ProjectIdParams,
} from '../validations/project.validation'

const projectService = new ProjectService()

export const projectController = new Elysia({ prefix: '/erd/projects' })
  .use(authMiddleware())

  // GET /erd/projects — List projects
  .get(
    '/',
    async ({ user, query }) => {
      return projectService.listProjects(user.id, {
        page: query.page ? Number(query.page) : 1,
        limit: query.limit ? Number(query.limit) : 10,
        sort: query.sort || 'updatedAt',
        order: query.order || 'desc',
        filter: query.filter || 'active',
        search: query.search,
      })
    },
    { query: ListProjectsQuery }
  )

  // GET /erd/projects/:id — Get project detail
  .get(
    '/:id',
    async ({ user, params }) => {
      return projectService.getProject(user.id, params.id)
    },
    { params: ProjectIdParams }
  )

  // GET /erd/projects/schemas?ids=a,b,c — Batch ambil schema (hindari N+1)
  .get(
    '/schemas',
    async ({ query }) => {
      const ids = String(query.ids || '')
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
      const schemas = await projectService.getSchemasBatch(ids)
      return { data: schemas }
    },
    {
      query: t.Object({ ids: t.Optional(t.String()) }),
    }
  )

  // POST /erd/projects — Create project
  .post(
    '/',
    async ({ user, body, set }) => {
      const project = await projectService.createProject(user.id, body)
      set.status = 201
      return project
    },
    { body: CreateProjectBody }
  )

  // PATCH /erd/projects/:id — Update project
  .patch(
    '/:id',
    async ({ user, params, body }) => {
      return projectService.updateProject(user.id, params.id, body)
    },
    { params: ProjectIdParams, body: UpdateProjectBody }
  )

  // DELETE /erd/projects/:id — Soft delete (pindah ke trash)
  .delete(
    '/:id',
    async ({ user, params }) => {
      return projectService.deleteProject(user.id, params.id)
    },
    { params: ProjectIdParams }
  )

  // POST /erd/projects/:id/restore — Restore dari trash
  .post(
    '/:id/restore',
    async ({ user, params }) => {
      return projectService.restoreProject(user.id, params.id)
    },
    { params: ProjectIdParams }
  )

  // DELETE /erd/projects/:id/permanent — Permanent delete
  .delete(
    '/:id/permanent',
    async ({ user, params }) => {
      return projectService.permanentDelete(user.id, params.id)
    },
    { params: ProjectIdParams }
  )
