import { prisma } from '../../../lib/prisma'
import { config } from '../../../config'

interface GoogleUserInfo {
  id: string
  email: string
  name: string
  picture?: string
  verified_email: boolean
}

interface GoogleTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope: string
  id_token: string
}

export class GoogleService {
  private clientId = config.google.clientId
  private clientSecret = config.google.clientSecret
  private redirectUri = config.google.redirectUri

  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    })
    if (state) params.set('state', state)

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  async exchangeCode(code: string): Promise<GoogleTokenResponse> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens')
    }

    return response.json()
  }

  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!response.ok) {
      throw new Error('Failed to get user info from Google')
    }

    return response.json()
  }

  async findOrCreateUser(googleUser: GoogleUserInfo) {
    // Cari user berdasarkan email
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    })

    if (user) {
      // Update nama dan avatar jika berubah
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: googleUser.name,
        },
      })
    } else {
      // Buat user baru
      user = await prisma.user.create({
        data: {
          name: googleUser.name,
          email: googleUser.email,
          password: '', // Google OAuth, tidak ada password
          role: 'user',
        },
      })
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  }
}
