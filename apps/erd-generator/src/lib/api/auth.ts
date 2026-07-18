import { api } from './client';

interface User {
	id: string;
	name: string;
	email: string;
	role: string;
}

interface AuthResponse {
	message: string;
	data: User | null;
}

interface GoogleAuthResponse {
	redirect: string;
}

export const authApi = {
	/** Get Google OAuth redirect URL */
	getGoogleUrl: () => api.get<GoogleAuthResponse>('/auth/google'),

	/** Get current session user */
	getSession: () => api.get<AuthResponse>('/session'),

	/** Logout */
	logout: () => api.post<AuthResponse>('/auth/logout')
};
