import { Elysia, sse } from 'elysia'
import { optionalAuthMiddleware } from '../../../../common/middlewares/auth.middleware'
import { SchemaService } from '../services/schema.service'
import { QuotaService } from '../services/quota.service'
import { GenerateSchemaBody } from '../validations/schema.validation'

const schemaService = new SchemaService()
const quotaService = new QuotaService()

export const schemaController = new Elysia({ prefix: '/erd' })
  .use(optionalAuthMiddleware())

  // POST /erd/generate — Generate ERD schema (non-streaming)
  .post(
    '/generate',
    async ({ body, user }) => {
      const userId = user?.id || null

      const schema = await schemaService.generateSchema(userId, {
        prompt: body.prompt,
        provider: body.provider,
        apiKey: body.apiKey,
      })

      return { data: schema }
    },
    { body: GenerateSchemaBody }
  )

  // POST /erd/generate/stream — Generate ERD schema (streaming)
  .post(
    '/generate/stream',
    async ({ body, user, request }) => {
      const userId = user?.id || null

      const stream = await schemaService.generateSchemaStream(userId, {
        prompt: body.prompt,
        provider: body.provider,
        apiKey: body.apiKey,
        signal: request.signal,
      })

      return sse(stream.textStream)
    },
    { body: GenerateSchemaBody }
  )

  // GET /erd/usage — Cek quota usage
  .get(
    '/usage',
    async ({ user, set }) => {
      if (!user) {
        set.status = 401
        return { message: 'Login required to check quota' }
      }

      const quota = await quotaService.checkQuota(user.id)

      return {
        data: {
          count: quota.count,
          limit: quota.limit,
          remaining: quota.isUnlimited ? 'unlimited' : quota.remaining,
          isUnlimited: quota.isUnlimited,
        },
      }
    }
  )
