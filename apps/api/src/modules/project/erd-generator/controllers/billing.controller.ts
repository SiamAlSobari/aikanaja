import { Elysia } from 'elysia'
import { authMiddleware } from '../../../../common/middlewares/auth.middleware'
import { BillingService } from '../services/billing.service'
import { UpgradeBody, ProofBody } from '../validations/billing.validation'

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

  // GET /erd/billing/payments/:id — Get one payment (user)
  .get('/payments/:id', async ({ user, params }) => {
    return billingService.getPaymentById(user.id, params.id)
  })

  // PUT /erd/billing/payments/:id/proof — Upload bukti (user)
  .put(
    '/payments/:id/proof',
    async ({ user, params, body }) => {
      return billingService.uploadProof(user.id, params.id, body.proofUrl)
    },
    { body: ProofBody }
  )
