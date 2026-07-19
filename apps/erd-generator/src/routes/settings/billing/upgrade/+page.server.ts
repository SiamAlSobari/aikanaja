import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch(`${getApiUrl()}/session`, { credentials: 'include' });
	const data = await res.json();
	if (!data.data) throw redirect(302, '/auth/login');
	return { user: data.data };
};

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const form = await request.formData();
		const plan = String(form.get('plan') ?? '');
		try {
			const res = await fetch(`${getApiUrl()}/erd/billing/upgrade`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ plan })
			});
			if (!res.ok) {
				const e = await res.json().catch(() => ({ message: 'Gagal membuat upgrade request' }));
				return fail(res.status, { error: e.message || 'Gagal upgrade' });
			}
			const result = await res.json();
			return { success: true, paymentInfo: result };
		} catch (e: any) {
			return fail(500, { error: e.message || 'Terjadi kesalahan' });
		}
	}
};
