import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const projRes = await fetch(`${getApiUrl()}/erd/projects/${params.projectId}`, { credentials: 'include' });
	if (!projRes.ok) throw redirect(302, '/dashboard');
	const projData = await projRes.json();
	const project = projData.data !== undefined ? projData.data : projData;

	const verRes = await fetch(`${getApiUrl()}/erd/projects/${params.projectId}/history/${params.versionId}`, { credentials: 'include' });
	if (!verRes.ok) throw redirect(302, `/project/${params.projectId}/history`);
	const verData = await verRes.json();
	const version = verData.data ?? verData;

	return { project, version };
};
