import { prisma } from '../../../../lib/prisma'
import { InternalServerErrorException, NotFoundException, ForbiddenException } from 'elysia-http-exception'

interface ListProjectsOptions {
  page?: number
  limit?: number
  sort?: 'title' | 'createdAt' | 'updatedAt'
  order?: 'asc' | 'desc'
  filter?: 'all' | 'active' | 'deleted'
  search?: string
}

const PROJECT_SELECT = {
  id: true,
  title: true,
  description: true,
  author: true,
  templateType: true,
  erdLinkId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const

function normalizePagination(page?: number, limit?: number) {
  const safePage = Math.max(1, page || 1)
  const safeLimit = Math.min(100, Math.max(1, limit || 10))
  const skip = (safePage - 1) * safeLimit
  return { safePage, safeLimit, skip }
}

function buildWhereClause(userId: string, options: ListProjectsOptions) {
  const where: any = { userId }

  if (options.filter === 'deleted') {
    where.status = 'deleted'
  } else if (options.filter === 'active') {
    where.status = 'active'
  }
  // 'all' = no status filter

  if (options.search) {
    where.OR = [
      { title: { contains: options.search } },
      { description: { contains: options.search } },
    ]
  }

  return where
}

export class ProjectService {
  /** List projects milik user (paginated, filtered, searchable) */
  async listProjects(userId: string, options: ListProjectsOptions = {}) {
    try {
      const { sort = 'updatedAt', order = 'desc' } = options
      const { safePage, safeLimit, skip } = normalizePagination(options.page, options.limit)
      const where = buildWhereClause(userId, options)

      const [projects, total] = await Promise.all([
        prisma.prdProject.findMany({
          where,
          select: {
            ...PROJECT_SELECT,
            _count: { select: { versions: true } },
          },
          orderBy: { [sort]: order },
          skip,
          take: safeLimit,
        }),
        prisma.prdProject.count({ where }),
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
      console.error('[PrdProjectService.listProjects]', err)
      throw new InternalServerErrorException('Failed to fetch projects')
    }
  }

  /** Get single project by id + owner check */
  async getProject(userId: string, projectId: string) {
    try {
      const project = await prisma.prdProject.findUnique({
        where: { id: projectId },
        select: {
          ...PROJECT_SELECT,
          content: true,
          _count: { select: { versions: true } },
        },
      })

      if (!project) throw new NotFoundException('Project not found')
      if (project.userId !== userId) throw new ForbiddenException('Access denied')

      return project
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[PrdProjectService.getProject]', { projectId, err })
      throw new InternalServerErrorException('Failed to fetch project')
    }
  }

  /** Create project baru */
  async createProject(userId: string, data: { title: string; description?: string; templateType?: string }) {
    try {
      const project = await prisma.prdProject.create({
        data: {
          title: data.title.trim(),
          description: data.description?.trim() || null,
          author: userId,
          userId,
          templateType: data.templateType || null,
          status: 'active',
        },
        select: PROJECT_SELECT,
      })

      return project
    } catch (err) {
      console.error('[PrdProjectService.createProject]', { userId, err })
      throw new InternalServerErrorException('Failed to create project')
    }
  }

  /** Update project (owner only) */
  async updateProject(
    userId: string,
    projectId: string,
    data: { title?: string; description?: string; content?: string; templateType?: string; erdLinkId?: string }
  ) {
    try {
      const project = await prisma.prdProject.findUnique({ where: { id: projectId }, select: { userId: true } })
      if (!project) throw new NotFoundException('Project not found')
      if (project.userId !== userId) throw new ForbiddenException('Access denied')

      return await prisma.prdProject.update({
        where: { id: projectId },
        data: {
          ...(data.title !== undefined && { title: data.title.trim() }),
          ...(data.description !== undefined && { description: data.description?.trim() || null }),
          ...(data.content !== undefined && { content: data.content }),
          ...(data.templateType !== undefined && { templateType: data.templateType }),
          ...(data.erdLinkId !== undefined && { erdLinkId: data.erdLinkId }),
        },
        select: PROJECT_SELECT,
      })
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[PrdProjectService.updateProject]', { projectId, err })
      throw new InternalServerErrorException('Failed to update project')
    }
  }

  /** Soft delete (owner only) */
  async deleteProject(userId: string, projectId: string) {
    try {
      const project = await prisma.prdProject.findUnique({ where: { id: projectId }, select: { userId: true, status: true, title: true } })
      if (!project) throw new NotFoundException('Project not found')
      if (project.userId !== userId) throw new ForbiddenException('Access denied')
      if (project.status === 'deleted') throw new Error('Project already in trash')

      await prisma.prdProject.update({
        where: { id: projectId },
        data: { status: 'deleted' },
      })

      return { id: projectId }
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[PrdProjectService.deleteProject]', { projectId, err })
      throw new InternalServerErrorException('Failed to delete project')
    }
  }

  /** Restore dari trash (owner only) */
  async restoreProject(userId: string, projectId: string) {
    try {
      const project = await prisma.prdProject.findUnique({ where: { id: projectId }, select: { userId: true, status: true } })
      if (!project) throw new NotFoundException('Project not found')
      if (project.userId !== userId) throw new ForbiddenException('Access denied')
      if (project.status !== 'deleted') throw new Error('Project not in trash')

      await prisma.prdProject.update({
        where: { id: projectId },
        data: { status: 'active' },
      })

      return { id: projectId }
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[PrdProjectService.restoreProject]', { projectId, err })
      throw new InternalServerErrorException('Failed to restore project')
    }
  }
}
