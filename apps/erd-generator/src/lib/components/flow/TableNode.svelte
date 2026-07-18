<script lang="ts">
	import { Key, Link, Hash } from 'lucide-svelte';
	import { getColumnColor } from '$lib/utils/schema-transform';
	import { flowStore } from '$lib/stores/flow.store.svelte';
	import type { ErdTable, ErdColumn } from '$lib/types/erd';

	let { data }: { data: { table: ErdTable } } = $props();
	const table = $derived(data.table);
	const isSelected = $derived(flowStore.selectedNodeId === table.id);

	function handleNodeClick() {
		flowStore.selectNode(table.id);
	}

	function handleAddColumn() {
		const newCol: ErdColumn = {
			id: `col-${Date.now()}`,
			name: 'new_column',
			type: 'VARCHAR',
			primaryKey: false,
			nullable: true,
			unique: false,
			defaultValue: null,
			foreignKey: null,
		};
		flowStore.addColumnToTable(table.id, newCol);
	}

	function handleDeleteColumn(columnId: string) {
		flowStore.deleteColumnFromTable(table.id, columnId);
	}
</script>

<div
	role="button"
	tabindex="0"
	aria-label="Select table {table.name}"
	onclick={handleNodeClick}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleNodeClick();
		}
	}}
	class="rounded-xl border-2 transition-all duration-200 select-none min-w-[200px] max-w-[240px] backdrop-blur-sm {isSelected ? 'ring-2 ring-orange-500/40 border-orange-500/50 shadow-orange-500/10' : 'bg-slate-950/95 border-slate-800 shadow-lg shadow-black/30'}"
>
	<!-- Header -->
	<div class="flex items-center gap-2 px-3 py-2 border-b border-slate-800/80 bg-slate-900/60 rounded-t-[10px]">
		<div class="w-2 h-2 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 shadow-[0_0_6px_rgba(249,115,22,0.5)]"></div>
		<span class="text-xs font-bold text-white tracking-wide truncate flex-1">{table.name}</span>
		<span class="text-[9px] text-slate-600 font-mono shrink-0">{table.columns.length} col</span>
	</div>

	<!-- Columns -->
	<div class="py-0.5">
		{#each table.columns as col (col.id)}
			<div class="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-800/40 transition-colors group border-b border-slate-800/20 last:border-0">
				<!-- Icon -->
				<span class="shrink-0 w-4 flex justify-center">
					{#if col.primaryKey}
						<Key class="w-3 h-3 text-orange-500" />
					{:else if col.foreignKey}
						<Link class="w-3 h-3 text-teal-500" />
					{:else}
						<Hash class="w-3 h-3 text-slate-600" />
					{/if}
				</span>

				<!-- Column name -->
				<span class="text-[11px] font-mono truncate flex-1 {col.primaryKey ? 'text-orange-400 font-semibold' : 'text-slate-300'}">
					{col.name}
				</span>

				<!-- Type -->
				<span class="text-[9px] font-mono {getColumnColor(col.type)} opacity-70 shrink-0">
					{col.type.toUpperCase()}
				</span>

				<!-- Delete button (hover only) -->
				<button
					class="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-red-400"
					aria-label={'Delete column ' + col.name}
					onclick={(e) => { e.stopPropagation(); handleDeleteColumn(col.id); }}
				>
					<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		{/each}

		<!-- Add column -->
		<button
			onclick={handleAddColumn}
			class="flex items-center justify-center gap-1 w-full py-1.5 text-[10px] text-slate-600 hover:text-orange-400 hover:bg-orange-500/5 transition-colors"
		>
			<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
			</svg>
			Add Column
		</button>
	</div>
</div>
