import { AiPromptService } from './ai-prompt.service'
import { InternalServerErrorException } from 'elysia-http-exception'

export interface AmbiguityWarning {
  phrase: string
  issue: string
  recommendation: string
}

export interface CompletenessItem {
  section: string
  status: 'complete' | 'incomplete' | 'missing'
  feedback: string
}

export interface QualityAuditResult {
  healthScore: number // 0-100
  summary: string
  ambiguityWarnings: AmbiguityWarning[]
  completenessCheck: CompletenessItem[]
}

const QUALITY_AUDIT_SYSTEM_PROMPT = `Anda adalah AI PRD Quality Auditor & Ambiguity Inspector.

Tugas Anda:
1. Audit kualitas dokumen PRD dan kalkulasikan Skor Kesehatan (0-100).
2. Ambiguity Detector: Cari kalimat atau istilah samar (misal: "aplikasi harus cepat", "mudah digunakan", "scalable", "loading sebentar", "ui bagus", "aman") dan berikan rekomendasi pengubahan yang spesifik & terukur (misal: "P95 response time < 200ms", "SUS score > 80").
3. Completeness Inspector: Evaluasi kelengkapan 11 Core Section PRD (Executive Summary, Scope & Goals, Target Audience, Functional Requirements, User Stories & Story Points, Sprint Roadmap, NFR, Mermaid Diagrams, Risk Analysis, Out of Scope).

WAJIB mengembalikan output HANYA dalam bentuk JSON valid tanpa teks pengantar atau penutup lain:
{
  "healthScore": 88,
  "summary": "...",
  "ambiguityWarnings": [
    {
      "phrase": "...",
      "issue": "...",
      "recommendation": "..."
    }
  ],
  "completenessCheck": [
    {
      "section": "...",
      "status": "complete" | "incomplete" | "missing",
      "feedback": "..."
    }
  ]
}`

export class QualityAuditService {
  private aiPromptService = new AiPromptService()

  async auditQuality(
    prdContent: string,
    userApiKey?: string
  ): Promise<QualityAuditResult> {
    try {
      const prompt = `Audit kualitas dan ketidakjelasan (ambiguity) dari dokumen PRD berikut:\n\n${prdContent}`
      const rawText = await this.aiPromptService.generateText(
        QUALITY_AUDIT_SYSTEM_PROMPT,
        prompt,
        userApiKey,
        'gemini'
      )

      const cleaned = rawText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      const parsed: QualityAuditResult = JSON.parse(cleaned)

      return {
        healthScore: Math.min(100, Math.max(0, parsed.healthScore ?? 75)),
        summary: parsed.summary || 'Audit kualitas PRD selesai.',
        ambiguityWarnings: Array.isArray(parsed.ambiguityWarnings) ? parsed.ambiguityWarnings : [],
        completenessCheck: Array.isArray(parsed.completenessCheck) ? parsed.completenessCheck : [],
      }
    } catch (err) {
      console.error('[QualityAuditService.auditQuality]', err)
      throw new InternalServerErrorException('Failed to audit PRD quality')
    }
  }
}
