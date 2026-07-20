import { AiPromptService } from './ai-prompt.service'
import { InternalServerErrorException } from 'elysia-http-exception'

export interface AgentExportResult {
  filename: string
  content: string
  targetAgent: string
}

const AGENT_EXPORTER_SYSTEM_PROMPT = `Anda adalah AI System Architect & Agent Prompt Engineer.

Tugas Anda:
Mengonversi dokumen PRD menjadi berkas spesifikasi instruksi koding terstruktur (\`AGENTS.md\` / \`PROMPT.md\`) yang siap dieksekusi oleh AI Coding Agents (Cursor, Claude Code, Antigravity, dll).

Struktur Berkas Export yang WAJIB Dihasilkan:
1. **PROJECT OVERVIEW & GOALS** — Ringkasan singkat fitur yang harus dibagun.
2. **TECH STACK & ARCHITECTURE DIRECTIVES** — Panduan arsitektur & dependensi.
3. **DATABASE SCHEMA REQUIREMENTS** — Ringkasan model data & atribut utama.
4. **API ENDPOINTS SPECIFICATION** — Daftar route, method, payload, & response.
5. **FRONTEND COMPONENTS & UI BREAKDOWN** — Daftar komponen UI & interaksi.
6. **STEP-BY-STEP IMPLEMENTATION TASKS** — Urutan tugas koding dari Phase 1 hingga Selesai.
7. **VERIFICATION & TESTING CHECKLIST** — Perintah pengujian & kriteria lolos test.

Aturan:
- Hasilkan Markdown murni yang sangat jelas dan teknis.
- Tulis instruksi dengan sintaks dan style panduan agentic coding.`

export class AgentExporterService {
  private aiPromptService = new AiPromptService()

  async exportAgentPrompt(
    prdContent: string,
    targetAgent: 'cursor' | 'claude' | 'antigravity' | 'generic' = 'antigravity',
    userApiKey?: string
  ): Promise<AgentExportResult> {
    try {
      const prompt = `Konversi dokumen PRD berikut menjadi berkas spesifikasi AGENTS.md / PROMPT.md untuk target AI Coding Agent: ${targetAgent.toUpperCase()}.\n\nDokumen PRD:\n${prdContent}`
      
      const rawText = await this.aiPromptService.generateText(
        AGENT_EXPORTER_SYSTEM_PROMPT,
        prompt,
        userApiKey,
        'gemini'
      )

      // Ensure clean content without outer json wrapper
      const content = rawText
        .replace(/^```markdown\s*/g, '')
        .replace(/^```\s*/g, '')
        .replace(/```$/g, '')
        .trim()

      const filename = targetAgent === 'cursor' ? '.cursorrules' : 'AGENTS.md'

      return {
        filename,
        content,
        targetAgent,
      }
    } catch (err) {
      console.error('[AgentExporterService.exportAgentPrompt]', err)
      throw new InternalServerErrorException('Failed to export AI agent prompt')
    }
  }
}
