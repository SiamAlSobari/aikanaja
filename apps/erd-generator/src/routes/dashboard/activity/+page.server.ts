import type { PageServerLoad } from './$types';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ fetch }) => {
	const apiUrl = getApiUrl();
	try {
		const res = await fetch(`${apiUrl}/erd/activities?limit=30`, { credentials: 'include' });
		const data = await res.json();
		return { activities: data.data || [] };
	} catch {
		return { activities: [] };
	}
};
