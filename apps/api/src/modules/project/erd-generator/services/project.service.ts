import { prisma } from '../../../../lib/prisma'
import { InternalServerErrorException } from 'elysia-http-exception'
import {
  buildProjectWhereClause,
  normalizePagination,
  checkProjectAccess,
  fetchProjectAsOwner,
} from '../helpers/project.helper'
import { ActivityService } from './activity.service'

const activityService = new ActivityService()

interface ListProjectsOptions {
  page?: number
  limit?: number
  sort?: 'name' | 'createdAt' | 'updatedAt'
  order?: 'asc' | 'desc'
  filter?: 'all' | 'active' | 'deleted' | 'shared'
  search?: string
}

const PROJECT_SELECT = {
  id: true,
  name: true,
  description: true,
  status: true,
  visibility: true,
  createdAt: true,
  updatedAt: true,
} as const

const PROJECT_SELECT_WITH_SCHEMA = {
  ...PROJECT_SELECT,
  schema: true,
} as const

export class ProjectService {
  /** List projects milik user (paginated, filtered, searchable) */
  async listProjects(userId: string, options: ListProjectsOptions = {}) {
    try {
      const { sort = 'updatedAt', order = 'desc' } = options
      const { safePage, safeLimit, skip } = normalizePagination(options.page, options.limit)
      const where = buildProjectWhereClause(userId, options)

      const [projects, total] = await Promise.all([
        prisma.erdProject.findMany({
          where,
          select: {
            ...PROJECT_SELECT,
            _count: { select: { versions: true, shares: true } },
          },
          orderBy: { [sort]: order },
          skip,
          take: safeLimit,
        }),
        prisma.erdProject.count({ where }),
      ])

      return {
        data: projects,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          totalPages: Math.ceil(total / safeLimit),
        },
      }
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[ProjectService.listProjects]', err)
      throw new InternalServerErrorException('Failed to fetch projects')
    }
  }

  /** Get single project dengan schema dan access check */
  async getProject(userId: string, projectId: string) {
    try {
      const project = await prisma.erdProject.findUnique({
        where: { id: projectId },
        include: {
          user: { select: { id: true, name: true, email: true } },
          shares: { where: { userId }, select: { role: true } },
          _count: { select: { versions: true, shares: true } },
        },
      })

      if (!project) throw new Error('Project not found')

      const isOwner = project.userId === userId
      if (!isOwner && project.shares.length === 0) {
        throw new Error('Access denied')
      }

      return {
        ...project,
        isOwner,
        role: isOwner ? 'owner' : project.shares[0].role,
      }
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[ProjectService.getProject]', { projectId, err })
      throw new InternalServerErrorException('Failed to fetch project')
    }
  }

  /** Create project baru (default: private, active) */
  async createProject(userId: string, data: { name: string; description?: string }) {
    try {
      const project = await prisma.erdProject.create({
        data: {
          name: data.name.trim(),
          description: data.description?.trim() || null,
          userId,
          status: 'active',
          visibility: 'private',
        },
        select: PROJECT_SELECT,
      })

      activityService.log({
        userId,
        type: 'create',
        message: `Created project "${project.name}"`,
        projectId: project.id,
        projectName: project.name,
      }).catch(() => {})

      return project
    } catch (err) {
      console.error('[ProjectService.createProject]', { userId, err })
      throw new InternalServerErrorException('Failed to create project')
    }
  }

  /** Update project (requires edit access) */
  async updateProject(
    userId: string,
    projectId: string,
    data: { name?: string; description?: string; schema?: string; visibility?: string }
  ) {
    try {
      await checkProjectAccess(userId, projectId, 'edit')

      return await prisma.erdProject.update({
        where: { id: projectId },
        data: {
          ...(data.name !== undefined && { name: data.name.trim() }),
          ...(data.description !== undefined && { description: data.description?.trim() || null }),
          ...(data.schema !== undefined && { schema: data.schema }),
          ...(data.visibility !== undefined && { visibility: data.visibility }),
        },
        select: PROJECT_SELECT_WITH_SCHEMA,
      })
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[ProjectService.updateProject]', { projectId, err })
      throw new InternalServerErrorException('Failed to update project')
    }
  }

  /** Soft delete (owner only, pindah ke trash) */
  async deleteProject(userId: string, projectId: string) {
    try {
      const project = await fetchProjectAsOwner(userId, projectId)

      if (project.status === 'deleted') {
        throw new Error('Project is already in trash')
      }

      await prisma.erdProject.update({
        where: { id: projectId },
        data: { status: 'deleted' },
      })

      activityService.log({
        userId,
        type: 'delete',
        message: `Moved "${project.name}" to trash`,
        projectId,
        projectName: project.name,
      }).catch(() => {})

      return { id: projectId }
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[ProjectService.deleteProject]', { projectId, err })
      throw new InternalServerErrorException('Failed to delete project')
    }
  }

  /** Restore dari trash (owner only) */
  async restoreProject(userId: string, projectId: string) {
    try {
      const project = await fetchProjectAsOwner(userId, projectId)

      if (project.status !== 'deleted') {
        throw new Error('Project is not in trash')
      }

      await prisma.erdProject.update({
        where: { id: projectId },
        data: { status: 'active' },
      })

      activityService.log({
        userId,
        type: 'restore',
        message: `Restored "${project.name}" from trash`,
        projectId,
        projectName: project.name,
      }).catch(() => {})

      return { id: projectId }
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[ProjectService.restoreProject]', { projectId, err })
      throw new InternalServerErrorException('Failed to restore project')
    }
  }

  /** Permanent delete (owner only, harus di trash dulu) */
  async permanentDelete(userId: string, projectId: string) {
    try {
      const project = await fetchProjectAsOwner(userId, projectId)

      if (project.status !== 'deleted') {
        throw new Error('Project must be in trash before permanent delete')
      }

      await prisma.erdProject.delete({ where: { id: projectId } })

      return { id: projectId }
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[ProjectService.permanentDelete]', { projectId, err })
      throw new InternalServerErrorException('Failed to permanently delete project')
    }
  }
}
