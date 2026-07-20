import { redirect } from '@sveltejs/kit';
import { getApiUrl } from '$lib/server/env';
import type { PageServerLoad } from './$types';
import type { BillingInfo } from '$lib/api/erd';

export const load: PageServerLoad = async ({ fetch, locals, request }) => {
	if (!(locals as any).user) throw redirect(303, '/auth/login');
	const cookie = request.headers.get('cookie') || '';
	try {
		const res = await fetch(`${getApiUrl()}/erd/billing`, { headers: { cookie } });
		if (res.ok) {
			const json = await res.json();
			return { billing: json.data as BillingInfo };
		}
	} catch (e) {
		console.error('[Billing.load]', e);
	}
	return { billing: null };
};
