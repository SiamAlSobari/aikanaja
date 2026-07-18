import type { PageServerLoad } from './$types';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ fetch }) => {
	const apiUrl = getApiUrl();
	try {
		const res = await fetch(`${apiUrl}/erd/templates`, { credentials: 'include' });
		const data = await res.json();
		return { templates: data.data || [] };
	} catch {
		return { templates: [] };
	}
};
