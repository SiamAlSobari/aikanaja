import { t } from 'elysia'

// POST /erd/projects/:id/share — Invite collaborator
export const InviteCollaboratorBody = t.Object({
  email: t.String({ format: 'email' }),
  role: t.Optional(t.Union([t.Literal('view'), t.Literal('edit')])),
})

// PATCH /erd/projects/:id/share/:userId — Update role
export const UpdateRoleBody = t.Object({
  role: t.Union([t.Literal('view'), t.Literal('edit')]),
})

// POST /erd/projects/:id/share/link — Generate share link
export const GenerateShareLinkBody = t.Object({
  expiresInDays: t.Optional(t.Number({ minimum: 1, maximum: 365 })),
})
