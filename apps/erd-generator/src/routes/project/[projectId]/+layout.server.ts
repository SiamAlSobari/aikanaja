import type { LayoutServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { getApiUrl } from '$lib/server/env';

export const load: LayoutServerLoad = async ({ params, fetch }) => {
	const projectId = params.projectId;

	try {
		const res = await fetch(`${getApiUrl()}/erd/projects/${projectId}`, { credentials: 'include' });

		if (res.status === 401) {
			throw redirect(302, '/auth/login');
		}

		if (!res.ok) {
			throw error(res.status, { message: 'Project not found' });
		}

		const data = await res.json();
		const project = data.data !== undefined ? data.data : data;

		return {
			project
		};
	} catch (e: any) {
		console.error('[ProjectLayout.load] Error loading project:', e);
		if (e && typeof e === 'object' && 'status' in e) throw e;
		throw error(500, { message: e?.message || 'Failed to load project' });
	}
};
