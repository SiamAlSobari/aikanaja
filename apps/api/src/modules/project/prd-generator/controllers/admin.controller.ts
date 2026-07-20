import { Elysia, t } from 'elysia'
import { authMiddleware } from '../../../../common/middlewares/auth.middleware'
import { prisma } from '../../../../lib/prisma'
import { ForbiddenException, InternalServerErrorException } from 'elysia-http-exception'

export const adminController = new Elysia({ prefix: '/admin/prd' })
  .use(authMiddleware())
  .onBeforeHandle(({ user }) => {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Admin privileges required')
    }
  })

  // GET /admin/prd/stats — Overview system statistics
  .get('/stats', async () => {
    try {
      const [totalProjects, activeProjects, deletedProjects, totalVersions, totalShares, totalUsers] = await Promise.all([
        prisma.prdProject.count(),
        prisma.prdProject.count({ where: { status: 'active' } }),
        prisma.prdProject.count({ where: { status: 'deleted' } }),
        prisma.prdVersion.count(),
        prisma.prdShareLink.count(),
        prisma.user.count(),
      ])

      return {
        success: true,
        data: {
          totalProjects,
          activeProjects,
          deletedProjects,
          totalVersions,
          totalShares,
          totalUsers,
        },
      }
    } catch (err) {
      console.error('[adminController.getStats]', err)
      throw new InternalServerErrorException('Failed to fetch admin stats')
    }
  })

  // GET /admin/prd/projects — List all PRD projects with pagination & filtering
  .get(
    '/projects',
    async ({ query }) => {
      try {
        const page = Math.max(1, query.page || 1)
        const limit = Math.min(100, Math.max(1, query.limit || 10))
        const skip = (page - 1) * limit

        const where: any = {}
        if (query.status) where.status = query.status
        if (query.search) {
          where.OR = [
            { title: { contains: query.search } },
            { description: { contains: query.search } },
            { author: { contains: query.search } },
          ]
        }

        const [projects, total] = await Promise.all([
          prisma.prdProject.findMany({
            where,
            include: {
              user: { select: { id: true, name: true, email: true } },
              _count: { select: { versions: true, shareLinks: true } },
            },
            orderBy: { updatedAt: 'desc' },
            skip,
            take: limit,
          }),
          prisma.prdProject.count({ where }),
        ])

        return {
          success: true,
          data: projects,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        }
      } catch (err) {
        console.error('[adminController.getProjects]', err)
        throw new InternalServerErrorException('Failed to fetch admin project list')
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Number()),
        limit: t.Optional(t.Number()),
        search: t.Optional(t.String()),
        status: t.Optional(t.String()),
      }),
    }
  )

  // GET /admin/prd/users — List users with PRD project statistics
  .get(
    '/users',
    async ({ query }) => {
      try {
        const page = Math.max(1, query.page || 1)
        const limit = Math.min(100, Math.max(1, query.limit || 10))
        const skip = (page - 1) * limit

        const [users, total] = await Promise.all([
          prisma.user.findMany({
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
              _count: { select: { prdProjects: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
          }),
          prisma.user.count(),
        ])

        return {
          success: true,
          data: users,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        }
      } catch (err) {
        console.error('[adminController.getUsers]', err)
        throw new InternalServerErrorException('Failed to fetch admin users')
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Number()),
        limit: t.Optional(t.Number()),
      }),
    }
  )
