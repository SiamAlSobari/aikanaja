<script lang="ts">
	import {
		X,
		Plus,
		Trash2,
		Table2,
		GitBranch,
		AlertTriangle
	} from 'lucide-svelte';
	import { flowStore } from '$lib/stores/flow.store.svelte';
	import { addToast } from '$lib/stores/ui.store.svelte';
	import type { ErdColumn } from '$lib/types/erd';
	import ColumnEditor from './ColumnEditor.svelte';
	import RelationEditor from './RelationEditor.svelte';

	let showDeleteConfirm = $state(false);
	let table = $derived(flowStore.selectedNode);
	let edge = $derived(flowStore.selectedEdge);

	function close() {
		flowStore.deselectAll();
		showDeleteConfirm = false;
	}

	function rename(name: string) {
		if (table) flowStore.renameTable(table.id, name);
	}

	function addColumn() {
		if (!table) return;
		const col: ErdColumn = {
			id: `col-${crypto.randomUUID().slice(0, 8)}`,
			name: 'new_column',
			type: 'VARCHAR',
			primaryKey: false,
			nullable: true,
			unique: false,
			defaultValue: null,
			foreignKey: null
		};
		flowStore.addColumnToTable(table.id, col);
	}

	function deleteTable() {
		if (!table) return;
		flowStore.deleteNode(table.id);
		addToast('info', `Tabel "${table.name}" dihapus`);
		close();
	}
</script>

{#if table}
	<aside class="absolute right-0 top-0 bottom-0 w-[340px] z-20 flex flex-col bg-slate-950/95 border-l border-slate-800/60 backdrop-blur-xl animate-slide-in">
		<!-- Header -->
		<div class="flex items-center justify-between px-4 py-3.5 border-b border-slate-800/60">
			<div class="flex items-center gap-2.5">
				<div class="w-7 h-7 rounded-lg bg-orange-600/10 border border-orange-600/20 flex items-center justify-center">
					<Table2 class="w-3.5 h-3.5 text-orange-500" />
				</div>
				<h2 class="text-sm font-bold text-white">Edit Tabel</h2>
			</div>
			<button
				onclick={close}
				class="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800/60 transition-all"
				title="Tutup"
			>
				<X class="w-4 h-4" />
			</button>
		</div>

		<!-- Table name -->
		<div class="px-4 py-3 border-b border-slate-800/40">
			<span class="text-[10px] text-slate-600 uppercase tracking-wider font-medium">Nama Tabel</span>
			<input
				value={table.name}
				oninput={(e) => rename(e.currentTarget.value)}
				class="mt-1.5 w-full bg-slate-900/60 border border-slate-800 text-slate-200 text-sm font-mono rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all"
			/>
		</div>

		<!-- Columns -->
		<div class="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5">
			<div class="flex items-center justify-between">
				<span class="text-[10px] text-slate-600 uppercase tracking-wider font-medium">
					Kolom ({table.columns.length})
				</span>
				<button
					onclick={addColumn}
					class="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-orange-400 hover:text-orange-300 hover:bg-orange-600/10 transition-all"
				>
					<Plus class="w-3 h-3" /> Tambah
				</button>
			</div>

			{#each table.columns as col (col.id)}
				<ColumnEditor tableId={table.id} column={col} />
			{/each}
		</div>

		<!-- Delete table -->
		<div class="px-4 py-3 border-t border-slate-800/60">
			{#if showDeleteConfirm}
				<div class="flex flex-col gap-2 p-3 rounded-xl bg-red-600/10 border border-red-600/20">
					<div class="flex items-center gap-2 text-[11px] text-red-300">
						<AlertTriangle class="w-3.5 h-3.5" />
						<span>Hapus tabel ini secara permanen?</span>
					</div>
					<div class="flex gap-2">
						<button onclick={() => (showDeleteConfirm = false)} class="flex-1 py-1.5 rounded-lg text-[11px] bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
							Batal
						</button>
						<button onclick={deleteTable} class="flex-1 py-1.5 rounded-lg text-[11px] font-semibold bg-red-600 text-white hover:bg-red-700 transition-all">
							Hapus
						</button>
					</div>
				</div>
			{:else}
				<button
					onclick={() => (showDeleteConfirm = true)}
					class="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-[11px] font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all"
				>
					<Trash2 class="w-3.5 h-3.5" /> Hapus Tabel
				</button>
			{/if}
		</div>
	</aside>
{:else if edge}
	<aside class="absolute right-0 top-0 bottom-0 w-[320px] z-20 flex flex-col bg-slate-950/95 border-l border-slate-800/60 backdrop-blur-xl animate-slide-in">
		<div class="flex items-center justify-between px-4 py-3.5 border-b border-slate-800/60">
			<div class="flex items-center gap-2.5">
				<div class="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
					<GitBranch class="w-3.5 h-3.5 text-teal-400" />
				</div>
				<h2 class="text-sm font-bold text-white">Edit Relasi</h2>
			</div>
			<button
				onclick={close}
				class="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800/60 transition-all"
				title="Tutup"
			>
				<X class="w-4 h-4" />
			</button>
		</div>
		<div class="flex-1 overflow-y-auto px-4 py-4">
			<RelationEditor {edge} />
		</div>
	</aside>
{/if}

<style>
	@keyframes slide-in {
		from { transform: translateX(100%); opacity: 0; }
		to { transform: translateX(0); opacity: 1; }
	}
	:global(.animate-slide-in) { animation: slide-in 0.25s ease-out; }
</style>
