import { prisma } from '../../../../lib/prisma'
import { NotFoundException, ForbiddenException, InternalServerErrorException } from 'elysia-http-exception'

export interface SaveChatMessageDto {
  role: 'user' | 'assistant' | 'system'
  actionType?: 'chat' | 'inline_edit' | 'selection_highlight' | 'section_expand' | string
  content: string
  revisedSnippet?: string
  modelUsed?: string
  promptTokenCount?: number
  responseTokenCount?: number
}

export class ChatHistoryService {
  /** Ensure user owns or has access to project */
  private async ensureOwnership(userId: string, projectId: string) {
    const project = await prisma.prdProject.findUnique({
      where: { id: projectId },
      select: { id: true, userId: true },
    })

    if (!project) throw new NotFoundException('Project not found')
    if (project.userId !== userId) throw new ForbiddenException('Access denied')

    return project
  }

  /** List chat messages for a project */
  async listChatMessages(userId: string, projectId: string, page = 1, limit = 50) {
    try {
      await this.ensureOwnership(userId, projectId)

      const safePage = Math.max(1, page)
      const safeLimit = Math.min(100, Math.max(1, limit))
      const skip = (safePage - 1) * safeLimit

      const [messages, total] = await Promise.all([
        prisma.prdChatMessage.findMany({
          where: { projectId },
          orderBy: { createdAt: 'asc' },
          skip,
          take: safeLimit,
        }),
        prisma.prdChatMessage.count({ where: { projectId } }),
      ])

      return {
        data: messages,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          totalPages: Math.ceil(total / safeLimit),
        },
      }
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[ChatHistoryService.listChatMessages]', { projectId, err })
      throw new InternalServerErrorException('Failed to fetch copilot chat history')
    }
  }

  /** Save a chat message entry */
  async saveChatMessage(userId: string, projectId: string, data: SaveChatMessageDto) {
    try {
      await this.ensureOwnership(userId, projectId)

      const message = await prisma.prdChatMessage.create({
        data: {
          projectId,
          userId,
          role: data.role,
          actionType: data.actionType || 'chat',
          content: data.content,
          revisedSnippet: data.revisedSnippet ?? null,
          modelUsed: data.modelUsed ?? null,
          promptTokenCount: data.promptTokenCount ?? null,
          responseTokenCount: data.responseTokenCount ?? null,
        },
      })

      return message
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[ChatHistoryService.saveChatMessage]', { projectId, err })
      throw new InternalServerErrorException('Failed to save copilot chat message')
    }
  }
}
