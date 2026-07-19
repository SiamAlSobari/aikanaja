import type { LayoutServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { erdApi } from '$lib/api/erd';

export const load: LayoutServerLoad = async ({ params }) => {
	const projectId = params.projectId;

	try {
		const response = await erdApi.getProject(projectId);

		if (!response.data) {
			throw error(404, { message: 'Project not found' });
		}

		const project = response.data;

		return {
			project
		};
	} catch (e: any) {
		console.error('[ProjectLayout.load] Error loading project:', e);
		if (e?.message === 'Unauthorized') {
			throw redirect(302, '/auth/login');
		}
		throw error(500, { message: e?.message || 'Failed to load project' });
	}
};
