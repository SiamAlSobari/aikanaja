import { Elysia } from 'elysia'
import { jwt } from '@elysia/jwt'
import { AuthService } from './auth.service'
import { GoogleService } from './google.service'
import { LoginBody, RegisterBody } from './auth.validation'
import { authMiddleware } from '../../../common/middlewares/auth.middleware'

const authService = new AuthService()
const googleService = new GoogleService()

export const authController = new Elysia({ prefix: '/auth' })
  .use(jwt({ name: 'jwt', secret: process.env.JWT_SECRET || 'super-secret-key' }))

  // Register (email/password) — legacy, bisa dihapus nanti
  .post(
    '/register',
    async ({ body, jwt, cookie }) => {
      const result = await authService.register(body)
      if (!result.data) return result

      const token = await jwt.sign({ id: result.data.id, email: result.data.email, role: result.data.role })
      cookie.token.value = token
      cookie.token.httpOnly = true
      cookie.token.sameSite = 'lax'
      cookie.token.maxAge = 60 * 60 * 24 * 7

      return result
    },
    { body: RegisterBody }
  )

  // Login (email/password) — legacy, bisa dihapus nanti
  .post(
    '/login',
    async ({ body, jwt, cookie }) => {
      const result = await authService.login(body)
      if (!result.data) return result

      const token = await jwt.sign({ id: result.data.id, email: result.data.email, role: result.data.role })
      cookie.token.value = token
      cookie.token.httpOnly = true
      cookie.token.sameSite = 'lax'
      cookie.token.maxAge = 60 * 60 * 24 * 7

      return result
    },
    { body: LoginBody }
  )

  // Google OAuth — redirect ke Google consent screen
  .get('/google', () => {
    const url = googleService.getAuthUrl()
    return { redirect: url }
  })

  // Google OAuth callback
  .get(
    '/callback',
    async ({ query, jwt, cookie, set }) => {
      try {
        const { code, error } = query as { code?: string; error?: string }

        if (error) {
          set.status = 400
          return { message: `Google OAuth error: ${error}`, data: null }
        }

        if (!code) {
          set.status = 400
          return { message: 'Missing authorization code', data: null }
        }

        // Exchange code untuk tokens
        const tokens = await googleService.exchangeCode(code)

        // Get user info dari Google
        const googleUser = await googleService.getUserInfo(tokens.access_token)

        // Find atau create user di database
        const user = await googleService.findOrCreateUser(googleUser)

        // Generate JWT token
        const token = await jwt.sign({
          id: user.id,
          email: user.email,
          role: user.role,
        })

        // Set cookie
        cookie.token.value = token
        cookie.token.httpOnly = true
        cookie.token.sameSite = 'lax'
        cookie.token.maxAge = 60 * 60 * 24 * 7 // 7 hari

        // Redirect ke frontend dashboard
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        set.status = 302
        set.headers['Location'] = `${frontendUrl}/dashboard`

        return { message: 'Login successful', data: user }
      } catch (err) {
        console.error('Google OAuth callback error:', err)
        set.status = 500
        return { message: 'Failed to process Google OAuth callback', data: null }
      }
    }
  )

  // Logout — clear cookie
  .post('/logout', ({ cookie }) => {
    cookie.token.value = ''
    cookie.token.httpOnly = true
    cookie.token.sameSite = 'lax'
    cookie.token.maxAge = 0

    return { message: 'Logged out' }
  })
