import { prisma } from '../../../../lib/prisma'
import {
  NotFoundException,
  ForbiddenException,
} from 'elysia-http-exception'
import { checkProjectAccess } from '../helpers/project.helper'

const MAX_VERSIONS = 100

export class HistoryService {
  /** Save version snapshot (auto-save saat schema berubah) */
  async saveVersion(userId: string, projectId: string, schema: string, description?: string) {
    await checkProjectAccess(userId, projectId, 'edit')

    // Create version
    const version = await prisma.erdVersion.create({
      data: { projectId, schema, description },
    })

    // Cleanup old versions (keep max 100)
    await this.cleanupOldVersions(projectId)

    return version
  }

  /** List versions (newest first) */
  async getVersions(userId: string, projectId: string) {
    await checkProjectAccess(userId, projectId, 'view')

    return prisma.erdVersion.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        description: true,
        createdAt: true,
      },
    })
  }

  /** Get specific version dengan schema */
  async getVersion(userId: string, projectId: string, versionId: string) {
    await checkProjectAccess(userId, projectId, 'view')

    const version = await prisma.erdVersion.findUnique({
      where: { id: versionId },
    })

    if (!version || version.projectId !== projectId) {
      throw new NotFoundException('Version not found')
    }

    return version
  }

  /** Restore version (update project schema + save new version) */
  async restoreVersion(userId: string, projectId: string, versionId: string) {
    await checkProjectAccess(userId, projectId, 'edit')

    const version = await prisma.erdVersion.findUnique({
      where: { id: versionId },
    })

    if (!version || version.projectId !== projectId) {
      throw new NotFoundException('Version not found')
    }

    // Update project schema
    await prisma.erdProject.update({
      where: { id: projectId },
      data: { schema: version.schema },
    })

    // Save as new version (restored)
    const restoredVersion = await prisma.erdVersion.create({
      data: {
        projectId,
        schema: version.schema,
        description: `Restored from version ${versionId.slice(0, 8)}`,
      },
    })

    // Cleanup old versions
    await this.cleanupOldVersions(projectId)

    return restoredVersion
  }

  /** Cleanup: keep only latest MAX_VERSIONS */
  private async cleanupOldVersions(projectId: string) {
    const count = await prisma.erdVersion.count({
      where: { projectId },
    })

    if (count > MAX_VERSIONS) {
      // Find oldest versions to delete
      const oldVersions = await prisma.erdVersion.findMany({
        where: { projectId },
        orderBy: { createdAt: 'asc' },
        take: count - MAX_VERSIONS,
        select: { id: true },
      })

      await prisma.erdVersion.deleteMany({
        where: { id: { in: oldVersions.map(v => v.id) } },
      })
    }
  }
}
