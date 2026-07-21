import { apiGet, apiPost, apiPatch, apiDelete, apiStream } from './client';
import type { ApiResponse, PaginatedResponse } from '$lib/types/api';
import type {
  PrdProject,
  PrdVersion,
  PrdWizardForm,
  VirtualReviewResult,
  QualityAuditResult,
  SprintRoadmap,
  PrdChatMessage,
  PrdTemplate,
  PrdAuditLog,
  DiffResult,
} from '$lib/types/prd';

export const prdApi = {
  async getProjects(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    filter?: string;
    search?: string;
  }): Promise<PaginatedResponse<PrdProject>> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.sort) query.set('sort', params.sort);
    if (params?.order) query.set('order', params.order);
    if (params?.filter) query.set('filter', params.filter);
    if (params?.search) query.set('search', params.search);
    const qs = query.toString();
    return apiGet(`/prd/projects${qs ? `?${qs}` : ''}`);
  },

  async getProject(id: string): Promise<PrdProject> {
    const res = await apiGet<ApiResponse<PrdProject>>(`/prd/projects/${id}`);
    if (!res.data) throw new Error('Project not found');
    return res.data;
  },

  async create(data: {
    title: string;
    description?: string;
    templateType?: string;
    targetUser?: string;
    techStack?: string;
  }): Promise<PrdProject> {
    const res = await apiPost<ApiResponse<PrdProject>>('/prd/projects', data);
    if (!res.data) throw new Error('Failed to create project');
    return res.data;
  },

  async update(
    id: string,
    data: Partial<Pick<PrdProject, 'title' | 'description' | 'content' | 'erdLinkId'>>
  ): Promise<PrdProject> {
    const res = await apiPatch<ApiResponse<PrdProject>>(`/prd/projects/${id}`, data);
    if (!res.data) throw new Error('Failed to update project');
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await apiDelete(`/prd/projects/${id}`);
  },

  async restore(id: string): Promise<PrdProject> {
    const res = await apiPost<ApiResponse<PrdProject>>(`/prd/projects/${id}/restore`);
    if (!res.data) throw new Error('Failed to restore project');
    return res.data;
  },

  async generate(
    wizardData: PrdWizardForm,
    onChunk: (chunk: string) => void,
    signal?: AbortSignal
  ): Promise<void> {
    await apiStream('/prd/generate', wizardData, onChunk, signal);
  },

  async copilot(
    content: string,
    instruction: string,
    onChunk: (chunk: string) => void,
    signal?: AbortSignal
  ): Promise<void> {
    await apiStream('/prd/copilot', { content, instruction }, onChunk, signal);
  },

  async virtualReview(content: string): Promise<VirtualReviewResult> {
    const res = await apiPost<ApiResponse<VirtualReviewResult>>('/prd/virtual-review', { content });
    if (!res.data) throw new Error('Virtual review failed');
    return res.data;
  },

  async qualityAudit(content: string): Promise<QualityAuditResult> {
    const res = await apiPost<ApiResponse<QualityAuditResult>>('/prd/quality-audit', { content });
    if (!res.data) throw new Error('Quality audit failed');
    return res.data;
  },

  async sprintPlan(content: string): Promise<SprintRoadmap> {
    const res = await apiPost<ApiResponse<SprintRoadmap>>('/prd/sprint-plan', { content });
    if (!res.data) throw new Error('Sprint plan failed');
    return res.data;
  },

  async exportAgentPrompt(content: string): Promise<string> {
    const res = await apiPost<ApiResponse<string>>('/prd/export-agent', { content });
    if (!res.data) throw new Error('Export failed');
    return res.data;
  },

  async exportJsonSpec(content: string): Promise<Record<string, unknown>> {
    const res = await apiPost<ApiResponse<Record<string, unknown>>>('/prd/export-json', { content });
    if (!res.data) throw new Error('JSON export failed');
    return res.data;
  },

  async getVersions(projectId: string): Promise<PrdVersion[]> {
    const res = await apiGet<ApiResponse<PrdVersion[]>>(`/prd/projects/${projectId}/versions`);
    return res.data ?? [];
  },

  async createVersion(
    projectId: string,
    data: { content: string; title?: string; qualityScore?: number; storyPointsTotal?: number }
  ): Promise<PrdVersion> {
    const res = await apiPost<ApiResponse<PrdVersion>>(
      `/prd/projects/${projectId}/versions`,
      data
    );
    if (!res.data) throw new Error('Failed to create version');
    return res.data;
  },

  async getVersionDiff(
    projectId: string,
    versionIdA: string,
    versionIdB: string
  ): Promise<DiffResult> {
    const res = await apiGet<ApiResponse<DiffResult>>(
      `/prd/projects/${projectId}/diff?vA=${versionIdA}&vB=${versionIdB}`
    );
    if (!res.data) throw new Error('Diff failed');
    return res.data;
  },

  async restoreVersion(projectId: string, versionId: string): Promise<PrdProject> {
    const res = await apiPost<ApiResponse<PrdProject>>(
      `/prd/projects/${projectId}/versions/${versionId}/restore`
    );
    if (!res.data) throw new Error('Restore failed');
    return res.data;
  },

  async share(projectId: string, expiresDays?: number): Promise<string> {
    const body: { expiresDays?: number } = {};
    if (expiresDays !== undefined) body.expiresDays = expiresDays;
    const res = await apiPost('/prd/projects/' + projectId + '/share', body) as ApiResponse<{ token: string }>;
    if (!res.data?.token) throw new Error('Share failed');
    return res.data.token;
  },

  async getQuota(): Promise<{ count: number; limit: number | null; remaining: number | null }> {
    const res = await apiGet('/prd/quota') as ApiResponse<{ count: number; limit: number | null; remaining: number | null }>;
    if (!res.data) throw new Error('Failed to get quota');
    return res.data;
  },

  async getChatMessages(
    projectId: string,
    params?: { limit?: number; skip?: number }
  ): Promise<PrdChatMessage[]> {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.skip) query.set('skip', String(params.skip));
    const qs = query.toString();
    return apiGet(`/prd/projects/${projectId}/chat-messages${qs ? `?${qs}` : ''}`);
  },

  async saveChatMessage(
    projectId: string,
    data: {
      role: string;
      actionType?: string;
      content: string;
      revisedSnippet?: string;
      modelUsed?: string;
      promptTokenCount?: number;
      responseTokenCount?: number;
    }
  ): Promise<PrdChatMessage> {
    const res = await apiPost<ApiResponse<PrdChatMessage>>(
      `/prd/projects/${projectId}/chat-messages`,
      data
    );
    if (!res.data) throw new Error('Failed to save chat message');
    return res.data;
  },

  async getVirtualReviews(projectId: string): Promise<VirtualReviewResult[]> {
    const res = await apiGet<ApiResponse<VirtualReviewResult[]>>(
      `/prd/projects/${projectId}/virtual-reviews`
    );
    return res.data ?? [];
  },

  async saveVirtualReview(projectId: string, data: VirtualReviewResult): Promise<void> {
    await apiPost(`/prd/projects/${projectId}/virtual-reviews`, data);
  },

  async getTemplates(category?: string): Promise<PrdTemplate[]> {
    const query = category ? `?category=${category}` : '';
    const res = await apiGet<ApiResponse<PrdTemplate[]>>(`/prd/templates${query}`);
    return res.data ?? [];
  },

  async getTemplate(id: string): Promise<PrdTemplate> {
    const res = await apiGet<ApiResponse<PrdTemplate>>(`/prd/templates/${id}`);
    if (!res.data) throw new Error('Template not found');
    return res.data;
  },

  async getAuditLogs(projectId: string): Promise<PrdAuditLog[]> {
    const res = await apiGet<ApiResponse<PrdAuditLog[]>>(
      `/prd/projects/${projectId}/audit-logs`
    );
    return res.data ?? [];
  },
};
