import { env } from '$env/dynamic/private';

export function getApiUrl(): string {
	const base = env.VITE_API_URL || 'http://localhost:3000';
	return base.endsWith('/api') ? base : `${base}/api`;
}
