import { prisma } from '../../../../lib/prisma'
import { InternalServerErrorException } from 'elysia-http-exception'

interface LogActivityParams {
	userId: string
	type: string
	message: string
	projectId?: string
	projectName?: string
	metadata?: Record<string, unknown>
}

export class ActivityService {
	async log(params: LogActivityParams) {
		try {
			await prisma.activity.create({
				data: {
					userId: params.userId,
					type: params.type,
					message: params.message,
					projectId: params.projectId,
					projectName: params.projectName,
					metadata: params.metadata ? JSON.stringify(params.metadata) : null,
				},
			})
		} catch (err) {
			console.error('[ActivityService.log]', err)
		}
	}

	async list(userId: string, limit = 20) {
		try {
			const activities = await prisma.activity.findMany({
				where: { userId },
				orderBy: { createdAt: 'desc' },
				take: limit,
				select: {
					id: true,
					type: true,
					message: true,
					projectId: true,
					projectName: true,
					createdAt: true,
				},
			})
			return activities
		} catch (err) {
			console.error('[ActivityService.list]', err)
			throw new InternalServerErrorException('Failed to fetch activities')
		}
	}

	async getStats(userId: string) {
		try {
			const now = new Date()
			const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

			const [totalProjects, monthlyGenerates, recentActivities] = await Promise.all([
				prisma.erdProject.count({
					where: { userId, status: 'active' },
				}),
				prisma.activity.count({
					where: {
						userId,
						type: 'generate',
						createdAt: {
							gte: new Date(now.getFullYear(), now.getMonth(), 1),
						},
					},
				}),
				prisma.activity.findMany({
					where: { userId },
					orderBy: { createdAt: 'desc' },
					take: 5,
					select: {
						id: true,
						type: true,
						message: true,
						projectId: true,
						projectName: true,
						createdAt: true,
					},
				}),
			])

			return {
				totalProjects,
				monthlyGenerates,
				recentActivities,
			}
		} catch (err) {
			console.error('[ActivityService.getStats]', err)
			throw new InternalServerErrorException('Failed to fetch stats')
		}
	}
}
