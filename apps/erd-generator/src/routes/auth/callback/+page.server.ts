import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ url, fetch, cookies }) => {
	const code = url.searchParams.get('code');
	const error = url.searchParams.get('error');

	if (error) {
		throw redirect(302, `/auth/login?error=${encodeURIComponent(error)}`);
	}

	if (!code) {
		throw redirect(302, '/auth/login?error=missing_code');
	}

	try {
		const res = await fetch(`${getApiUrl()}/auth/callback?code=${code}`, {
			credentials: 'include'
		});

		if (res.ok) {
			throw redirect(302, '/dashboard');
		}

		const data = await res.json();
		throw redirect(302, `/auth/login?error=${encodeURIComponent(data.message || 'login_failed')}`);
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		console.error('[auth.callback]', err);
		throw redirect(302, '/auth/login?error=server_error');
	}
};
