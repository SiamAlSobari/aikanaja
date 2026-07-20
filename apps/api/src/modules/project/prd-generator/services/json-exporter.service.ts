import { AiPromptService } from './ai-prompt.service'
import { InternalServerErrorException } from 'elysia-http-exception'

export interface JsonSpecExportResult {
  filename: string
  spec: Record<string, any>
}

const JSON_EXPORTER_SYSTEM_PROMPT = `Anda adalah AI System Architect & JSON Data Exporter.

Tugas Anda:
Mengonversi dokumen PRD format Markdown menjadi objek JSON spec terstruktur standar enterprise.

Struktur JSON WAJIB Dihasilkan HANYA dalam format JSON valid:
{
  "title": "...",
  "version": "1.0",
  "executiveSummary": "...",
  "problemStatement": {
    "background": "...",
    "scope": "...",
    "goals": ["..."]
  },
  "userPersonas": [
    { "role": "...", "needs": ["..."], "painPoints": ["..."] }
  ],
  "functionalRequirements": [
    { "id": "FR-01", "feature": "...", "description": "...", "priority": "high" | "medium" | "low" }
  ],
  "userStories": [
    { "featureId": "FR-01", "story": "Given-When-Then...", "storyPoints": 5 }
  ],
  "sprintRoadmap": {
    "sprint1": ["..."],
    "sprint2": ["..."],
    "sprint3": ["..."]
  },
  "nonFunctionalRequirements": {
    "performance": ["..."],
    "security": ["..."],
    "scalability": ["..."]
  },
  "riskAnalysis": [
    { "risk": "...", "mitigation": "..." }
  ],
  "outOfScope": ["..."]
}`

export class JsonExporterService {
  private aiPromptService = new AiPromptService()

  async exportJsonSpec(
    prdContent: string,
    userApiKey?: string
  ): Promise<JsonSpecExportResult> {
    try {
      const prompt = `Ekstrak dan konversi dokumen PRD berikut menjadi JSON Spec terstruktur:\n\n${prdContent}`
      const rawText = await this.aiPromptService.generateText(
        JSON_EXPORTER_SYSTEM_PROMPT,
        prompt,
        userApiKey,
        'gemini'
      )

      const cleaned = rawText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      const spec = JSON.parse(cleaned)

      return {
        filename: 'prd-spec.json',
        spec,
      }
    } catch (err) {
      console.error('[JsonExporterService.exportJsonSpec]', err)
      throw new InternalServerErrorException('Failed to generate PRD JSON spec')
    }
  }
}
