import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch(`${getApiUrl()}/session`, { credentials: 'include' });
	const data = await res.json();
	return { user: data.data ?? null };
};

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const form = await request.formData();
		const name = String(form.get('name') ?? '');
		const bio = String(form.get('bio') ?? '');
		const avatar = String(form.get('avatar') ?? '');
		try {
			const res = await fetch(`${getApiUrl()}/session`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ name, bio, avatar })
			});
			if (!res.ok) {
				const e = await res.json().catch(() => ({ message: 'Gagal menyimpan' }));
				return fail(res.status, { error: e.message || 'Gagal menyimpan' });
			}
			return { success: true };
		} catch (e: any) {
			return fail(500, { error: e.message || 'Terjadi kesalahan' });
		}
	}
};
