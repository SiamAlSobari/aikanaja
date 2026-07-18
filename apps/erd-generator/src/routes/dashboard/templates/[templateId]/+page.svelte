<script lang="ts">
	import { goto } from '$app/navigation';
	import ERDCanvas from '$lib/components/flow/ERDCanvas.svelte';
	import { schemaToFlowNodes } from '$lib/utils/schema-transform';
	import {
		ArrowLeft,
		Zap,
		Database,
		GitBranch,
		Table2,
		Sparkles,
	} from 'lucide-svelte';

	let { data } = $props();
	const template = $derived(data.template);
	const schema = $derived(template?.schema);
	const flow = $derived(schema ? schemaToFlowNodes(schema) : { nodes: [], edges: [] });

	let isUsing = $state(false);

	async function useTemplate() {
		if (isUsing) return;
		isUsing = true;
		try {
			const { erdApi } = await import('$lib/api/erd');
			const res = await erdApi.useTemplate(template.id, template.name);
			if (res.data?.id) {
				window.location.href = `/project/${res.data.id}`;
			}
		} catch (err) {
			console.error('[template.use]', err);
		} finally {
			isUsing = false;
		}
	}

	function handleCardMouseMove(e: MouseEvent) {
		const card = e.currentTarget as HTMLElement;
		const rect = card.getBoundingClientRect();
		card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
		card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
	}
</script>

<svelte:head>
	<title>{template?.name || 'Template'} — SchemaFlow</title>
</svelte:head>

<div class="relative min-h-full">
	<div class="absolute top-0 right-0 w-[400px] h-[300px] bg-orange-600/3 blur-[100px] pointer-events-none"></div>

	<div class="relative p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
		<a href="/dashboard/templates" class="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-orange-400 transition-colors">
			<ArrowLeft class="w-3.5 h-3.5" /> Back to Templates
		</a>

		<div class="grid lg:grid-cols-12 gap-6">
			<!-- Info Panel -->
			<div class="lg:col-span-4 space-y-5">
				<div
					onmousemove={handleCardMouseMove}
					role="presentation"
					class="relative rounded-2xl bg-slate-900/40 border border-slate-800/60 p-6 overflow-hidden"
				>
					<div
						class="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500"
						style="background: radial-gradient(circle 300px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 62, 0, 0.04), transparent 80%);"
					></div>
					<div class="relative space-y-4">
						<div class="w-12 h-12 rounded-xl bg-orange-600/10 border border-orange-600/20 flex items-center justify-center">
							<Database class="w-6 h-6 text-orange-500" />
						</div>
						<div>
							<h1 class="text-xl font-extrabold text-white">{template?.name}</h1>
							<span class="text-[11px] text-slate-500">{template?.category}</span>
						</div>
						<p class="text-sm text-slate-400 leading-relaxed">
							{template?.description || 'No description'}
						</p>
					</div>
				</div>

				<!-- Stats -->
				<div class="grid grid-cols-2 gap-3">
					<div class="rounded-xl bg-slate-900/40 border border-slate-800/60 p-4 text-center">
						<p class="text-xl font-extrabold text-white">{schema?.tables?.length || 0}</p>
						<p class="text-[10px] text-slate-500 uppercase tracking-wider">Tables</p>
					</div>
					<div class="rounded-xl bg-slate-900/40 border border-slate-800/60 p-4 text-center">
						<p class="text-xl font-extrabold text-white">{schema?.relations?.length || 0}</p>
						<p class="text-[10px] text-slate-500 uppercase tracking-wider">Relations</p>
					</div>
				</div>

				<!-- Tables List -->
				<div class="rounded-xl bg-slate-900/40 border border-slate-800/60 p-4">
					<h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Tables</h3>
					<div class="space-y-2">
						{#each schema?.tables || [] as table}
							<div class="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-950/40 border border-slate-800/40">
								<Table2 class="w-3.5 h-3.5 text-orange-500/70" />
								<span class="text-xs font-mono text-slate-300">{table.name}</span>
								<span class="ml-auto text-[10px] text-slate-600">{table.columns?.length || 0} col</span>
							</div>
						{/each}
					</div>
				</div>

				<!-- Use Button -->
				<button
					onclick={useTemplate}
					disabled={isUsing}
					class="group relative flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-slate-950 font-bold text-sm shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99] overflow-hidden"
				>
					<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
					{#if isUsing}
						<span class="relative w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></span>
					{:else}
						<Zap class="relative w-4 h-4" />
					{/if}
					<span class="relative">{isUsing ? 'Creating...' : 'Use Template'}</span>
				</button>
			</div>

			<!-- ERD Preview -->
			<div class="lg:col-span-8">
				<div class="rounded-2xl border border-slate-800/60 overflow-hidden bg-slate-950 h-[500px] lg:h-[calc(100vh-200px)]">
					{#if flow.nodes.length > 0}
						<ERDCanvas nodes={flow.nodes} edges={flow.edges} readonly={true} />
					{:else}
						<div class="flex items-center justify-center h-full">
							<p class="text-sm text-slate-600">No preview available</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
