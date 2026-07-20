import { diffLines, Change } from 'diff'
import { prisma } from '../../../../lib/prisma'
import { NotFoundException, ForbiddenException, InternalServerErrorException, BadRequestException } from 'elysia-http-exception'

export interface CreateVersionDto {
  content: string
  title?: string
  qualityScore?: number
  storyPointsTotal?: number
}

export class VersionService {
  /** Ensure user owns project */
  private async ensureOwnership(userId: string, projectId: string) {
    const project = await prisma.prdProject.findUnique({
      where: { id: projectId },
      select: { id: true, userId: true, content: true, title: true },
    })

    if (!project) throw new NotFoundException('Project not found')
    if (project.userId !== userId) throw new ForbiddenException('Access denied')

    return project
  }

  /** Create new snapshot version */
  async createVersionSnapshot(userId: string, projectId: string, data: CreateVersionDto) {
    try {
      await this.ensureOwnership(userId, projectId)

      // Find highest versionNum for this project
      const latest = await prisma.prdVersion.findFirst({
        where: { projectId },
        orderBy: { versionNum: 'desc' },
        select: { versionNum: true },
      })

      const nextVersionNum = (latest?.versionNum || 0) + 1

      const version = await prisma.prdVersion.create({
        data: {
          projectId,
          versionNum: nextVersionNum,
          title: data.title?.trim() || `v${nextVersionNum}.0 Snapshot`,
          content: data.content,
          qualityScore: data.qualityScore ?? null,
          storyPointsTotal: data.storyPointsTotal ?? null,
        },
      })

      return version
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[VersionService.createVersionSnapshot]', { projectId, err })
      throw new InternalServerErrorException('Failed to create version snapshot')
    }
  }

  /** List all version snapshots for a project */
  async listVersions(userId: string, projectId: string) {
    try {
      await this.ensureOwnership(userId, projectId)

      const versions = await prisma.prdVersion.findMany({
        where: { projectId },
        orderBy: { versionNum: 'desc' },
        select: {
          id: true,
          projectId: true,
          versionNum: true,
          title: true,
          qualityScore: true,
          storyPointsTotal: true,
          createdAt: true,
        },
      })

      return versions
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[VersionService.listVersions]', { projectId, err })
      throw new InternalServerErrorException('Failed to fetch versions')
    }
  }

  /** Get single version snapshot */
  async getVersion(userId: string, projectId: string, versionId: string) {
    try {
      await this.ensureOwnership(userId, projectId)

      const version = await prisma.prdVersion.findFirst({
        where: { id: versionId, projectId },
      })

      if (!version) throw new NotFoundException('Version snapshot not found')

      return version
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[VersionService.getVersion]', { projectId, versionId, err })
      throw new InternalServerErrorException('Failed to fetch version')
    }
  }

  /** Compare diff between version A and version B */
  async getVersionDiff(userId: string, projectId: string, versionIdA: string, versionIdB: string) {
    try {
      await this.ensureOwnership(userId, projectId)

      const [versionA, versionB] = await Promise.all([
        prisma.prdVersion.findFirst({ where: { id: versionIdA, projectId } }),
        prisma.prdVersion.findFirst({ where: { id: versionIdB, projectId } }),
      ])

      if (!versionA || !versionB) {
        throw new NotFoundException('One or both version snapshots were not found')
      }

      const diff: Change[] = diffLines(versionA.content, versionB.content)

      let additions = 0
      let deletions = 0
      let unchanged = 0

      const chunks = diff.map((change) => {
        const lineCount = change.count || change.value.split('\n').length
        if (change.added) {
          additions += lineCount
          return { type: 'added', value: change.value, count: lineCount }
        } else if (change.removed) {
          deletions += lineCount
          return { type: 'removed', value: change.value, count: lineCount }
        } else {
          unchanged += lineCount
          return { type: 'unchanged', value: change.value, count: lineCount }
        }
      })

      return {
        versionA: {
          id: versionA.id,
          versionNum: versionA.versionNum,
          title: versionA.title,
          createdAt: versionA.createdAt,
        },
        versionB: {
          id: versionB.id,
          versionNum: versionB.versionNum,
          title: versionB.title,
          createdAt: versionB.createdAt,
        },
        stats: {
          additions,
          deletions,
          unchanged,
        },
        diffChunks: chunks,
      }
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[VersionService.getVersionDiff]', { projectId, versionIdA, versionIdB, err })
      throw new InternalServerErrorException('Failed to calculate version diff')
    }
  }

  /** Restore specific version snapshot to active project content */
  async restoreVersion(userId: string, projectId: string, versionId: string) {
    try {
      await this.ensureOwnership(userId, projectId)

      const targetVersion = await prisma.prdVersion.findFirst({
        where: { id: versionId, projectId },
      })

      if (!targetVersion) throw new NotFoundException('Version snapshot not found')

      // Update project content
      const updatedProject = await prisma.prdProject.update({
        where: { id: projectId },
        data: {
          content: targetVersion.content,
        },
        select: {
          id: true,
          title: true,
          content: true,
          updatedAt: true,
        },
      })

      // Create snapshot for the restoration action
      const newSnapshot = await this.createVersionSnapshot(userId, projectId, {
        content: targetVersion.content,
        title: `Restored from v${targetVersion.versionNum}.0`,
        qualityScore: targetVersion.qualityScore ?? undefined,
        storyPointsTotal: targetVersion.storyPointsTotal ?? undefined,
      })

      return {
        project: updatedProject,
        restoredVersion: targetVersion,
        newSnapshot,
      }
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[VersionService.restoreVersion]', { projectId, versionId, err })
      throw new InternalServerErrorException('Failed to restore version')
    }
  }
}
