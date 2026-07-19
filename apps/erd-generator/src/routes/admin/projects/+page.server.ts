import type { PageServerLoad } from './$types';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const page = Number(url.searchParams.get('page') || '1');
	const res = await fetch(`${getApiUrl()}/erd/admin/projects?page=${page}&limit=20`, {
		credentials: 'include'
	});
	const data = await res.json();
	return { projects: data.data ?? [], pagination: data.pagination ?? null, page };
};
