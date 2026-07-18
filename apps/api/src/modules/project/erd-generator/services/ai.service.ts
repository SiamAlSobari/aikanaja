import { createGroq } from '@ai-sdk/groq'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText, streamText } from 'ai'

type Provider = 'groq' | 'gemini'

interface GenerateOptions {
  system: string
  prompt: string
  provider?: Provider
  userApiKey?: string
}

// Key rotation state
const groqKeyIndex = { current: 0 }
const geminiKeyIndex = { current: 0 }

// Load keys dari env
function getGroqKeys(): string[] {
  const keys: string[] = []
  for (let i = 1; i <= 4; i++) {
    const key = process.env[`GROQ_AI_API_KEY${i}`]
    if (key) keys.push(key)
  }
  return keys
}

function getGeminiKeys(): string[] {
  const keys: string[] = []
  for (let i = 1; i <= 3; i++) {
    const key = process.env[`GEMINI_API_KEY${i}`]
    if (key) keys.push(key)
  }
  return keys
}

// Round-robin key selection
function getNextKey(keys: string[], index: { current: number }): string {
  if (keys.length === 0) throw new Error('No API keys available')
  const key = keys[index.current % keys.length]
  index.current++
  return key
}

// Create provider instance
function createProvider(provider: Provider, apiKey?: string) {
  if (provider === 'groq') {
    const key = apiKey || getNextKey(getGroqKeys(), groqKeyIndex)
    return createGroq({ apiKey: key })
  } else {
    const key = apiKey || getNextKey(getGeminiKeys(), geminiKeyIndex)
    return createGoogleGenerativeAI({ apiKey: key })
  }
}

// Get model name
function getModel(provider: Provider) {
  return provider === 'groq'
    ? 'llama-3.3-70b-versatile'
    : 'gemini-2.0-flash'
}

export class AiService {
  /**
   * Generate text dari AI (non-streaming).
   * - Support Groq dan Gemini provider
   * - Key rotation dengan retry (max 3 attempts)
   * - Jika user API key gagal, langsung throw (tidak retry)
   */
  async generate(options: GenerateOptions) {
    const provider = options.provider || 'groq'
    const maxRetries = 3
    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const aiProvider = createProvider(provider, options.userApiKey)
        const model = getModel(provider)

        const result = await generateText({
          model: aiProvider(model),
          system: options.system,
          prompt: options.prompt,
        })

        return {
          text: result.text,
          provider,
          usage: result.usage,
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err))
        console.error(`[AiService.generate] Attempt ${attempt + 1} failed`, {
          provider,
          error: lastError.message,
        })

        // Jika user API key gagal, jangan retry dengan key lain
        if (options.userApiKey) throw lastError

        // Retry dengan key berikutnya
        continue
      }
    }

    throw lastError || new Error('All retry attempts failed')
  }

  /** Generate text dengan streaming (untuk SSE response) */
  async generateStream(options: GenerateOptions) {
    const provider = options.provider || 'groq'
    const aiProvider = createProvider(provider, options.userApiKey)
    const model = getModel(provider)

    return streamText({
      model: aiProvider(model),
      system: options.system,
      prompt: options.prompt,
    })
  }
}
