import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const projRes = await fetch(`${getApiUrl()}/erd/projects/${params.projectId}`, { credentials: 'include' });
	if (!projRes.ok) throw redirect(302, '/dashboard');
	const projData = await projRes.json();
	const project = projData.data !== undefined ? projData.data : projData;

	const histRes = await fetch(`${getApiUrl()}/erd/projects/${params.projectId}/history`, { credentials: 'include' });
	const histData = histRes.ok ? await histRes.json() : { data: [] };
	const versions = histData.data ?? [];

	return { project, versions };
};
