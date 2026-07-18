import { Elysia } from 'elysia'
import { authMiddleware } from '../../../../common/middlewares/auth.middleware'
import { BillingService } from '../services/billing.service'
import { UpgradeBody } from '../validations/billing.validation'

const billingService = new BillingService()

export const billingController = new Elysia({ prefix: '/erd/billing' })
  .use(authMiddleware())

  // GET /erd/billing — Get billing info
  .get('/', async ({ user }) => {
    return billingService.getBillingInfo(user.id)
  })

  // POST /erd/billing/upgrade — Request upgrade
  .post(
    '/upgrade',
    async ({ user, body }) => {
      return billingService.requestUpgrade(user.id, body.plan)
    },
    { body: UpgradeBody }
  )

  // POST /erd/billing/cancel — Cancel subscription
  .post('/cancel', async ({ user }) => {
    return billingService.cancelSubscription(user.id)
  })
