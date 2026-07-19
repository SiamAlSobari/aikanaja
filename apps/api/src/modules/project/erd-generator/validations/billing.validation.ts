import { t } from 'elysia'

// POST /erd/billing/upgrade
export const UpgradeBody = t.Object({
  plan: t.Union([t.Literal('pro'), t.Literal('team')]),
})

// PUT /erd/billing/payments/:id/proof
export const ProofBody = t.Object({
  proofUrl: t.String(),
})
