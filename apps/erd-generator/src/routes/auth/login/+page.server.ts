import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const res = await fetch(`${getApiUrl()}/session`, {
			credentials: 'include'
		});

		if (res.ok) {
			const data = await res.json();
			if (data.data) {
				throw redirect(302, '/dashboard');
			}
		}
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
	}

	return {};
};
