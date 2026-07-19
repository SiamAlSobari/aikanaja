import type { PageServerLoad } from './$types';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch(`${getApiUrl()}/erd/billing`, { credentials: 'include' });
	const data = await res.json();
	return { billing: data.data ?? null };
};
