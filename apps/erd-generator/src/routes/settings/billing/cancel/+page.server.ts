import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getApiUrl } from '$lib/server/env';

export const actions: Actions = {
	default: async ({ fetch }) => {
		try {
			const res = await fetch(`${getApiUrl()}/erd/billing/cancel`, {
				method: 'POST',
				credentials: 'include'
			});
			if (!res.ok) {
				const e = await res.json().catch(() => ({ message: 'Gagal membatalkan langganan' }));
				return fail(res.status, { error: e.message || 'Gagal membatalkan' });
			}
			throw redirect(303, '/settings/billing');
		} catch (e: any) {
			if (e && typeof e === 'object' && 'status' in e) throw e;
			return fail(500, { error: e.message || 'Terjadi kesalahan' });
		}
	}
};
