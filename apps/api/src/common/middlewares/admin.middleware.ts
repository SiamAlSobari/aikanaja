import { Elysia } from 'elysia'
import { jwt } from '@elysia/jwt'
import { ForbiddenException } from 'elysia-http-exception'

/**
 * Admin middleware — cek user.role === 'admin'.
 * WAJIB dipakai sesudah authMiddleware (user harus ada di context).
 */
export const adminMiddleware = () =>
  new Elysia()
    .use(jwt({ name: 'jwt', secret: process.env.JWT_SECRET || 'super-secret-key' }))
    .derive({ as: 'scoped' }, async ({ cookie, jwt, set }) => {
      const token = cookie.token
      if (!token?.value) {
        set.status = 401
        throw new Error('Unauthorized')
      }

      const payload = await jwt.verify(token.value as string)
      if (!payload) {
        set.status = 401
        throw new Error('Invalid token')
      }

      if (payload.role !== 'admin') {
        throw new ForbiddenException('Admin access required')
      }

      return {
        user: {
          id: payload.id as string,
          email: payload.email as string,
          role: payload.role as string,
        },
      }
    })
