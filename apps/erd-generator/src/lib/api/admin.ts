import { api } from './client';

export type AdminRole = 'admin' | 'user' | 'free' | 'pro' | 'team';

export interface AdminStats {
	userCount: number;
	projectCount: number;
	paymentCount: number;
	pendingPayments: number;
}

export interface AdminUser {
	id: string;
	name: string;
	email: string;
	role: AdminRole;
	createdAt: string;
	_count?: { erdProjects: number; payments: number };
}

export interface AdminProject {
	id: string;
	name: string;
	status: string;
	visibility: string;
	createdAt: string;
	user: { id: string; name: string; email: string };
}

export interface AdminPayment {
	id: string;
	plan: string;
	amount: number | null;
	method: string | null;
	status: 'pending' | 'verified' | 'rejected';
	proof: string | null;
	verifiedAt: string | null;
	createdAt: string;
	user: { id: string; name: string; email: string };
}

interface Paginated<T> {
	data: T[];
	pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const adminApi = {
	getStats: () => api.get<{ data: AdminStats }>('/erd/admin/stats'),

	getUsers: (page = 1, limit = 20) => {
		const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
		return api.get<{ data: AdminUser[]; pagination: Paginated<AdminUser>['pagination'] }>(
			`/erd/admin/users?${qs}`
		);
	},

	getUser: (id: string) => api.get<{ data: AdminUser & { erdProjects: any[]; payments: any[] } }>(`/erd/admin/users/${id}`),

	updateUserRole: (id: string, role: AdminRole) =>
		api.patch<{ data: AdminUser }>(`/erd/admin/users/${id}`, { role }),

	deleteUser: (id: string) => api.delete<{ message: string }>(`/erd/admin/users/${id}`),

	getProjects: (page = 1, limit = 20) => {
		const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
		return api.get<{ data: AdminProject[]; pagination: Paginated<AdminProject>['pagination'] }>(
			`/erd/admin/projects?${qs}`
		);
	},

	getPayments: (page = 1, limit = 20, status?: string) => {
		const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
		if (status) qs.set('status', status);
		return api.get<{ data: AdminPayment[]; pagination: Paginated<AdminPayment>['pagination'] }>(
			`/erd/admin/payments?${qs}`
		);
	},

	getPayment: (id: string) =>
		api.get<{ data: AdminPayment }>(`/erd/admin/payments/${id}`),

	verifyPayment: (id: string) =>
		api.post<{ message: string }>(`/erd/admin/payments/${id}/verify`),

	rejectPayment: (id: string) =>
		api.post<{ message: string }>(`/erd/admin/payments/${id}/reject`),
};
