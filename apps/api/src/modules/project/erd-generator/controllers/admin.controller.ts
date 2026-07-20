import { Elysia, t } from 'elysia'
import { prisma } from '../../../../lib/prisma'
import { adminMiddleware } from '../../../../common/middlewares/admin.middleware'
import { NotFoundException, BadRequestException } from 'elysia-http-exception'

export const adminController = new Elysia({ prefix: '/erd/admin' })
  .use(adminMiddleware())

  // GET /admin/stats — Dashboard stats
  .get('/stats', async () => {
    const [userCount, projectCount, paymentCount, pendingPayments] = await Promise.all([
      prisma.user.count(),
      prisma.erdProject.count({ where: { status: 'active' } }),
      prisma.payment.count(),
      prisma.payment.count({ where: { status: 'pending' } }),
    ])

    return {
      data: { userCount, projectCount, paymentCount, pendingPayments },
    }
  })

  // GET /admin/users — List all users
  .get('/users', async ({ query }) => {
    const page = Math.max(1, Number(query.page) || 1)
    const limit = Math.min(Math.max(1, Number(query.limit) || 20), 100)
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { erdProjects: true, payments: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ])

    return {
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  }, {
    query: t.Object({ page: t.Optional(t.String()), limit: t.Optional(t.String()) }),
  })

  // GET /admin/users/:id — User detail
  .get('/users/:id', async ({ params }) => {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        erdProjects: {
          select: { id: true, name: true, status: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        payments: {
          select: { id: true, plan: true, amount: true, status: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { erdProjects: true, payments: true } },
      },
    })

    if (!user) throw new NotFoundException('User not found')

    return { data: user }
  }, {
    params: t.Object({ id: t.String() }),
  })

  // PATCH /admin/users/:id — Update user (role)
  .patch('/users/:id', async ({ params, body }) => {
    const user = await prisma.user.findUnique({ where: { id: params.id } })
    if (!user) throw new NotFoundException('User not found')

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: { role: body.role },
      select: { id: true, name: true, email: true, role: true },
    })

    return { data: updated }
  }, {
    params: t.Object({ id: t.String() }),
    body: t.Object({ role: t.String() }),
  })

  // DELETE /admin/users/:id — Delete user
  .delete('/users/:id', async ({ params }) => {
    const user = await prisma.user.findUnique({ where: { id: params.id } })
    if (!user) throw new NotFoundException('User not found')

    await prisma.user.delete({ where: { id: params.id } })

    return { message: 'User deleted' }
  }, {
    params: t.Object({ id: t.String() }),
  })

  // GET /admin/projects — List all projects
  .get('/projects', async ({ query }) => {
    const page = Math.max(1, Number(query.page) || 1)
    const limit = Math.min(Math.max(1, Number(query.limit) || 20), 100)
    const skip = (page - 1) * limit

    const [projects, total] = await Promise.all([
      prisma.erdProject.findMany({
        select: {
          id: true,
          name: true,
          status: true,
          visibility: true,
          createdAt: true,
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.erdProject.count(),
    ])

    return {
      data: projects,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  }, {
    query: t.Object({ page: t.Optional(t.String()), limit: t.Optional(t.String()) }),
  })

  // GET /admin/payments — List all payments
  .get('/payments', async ({ query }) => {
    const page = Math.max(1, Number(query.page) || 1)
    const limit = Math.min(Math.max(1, Number(query.limit) || 20), 100)
    const skip = (page - 1) * limit

    const where: any = {}
    if (query.status) where.status = query.status

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        select: {
          id: true,
          plan: true,
          amount: true,
          method: true,
          status: true,
          proof: true,
          verifiedAt: true,
          createdAt: true,
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ])

    return {
      data: payments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  }, {
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
      status: t.Optional(t.String()),
    }),
  })

  // GET /admin/payments/:id — Payment detail
  .get('/payments/:id', async ({ params }) => {
    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        plan: true,
        amount: true,
        method: true,
        status: true,
        proof: true,
        verifiedAt: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    })

    if (!payment) throw new NotFoundException('Payment not found')

    return { data: payment }
  }, {
    params: t.Object({ id: t.String() }),
  })

  // POST /admin/payments/:id/verify — Verify payment
  .post('/payments/:id/verify', async ({ params }) => {
    const payment = await prisma.payment.findUnique({ where: { id: params.id } })
    if (!payment) throw new NotFoundException('Payment not found')
    if (payment.status !== 'pending') throw new BadRequestException('Payment is not pending')

    // Update payment
    await prisma.payment.update({
      where: { id: params.id },
      data: { status: 'verified', verifiedAt: new Date() },
    })

    // Update user role
    await prisma.user.update({
      where: { id: payment.userId },
      data: { role: payment.plan },
    })

    // Update usage limit
    const limit = payment.plan === 'pro' ? 20 : 50 // pro: 20, team: 50
    const month = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
    await prisma.usage.upsert({
      where: { userId_month: { userId: payment.userId, month } },
      update: { limit },
      create: { userId: payment.userId, month, count: 0, limit },
    })

    return { message: 'Payment verified and plan updated' }
  }, {
    params: t.Object({ id: t.String() }),
  })

  // POST /admin/payments/:id/reject — Reject payment
  .post('/payments/:id/reject', async ({ params }) => {
    const payment = await prisma.payment.findUnique({ where: { id: params.id } })
    if (!payment) throw new NotFoundException('Payment not found')
    if (payment.status !== 'pending') throw new BadRequestException('Payment is not pending')

    await prisma.payment.update({
      where: { id: params.id },
      data: { status: 'rejected' },
    })

    return { message: 'Payment rejected' }
  }, {
    params: t.Object({ id: t.String() }),
  })
