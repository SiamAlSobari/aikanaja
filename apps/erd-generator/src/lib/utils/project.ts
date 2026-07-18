import { erdApi } from '$lib/api/erd';
import type { ErdSchema } from '$lib/types/erd';

export async function saveProjectSchema(projectId: string, schema: ErdSchema): Promise<void> {
	await erdApi.update(projectId, { schema: JSON.stringify(schema) });
}
