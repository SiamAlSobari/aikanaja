import { Elysia } from 'elysia'
import logixlysia from 'logixlysia'
import { httpExceptionPlugin } from 'elysia-http-exception'
import { config } from './config'
import { authModule } from './modules/shared/auth'
import { sessionController } from './modules/shared/session/session.controller'
import { apiKeyController } from './modules/shared/api-key/api-key.controller'
import { erdModule } from './modules/project/erd-generator'
import { prdModule } from './modules/project/prd-generator'

const app = new Elysia({ prefix: '/api' })
  .use(httpExceptionPlugin())
  .use(
    logixlysia({
      config: {
        showStartupMessage: true,
        startupMessageFormat: 'banner',
      },
    })
  )
  .get('/', () => ({
    status: 'ok',
    message: 'AI Kanaja Backend',
    version: '1.0.0',
  }))

  .use(authModule)
  .use(erdModule)
  .use(prdModule)
  .use(sessionController)
  .use(apiKeyController)

  .listen(config.port)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
