import { api } from './client';
import type { ErdProject, ErdSchema, GenerateSchemaRequest } from '$lib/types/erd';
import type { ApiResponse, PaginatedResponse, UsageInfo } from '$lib/types/api';

interface ListProjectsParams {
	page?: number;
	limit?: number;
	sort?: string;
	order?: 'asc' | 'desc';
	filter?: string;
	search?: string;
}

interface ExportRequest {
	schema: ErdSchema;
	format: 'sql' | 'prisma';
	target?: 'mysql' | 'postgresql' | 'sqlite';
}

interface ExportResponse {
	file: string;
	filename: string;
}

interface Template {
	id: string;
	name: string;
	description: string;
	category: string;
	schema: ErdSchema;
	thumbnail: string | null;
}

export interface Version {
	id: string;
	projectId: string;
	schema: ErdSchema;
	description: string | null;
	createdAt: string;
}

export interface ChatMessage {
	id: string;
	projectId: string;
	userId: string;
	role: 'user' | 'ai';
	content: string;
	tableCount: number | null;
	createdAt: string;
}

interface Collaborator {
	id: string;
	userId: string;
	role: 'view' | 'edit';
	user: { id: string; name: string; email: string };
}

interface ShareLink {
	link: string;
	expiresAt: string | null;
}

export type PlanTier = 'free' | 'pro' | 'team';
export type PaymentStatus = 'pending' | 'verified' | 'rejected';

export interface Payment {
	id: string;
	plan: PlanTier;
	amount: number;
	method: string;
	status: PaymentStatus;
	proof: string | null;
	note: string | null;
	createdAt: string;
	verifiedAt: string | null;
}

export interface BillingInfo {
	plan: PlanTier;
	status: string;
	usage: { count: number; limit: number; remaining: number };
	payments: Payment[];
}

export const erdApi = {
	getProjects: (params?: ListProjectsParams) => {
		const query = new URLSearchParams();
		if (params) {
			Object.entries(params).forEach(([k, v]) => {
				if (v !== undefined) query.set(k, String(v));
			});
		}
		const qs = query.toString();
		return api.get<PaginatedResponse<ErdProject>>(`/erd/projects${qs ? `?${qs}` : ''}`);
	},

	getProject: (id: string) =>
		api.get<ApiResponse<ErdProject>>(`/erd/projects/${id}`),

	getChat: (projectId: string) =>
		api.get<ApiResponse<ChatMessage[]>>(`/erd/projects/${projectId}/chat`),

	addChatMessage: (projectId: string, msg: { role: 'user' | 'ai'; content: string; tableCount?: number }) =>
		api.post<ApiResponse<ChatMessage>>(`/erd/projects/${projectId}/chat`, msg),

	clearChat: (projectId: string) =>
		api.delete<ApiResponse<null>>(`/erd/projects/${projectId}/chat`),

	create: (data: { name: string; description?: string }) =>
		api.post<ApiResponse<ErdProject>>('/erd/projects', data),

	update: (id: string, data: { name?: string; description?: string; schema?: string; visibility?: string }) =>
		api.patch<ApiResponse<ErdProject>>(`/erd/projects/${id}`, data),

	delete: (id: string) =>
		api.delete<ApiResponse<null>>(`/erd/projects/${id}`),

	restore: (id: string) =>
		api.post<ApiResponse<ErdProject>>(`/erd/projects/${id}/restore`),

	generate: (prompt: string, apiKey?: string, provider?: string) =>
		api.post<ApiResponse<ErdSchema>>('/erd/generate', { prompt, apiKey, provider } as GenerateSchemaRequest),

	export: (req: ExportRequest) =>
		api.post<ExportResponse>('/erd/export', req),

	getUsage: () =>
		api.get<ApiResponse<UsageInfo>>('/erd/usage'),

	getTemplates: () =>
		api.get<ApiResponse<Template[]>>('/erd/templates'),

	getTemplate: (id: string) =>
		api.get<ApiResponse<Template>>(`/erd/templates/${id}`),

	useTemplate: (id: string, name?: string) =>
		api.post<ApiResponse<ErdProject>>(`/erd/templates/${id}/use`, { name }),

	getHistory: (projectId: string) =>
		api.get<ApiResponse<Version[]>>(`/erd/projects/${projectId}/history`),

	restoreVersion: (projectId: string, versionId: string) =>
		api.post<ApiResponse<ErdProject>>(`/erd/projects/${projectId}/history/${versionId}/restore`),

	getVersion: (projectId: string, versionId: string) =>
		api.get<ApiResponse<Version>>(`/erd/projects/${projectId}/history/${versionId}`),

	getBilling: () =>
		api.get<ApiResponse<BillingInfo>>('/erd/billing'),

	requestUpgrade: (plan: PlanTier) =>
		api.post<ApiResponse<{ payment: Payment; paymentInfo: { danaNumber: string; whatsappUrl: string }; instructions: string[] }>>('/erd/billing/upgrade', { plan }),

	cancelSubscription: () =>
		api.post<ApiResponse<null>>('/erd/billing/cancel'),

	getPayment: (id: string) =>
		api.get<ApiResponse<Payment>>(`/erd/billing/payments/${id}`),

	uploadProof: (id: string, proofUrl: string) =>
		api.put<ApiResponse<Payment>>(`/erd/billing/payments/${id}/proof`, { proofUrl }),

	getShare: (projectId: string) =>
		api.get<ApiResponse<{ collaborators: Collaborator[] }>>(`/erd/projects/${projectId}/share`),

	updateShareRole: (projectId: string, userId: string, role: 'view' | 'edit') =>
		api.patch<ApiResponse<Collaborator>>(`/erd/projects/${projectId}/share/${userId}`, { role }),

	getShareLink: (projectId: string) =>
		api.get<ApiResponse<ShareLink>>(`/erd/projects/${projectId}/share/link`),

	getProjectByShareLink: (link: string) =>
		api.get<ApiResponse<{ id: string; name: string; schema: ErdSchema; collaborators: Collaborator[] }>>(`/erd/share/${link}`),

	share: (projectId: string, email: string, role: 'view' | 'edit') =>
		api.post<ApiResponse<Collaborator>>(`/erd/projects/${projectId}/share`, { email, role }),

	removeShare: (projectId: string, userId: string) =>
		api.delete<ApiResponse<null>>(`/erd/projects/${projectId}/share/${userId}`),

	generateShareLink: (projectId: string) =>
		api.post<ApiResponse<ShareLink>>(`/erd/projects/${projectId}/share/link`),

	getActivities: (limit?: number) =>
		api.get<ApiResponse<any[]>>(`/erd/activities${limit ? `?limit=${limit}` : ''}`),

	getStats: () =>
		api.get<ApiResponse<{ totalProjects: number; monthlyGenerates: number; recentActivities: any[] }>>('/erd/stats'),
};
