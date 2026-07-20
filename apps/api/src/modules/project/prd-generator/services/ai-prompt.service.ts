import { createGroq } from '@ai-sdk/groq'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText } from 'ai'
import { config } from '../../../../config'

type Provider = 'groq' | 'gemini'

// ── System Prompts ──────────────────────────────────────────

export const PRD_GENERATOR_SYSTEM_PROMPT = `Anda adalah AI Product Requirement Document (PRD) Generator yang expert.

Tugas: Generate PRD lengkap dalam format Markdown berdasarkan input pengguna.

Struktur PRD yang WAJIB dihasilkan:
1. **Executive Summary & Visi Produk** — Ringkasan proyek, nilai bisnis, latar belakang
2. **Problem Statement, Scope & Goals** — Masalah yang diselesaikan, batas lingkup, KPI
3. **User Personas & Target Audience** — Profil pengguna, kebutuhan, pain points
4. **Functional Requirements (FR)** — Matriks kebutuhan fungsional (Feature ID, Fitur, Deskripsi, Prioritas)
5. **User Stories, Acceptance Criteria & Story Points** — Format Given-When-Then, estimasi Story Points (1,2,3,5,8,13)
6. **Sprint Roadmap & Milestone Allocation** — Distribusi ke Sprint 1 (MVP), Sprint 2 (Expansion), Sprint 3 (Scalability)
7. **Non-Functional Requirements (NFR)** — Performa, Keamanan, Skalabilitas, Ketersediaan
8. **Mermaid.js Diagrams** — User Flow, Sequence Diagram, System Architecture (dalam code block mermaid)
9. **Risk Analysis & Mitigation** — Risiko teknis/bisnis dan strategi mitigasi
10. **Out of Scope / Future Enhancements** — Fitur yang ditunda ke phase berikutnya

Aturan:
- Gunakan bahasa Indonesia yang profesional
- User stories WAJIB format Given-When-Then
- Story Points mengikuti Fibonacci: 1, 2, 3, 5, 8, 13
- Sprint 1 = MVP (prioritas tinggi, fondasi sistem)
- Sprint 2 = Expansion (fitur pelengkap)
- Sprint 3 = Scalability (optimasi, fitur lanjutan)
- Setiap FR harus punya minimal 1 User Story
- Output dalam format Markdown murni`

export const PRD_COPILOT_SYSTEM_PROMPT = `Anda adalah AI Copilot untuk PRD Editor. Pengguna sedang mengedit dokumen PRD dan meminta bantuan Anda.

Tugas Anda:
- Merevisi acceptance criteria agar lebih spesifik
- Menambahkan user stories baru
- Memperjelas section yang ambigu
- Menghitung ulang story points
- Menambah detail pada section yang kurang lengkap
- Merekomendasikan improvement untuk kualitas PRD

Aturan:
- Selalu pertahankan konteks dokumen yang sedang diedit
- Output dalam format Markdown
- Jika diminta merevisi, kirim hanya bagian yang direvisi (bukan seluruh dokumen)
- Jika diminta menambah, kirim bagian baru yang bisa di-insert
- Gunakan bahasa Indonesia yang profesional
- Story Points tetap pakai Fibonacci: 1, 2, 3, 5, 8, 13`

// ── Provider Helpers ─────────────────────────────────────────

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

// ── Attempt List Builder ─────────────────────────────────────

interface Attempt {
  provider: Provider
  key: string
  source: 'user' | 'server'
}

function buildAttemptList(preferredProvider: Provider, userApiKey?: string): Attempt[] {
  const attempts: Attempt[] = []
  const fallbackProvider: Provider = preferredProvider === 'groq' ? 'gemini' : 'groq'

  if (userApiKey) {
    attempts.push({ provider: preferredProvider, key: userApiKey, source: 'user' })
  }

  for (const key of getKeys(preferredProvider)) {
    attempts.push({ provider: preferredProvider, key, source: 'server' })
  }

  for (const key of getKeys(fallbackProvider)) {
    attempts.push({ provider: fallbackProvider, key, source: 'server' })
  }

  return attempts
}

// ── AI Prompt Service ────────────────────────────────────────

export class AiPromptService {
  /**
   * Extract custom API key dari request header.
   * Header: x-custom-api-key
   */
  extractCustomApiKey(headers: Record<string, string | null>): string | undefined {
    return headers['x-custom-api-key'] || undefined
  }

  /**
   * Stream PRD generation response.
   * Fallback: user key → server keys gemini → server keys groq
   */
  async streamGenerate(
    prompt: string,
    userApiKey?: string,
    signal?: AbortSignal
  ) {
    const preferred: Provider = 'gemini'
    const attempts = buildAttemptList(preferred, userApiKey)

    if (attempts.length === 0) {
      throw new Error('No API keys available')
    }

    let lastError: Error | null = null

    for (let i = 0; i < attempts.length; i++) {
      const { provider, key, source } = attempts[i]
      try {
        const aiProvider = createAiProvider(provider, key)
        const model = getModel(provider)

        const stream = streamText({
          model: aiProvider(model),
          system: PRD_GENERATOR_SYSTEM_PROMPT,
          prompt,
          abortSignal: signal,
        })

        if (i > 0) {
          console.log(`[AiPromptService.streamGenerate] Fallback ke attempt ${i + 1} — ${provider} (${source})`)
        }

        return stream
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err))
        console.error(`[AiPromptService.streamGenerate] Attempt ${i + 1}/${attempts.length} gagal`, {
          provider,
          source,
          error: lastError.message,
        })
      }
    }

    throw lastError || new Error('All API keys exhausted')
  }

  /**
   * Stream copilot response (inline edit, section expand, etc.)
   */
  async streamCopilot(
    instruction: string,
    currentContent: string,
    userApiKey?: string,
    signal?: AbortSignal
  ) {
    const preferred: Provider = 'groq'
    const attempts = buildAttemptList(preferred, userApiKey)

    if (attempts.length === 0) {
      throw new Error('No API keys available')
    }

    let lastError: Error | null = null

    for (let i = 0; i < attempts.length; i++) {
      const { provider, key, source } = attempts[i]
      try {
        const aiProvider = createAiProvider(provider, key)
        const model = getModel(provider)

        const prompt = `Instruksi: ${instruction}\n\nDokumen PRD saat ini:\n${currentContent}`

        const stream = streamText({
          model: aiProvider(model),
          system: PRD_COPILOT_SYSTEM_PROMPT,
          prompt,
          abortSignal: signal,
        })

        if (i > 0) {
          console.log(`[AiPromptService.streamCopilot] Fallback ke attempt ${i + 1} — ${provider} (${source})`)
        }

        return stream
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err))
        console.error(`[AiPromptService.streamCopilot] Attempt ${i + 1}/${attempts.length} gagal`, {
          provider,
          source,
          error: lastError.message,
        })
      }
    }

    throw lastError || new Error('All API keys exhausted')
  }
}
