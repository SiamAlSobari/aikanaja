import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const hasGenerated = cookies.get('guest_generated');

	return {
		hasGenerated: !!hasGenerated,
	};
};
