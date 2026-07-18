import { t } from 'elysia'

// POST /erd/generate — Generate schema body
export const GenerateSchemaBody = t.Object({
  prompt: t.String({ minLength: 5, maxLength: 2000 }),
  provider: t.Optional(t.Union([t.Literal('groq'), t.Literal('gemini')])),
  apiKey: t.Optional(t.String()),
})

// GET /erd/usage — Response type (untuk dokumentasi)
export const UsageResponse = t.Object({
  count: t.Number(),
  limit: t.Number(),
  remaining: t.Union([t.Number(), t.Literal('unlimited')]),
  isUnlimited: t.Boolean(),
})
