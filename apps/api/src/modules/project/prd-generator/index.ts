import { Elysia } from 'elysia'
import { projectController } from './controllers/project.controller'
import { aiController } from './controllers/ai.controller'

export const prdModule = new Elysia()
  .use(projectController)
  .use(aiController)
