import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(`${getApiUrl()}/erd/projects/${params.projectId}`, { credentials: 'include' });
	if (!res.ok) throw redirect(302, '/dashboard');
	
	const data = await res.json();
	const project = data.data !== undefined ? data.data : data;
	return { project };
};

export const actions: Actions = {
	update: async ({ params, request, fetch }) => {
		const form = await request.formData();
		const name = String(form.get('name') ?? '').trim();
		const description = String(form.get('description') ?? '').trim();
		const visibility = String(form.get('visibility') ?? 'private');

		if (!name) {
			return fail(400, { error: 'Project name is required' });
		}

		try {
			const res = await fetch(`${getApiUrl()}/erd/projects/${params.projectId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ name, description, visibility })
			});
			if (!res.ok) {
				const e = await res.json().catch(() => ({ message: 'Failed to update' }));
				return fail(res.status, { error: e.message || 'Failed to update' });
			}
			return { success: true };
		} catch (e: any) {
			return fail(500, { error: e.message || 'An error occurred' });
		}
	},

	delete: async ({ params, fetch }) => {
		try {
			const res = await fetch(`${getApiUrl()}/erd/projects/${params.projectId}`, {
				method: 'DELETE',
				credentials: 'include'
			});
			if (!res.ok) {
				const e = await res.json().catch(() => ({ message: 'Failed to delete' }));
				return fail(res.status, { error: e.message || 'Failed to delete' });
			}
			throw redirect(303, '/dashboard/projects');
		} catch (e: any) {
			if (e && typeof e === 'object' && 'status' in e) throw e;
			return fail(500, { error: e.message || 'An error occurred' });
		}
	}
};
