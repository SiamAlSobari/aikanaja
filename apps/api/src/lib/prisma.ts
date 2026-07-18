import { PrismaClient } from '../../generated/prisma/client'
import { PrismaBunSqlite } from 'prisma-adapter-bun-sqlite'

const adapter = new PrismaBunSqlite({
  url: process.env.DATABASE_URL || 'file:../data/dev.db',
})

export const prisma = new PrismaClient({ adapter })
