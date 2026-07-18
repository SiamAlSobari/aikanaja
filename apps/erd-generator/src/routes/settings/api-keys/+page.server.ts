import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch(`${getApiUrl()}/api-keys`, { credentials: 'include' });
	const data = await res.json();
	return { keys: data.data ?? [] };
};

export const actions: Actions = {
	add: async ({ request, fetch }) => {
		const form = await request.formData();
		const provider = String(form.get('provider') ?? '');
		const key = String(form.get('key') ?? '');
		const label = String(form.get('label') ?? '');
		try {
			const res = await fetch(`${getApiUrl()}/api-keys`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ provider, key, label: label || undefined })
			});
			if (!res.ok) {
				const e = await res.json().catch(() => ({ message: 'Gagal menambah key' }));
				return fail(res.status, { error: e.message || 'Gagal menambah key' });
			}
			return { success: true };
		} catch (e: any) {
			return fail(500, { error: e.message || 'Terjadi kesalahan' });
		}
	},

	setDefault: async ({ request, fetch }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		try {
			const res = await fetch(`${getApiUrl()}/api-keys/${id}/default`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include'
			});
			if (!res.ok) {
				const e = await res.json().catch(() => ({ message: 'Gagal set default' }));
				return fail(res.status, { error: e.message || 'Gagal set default' });
			}
			return { success: true };
		} catch (e: any) {
			return fail(500, { error: e.message || 'Terjadi kesalahan' });
		}
	},

	delete: async ({ request, fetch }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		try {
			const res = await fetch(`${getApiUrl()}/api-keys/${id}`, {
				method: 'DELETE',
				credentials: 'include'
			});
			if (!res.ok) {
				const e = await res.json().catch(() => ({ message: 'Gagal menghapus' }));
				return fail(res.status, { error: e.message || 'Gagal menghapus' });
			}
			return { success: true };
		} catch (e: any) {
			return fail(500, { error: e.message || 'Terjadi kesalahan' });
		}
	}
};
