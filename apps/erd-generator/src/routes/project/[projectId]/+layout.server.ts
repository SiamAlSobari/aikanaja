import type { LayoutServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { erdApi } from '$lib/api/erd';

export const load: LayoutServerLoad = async ({ params, cookies }) => {
	const projectId = params.projectId;

	try {
		const response = await erdApi.getProject(projectId);

		if (!response.data) {
			return fail(404, { error: 'Project not found' });
		}

		const project = response.data;

		return {
			project
		};
	} catch (error) {
		console.error('[ProjectLayout.load] Error loading project:', error);
		return fail(500, { error: 'Failed to load project' });
	}
};
