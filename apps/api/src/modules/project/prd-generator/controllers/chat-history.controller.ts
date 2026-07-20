import { Elysia, t } from 'elysia'
import { authMiddleware } from '../../../../common/middlewares/auth.middleware'
import { ChatHistoryService } from '../services/chat-history.service'

const chatHistoryService = new ChatHistoryService()

export const chatHistoryController = new Elysia({ prefix: '/prd/projects' })
  .use(authMiddleware())

  // GET /prd/projects/:id/chat-messages — Fetch copilot chat history
  .get(
    '/:id/chat-messages',
    async ({ user, params, query }) => {
      const page = query.page ? Number(query.page) : 1
      const limit = query.limit ? Number(query.limit) : 50
      const data = await chatHistoryService.listChatMessages(user.id, params.id, page, limit)
      return { success: true, ...data }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      query: t.Object({
        page: t.Optional(t.Number()),
        limit: t.Optional(t.Number()),
      }),
    }
  )

  // POST /prd/projects/:id/chat-messages — Save a copilot chat message
  .post(
    '/:id/chat-messages',
    async ({ user, params, body }) => {
      const data = await chatHistoryService.saveChatMessage(user.id, params.id, {
        role: body.role as 'user' | 'assistant' | 'system',
        actionType: body.actionType,
        content: body.content,
        revisedSnippet: body.revisedSnippet,
        modelUsed: body.modelUsed,
        promptTokenCount: body.promptTokenCount,
        responseTokenCount: body.responseTokenCount,
      })
      return { success: true, data }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        role: t.Union([t.Literal('user'), t.Literal('assistant'), t.Literal('system')]),
        actionType: t.Optional(t.String()),
        content: t.String({ minLength: 1 }),
        revisedSnippet: t.Optional(t.String()),
        modelUsed: t.Optional(t.String()),
        promptTokenCount: t.Optional(t.Number()),
        responseTokenCount: t.Optional(t.Number()),
      }),
    }
  )
