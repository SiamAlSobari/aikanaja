import { Elysia, t } from 'elysia'
import { authMiddleware } from '../../../../common/middlewares/auth.middleware'
import { AiPromptService } from '../services/ai-prompt.service'

const aiPromptService = new AiPromptService()

export const aiController = new Elysia({ prefix: '/prd' })
  .use(authMiddleware())

  // POST /prd/generate — Streaming PRD generation
  .post(
    '/generate',
    async ({ user, body, headers, signal }) => {
      const userApiKey = aiPromptService.extractCustomApiKey(headers as Record<string, string | null>)

      const prompt = `Buat PRD lengkap untuk:\n\nJudul: ${body.title}\nDeskripsi: ${body.description || '-'}\nTarget User: ${body.targetUser || '-'}\nTech Stack: ${body.techStack || '-'}\nTemplate: ${body.templateType || 'custom'}`

      const stream = await aiPromptService.streamGenerate(prompt, userApiKey, signal)

      return stream.toDataStreamResponse()
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1 }),
        description: t.Optional(t.String()),
        targetUser: t.Optional(t.String()),
        techStack: t.Optional(t.String()),
        templateType: t.Optional(t.String()),
      }),
    }
  )

  // POST /prd/copilot — Streaming copilot modifier
  .post(
    '/copilot',
    async ({ user, body, headers, signal }) => {
      const userApiKey = aiPromptService.extractCustomApiKey(headers as Record<string, string | null>)

      const stream = await aiPromptService.streamCopilot(
        body.instruction,
        body.currentContent,
        userApiKey,
        signal
      )

      return stream.toDataStreamResponse()
    },
    {
      body: t.Object({
        instruction: t.String({ minLength: 1 }),
        currentContent: t.String(),
      }),
    }
  )
