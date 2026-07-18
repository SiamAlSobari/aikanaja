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

interface Version {
	id: string;
	projectId: string;
	schema: ErdSchema;
	description: string | null;
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
