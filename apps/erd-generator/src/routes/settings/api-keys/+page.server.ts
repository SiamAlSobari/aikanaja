import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Zero-Persistence Client Security: API keys are stored 100% in client LocalStorage.
	return { keys: [] };
};
