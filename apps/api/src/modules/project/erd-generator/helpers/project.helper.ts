import { prisma } from '../../../../lib/prisma'
import { Prisma } from '../../../../../generated/prisma/client'
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from 'elysia-http-exception'

interface ListProjectsOptions {
  page?: number
  limit?: number
  sort?: 'name' | 'createdAt' | 'updatedAt'
  order?: 'asc' | 'desc'
  filter?: 'all' | 'active' | 'deleted' | 'shared'
  search?: string
}

/**
 * Build Prisma where clause dari filter options.
 * Digunakan di listProjects untuk filter by status, ownership, dan search.
 */
export function buildProjectWhereClause(
  userId: string,
  options: ListProjectsOptions
): Prisma.ErdProjectWhereInput {
  const { filter = 'active', search } = options
  const where: Prisma.ErdProjectWhereInput = {}

  // Filter by status dan ownership
  if (filter === 'shared') {
    where.shares = { some: { userId } }
    where.status = 'active'
  } else if (filter === 'deleted') {
    where.userId = userId
    where.status = 'deleted'
  } else if (filter === 'active') {
    where.userId = userId
    where.status = 'active'
  } else {
    // 'all' — semua project milik user + shared
    where.OR = [
      { userId },
      { shares: { some: { userId } } },
    ]
    where.status = 'active'
  }

  // Search by name atau description
  if (search?.trim()) {
    const searchTerm = `%${search.trim()}%`
    const searchFilter: Prisma.ErdProjectWhereInput = {
      OR: [
        { name: { contains: searchTerm } },
        { description: { contains: searchTerm } },
      ],
    }

    where.AND = where.AND
      ? Array.isArray(where.AND)
        ? [...where.AND, searchFilter]
        : [where.AND, searchFilter]
      : [searchFilter]
  }

  return where
}

/**
 * Validate pagination params.
 * Clamp page >= 1, limit antara 1-100.
 */
export function normalizePagination(page?: number, limit?: number) {
  const safePage = Math.max(1, page || 1)
  const safeLimit = Math.min(Math.max(1, limit || 10), 100)
  const skip = (safePage - 1) * safeLimit

  return { safePage, safeLimit, skip }
}

/**
 * Cek akses user ke project.
 * Owner selalu punya akses. Collaborator tergantung role.
 * Throw NotFoundException / ForbiddenException jika denied.
 */
export async function checkProjectAccess(
  userId: string,
  projectId: string,
  requiredRole: 'view' | 'edit' = 'view'
) {
  const project = await prisma.erdProject.findUnique({
    where: { id: projectId },
    select: {
      userId: true,
      shares: {
        where: { userId },
        select: { role: true },
      },
    },
  })

  if (!project) {
    throw new NotFoundException('Project not found')
  }

  // Owner selalu punya akses
  if (project.userId === userId) return

  // Check collaborator
  const share = project.shares[0]
  if (!share) {
    throw new ForbiddenException('Access denied')
  }

  if (requiredRole === 'edit' && share.role !== 'edit') {
    throw new ForbiddenException('Edit access required')
  }
}

/**
 * Fetch project dengan ownership check.
 * Hanya owner yang bisa akses (untuk delete/restore/permanent).
 */
export async function fetchProjectAsOwner(userId: string, projectId: string) {
  const project = await prisma.erdProject.findUnique({
    where: { id: projectId },
    select: { id: true, userId: true, status: true, name: true },
  })

  if (!project) {
    throw new NotFoundException('Project not found')
  }

  if (project.userId !== userId) {
    throw new ForbiddenException('Only owner can perform this action')
  }

  return project
}
