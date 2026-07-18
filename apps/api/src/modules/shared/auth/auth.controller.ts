import { Elysia } from 'elysia'
import { jwt } from '@elysia/jwt'
import { AuthService } from './auth.service'
import { GoogleService } from './google.service'
import { LoginBody, RegisterBody } from './auth.validation'
import { authMiddleware } from '../../../common/middlewares/auth.middleware'
import { config, resolveFrontend } from '../../../config'

const authService = new AuthService()
const googleService = new GoogleService()

export const authController = new Elysia({ prefix: '/auth' })
  .use(jwt({ name: 'jwt', secret: config.jwt.secret }))

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
  .get('/google', ({ request }) => {
    const origin = request.headers.get('origin')
    const state = encodeURIComponent(resolveFrontend(origin))
    const url = googleService.getAuthUrl(state)
    return { redirect: url }
  })

  // Google OAuth callback
  .get(
    '/callback',
    async ({ query, jwt, cookie, set }) => {
      const { code, error, state } = query as {
        code?: string
        error?: string
        state?: string
      }
      const target = resolveFrontend(state ? decodeURIComponent(state) : null)

      const redirectToLogin = (err: string) => {
        set.status = 302
        set.headers['Location'] = `${target}/auth/login?error=${encodeURIComponent(err)}`
      }

      if (error) {
        redirectToLogin(error)
        return
      }

      if (!code) {
        redirectToLogin('missing_code')
        return
      }

      try {
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

        // Redirect ke frontend yang memulai login
        set.status = 302
        set.headers['Location'] = `${target}/dashboard`

        return
      } catch (err) {
        console.error('Google OAuth callback error:', err)
        redirectToLogin('server_error')
        return
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
