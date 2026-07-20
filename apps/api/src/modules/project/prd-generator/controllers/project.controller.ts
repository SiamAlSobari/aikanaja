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

export const projectController = new Elysia({ prefix: '/prd/projects' })
  .use(authMiddleware())

  // GET /prd/projects — List projects
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

  // GET /prd/projects/:id — Get project detail
  .get(
    '/:id',
    async ({ user, params }) => {
      return projectService.getProject(user.id, params.id)
    },
    { params: ProjectIdParams }
  )

  // POST /prd/projects — Create project
  .post(
    '/',
    async ({ user, body, set }) => {
      const project = await projectService.createProject(user.id, body)
      set.status = 201
      return { message: 'Project created', data: project }
    },
    { body: CreateProjectBody }
  )

  // PATCH /prd/projects/:id — Update project
  .patch(
    '/:id',
    async ({ user, params, body }) => {
      return projectService.updateProject(user.id, params.id, body)
    },
    { params: ProjectIdParams, body: UpdateProjectBody }
  )

  // DELETE /prd/projects/:id — Soft delete
  .delete(
    '/:id',
    async ({ user, params }) => {
      return projectService.deleteProject(user.id, params.id)
    },
    { params: ProjectIdParams }
  )

  // POST /prd/projects/:id/restore — Restore dari trash
  .post(
    '/:id/restore',
    async ({ user, params }) => {
      return projectService.restoreProject(user.id, params.id)
    },
    { params: ProjectIdParams }
  )
