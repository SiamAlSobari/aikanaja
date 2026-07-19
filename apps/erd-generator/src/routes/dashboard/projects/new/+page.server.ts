import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getApiUrl } from '$lib/server/env';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const form = await request.formData();
		const name = String(form.get('name') ?? '').trim();
		const description = String(form.get('description') ?? '').trim();

		if (!name) {
			return fail(400, { error: 'Project name is required' });
		}

		try {
			const res = await fetch(`${getApiUrl()}/erd/projects`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ name, description })
			});

			if (!res.ok) {
				const e = await res.json().catch(() => ({ message: 'Gagal membuat proyek' }));
				return fail(res.status, { error: e.message || 'Gagal membuat proyek' });
			}

			const result = await res.json();
			if (result.data?.id) {
				throw redirect(303, `/project/${result.data.id}`);
			}
			return { success: true };
		} catch (e: any) {
			if (e && typeof e === 'object' && 'status' in e) throw e;
			return fail(500, { error: e.message || 'Terjadi kesalahan' });
		}
	}
};
