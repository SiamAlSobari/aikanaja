import { prisma } from '../../../../lib/prisma'
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from 'elysia-http-exception'
import { checkProjectAccess } from '../helpers/project.helper'
import { ActivityService } from './activity.service'
import { randomUUID } from 'crypto'

const activityService = new ActivityService()

export class ShareService {
  /** Invite collaborator by email */
  async inviteCollaborator(ownerId: string, projectId: string, email: string, role: 'view' | 'edit' = 'view') {
    // Verify ownership
    await checkProjectAccess(ownerId, projectId, 'edit')

    // Find user by email
    const invitee = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    })

    if (!invitee) throw new NotFoundException('User not found')
    if (invitee.id === ownerId) throw new BadRequestException('Cannot invite yourself')

    // Check if already shared
    const existing = await prisma.erdShare.findUnique({
      where: { projectId_userId: { projectId, userId: invitee.id } },
    })

    if (existing) throw new BadRequestException('User already invited')

    // Create share record
    const share = await prisma.erdShare.create({
      data: { projectId, userId: invitee.id, role },
      include: { user: { select: { id: true, name: true, email: true } } },
    })

    const project = await prisma.erdProject.findUnique({
      where: { id: projectId },
      select: { name: true },
    })

    activityService.log({
      userId: ownerId,
      type: 'share',
      message: `Shared "${project?.name}" with ${invitee.email}`,
      projectId,
      projectName: project?.name,
    }).catch(() => {})

    return share
  }

  /** Remove collaborator */
  async removeCollaborator(ownerId: string, projectId: string, userId: string) {
    await checkProjectAccess(ownerId, projectId, 'edit')

    const share = await prisma.erdShare.findUnique({
      where: { projectId_userId: { projectId, userId } },
    })

    if (!share) throw new NotFoundException('Collaborator not found')

    await prisma.erdShare.delete({
      where: { projectId_userId: { projectId, userId } },
    })

    return { message: 'Collaborator removed' }
  }

  /** Update collaborator role */
  async updateRole(ownerId: string, projectId: string, userId: string, role: 'view' | 'edit') {
    await checkProjectAccess(ownerId, projectId, 'edit')

    const share = await prisma.erdShare.findUnique({
      where: { projectId_userId: { projectId, userId } },
    })

    if (!share) throw new NotFoundException('Collaborator not found')

    const updated = await prisma.erdShare.update({
      where: { projectId_userId: { projectId, userId } },
      data: { role },
      include: { user: { select: { id: true, name: true, email: true } } },
    })

    return updated
  }

  /** List collaborators */
  async listCollaborators(userId: string, projectId: string) {
    await checkProjectAccess(userId, projectId, 'view')

    return prisma.erdShare.findMany({
      where: { projectId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'asc' },
    })
  }

  /** Generate public share link */
  async generateShareLink(userId: string, projectId: string, expiresInDays?: number) {
    await checkProjectAccess(userId, projectId, 'edit')

    // Generate unique link
    const link = `share_${randomUUID()}`

    const shareLink = await prisma.erdShareLink.create({
      data: {
        projectId,
        link,
        expiresAt: expiresInDays
          ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
          : null,
      },
    })

    return shareLink
  }

  /** Get current share link */
  async getShareLink(userId: string, projectId: string) {
    await checkProjectAccess(userId, projectId, 'view')

    return prisma.erdShareLink.findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    })
  }

  /** Get project by share link (public, no auth) */
  async getProjectByShareLink(link: string) {
    const shareLink = await prisma.erdShareLink.findUnique({
      where: { link },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            schema: true,
            user: { select: { id: true, name: true } },
          },
        },
      },
    })

    if (!shareLink) throw new NotFoundException('Share link not found')

    // Check expiry
    if (shareLink.expiresAt && shareLink.expiresAt < new Date()) {
      throw new BadRequestException('Share link has expired')
    }

    return shareLink.project
  }
}
