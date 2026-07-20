import { AiPromptService } from './ai-prompt.service'
import { InternalServerErrorException } from 'elysia-http-exception'

export interface SprintTask {
  featureId: string
  title: string
  userStory: string
  storyPoints: number // 1, 2, 3, 5, 8, 13
  reasoning: string
}

export interface SprintPlanResult {
  totalStoryPoints: number
  sprintRoadmap: {
    sprint1: SprintTask[] // MVP Launch
    sprint2: SprintTask[] // Expansion & Enhancements
    sprint3: SprintTask[] // Scalability & Advanced Features
  }
  velocityRecommendation: string
}

const SPRINT_PLANNER_SYSTEM_PROMPT = `Anda adalah AI Agile Coach & Technical Sprint Planner.

Tugas Anda:
1. Analisis seluruh User Stories & Functional Requirements di dalam dokumen PRD.
2. Tetapkan estimasi Story Points berbasis Fibonacci (1, 2, 3, 5, 8, 13) berdasarkan faktor risiko teknis, kompleksitas UI/API, dan dependensi.
3. Kelompokkan seluruh fitur ke dalam 3 alokasi Milestone Sprint Roadmap:
   - Sprint 1 (MVP Launch): Fitur prioritas tinggi & fondasi inti sistem.
   - Sprint 2 (Expansion & Enhancements): Fitur pelengkap & integrasi sekunder.
   - Sprint 3 (Scalability & Advanced Features): Optimasi performa & fitur kompleks tingkat lanjut.

WAJIB mengembalikan output HANYA dalam bentuk JSON valid tanpa teks pengantar atau penutup lain:
{
  "totalStoryPoints": 42,
  "sprintRoadmap": {
    "sprint1": [
      {
        "featureId": "FR-01",
        "title": "...",
        "userStory": "...",
        "storyPoints": 5,
        "reasoning": "..."
      }
    ],
    "sprint2": [],
    "sprint3": []
  },
  "velocityRecommendation": "..."
}`

export class SprintPlannerService {
  private aiPromptService = new AiPromptService()

  async planSprint(
    prdContent: string,
    userApiKey?: string
  ): Promise<SprintPlanResult> {
    try {
      const prompt = `Analisis PRD dan buat estimasi Story Points Fibonacci serta Sprint Roadmap Plan:\n\n${prdContent}`
      const rawText = await this.aiPromptService.generateText(
        SPRINT_PLANNER_SYSTEM_PROMPT,
        prompt,
        userApiKey,
        'gemini'
      )

      const cleaned = rawText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      const parsed: SprintPlanResult = JSON.parse(cleaned)

      const sprint1 = Array.isArray(parsed.sprintRoadmap?.sprint1) ? parsed.sprintRoadmap.sprint1 : []
      const sprint2 = Array.isArray(parsed.sprintRoadmap?.sprint2) ? parsed.sprintRoadmap.sprint2 : []
      const sprint3 = Array.isArray(parsed.sprintRoadmap?.sprint3) ? parsed.sprintRoadmap.sprint3 : []

      const calculatedTotal = [...sprint1, ...sprint2, ...sprint3].reduce(
        (acc, item) => acc + (Number(item.storyPoints) || 0),
        0
      )

      return {
        totalStoryPoints: parsed.totalStoryPoints || calculatedTotal,
        sprintRoadmap: {
          sprint1,
          sprint2,
          sprint3,
        },
        velocityRecommendation: parsed.velocityRecommendation || 'Rekomendasi velocity: 15-20 story points per sprint.',
      }
    } catch (err) {
      console.error('[SprintPlannerService.planSprint]', err)
      throw new InternalServerErrorException('Failed to generate sprint plan')
    }
  }
}
