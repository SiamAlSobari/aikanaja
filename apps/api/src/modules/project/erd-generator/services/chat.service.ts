import { prisma } from '../../../../lib/prisma'

export class ChatService {
	/** Get chat history for a project (oldest first) */
	async getMessages(projectId: string, userId: string) {
		return prisma.erdChatMessage.findMany({
			where: { projectId, userId },
			orderBy: { createdAt: 'asc' },
		});
	}

	/** Append a chat message */
	async addMessage(
		projectId: string,
		userId: string,
		role: string,
		content: string,
		tableCount?: number
	) {
		return prisma.erdChatMessage.create({
			data: { projectId, userId, role, content, tableCount },
		});
	}

	/** Clear chat history for a project */
	async clearMessages(projectId: string, userId: string) {
		await prisma.erdChatMessage.deleteMany({ where: { projectId, userId } });
		return { message: 'Chat history cleared' };
	}
}
