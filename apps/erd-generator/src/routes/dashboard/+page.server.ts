import type { PageServerLoad } from './$types';
import { getApiUrl } from '$lib/server/env';

export const load: PageServerLoad = async ({ fetch }) => {
	const apiUrl = getApiUrl();

	const [projectsRes, usageRes, statsRes] = await Promise.allSettled([
		fetch(`${apiUrl}/erd/projects?limit=5&sort=updatedAt&order=desc`, {
			credentials: 'include',
		}).then((r) => r.json()),
		fetch(`${apiUrl}/erd/usage`, {
			credentials: 'include',
		}).then((r) => r.json()),
		fetch(`${apiUrl}/erd/stats`, {
			credentials: 'include',
		}).then((r) => r.json()),
	]);

	const projects = projectsRes.status === 'fulfilled' ? projectsRes.value : { data: [], pagination: { total: 0 } };
	const usage = usageRes.status === 'fulfilled' ? usageRes.value : { data: null };
	const stats = statsRes.status === 'fulfilled' ? statsRes.value : { data: null };

	return {
		recentProjects: projects.data || [],
		totalProjects: projects.pagination?.total || 0,
		usage: usage.data || { count: 0, limit: 10, remaining: 10, isUnlimited: false },
		stats: stats.data || { totalProjects: 0, monthlyGenerates: 0, recentActivities: [] },
	};
};
