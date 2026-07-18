import type { PageServerLoad } from './$types';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const apiUrl = getApiUrl();
	const page = Number(url.searchParams.get('page')) || 1;
	const limit = Number(url.searchParams.get('limit')) || 12;
	const sort = url.searchParams.get('sort') || 'updatedAt';
	const order = url.searchParams.get('order') || 'desc';
	const filter = url.searchParams.get('filter') || 'active';
	const search = url.searchParams.get('search') || '';

	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
		sort,
		order,
		filter,
	});
	if (search) params.set('search', search);

	try {
		const res = await fetch(`${apiUrl}/erd/projects?${params}`, {
			credentials: 'include',
		});
		const data = await res.json();

		// Fetch schema for each project (for thumbnail preview)
		const projects = data.data || [];
		const projectsWithSchema = await Promise.all(
			projects.map(async (p: any) => {
				try {
					const detailRes = await fetch(`${apiUrl}/erd/projects/${p.id}`, {
						credentials: 'include',
					});
					const detail = await detailRes.json();
					return { ...p, schema: detail.data?.schema ? JSON.parse(detail.data.schema) : null };
				} catch {
					return { ...p, schema: null };
				}
			})
		);

		return {
			projects: projectsWithSchema,
			pagination: data.pagination || { page: 1, limit: 12, total: 0, totalPages: 0 },
			filters: { page, limit, sort, order, filter, search },
		};
	} catch {
		return {
			projects: [],
			pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
			filters: { page, limit, sort, order, filter, search },
		};
	}
};
