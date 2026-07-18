import { authApi } from '$lib/api/auth';
import type { User } from '$lib/types/user';

let user = $state<User | null>(null);
let isLoading = $state(true);
let isAuthenticated = $derived(!!user);

export function getAuthState() {
	return {
		get user() { return user; },
		get isLoading() { return isLoading; },
		get isAuthenticated() { return isAuthenticated; }
	};
}

/** Fetch current session from backend */
export async function fetchSession() {
	try {
		isLoading = true;
		const res = await authApi.getSession();
		user = res.data;
	} catch {
		user = null;
	} finally {
		isLoading = false;
	}
}

/** Redirect to Google OAuth */
export async function loginWithGoogle() {
	try {
		const { redirect } = await authApi.getGoogleUrl();
		window.location.href = redirect;
	} catch (err) {
		console.error('[auth.loginWithGoogle]', err);
	}
}

/** Logout */
export async function logout() {
	try {
		await authApi.logout();
		user = null;
		window.location.href = '/';
	} catch (err) {
		console.error('[auth.logout]', err);
	}
}
