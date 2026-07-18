import { prisma } from '../../../lib/prisma'

export interface ApiKeyView {
  id: string
  provider: string
  label: string | null
  masked: string
  isDefault: boolean
  createdAt: string
}

function maskKey(key: string): string {
  const tail = key.slice(-4)
  return `sk-...${tail}`
}

export class ApiKeyService {
  async list(userId: string): Promise<ApiKeyView[]> {
    const keys = await prisma.apiKey.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })
    return keys.map((k) => ({
      id: k.id,
      provider: k.provider,
      label: k.label,
      masked: maskKey(k.key),
      isDefault: k.isDefault,
      createdAt: k.createdAt.toISOString(),
    }))
  }

  async add(
    userId: string,
    input: { provider: string; key: string; label?: string }
  ): Promise<ApiKeyView> {
    const existingCount = await prisma.apiKey.count({ where: { userId } })
    const created = await prisma.apiKey.create({
      data: {
        userId,
        provider: input.provider,
        key: input.key,
        label: input.label,
        isDefault: existingCount === 0,
      },
    })
    return {
      id: created.id,
      provider: created.provider,
      label: created.label,
      masked: maskKey(created.key),
      isDefault: created.isDefault,
      createdAt: created.createdAt.toISOString(),
    }
  }

  async setDefault(userId: string, id: string): Promise<ApiKeyView> {
    const target = await prisma.apiKey.findFirst({ where: { id, userId } })
    if (!target) throw new Error('API key tidak ditemukan')

    await prisma.$transaction([
      prisma.apiKey.updateMany({
        where: { userId, provider: target.provider, isDefault: true },
        data: { isDefault: false },
      }),
      prisma.apiKey.update({
        where: { id },
        data: { isDefault: true },
      }),
    ])

    const updated = await prisma.apiKey.findUniqueOrThrow({ where: { id } })
    return {
      id: updated.id,
      provider: updated.provider,
      label: updated.label,
      masked: maskKey(updated.key),
      isDefault: updated.isDefault,
      createdAt: updated.createdAt.toISOString(),
    }
  }

  async remove(userId: string, id: string): Promise<void> {
    const target = await prisma.apiKey.findFirst({ where: { id, userId } })
    if (!target) throw new Error('API key tidak ditemukan')
    await prisma.apiKey.delete({ where: { id } })
  }

  /** Ambil default key user utk provider tertentu (dipakai generate). */
  async getDefaultKey(userId: string, provider: string): Promise<string | null> {
    const k = await prisma.apiKey.findFirst({
      where: { userId, provider, isDefault: true },
    })
    return k?.key ?? null
  }

  /** Validasi key lewat provider endpoint murah. */
  async testConnection(provider: string, key: string): Promise<boolean> {
    try {
      if (provider === 'groq') {
        const res = await fetch('https://api.groq.com/openai/v1/models', {
          headers: { Authorization: `Bearer ${key}` },
        })
        return res.ok
      }
      if (provider === 'gemini') {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
          { method: 'GET' }
        )
        return res.ok
      }
      return false
    } catch {
      return false
    }
  }
}
