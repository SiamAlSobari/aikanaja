import { env } from '$env/dynamic/private';

export function getApiUrl(): string {
	return env.VITE_API_URL || 'http://localhost:3000';
}
