import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const projRes = await fetch(`${getApiUrl()}/erd/projects/${params.projectId}`, { credentials: 'include' });
	if (!projRes.ok) {
		throw redirect(302, '/dashboard');
	}
	const projData = await projRes.json();

	const collRes = await fetch(`${getApiUrl()}/erd/projects/${params.projectId}/share`, { credentials: 'include' });
	const collData = collRes.ok ? await collRes.json() : [];

	const linkRes = await fetch(`${getApiUrl()}/erd/projects/${params.projectId}/share/link`, { credentials: 'include' });
	const linkData = linkRes.ok ? await linkRes.json() : null;

	const project = projData.data !== undefined ? projData.data : projData;
	const collaborators = collData.data !== undefined ? collData.data : (collData ?? []);
	const shareLink = linkData && linkData.data !== undefined ? linkData.data : (linkData ?? null);

	return {
		project,
		collaborators,
		shareLink
	};
};

export const actions: Actions = {
	invite: async ({ params, request, fetch }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();
		const role = String(form.get('role') ?? 'view');

		if (!email) {
			return fail(400, { error: 'Email is required' });
		}

		try {
			const res = await fetch(`${getApiUrl()}/erd/projects/${params.projectId}/share`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ email, role })
			});
			if (!res.ok) {
				const e = await res.json().catch(() => ({ message: 'Failed to invite collaborator' }));
				return fail(res.status, { error: e.message || 'Failed to invite collaborator' });
			}
			return { success: true };
		} catch (e: any) {
			return fail(500, { error: e.message || 'An error occurred' });
		}
	},

	remove: async ({ params, request, fetch }) => {
		const form = await request.formData();
		const userId = String(form.get('userId') ?? '');

		try {
			const res = await fetch(`${getApiUrl()}/erd/projects/${params.projectId}/share/${userId}`, {
				method: 'DELETE',
				credentials: 'include'
			});
			if (!res.ok) {
				const e = await res.json().catch(() => ({ message: 'Failed to remove collaborator' }));
				return fail(res.status, { error: e.message || 'Failed to remove collaborator' });
			}
			return { success: true };
		} catch (e: any) {
			return fail(500, { error: e.message || 'An error occurred' });
		}
	},

	generateLink: async ({ params, fetch }) => {
		try {
			const res = await fetch(`${getApiUrl()}/erd/projects/${params.projectId}/share/link`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({})
			});
			if (!res.ok) {
				const e = await res.json().catch(() => ({ message: 'Failed to generate share link' }));
				return fail(res.status, { error: e.message || 'Failed to generate share link' });
			}
			return { success: true };
		} catch (e: any) {
			return fail(500, { error: e.message || 'An error occurred' });
		}
	}
};
