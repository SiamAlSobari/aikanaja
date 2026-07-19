import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(`${getApiUrl()}/erd/share/${params.shareLink}`);
	if (!res.ok) throw error(404, 'Shared project not found');
	const data = await res.json();

	const project = data.data !== undefined ? data.data : data;

	if (project && typeof project.schema === 'string') {
		try {
			project.schema = JSON.parse(project.schema);
		} catch (err) {
			console.error('Failed to parse schema JSON:', err);
			project.schema = null;
		}
	}

	return { project };
};
