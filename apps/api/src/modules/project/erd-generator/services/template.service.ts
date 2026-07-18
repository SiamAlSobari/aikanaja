import { prisma } from '../../../../lib/prisma'
import { NotFoundException, BadRequestException } from 'elysia-http-exception'

export class TemplateService {
  /** List semua templates (optional filter by category) */
  async listTemplates(category?: string) {
    const where = category ? { category } : {}

    return prisma.erdTemplate.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        thumbnail: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    })
  }

  /** Get template detail dengan schema */
  async getTemplate(templateId: string) {
    const template = await prisma.erdTemplate.findUnique({
      where: { id: templateId },
    })

    if (!template) throw new NotFoundException('Template not found')

    return template
  }

  /** Create project dari template */
  async useTemplate(userId: string, templateId: string, projectName?: string) {
    const template = await prisma.erdTemplate.findUnique({
      where: { id: templateId },
    })

    if (!template) throw new NotFoundException('Template not found')

    const project = await prisma.erdProject.create({
      data: {
        name: projectName || template.name,
        description: template.description,
        userId,
        schema: template.schema,
        status: 'active',
        visibility: 'private',
      },
      select: {
        id: true,
        name: true,
        description: true,
        schema: true,
        status: true,
        visibility: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return project
  }
}
