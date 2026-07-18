import { Elysia } from 'elysia'
import { prdExampleController } from './controllers/example.controller'

export const prdModule = new Elysia()
  .use(prdExampleController)