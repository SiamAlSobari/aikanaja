import { browser } from '$app/environment';

const API_URL = browser ? (import.meta.env.VITE_API_URL || 'http://localhost:3000') : '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const url = `${API_URL}/api${path}`;
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...((options.headers as Record<string, string>) || {})
	};

	const response = await fetch(url, {
		...options,
		headers,
		credentials: 'include'
	});

	if (!response.ok) {
		if (response.status === 401 && browser) {
			window.location.href = '/auth/login';
			throw new Error('Unauthorized');
		}
		const error = await response.json().catch(() => ({ message: 'Request failed' }));
		throw new Error(error.message || `HTTP ${response.status}`);
	}

	return response.json();
}

export const api = {
	get: <T>(path: string, options?: RequestInit) =>
		request<T>(path, { ...options, method: 'GET' }),

	post: <T>(path: string, body?: unknown, options?: RequestInit) =>
		request<T>(path, {
			...options,
			method: 'POST',
			body: body ? JSON.stringify(body) : undefined
		}),

	patch: <T>(path: string, body?: unknown, options?: RequestInit) =>
		request<T>(path, {
			...options,
			method: 'PATCH',
			body: body ? JSON.stringify(body) : undefined
		}),

	delete: <T>(path: string, options?: RequestInit) =>
		request<T>(path, { ...options, method: 'DELETE' })
};
