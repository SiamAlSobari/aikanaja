import { Elysia } from 'elysia'
import { jwt } from '@elysia/jwt'
import { config } from '../../config'

export interface AuthUser {
  id: string
  email: string
  role: string
}

// Auth middleware yang WAJIB authenticated
export const authMiddleware = () =>
  new Elysia()
    .use(jwt({ name: 'jwt', secret: config.jwt.secret }))
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

      const user: AuthUser = {
        id: payload.id as string,
        email: payload.email as string,
        role: payload.role as string,
      }

      return { user }
    })

// Auth middleware yang OPSIONAL (user bisa null untuk guest routes)
export const optionalAuthMiddleware = () =>
  new Elysia()
    .use(jwt({ name: 'jwt', secret: config.jwt.secret }))
    .derive({ as: 'scoped' }, async ({ cookie, jwt }) => {
      const token = cookie.token
      if (!token?.value) {
        return { user: null }
      }

      try {
        const payload = await jwt.verify(token.value as string)
        if (!payload) {
          return { user: null }
        }

        const user: AuthUser = {
          id: payload.id as string,
          email: payload.email as string,
          role: payload.role as string,
        }

        return { user }
      } catch {
        return { user: null }
      }
    })
