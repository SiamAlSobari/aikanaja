import { prisma } from "../../../lib/prisma";

export class AuthService {
  async register(data: { name: string; email: string; password: string }) {
    const exists = await prisma.user.findUnique({ where: { email: data.email } })
    if (exists) return { message: 'Email already registered', data: null }

    const hashed = await Bun.password.hash(data.password)
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password: hashed },
    })

    return {
      message: 'Registered',
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    }
  }

  async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (!user) return { message: 'Invalid credentials', data: null }

    const valid = await Bun.password.verify(data.password, user.password)
    if (!valid) return { message: 'Invalid credentials', data: null }

    return {
      message: 'Logged in',
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    }
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    })

    if (!user) return { message: 'User not found', data: null }

    return { data: user }
  }
}
