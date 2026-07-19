import type { PageServerLoad } from './$types';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const res = await fetch(`${getApiUrl()}/erd/admin/payments/${params.paymentId}`, {
		credentials: 'include'
	});
	const data = await res.json();
	return { payment: data.data ?? null };
};
