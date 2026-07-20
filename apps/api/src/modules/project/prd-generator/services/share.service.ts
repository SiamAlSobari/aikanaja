import { prisma } from '../../../../lib/prisma'
import { NotFoundException, ForbiddenException, InternalServerErrorException } from 'elysia-http-exception'
import { randomBytes } from 'crypto'

export class ShareService {
  /** Ensure user owns project */
  private async ensureOwnership(userId: string, projectId: string) {
    const project = await prisma.prdProject.findUnique({
      where: { id: projectId },
      select: { id: true, userId: true, title: true, status: true },
    })

    if (!project) throw new NotFoundException('Project not found')
    if (project.userId !== userId) throw new ForbiddenException('Access denied')

    return project
  }

  /** Generate or retrieve a public share token for a project */
  async generateShareLink(userId: string, projectId: string, expiresDays?: number) {
    try {
      const project = await this.ensureOwnership(userId, projectId)

      // Generate random token if project doesn't have one
      let token = project.id ? randomBytes(16).toString('hex') : ''

      let expiresAt: Date | undefined = undefined
      if (expiresDays && expiresDays > 0) {
        expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + expiresDays)
      }

      const [updatedProject, shareLink] = await Promise.all([
        prisma.prdProject.update({
          where: { id: projectId },
          data: { shareToken: token },
          select: { id: true, title: true, shareToken: true },
        }),
        prisma.prdShareLink.create({
          data: {
            projectId,
            token,
            expiresAt: expiresAt ?? null,
          },
        }),
      ])

      return {
        projectId,
        title: updatedProject.title,
        shareToken: token,
        shareUrl: `/prd/share/${token}`,
        expiresAt: shareLink.expiresAt,
      }
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[ShareService.generateShareLink]', { projectId, err })
      throw new InternalServerErrorException('Failed to generate share link')
    }
  }

  /** Get public read-only project content by share token */
  async getPublicProject(shareToken: string) {
    try {
      // Find project directly or via share link
      let project = await prisma.prdProject.findFirst({
        where: { shareToken, status: 'active' },
        select: {
          id: true,
          title: true,
          description: true,
          author: true,
          content: true,
          templateType: true,
          erdLinkId: true,
          updatedAt: true,
        },
      })

      if (!project) {
        // Fallback check in PrdShareLink table
        const shareLink = await prisma.prdShareLink.findUnique({
          where: { token: shareToken },
          include: {
            project: {
              select: {
                id: true,
                title: true,
                description: true,
                author: true,
                content: true,
                templateType: true,
                erdLinkId: true,
                status: true,
                updatedAt: true,
              },
            },
          },
        })

        if (!shareLink || shareLink.project.status === 'deleted') {
          throw new NotFoundException('Shared PRD project not found or expired')
        }

        if (shareLink.expiresAt && shareLink.expiresAt < new Date()) {
          throw new ForbiddenException('This share link has expired')
        }

        project = shareLink.project
      }

      return project
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[ShareService.getPublicProject]', { shareToken, err })
      throw new InternalServerErrorException('Failed to fetch public project')
    }
  }
}
