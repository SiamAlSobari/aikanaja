import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const apiUrl = getApiUrl();
	try {
		const res = await fetch(`${apiUrl}/erd/templates/${params.templateId}`, { credentials: 'include' });
		if (!res.ok) throw error(404, 'Template not found');
		const data = await res.json();
		return { template: data.data };
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) throw err;
		throw error(404, 'Template not found');
	}
};
