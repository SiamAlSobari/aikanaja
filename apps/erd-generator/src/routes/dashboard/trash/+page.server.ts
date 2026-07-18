import type { PageServerLoad } from './$types';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ fetch }) => {
	const apiUrl = getApiUrl();
	try {
		const res = await fetch(`${apiUrl}/erd/projects?filter=deleted&limit=50`, { credentials: 'include' });
		const data = await res.json();
		return { projects: data.data || [] };
	} catch {
		return { projects: [] };
	}
};
