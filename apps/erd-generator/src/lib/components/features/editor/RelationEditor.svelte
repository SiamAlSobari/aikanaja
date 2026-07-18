<script lang="ts">
	import { Trash2, ArrowRight } from 'lucide-svelte';
	import { flowStore } from '$lib/stores/flow.store.svelte';
	import { RELATION_TYPES } from '$lib/utils/constants';
	import type { ErdRelation } from '$lib/types/erd';

	let { edge }: { edge: any } = $props();

	const sourceTable = $derived(flowStore.tableList.find((t) => t.id === edge.source));
	const targetTable = $derived(flowStore.tableList.find((t) => t.id === edge.target));
	const currentType = $derived(
		(edge.label as string) === '1:1'
			? 'one-to-one'
			: (edge.label as string) === 'N:M'
				? 'many-to-many'
				: 'one-to-many'
	);

	function setType(value: string) {
		flowStore.updateRelationType(edge.id, value as ErdRelation['type']);
	}

	function remove() {
		flowStore.deleteEdge(edge.id);
	}
</script>

<div class="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4 flex flex-col gap-3">
	<!-- Tables summary -->
	<div class="flex items-center justify-center gap-2 text-[12px]">
		<span class="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 font-mono truncate max-w-[120px]">
			{sourceTable?.name ?? '?'}
		</span>
		<ArrowRight class="w-3.5 h-3.5 text-orange-500 shrink-0" />
		<span class="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 font-mono truncate max-w-[120px]">
			{targetTable?.name ?? '?'}
		</span>
	</div>

	<!-- Type selector -->
	<div class="flex flex-col gap-1.5">
		<span class="text-[10px] text-slate-600 uppercase tracking-wider font-medium">Cardinality</span>
		<div class="grid grid-cols-3 gap-1.5">
			{#each RELATION_TYPES as r}
				<button
					onclick={() => setType(r.value)}
					class="py-1.5 rounded-lg text-[11px] font-medium border transition-all {currentType === r.value
						? 'bg-orange-600/15 border-orange-600/30 text-orange-400'
						: 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'}"
					title={r.label}
				>
					{r.short}
				</button>
			{/each}
		</div>
	</div>

	<!-- Delete -->
	<button
		onclick={remove}
		class="flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all"
	>
		<Trash2 class="w-3.5 h-3.5" /> Hapus Relasi
	</button>
</div>
