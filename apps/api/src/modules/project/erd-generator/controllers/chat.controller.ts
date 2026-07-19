import { Elysia } from 'elysia'
import { authMiddleware } from '../../../../common/middlewares/auth.middleware'
import { ChatService } from '../services/chat.service'
import { t } from 'elysia'

const chatService = new ChatService()

export const chatController = new Elysia({ prefix: '/erd/projects' })
	.use(authMiddleware())

	// GET /erd/projects/:id/chat — history
	.get('/:id/chat', async ({ params, user }) => {
		return chatService.getMessages(params.id, user.id);
	})

	// POST /erd/projects/:id/chat — append message
	.post(
		'/:id/chat',
		async ({ params, user, body }) => {
			return chatService.addMessage(params.id, user.id, body.role, body.content, body.tableCount);
		},
		{
			body: t.Object({
				role: t.Union([t.Literal('user'), t.Literal('ai')]),
				content: t.String(),
				tableCount: t.Optional(t.Number()),
			}),
		}
	)

	// DELETE /erd/projects/:id/chat — clear
	.delete('/:id/chat', async ({ params, user }) => {
		return chatService.clearMessages(params.id, user.id);
	})
