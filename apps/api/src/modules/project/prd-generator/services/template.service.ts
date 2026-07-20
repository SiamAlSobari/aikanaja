import { prisma } from '../../../../lib/prisma'
import { NotFoundException, InternalServerErrorException } from 'elysia-http-exception'

const DEFAULT_PRD_TEMPLATES = [
  {
    name: 'SaaS B2B Platform',
    category: 'saas',
    description: 'Template PRD komprehensif untuk platform SaaS B2B dengan multi-tenant auth, billing subscription, & role RBAC.',
    templateContent: `# PRD: SaaS B2B Platform Template\n\n## 1. Executive Summary\nRingkasan platform SaaS B2B...\n\n## 2. Problem Statement & Goals\n- Multi-tenancy\n- Granular RBAC Permissions`,
  },
  {
    name: 'E-Commerce Marketplace',
    category: 'ecommerce',
    description: 'Template PRD untuk aplikasi e-commerce dengan payment gateway, catalog inventory, & order fulfillment.',
    templateContent: `# PRD: E-Commerce Marketplace Template\n\n## 1. Executive Summary\nPlatform e-commerce multi-seller...\n\n## 2. Functional Requirements\n- Catalog Management\n- Checkout & Payment Integration`,
  },
  {
    name: 'Mobile App MVP',
    category: 'mobile',
    description: 'Template PRD ringan untuk aplikasi mobile iOS/Android MVP.',
    templateContent: `# PRD: Mobile App MVP Template\n\n## 1. Executive Summary\nAplikasi mobile MVP...\n\n## 2. Target Audience & Push Notifications`,
  },
  {
    name: 'FinTech REST API Spec',
    category: 'api',
    description: 'Template PRD berfokus pada arsitektur API, idempotency, webhook payment, & audit log.',
    templateContent: `# PRD: FinTech REST API Spec\n\n## 1. Executive Summary\nInfrastruktur API FinTech...\n\n## 2. Security, Idempotency Header & Rate Limiting`,
  },
  {
    name: 'AI Agent & Microservice App',
    category: 'ai',
    description: 'Template PRD khusus aplikasi AI/LLM dengan prompt pipeline, streaming response, & fallback system.',
    templateContent: `# PRD: AI Microservice App Template\n\n## 1. Executive Summary\nSistem pemrosesan AI LLM...\n\n## 2. AI Fallback Engine & Token Quota Management`,
  },
]

export class TemplateService {
  /** List preset PRD templates */
  async listTemplates(category?: string) {
    try {
      const count = await prisma.prdTemplate.count()
      if (count === 0) {
        // Seed default templates if database table is empty
        await prisma.prdTemplate.createMany({
          data: DEFAULT_PRD_TEMPLATES,
        })
      }

      const where: any = {}
      if (category) where.category = category

      return await prisma.prdTemplate.findMany({
        where,
        orderBy: { createdAt: 'asc' },
      })
    } catch (err) {
      console.error('[TemplateService.listTemplates]', err)
      throw new InternalServerErrorException('Failed to fetch PRD templates')
    }
  }

  /** Get single PRD template detail */
  async getTemplate(templateId: string) {
    try {
      const template = await prisma.prdTemplate.findUnique({
        where: { id: templateId },
      })

      if (!template) throw new NotFoundException('Template not found')

      return template
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) throw err
      console.error('[TemplateService.getTemplate]', { templateId, err })
      throw new InternalServerErrorException('Failed to fetch template detail')
    }
  }
}
