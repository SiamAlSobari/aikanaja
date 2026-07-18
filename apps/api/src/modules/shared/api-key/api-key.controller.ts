import { Elysia, t } from 'elysia'
import { authMiddleware } from '../../../common/middlewares/auth.middleware'
import { ApiKeyService } from './api-key.service'

const apiKeyService = new ApiKeyService()
const providerEnum = t.Union([t.Literal('groq'), t.Literal('gemini')])

export const apiKeyController = new Elysia({ prefix: '/api-keys' })
  .use(authMiddleware())

  // GET /api-keys — list user's keys (masked)
  .get('/', async ({ user }) => {
    const keys = await apiKeyService.list(user.id)
    return { data: keys }
  })
  

  // POST /api-keys — add key (test koneksi dulu)
  .post(
    '/',
    async ({ body, user, set }) => {
      const ok = await apiKeyService.testConnection(body.provider, body.key)
      if (!ok) {
        set.status = 400
        return { message: 'Koneksi gagal. Periksa API key.', data: null }
      }
      const created = await apiKeyService.add(user.id, {
        provider: body.provider,
        key: body.key,
        label: body.label,
      })
      return { data: created }
    },
    {
      body: t.Object({
        provider: providerEnum,
        key: t.String({ minLength: 10 }),
        label: t.Optional(t.String()),
      }),
    }
  )

  // PATCH /api-keys/:id/default — set sebagai default provider
  .patch(
    '/:id/default',
    async ({ params, user, set }) => {
      try {
        const updated = await apiKeyService.setDefault(user.id, params.id)
        return { data: updated }
      } catch (err: any) {
        set.status = 400
        return { message: err.message || 'Gagal set default', data: null }
      }
    }
  )

  // DELETE /api-keys/:id — hapus key
  .delete(
    '/:id',
    async ({ params, user, set }) => {
      try {
        await apiKeyService.remove(user.id, params.id)
        return { message: 'API key dihapus' }
      } catch (err: any) {
        set.status = 400
        return { message: err.message || 'Gagal hapus', data: null }
      }
    }
  )

  // POST /api-keys/test — test koneksi tanpa simpan
  .post(
    '/test',
    async ({ body, set }) => {
      const ok = await apiKeyService.testConnection(body.provider, body.key)
      if (!ok) {
        set.status = 400
        return { message: 'Koneksi gagal', data: null }
      }
      return { message: 'Koneksi berhasil' }
    },
    {
      body: t.Object({
        provider: providerEnum,
        key: t.String({ minLength: 10 }),
      }),
    }
  )
