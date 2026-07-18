import { t } from 'elysia'

// POST /erd/billing/upgrade
export const UpgradeBody = t.Object({
  plan: t.Union([t.Literal('pro'), t.Literal('team')]),
})
