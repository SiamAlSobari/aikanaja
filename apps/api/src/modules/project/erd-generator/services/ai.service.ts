import { createGroq } from '@ai-sdk/groq'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText, streamText } from 'ai'
import { config } from '../../../../config'

type Provider = 'groq' | 'gemini'

interface GenerateOptions {
  system: string
  prompt: string
  provider?: Provider
  userApiKey?: string
  signal?: AbortSignal
}

// ── Helper functions ────────────────────────────────────────

function getKeys(provider: Provider): string[] {
  return provider === 'groq' ? config.ai.groqKeys : config.ai.geminiKeys
}

function createAiProvider(provider: Provider, apiKey: string) {
  return provider === 'groq'
    ? createGroq({ apiKey })
    : createGoogleGenerativeAI({ apiKey })
}

function getModel(provider: Provider) {
  return provider === 'groq'
    ? 'llama-3.3-70b-versatile'
    : 'gemini-2.0-flash'
}

// ── Attempt list builder ────────────────────────────────────

interface Attempt {
  provider: Provider
  key: string
  source: 'user' | 'server'
}

/**
 * Susun daftar semua key yang bisa dicoba, urut prioritas:
 * 1. User API key (kalau ada) — pakai provider yang diminta
 * 2. Semua server key dari provider yang diminta
 * 3. Semua server key dari provider lain (fallback cross-provider)
 */
function buildAttemptList(preferredProvider: Provider, userApiKey?: string): Attempt[] {
  const attempts: Attempt[] = []
  const fallbackProvider: Provider = preferredProvider === 'groq' ? 'gemini' : 'groq'

  // 1. User API key duluan
  if (userApiKey) {
    attempts.push({ provider: preferredProvider, key: userApiKey, source: 'user' })
  }

  // 2. Server keys — provider yang diminta
  for (const key of getKeys(preferredProvider)) {
    attempts.push({ provider: preferredProvider, key, source: 'server' })
  }

  // 3. Server keys — provider lain
  for (const key of getKeys(fallbackProvider)) {
    attempts.push({ provider: fallbackProvider, key, source: 'server' })
  }

  return attempts
}

// ── AI Service ──────────────────────────────────────────────

export class AiService {
  /**
   * Generate text dari AI (non-streaming).
   *
   * Fallback chain:
   *  User key → server keys provider utama → server keys provider lain
   *
   * Semua dicoba satu-satu. Baru throw kalau beneran semua gagal.
   */
  async generate(options: GenerateOptions) {
    const preferred = options.provider || 'groq'
    const attempts = buildAttemptList(preferred, options.userApiKey)

    if (attempts.length === 0) {
      throw new Error('No API keys available for any provider')
    }

    let lastError: Error | null = null

    for (let i = 0; i < attempts.length; i++) {
      const { provider, key, source } = attempts[i]
      try {
        const aiProvider = createAiProvider(provider, key)
        const model = getModel(provider)

        const result = await generateText({
          model: aiProvider(model),
          system: options.system,
          prompt: options.prompt,
          abortSignal: options.signal,
        })

        // Log kalau bukan attempt pertama (berarti ada fallback)
        if (i > 0) {
          console.log(
            `[AiService.generate] Berhasil di attempt ${i + 1} — ${provider} (${source})`
          )
        }

        return {
          text: result.text,
          provider,
          usage: result.usage,
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err))
        console.error(
          `[AiService.generate] Attempt ${i + 1}/${attempts.length} gagal`,
          { provider, source, error: lastError.message }
        )
      }
    }

    throw lastError || new Error('All API keys exhausted across all providers')
  }

  /**
   * Generate text dengan streaming (untuk SSE response).
   *
   * Sama kayak generate(), coba semua key satu-satu.
   * Catatan: error yang terjadi *di tengah* streaming tetap bisa lolos,
   * tapi error saat inisialisasi (key invalid, auth gagal) akan di-catch.
   */
  async generateStream(options: GenerateOptions) {
    const preferred = options.provider || 'groq'
    const attempts = buildAttemptList(preferred, options.userApiKey)

    if (attempts.length === 0) {
      throw new Error('No API keys available for any provider')
    }

    let lastError: Error | null = null

    for (let i = 0; i < attempts.length; i++) {
      const { provider, key, source } = attempts[i]
      try {
        const aiProvider = createAiProvider(provider, key)
        const model = getModel(provider)

        const stream = streamText({
          model: aiProvider(model),
          system: options.system,
          prompt: options.prompt,
          abortSignal: options.signal,
        })

        if (i > 0) {
          console.log(
            `[AiService.generateStream] Berhasil di attempt ${i + 1} — ${provider} (${source})`
          )
        }

        return stream
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err))
        console.error(
          `[AiService.generateStream] Attempt ${i + 1}/${attempts.length} gagal`,
          { provider, source, error: lastError.message }
        )
      }
    }

    throw lastError || new Error('All API keys exhausted across all providers')
  }
}
