import { Elysia } from 'elysia'
import { authMiddleware } from '../../../../common/middlewares/auth.middleware'
import { ActivityService } from '../services/activity.service'

const activityService = new ActivityService()

export const activityController = new Elysia({ prefix: '/erd' })
	.use(authMiddleware())

	// GET /erd/activities — List user activities
	.get('/activities', async ({ user, query }) => {
		const limit = query.limit ? Number(query.limit) : 20
		const activities = await activityService.list(user.id, limit)
		return { data: activities }
	})

	// GET /erd/stats — Dashboard stats
	.get('/stats', async ({ user }) => {
		const stats = await activityService.getStats(user.id)
		return { data: stats }
	})
