import { PrismaClient } from '../../generated/prisma/client'
import { PrismaBunSqlite } from 'prisma-adapter-bun-sqlite'
import { config } from '../config'

const adapter = new PrismaBunSqlite({
  url: config.databaseUrl,
})

export const prisma = new PrismaClient({ adapter })
