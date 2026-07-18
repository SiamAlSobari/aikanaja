import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getApiUrl } from '$lib/server/env';

export const load: LayoutServerLoad = async ({ fetch }) => {
	try {
		const res = await fetch(`${getApiUrl()}/session`, {
			credentials: 'include'
		});

		if (!res.ok) {
			throw redirect(302, '/auth/login');
		}

		const data = await res.json();
		if (!data.data) {
			throw redirect(302, '/auth/login');
		}

		return {
			user: data.data,
		};
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw redirect(302, '/auth/login');
	}
};
