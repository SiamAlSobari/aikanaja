<script lang="ts">
	import { onMount } from 'svelte';
	import { flowStore } from '$lib/stores/flow.store.svelte';
	import { addToast } from '$lib/stores/ui.store.svelte';
	import { saveProjectSchema } from '$lib/utils/project';
	import type { ErdSchema, ErdProject } from '$lib/types/erd';

	import SchemaToolbar from '$lib/components/features/editor/SchemaToolbar.svelte';
	import ERDCanvas from '$lib/components/flow/ERDCanvas.svelte';
	import AIChatPanel from '$lib/components/features/ai/AIChatPanel.svelte';
	import TableDetailPanel from '$lib/components/features/editor/TableDetailPanel.svelte';
	import ExportModal from '$lib/components/features/export/ExportModal.svelte';

	let { data }: { data: { project: ErdProject } } = $props();

	let aiCollapsed = $state(true);
	let exportOpen = $state(false);
	const schema = $derived(flowStore.toSchema());

	onMount(() => {
		if (data.project?.schema) {
			flowStore.loadFromSchema(data.project.schema);
		}
	});

	async function handleSave() {
		const s = flowStore.saveToSchema();
		try {
			await saveProjectSchema(data.project.id, s);
			addToast('success', 'Skema tersimpan');
		} catch (err) {
			console.error('[Workspace.save]', err);
			addToast('error', 'Gagal menyimpan skema');
		}
	}

	function onKeydown(e: KeyboardEvent) {
		const tag = (document.activeElement?.tagName || '').toLowerCase();
		const typing = tag === 'input' || tag === 'textarea' || tag === 'select';
		const mod = e.metaKey || e.ctrlKey;

		if (mod && e.key.toLowerCase() === 'z') {
			e.preventDefault();
			e.shiftKey ? flowStore.redo() : flowStore.undo();
		} else if (mod && e.key.toLowerCase() === 'y') {
			e.preventDefault();
			flowStore.redo();
		} else if (mod && e.key.toLowerCase() === 's') {
			e.preventDefault();
			handleSave();
		} else if ((e.key === 'Delete' || e.key === 'Backspace') && !typing) {
			if (flowStore.selectedNodeId) flowStore.deleteNode(flowStore.selectedNodeId);
			else if (flowStore.selectedEdgeId) flowStore.deleteEdge(flowStore.selectedEdgeId);
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />

<div class="relative flex-1 min-h-0 w-full">
	<ERDCanvas />

	<SchemaToolbar project={data.project} onExport={() => (exportOpen = true)} />

	<AIChatPanel bind:collapsed={aiCollapsed} onGenerated={handleSave} />

	<TableDetailPanel />

	<ExportModal bind:open={exportOpen} {schema} projectName={data.project.name} />
</div>
