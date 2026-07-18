import { Elysia } from 'elysia'
import { ExportService } from '../services/export.service'
import { ExportBody } from '../validations/export.validation'

const exportService = new ExportService()

export const exportController = new Elysia({ prefix: '/erd' })
  // POST /erd/export — Export schema ke SQL/Prisma
  .post(
    '/export',
    async ({ body }) => {
      const { schema, format, target } = body

      if (format === 'sql') {
        const sql = exportService.toSqlDdl(schema, target || 'postgresql')
        const filename = `schema_${target || 'postgresql'}_${Date.now()}.sql`
        return { file: sql, filename }
      }

      if (format === 'prisma') {
        const prisma = exportService.toPrismaSchema(schema)
        const filename = `schema_${Date.now()}.prisma`
        return { file: prisma, filename }
      }

      // Tidak akan terjadi karena validasi
      return { file: '', filename: '' }
    },
    { body: ExportBody }
  )
