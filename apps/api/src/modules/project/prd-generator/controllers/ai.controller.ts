import { Elysia, t } from 'elysia'
import { authMiddleware } from '../../../../common/middlewares/auth.middleware'
import { AiPromptService } from '../services/ai-prompt.service'
import { VirtualReviewService } from '../services/virtual-review.service'
import { QualityAuditService } from '../services/quality-audit.service'
import { SprintPlannerService } from '../services/sprint-planner.service'
import { AgentExporterService } from '../services/agent-exporter.service'
import { JsonExporterService } from '../services/json-exporter.service'
import { PrdBillingService } from '../services/billing.service'

const aiPromptService = new AiPromptService()
const virtualReviewService = new VirtualReviewService()
const qualityAuditService = new QualityAuditService()
const sprintPlannerService = new SprintPlannerService()
const agentExporterService = new AgentExporterService()
const jsonExporterService = new JsonExporterService()
const prdBillingService = new PrdBillingService()

export const aiController = new Elysia({ prefix: '/prd' })
  .use(authMiddleware())

  // GET /prd/quota — Fetch user's separate PRD quota status
  .get('/quota', async ({ user }) => {
    const data = await prdBillingService.checkQuota(user.id)
    return { success: true, data }
  })

  // POST /prd/generate — Streaming PRD generation
  .post(
    '/generate',
    async ({ user, body, headers, request }) => {
      // Check PRD quota
      const quota = await prdBillingService.checkQuota(user.id)
      if (!quota.allowed) {
        throw new Error('PRD generation monthly quota reached. Upgrade to Pro or Team plan for unlimited generations.')
      }

      const userApiKey = aiPromptService.extractCustomApiKey(headers as Record<string, string | null>)

      const prompt = `Buat PRD lengkap untuk:\n\nJudul: ${body.title}\nDeskripsi: ${body.description || '-'}\nTarget User: ${body.targetUser || '-'}\nTech Stack: ${body.techStack || '-'}\nTemplate: ${body.templateType || 'custom'}`

      const stream = await aiPromptService.streamGenerate(prompt, userApiKey, request.signal)

      // Increment PRD quota usage
      await prdBillingService.incrementUsage(user.id)

      return stream.toTextStreamResponse()
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
    async ({ body, headers, request }) => {
      const userApiKey = aiPromptService.extractCustomApiKey(headers as Record<string, string | null>)

      const stream = await aiPromptService.streamCopilot(
        body.instruction,
        body.currentContent,
        userApiKey,
        request.signal
      )

      return stream.toTextStreamResponse()
    },
    {
      body: t.Object({
        instruction: t.String({ minLength: 1 }),
        currentContent: t.String(),
      }),
    }
  )

  // POST /prd/virtual-review — Multi-Agent Virtual Review
  .post(
    '/virtual-review',
    async ({ body, headers }) => {
      const userApiKey = aiPromptService.extractCustomApiKey(headers as Record<string, string | null>)
      const data = await virtualReviewService.generateVirtualReview(body.prdContent, userApiKey)
      return { success: true, data }
    },
    {
      body: t.Object({
        prdContent: t.String({ minLength: 1 }),
      }),
    }
  )

  // POST /prd/quality-audit — Quality score & ambiguity inspection
  .post(
    '/quality-audit',
    async ({ body, headers }) => {
      const userApiKey = aiPromptService.extractCustomApiKey(headers as Record<string, string | null>)
      const data = await qualityAuditService.auditQuality(body.prdContent, userApiKey)
      return { success: true, data }
    },
    {
      body: t.Object({
        prdContent: t.String({ minLength: 1 }),
      }),
    }
  )

  // POST /prd/sprint-plan — Story points & Sprint roadmap planning
  .post(
    '/sprint-plan',
    async ({ body, headers }) => {
      const userApiKey = aiPromptService.extractCustomApiKey(headers as Record<string, string | null>)
      const data = await sprintPlannerService.planSprint(body.prdContent, userApiKey)
      return { success: true, data }
    },
    {
      body: t.Object({
        prdContent: t.String({ minLength: 1 }),
      }),
    }
  )

  // POST /prd/export-agent — Exporter to AGENTS.md / PROMPT.md for AI coding agents
  .post(
    '/export-agent',
    async ({ body, headers }) => {
      const userApiKey = aiPromptService.extractCustomApiKey(headers as Record<string, string | null>)
      const data = await agentExporterService.exportAgentPrompt(
        body.prdContent,
        body.targetAgent as 'cursor' | 'claude' | 'antigravity' | 'generic',
        userApiKey
      )
      return { success: true, data }
    },
    {
      body: t.Object({
        prdContent: t.String({ minLength: 1 }),
        targetAgent: t.Optional(
          t.Union([
            t.Literal('cursor'),
            t.Literal('claude'),
            t.Literal('antigravity'),
            t.Literal('generic'),
          ])
        ),
      }),
    }
  )

  // POST /prd/export-json — Exporter to enterprise JSON Spec format
  .post(
    '/export-json',
    async ({ body, headers }) => {
      const userApiKey = aiPromptService.extractCustomApiKey(headers as Record<string, string | null>)
      const data = await jsonExporterService.exportJsonSpec(body.prdContent, userApiKey)
      return { success: true, data }
    },
    {
      body: t.Object({
        prdContent: t.String({ minLength: 1 }),
      }),
    }
  )
