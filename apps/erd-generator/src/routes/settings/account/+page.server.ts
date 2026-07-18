import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch(`${getApiUrl()}/session`, { credentials: 'include' });
	const data = await res.json();
	return { user: data.data ?? null };
};

export const actions: Actions = {
	delete: async ({ fetch, cookies }) => {
		let res: Response;
		try {
			res = await fetch(`${getApiUrl()}/session`, {
				method: 'DELETE',
				credentials: 'include'
			});
		} catch (e: any) {
			return fail(500, { error: e.message || 'Terjadi kesalahan' });
		}
		if (!res.ok) {
			const e = await res.json().catch(() => ({ message: 'Gagal menghapus akun' }));
			return fail(res.status, { error: e.message || 'Gagal menghapus akun' });
		}
		cookies.delete('token', { path: '/' });
		throw redirect(303, '/');
	}
};
