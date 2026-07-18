import { Elysia, t } from 'elysia'
import { authMiddleware, optionalAuthMiddleware } from '../../../../common/middlewares/auth.middleware'
import { ShareService } from '../services/share.service'
import {
  InviteCollaboratorBody,
  UpdateRoleBody,
  GenerateShareLinkBody,
} from '../validations/share.validation'

const shareService = new ShareService()

export const shareController = new Elysia({ prefix: '/erd/projects' })
  .use(authMiddleware())

  // GET /erd/projects/:id/share — List collaborators
  .get(
    '/:id/share',
    async ({ user, params }) => {
      return shareService.listCollaborators(user.id, params.id)
    },
    { params: t.Object({ id: t.String() }) }
  )

  // POST /erd/projects/:id/share — Invite collaborator
  .post(
    '/:id/share',
    async ({ user, params, body }) => {
      return shareService.inviteCollaborator(user.id, params.id, body.email, body.role)
    },
    { params: t.Object({ id: t.String() }), body: InviteCollaboratorBody }
  )

  // DELETE /erd/projects/:id/share/:userId — Remove collaborator
  .delete(
    '/:id/share/:userId',
    async ({ user, params }) => {
      return shareService.removeCollaborator(user.id, params.id, params.userId)
    },
    { params: t.Object({ id: t.String(), userId: t.String() }) }
  )

  // PATCH /erd/projects/:id/share/:userId — Update role
  .patch(
    '/:id/share/:userId',
    async ({ user, params, body }) => {
      return shareService.updateRole(user.id, params.id, params.userId, body.role)
    },
    { params: t.Object({ id: t.String(), userId: t.String() }), body: UpdateRoleBody }
  )

  // GET /erd/projects/:id/share/link — Get share link
  .get(
    '/:id/share/link',
    async ({ user, params }) => {
      return shareService.getShareLink(user.id, params.id)
    },
    { params: t.Object({ id: t.String() }) }
  )

  // POST /erd/projects/:id/share/link — Generate share link
  .post(
    '/:id/share/link',
    async ({ user, params, body }) => {
      return shareService.generateShareLink(user.id, params.id, body.expiresInDays)
    },
    { params: t.Object({ id: t.String() }), body: GenerateShareLinkBody }
  )

// Public route (no auth)
export const sharePublicController = new Elysia({ prefix: '/erd/share' })
  // GET /erd/share/:link — Get project by share link (public)
  .get(
    '/:link',
    async ({ params }) => {
      return shareService.getProjectByShareLink(params.link)
    },
    { params: t.Object({ link: t.String() }) }
  )
