import { AiPromptService } from './ai-prompt.service'
import { InternalServerErrorException } from 'elysia-http-exception'

export interface PersonaReview {
  score: number // 0 - 100
  summary: string
  keyFeedback: string[]
}

export interface VirtualReviewResult {
  techLead: PersonaReview & {
    feasibilityIssues: string[]
    architectureRecommendations: string[]
  }
  qaEngineer: PersonaReview & {
    edgeCases: string[]
    missingBoundaryConditions: string[]
  }
  productSponsor: PersonaReview & {
    businessValueFeedback: string[]
    kpiAlignment: string[]
  }
  overallRecommendations: string[]
}

const VIRTUAL_REVIEW_SYSTEM_PROMPT = `Anda adalah sistem AI Virtual Stakeholder Reviewer yang melakukan audit & simulasi review komprehensif terhadap dokumen PRD.

Tugas Anda:
Simulasikan masukan dan kritik dari 3 persona profesional:
1. Tech Lead Persona: Menilai kelayakan teknis, arsitektur, skalabilitas, dan bottleneck.
2. QA Engineer Persona: Menemukan edge cases, boundary conditions, dan skenario kegagalan.
3. Product Sponsor / Business Persona: Menilai nilai bisnis, KPI, ROI, dan relevansi produk.

WAJIB mengembalikan output HANYA dalam bentuk JSON valid tanpa teks pengantar atau penutup lain:
{
  "techLead": {
    "score": 85,
    "summary": "...",
    "keyFeedback": ["..."],
    "feasibilityIssues": ["..."],
    "architectureRecommendations": ["..."]
  },
  "qaEngineer": {
    "score": 80,
    "summary": "...",
    "keyFeedback": ["..."],
    "edgeCases": ["..."],
    "missingBoundaryConditions": ["..."]
  },
  "productSponsor": {
    "score": 90,
    "summary": "...",
    "keyFeedback": ["..."],
    "businessValueFeedback": ["..."],
    "kpiAlignment": ["..."]
  },
  "overallRecommendations": ["..."]
}`

export class VirtualReviewService {
  private aiPromptService = new AiPromptService()

  async generateVirtualReview(
    prdContent: string,
    userApiKey?: string
  ): Promise<VirtualReviewResult> {
    try {
      const prompt = `Lakukan simulasi Virtual Stakeholder Review untuk dokumen PRD berikut:\n\n${prdContent}`
      const rawText = await this.aiPromptService.generateText(
        VIRTUAL_REVIEW_SYSTEM_PROMPT,
        prompt,
        userApiKey,
        'gemini'
      )

      // Clean markdown code blocks if present
      const cleaned = rawText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      const parsed: VirtualReviewResult = JSON.parse(cleaned)

      return {
        techLead: {
          score: parsed.techLead?.score ?? 80,
          summary: parsed.techLead?.summary || 'Tinjauan teknis selesai.',
          keyFeedback: Array.isArray(parsed.techLead?.keyFeedback) ? parsed.techLead.keyFeedback : [],
          feasibilityIssues: Array.isArray(parsed.techLead?.feasibilityIssues) ? parsed.techLead.feasibilityIssues : [],
          architectureRecommendations: Array.isArray(parsed.techLead?.architectureRecommendations) ? parsed.techLead.architectureRecommendations : [],
        },
        qaEngineer: {
          score: parsed.qaEngineer?.score ?? 80,
          summary: parsed.qaEngineer?.summary || 'Tinjauan QA selesai.',
          keyFeedback: Array.isArray(parsed.qaEngineer?.keyFeedback) ? parsed.qaEngineer.keyFeedback : [],
          edgeCases: Array.isArray(parsed.qaEngineer?.edgeCases) ? parsed.qaEngineer.edgeCases : [],
          missingBoundaryConditions: Array.isArray(parsed.qaEngineer?.missingBoundaryConditions) ? parsed.qaEngineer.missingBoundaryConditions : [],
        },
        productSponsor: {
          score: parsed.productSponsor?.score ?? 80,
          summary: parsed.productSponsor?.summary || 'Tinjauan bisnis selesai.',
          keyFeedback: Array.isArray(parsed.productSponsor?.keyFeedback) ? parsed.productSponsor.keyFeedback : [],
          businessValueFeedback: Array.isArray(parsed.productSponsor?.businessValueFeedback) ? parsed.productSponsor.businessValueFeedback : [],
          kpiAlignment: Array.isArray(parsed.productSponsor?.kpiAlignment) ? parsed.productSponsor.kpiAlignment : [],
        },
        overallRecommendations: Array.isArray(parsed.overallRecommendations) ? parsed.overallRecommendations : [],
      }
    } catch (err) {
      console.error('[VirtualReviewService.generateVirtualReview]', err)
      throw new InternalServerErrorException('Failed to generate virtual review')
    }
  }
}
