import { AiService } from './ai.service'
import { QuotaService } from './quota.service'
import { ActivityService } from './activity.service'
import { ApiKeyService } from '../../../shared/api-key/api-key.service'
import { GENERATE_ERD_SYSTEM_PROMPT, buildGeneratePrompt } from '../prompts/generate-erd.prompt'
import {
  BadRequestException,
  TooManyRequestsException,
  InternalServerErrorException,
} from 'elysia-http-exception'

interface GenerateSchemaInput {
  prompt: string
  provider?: 'groq' | 'gemini'
  apiKey?: string
}

interface ErdColumn {
  id: string
  name: string
  type: string
  primaryKey: boolean
  nullable: boolean
  unique: boolean
  defaultValue: string | null
  foreignKey: { table: string; column: string } | null
}

interface ErdTable {
  id: string
  name: string
  position: { x: number; y: number }
  columns: ErdColumn[]
}

interface ErdRelation {
  id: string
  sourceTableId: string
  targetTableId: string
  sourceColumn: string
  targetColumn: string
  type: 'one-to-one' | 'one-to-many' | 'many-to-many'
}

interface ErdSchema {
  tables: ErdTable[]
  relations: ErdRelation[]
}

export class SchemaService {
  private aiService: AiService
  private quotaService: QuotaService
  private activityService: ActivityService
  private apiKeyService: ApiKeyService

  constructor() {
    this.aiService = new AiService()
    this.quotaService = new QuotaService()
    this.activityService = new ActivityService()
    this.apiKeyService = new ApiKeyService()
  }

  /**
   * Generate ERD schema dari natural language description.
   * - Cek quota (skip jika user pakai API key sendiri)
   * - Generate via AI (Groq/Gemini)
   * - Parse dan validasi response
   * - Increment quota usage
   *
   * @throws BadRequestException - prompt terlalu pendek
   * @throws TooManyRequestsException - quota habis
   * @throws InternalServerErrorException - AI gagal atau response invalid
   */
  async generateSchema(userId: string | null, input: GenerateSchemaInput): Promise<ErdSchema> {
    // Validasi input
    if (!input.prompt || input.prompt.trim().length < 5) {
      throw new BadRequestException('Prompt must be at least 5 characters')
    }

    // Resolve API key: body > default key user (provider default 'groq')
    let apiKey = input.apiKey
    if (!apiKey && userId) {
      const provider = input.provider || 'groq'
      apiKey = (await this.apiKeyService.getDefaultKey(userId, provider)) || undefined
    }

    // Cek quota (skip jika pakai API key sendiri)
    if (!apiKey && userId) {
      const quota = await this.quotaService.checkQuota(userId)
      if (!quota.isUnlimited && quota.remaining <= 0) {
        throw new TooManyRequestsException({
          message: 'Quota exceeded. Upgrade plan or use your own API key.',
          quota: {
            limit: quota.limit,
            used: quota.count,
            remaining: 0,
          },
        })
      }
    }

    // Generate schema via AI
    const systemPrompt = GENERATE_ERD_SYSTEM_PROMPT
    const userPrompt = buildGeneratePrompt(input.prompt.trim())

    try {
      const result = await this.aiService.generate({
        system: systemPrompt,
        prompt: userPrompt,
        provider: input.provider,
        userApiKey: apiKey,
      })

      // Parse response
      const schema = this.parseSchemaResponse(result.text)

      // Increment quota (hanya jika pakai server key)
      if (!apiKey && userId) {
        await this.quotaService.incrementUsage(userId)
      }

      // Log activity
      if (userId) {
        const tableCount = schema.tables?.length || 0
        const relCount = schema.relations?.length || 0
        this.activityService.log({
          userId,
          type: 'generate',
          message: `Generated schema with ${tableCount} tables and ${relCount} relations`,
        }).catch(() => {})
      }

      return schema
    } catch (err) {
      console.error('[SchemaService.generateSchema]', err)
      throw new InternalServerErrorException('Failed to generate schema')
    }
  }

  async generateSchemaStream(userId: string | null, input: GenerateSchemaInput) {
    // Validasi input
    if (!input.prompt || input.prompt.trim().length < 5) {
      throw new BadRequestException('Prompt must be at least 5 characters')
    }

    // Resolve API key: body > default key user (provider default 'groq')
    let apiKey = input.apiKey
    if (!apiKey && userId) {
      const provider = input.provider || 'groq'
      apiKey = (await this.apiKeyService.getDefaultKey(userId, provider)) || undefined
    }

    // Cek quota (skip jika pakai API key sendiri)
    if (!apiKey && userId) {
      const quota = await this.quotaService.checkQuota(userId)
      if (!quota.isUnlimited && quota.remaining <= 0) {
        throw new TooManyRequestsException({
          message: 'Quota exceeded. Upgrade plan or use your own API key.',
          quota: {
            limit: quota.limit,
            used: quota.count,
            remaining: 0,
          },
        })
      }
    }

    const systemPrompt = GENERATE_ERD_SYSTEM_PROMPT
    const userPrompt = buildGeneratePrompt(input.prompt.trim())

    return this.aiService.generateStream({
      system: systemPrompt,
      prompt: userPrompt,
      provider: input.provider,
      userApiKey: apiKey,
    })
  }

  /**
   * Parse AI response menjadi ErdSchema.
   * - Bersihkan markdown code blocks
   * - Parse JSON
   * - Validasi struktur (tables, columns, relations)
   * - Auto-add primary key jika tidak ada
   *
   * @throws InternalServerErrorException jika response bukan JSON valid
   */
  private parseSchemaResponse(text: string): ErdSchema {
    try {
      // Bersihkan response (hapus markdown code blocks jika ada)
      let cleanText = text.trim()
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.slice(7)
      }
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.slice(3)
      }
      if (cleanText.endsWith('```')) {
        cleanText = cleanText.slice(0, -3)
      }
      cleanText = cleanText.trim()

      const parsed = JSON.parse(cleanText)

      // Validasi struktur dasar
      if (!parsed.tables || !Array.isArray(parsed.tables)) {
        throw new Error('Invalid schema: missing tables array')
      }

      if (!parsed.relations || !Array.isArray(parsed.relations)) {
        throw new Error('Invalid schema: missing relations array')
      }

      // Validasi setiap tabel
      for (const table of parsed.tables) {
        if (!table.id || !table.name || !Array.isArray(table.columns)) {
          throw new Error(`Invalid table structure: ${JSON.stringify(table)}`)
        }

        // Pastikan ada primary key
        const hasPk = table.columns.some((col: any) => col.primaryKey === true)
        if (!hasPk) {
          // Auto-add id sebagai primary key jika tidak ada
          table.columns.unshift({
            id: `${table.id}-pk`,
            name: 'id',
            type: 'UUID',
            primaryKey: true,
            nullable: false,
            unique: true,
            defaultValue: null,
            foreignKey: null,
          })
        }
      }

      return {
        tables: parsed.tables,
        relations: parsed.relations,
      }
    } catch (err) {
      console.error('[SchemaService.parseSchemaResponse]', { text: text.substring(0, 200), err })
      throw new InternalServerErrorException('Failed to parse AI response. Please try again.')
    }
  }
}
