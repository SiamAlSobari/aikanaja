import { prisma } from '../../../../lib/prisma'
import { NotFoundException, ForbiddenException, InternalServerErrorException } from 'elysia-http-exception'

export class AuditLogService {
  /** Ensure user owns project */
  private async ensureOwnership(userId: string, projectId: string) {
    const project = await prisma.prdProject.findUnique({
      where: { id: projectId },
      select: { id: true, userId: true },
    })

    if (!project) throw new NotFoundException('Project not found')
    if (project.userId !== userId) throw new ForbiddenException('Access denied')

    return project
  }

  /** List audit trail logs for a project */
  async listAuditLogs(userId: string, projectId: string, limit = 50) {
    try {
      await this.ensureOwnership(userId, projectId)

      const logs = await prisma.prdAuditLog.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
        take: Math.min(100, Math.max(1, limit)),
      })

      const formatted = logs.map((log) => ({
        ...log,
        details: log.details ? (typeof log.details === 'string' ? JSON.parse(log.details) : log.details) : null,
      }))

      return formatted
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[AuditLogService.listAuditLogs]', { projectId, err })
      throw new InternalServerErrorException('Failed to fetch audit log trail')
    }
  }

  /** Log an action entry in audit trail */
  async logAction(
    userId: string,
    projectId: string,
    action: string,
    sectionName?: string,
    details?: Record<string, any> | string
  ) {
    try {
      const entry = await prisma.prdAuditLog.create({
        data: {
          projectId,
          userId,
          action,
          sectionName: sectionName ?? null,
          details: details ? (typeof details === 'string' ? details : JSON.stringify(details)) : null,
        },
      })

      return entry
    } catch (err) {
      console.error('[AuditLogService.logAction]', { projectId, action, err })
      // Non-blocking log insertion failure
      return null
    }
  }
}
