import type { PageServerLoad } from './$types';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const page = Number(url.searchParams.get('page') || '1');
	const status = url.searchParams.get('status') || 'pending';
	const res = await fetch(`${getApiUrl()}/erd/admin/payments?page=${page}&limit=20&status=${status}`, {
		credentials: 'include'
	});
	const data = await res.json();
	return { payments: data.data ?? [], pagination: data.pagination ?? null, page, status };
};
