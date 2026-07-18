<script lang="ts">
	import { goto } from '$app/navigation';
	import ExportModal from '$lib/components/features/export/ExportModal.svelte';
	import type { ErdProject } from '$lib/types/erd';

	let { data }: { data: { project: ErdProject | null } } = $props();

	let open = $state(true);
	const schema = $derived(data.project?.schema ?? null);

	$effect(() => {
		if (!open) goto(`/project/${data.project?.id}`);
	});
</script>

<ExportModal bind:open {schema} projectName={data.project?.name ?? 'schema'} />
