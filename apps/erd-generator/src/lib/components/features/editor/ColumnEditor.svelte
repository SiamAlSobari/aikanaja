<script lang="ts">
	import { Key, Link, Hash, X } from 'lucide-svelte';
	import { flowStore } from '$lib/stores/flow.store.svelte';
	import { COLUMN_TYPES } from '$lib/utils/constants';
	import type { ErdColumn } from '$lib/types/erd';

	let {
		tableId,
		column
	}: {
		tableId: string;
		column: ErdColumn;
	} = $props();

	const tables = $derived(flowStore.tableList.filter((t) => t.id !== tableId));

	function update(patch: Partial<ErdColumn>) {
		flowStore.updateColumnInTable(tableId, column.id, patch);
	}

	function remove() {
		flowStore.deleteColumnFromTable(tableId, column.id);
	}
</script>

<div class="rounded-xl border border-slate-800/60 bg-slate-950/40 p-3 flex flex-col gap-2.5 group hover:border-slate-700/60 transition-colors">
	<!-- Row 1: name + type + delete -->
	<div class="flex items-center gap-2">
		<span class="shrink-0 w-4 flex justify-center">
			{#if column.primaryKey}
				<Key class="w-3.5 h-3.5 text-orange-500" />
			{:else if column.foreignKey}
				<Link class="w-3.5 h-3.5 text-teal-500" />
			{:else}
				<Hash class="w-3.5 h-3.5 text-slate-600" />
			{/if}
		</span>

		<input
			value={column.name}
			oninput={(e) => update({ name: e.currentTarget.value })}
			class="flex-1 min-w-0 bg-transparent text-[13px] font-mono text-slate-200 border-b border-transparent
				focus:border-orange-600/40 focus:outline-none py-0.5 transition-colors"
			placeholder="column_name"
		/>

		<select
			value={column.type}
			onchange={(e) => update({ type: e.currentTarget.value })}
			class="shrink-0 bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:border-orange-600/40 cursor-pointer"
		>
			{#each COLUMN_TYPES as t}
				<option value={t}>{t}</option>
			{/each}
		</select>

		<button
			onclick={remove}
			class="shrink-0 p-1 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
			title="Hapus kolom"
		>
			<X class="w-3.5 h-3.5" />
		</button>
	</div>

	<!-- Row 2: flags -->
	<div class="flex flex-wrap items-center gap-1.5 pl-6">
		<button
			onclick={() => update({ primaryKey: !column.primaryKey, nullable: column.primaryKey ? column.nullable : false })}
			class="px-2 py-0.5 rounded-md text-[10px] font-medium border transition-all {column.primaryKey
				? 'bg-orange-600/15 border-orange-600/30 text-orange-400'
				: 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'}"
		>
			PK
		</button>
		<button
			onclick={() => update({ nullable: !column.nullable })}
			class="px-2 py-0.5 rounded-md text-[10px] font-medium border transition-all {column.nullable
				? 'bg-slate-700/40 border-slate-600 text-slate-300'
				: 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'}"
		>
			NULL
		</button>
		<button
			onclick={() => update({ unique: !column.unique })}
			class="px-2 py-0.5 rounded-md text-[10px] font-medium border transition-all {column.unique
				? 'bg-teal-500/15 border-teal-500/30 text-teal-400'
				: 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'}"
		>
			UNIQUE
		</button>

		<!-- FK select -->
		<select
			value={column.foreignKey ? `${column.foreignKey.table}.${column.foreignKey.column}` : ''}
			onchange={(e) => {
				const v = e.currentTarget.value;
				if (!v) update({ foreignKey: null });
				else {
					const [t, c] = v.split('.');
					update({ foreignKey: { table: t, column: c } });
				}
			}}
			class="ml-auto bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 rounded-lg px-1.5 py-1 focus:outline-none focus:border-teal-500/40 cursor-pointer max-w-[110px]"
		>
			<option value="">No FK</option>
			{#each tables as t}
				{#each (flowStore.nodes.find((n) => n.id === t.id)?.data as any)?.table.columns ?? [] as col}
					<option value={`${t.name}.${col.name}`}>{t.name}.{col.name}</option>
				{/each}
			{/each}
		</select>
	</div>

	<!-- Row 3: default -->
	<div class="flex items-center gap-2 pl-6">
		<span class="text-[10px] text-slate-600 font-mono shrink-0">default</span>
		<input
			value={column.defaultValue ?? ''}
			oninput={(e) => update({ defaultValue: e.currentTarget.value || null })}
			class="flex-1 min-w-0 bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 rounded-md px-2 py-1 focus:outline-none focus:border-orange-600/40 transition-colors"
			placeholder="null"
		/>
	</div>
</div>
