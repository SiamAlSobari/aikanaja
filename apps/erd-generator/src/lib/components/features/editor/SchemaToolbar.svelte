<script lang="ts">
	import {
		Undo,
		Redo,
		LayoutGrid,
		Download,
		ChevronLeft,
		Save,
		Loader2,
	} from 'lucide-svelte';
	import { flowStore } from '$lib/stores/flow.store.svelte';
	import { goto } from '$app/navigation';
	import { addToast } from '$lib/stores/ui.store.svelte';
	import { saveProjectSchema } from '$lib/utils/project';
	import type { ErdProject } from '$lib/types/erd';

	let { project, onExport }: { project: ErdProject; onExport?: () => void } = $props();
	let isSaving = $state(false);
	let saveStatus = $state<'idle' | 'saving' | 'saved'>('idle');

	function handleUndo() {
		flowStore.undo();
	}

	function handleRedo() {
		flowStore.redo();
	}

	function handleAutoLayout() {
		const cols = Math.ceil(Math.sqrt(flowStore.nodes.length)) || 1;
		const rowHeight = 200;
		const colWidth = 260;

		flowStore.nodes.forEach((node, i) => {
			const col = i % cols;
			const row = Math.floor(i / cols);
			flowStore.updateNode(node.id, {
				position: {
					x: col * colWidth + 50,
					y: row * rowHeight + 50,
				},
			});
		});
	}

	async function handleSave() {
		isSaving = true;
		saveStatus = 'saving';
		try {
			const schema = flowStore.saveToSchema();
			await saveProjectSchema(project.id, schema);
			saveStatus = 'saved';
			setTimeout(() => (saveStatus = 'idle'), 2000);
		} catch (err) {
			console.error('[SchemaToolbar.save]', err);
			saveStatus = 'idle';
			addToast('error', 'Gagal menyimpan skema');
		} finally {
			isSaving = false;
		}
	}

	function handleBack() {
		goto('/dashboard');
	}

	function handleExport() {
		if (onExport) {
			onExport();
			return;
		}
		const schema = flowStore.saveToSchema();
		fetch('/api/erd/export', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ schema, format: 'sql', target: 'sqlite' }),
		})
			.then((res) => res.json())
			.then((data) => {
				const blob = new Blob([data.file], { type: 'text/sql' });
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = data.filename || 'schema.sql';
				a.click();
				URL.revokeObjectURL(url);
			})
			.catch((err) => console.error('[SchemaToolbar.export]', err));
	}

	$effect(() => {
		if (flowStore.isDirty && saveStatus === 'idle') {
			saveStatus = 'saving';
		}
	});
</script>

<div class="absolute top-3 left-1/2 -translate-x-1/2 z-30">
	<div class="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800/80 backdrop-blur-sm shadow-lg shadow-black/40">
		<!-- Back -->
		<button
			onclick={handleBack}
			class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
			title="Back to Dashboard"
		>
			<ChevronLeft class="w-4 h-4" />
		</button>

		<div class="w-px h-5 bg-slate-800"></div>

		<!-- Project Name -->
		<span class="text-xs font-semibold text-slate-200 px-2 truncate max-w-[160px]">
			{project.name}
		</span>

		<div class="w-px h-5 bg-slate-800"></div>

		<!-- Undo / Redo -->
		<button
			onclick={handleUndo}
			disabled={!flowStore.canUndo}
			class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
			title="Undo (Ctrl+Z)"
		>
			<Undo class="w-3.5 h-3.5" />
		</button>

		<button
			onclick={handleRedo}
			disabled={!flowStore.canRedo}
			class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
			title="Redo (Ctrl+Y)"
		>
			<Redo class="w-3.5 h-3.5" />
		</button>

		<div class="w-px h-5 bg-slate-800"></div>

		<!-- Auto Layout -->
		<button
			onclick={handleAutoLayout}
			class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
			title="Auto Layout"
		>
			<LayoutGrid class="w-3.5 h-3.5" />
		</button>

		<div class="w-px h-5 bg-slate-800"></div>

		<!-- Save -->
		<button
			onclick={handleSave}
			disabled={isSaving}
			class="p-1.5 rounded-lg transition-all {saveStatus === 'saved' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'} disabled:opacity-50"
			title="Save"
		>
			{#if isSaving}
				<Loader2 class="w-3.5 h-3.5 animate-spin" />
			{:else}
				<Save class="w-3.5 h-3.5" />
			{/if}
		</button>

		{#if saveStatus === 'saved'}
			<span class="text-[10px] text-emerald-400 font-mono px-1">Saved</span>
		{/if}

		<div class="w-px h-5 bg-slate-800"></div>

		<!-- Export -->
		<button
			onclick={handleExport}
			class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 transition-all"
			title="Export SQL"
		>
			<Download class="w-3.5 h-3.5" />
			Export
		</button>
	</div>
</div>

<!-- Stats badge -->
<div class="absolute bottom-3 left-3 z-10">
	<div class="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800/60 backdrop-blur-sm">
		<span class="text-[10px] text-slate-500 font-mono">
			{flowStore.nodes.length} tables
		</span>
		<span class="text-slate-700">·</span>
		<span class="text-[10px] text-slate-500 font-mono">
			{flowStore.edges.length} relations
		</span>
	</div>
</div>
