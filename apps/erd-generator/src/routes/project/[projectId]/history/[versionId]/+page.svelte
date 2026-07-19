<script lang="ts">
	import { ArrowLeft, History, RotateCcw, Loader2, Table2, Link2, KeyRound, Eye } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { Version } from '$lib/api/erd';
	import { erdApi } from '$lib/api/erd';
	import { addToast } from '$lib/stores/ui.store.svelte';
	import { goto } from '$app/navigation';

	let { data }: { data: { project: any; version: Version } } = $props();

	let restoring = $state(false);

	const nodes = $derived(data.version.schema?.nodes ?? []);
	const edges = $derived(data.version.schema?.edges ?? []);

	function fmt(d: string) {
		return new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
	}
	function colCount(n: any): number {
		return n.data?.columns?.length ?? 0;
	}
	function relTypes(edges: any[]): string[] {
		const s = new Set<string>();
		for (const e of edges) if (e?.data?.relationType) s.add(e.data.relationType);
		return [...s];
	}

	async function restore() {
		if (!confirm('Kembalikan project ke versi ini?')) return;
		restoring = true;
		try {
			await erdApi.restoreVersion(data.project.id, data.version.id);
			addToast('success', 'Project dikembalikan');
			goto(`/project/${data.project.id}`);
		} catch (e: any) {
			addToast('error', e.message || 'Gagal restore');
		} finally {
			restoring = false;
		}
	}
</script>

<div class="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-3xl mx-auto space-y-6">
	<div class="flex items-center gap-3">
		<a href="/project/{data.project.id}/history" class="btn btn-sm btn-ghost rounded-xl text-slate-400 hover:text-white">
			<ArrowLeft class="w-4 h-4" /> History
		</a>
		<h1 class="text-xl font-bold text-white">Detail Versi</h1>
	</div>

	<div class="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-sm">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="w-11 h-11 rounded-xl bg-orange-600/15 flex items-center justify-center text-orange-500">
					<History class="w-5 h-5" />
				</div>
				<div>
					<p class="text-sm font-semibold text-white">{fmt(data.version.createdAt)}</p>
					<p class="text-xs text-slate-500">{data.version.description || 'Tanpa deskripsi'}</p>
				</div>
			</div>
			<button onclick={restore} disabled={restoring} class="btn btn-sm bg-orange-600 hover:bg-orange-700 text-slate-950 border-none font-semibold rounded-xl gap-1.5 shadow-lg shadow-orange-600/20 disabled:opacity-50">
				{#if restoring}<Loader2 class="w-4 h-4 animate-spin" />{:else}<RotateCcw class="w-4 h-4" />{/if} Restore Versi Ini
			</button>
		</div>

		<div class="mt-5 grid grid-cols-3 gap-3 text-center">
			<div class="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60"><p class="text-lg font-bold text-white">{nodes.length}</p><p class="text-[11px] text-slate-500 flex items-center justify-center gap-1"><Table2 class="w-3 h-3" />Tabel</p></div>
			<div class="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60"><p class="text-lg font-bold text-white">{edges.length}</p><p class="text-[11px] text-slate-500 flex items-center justify-center gap-1"><Link2 class="w-3 h-3" />Relasi</p></div>
			<div class="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60"><p class="text-lg font-bold text-white">{relTypes(edges).length}</p><p class="text-[11px] text-slate-500 flex items-center justify-center gap-1"><KeyRound class="w-3 h-3" />Tipe Relasi</p></div>
		</div>
	</div>

	<div class="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-sm">
		<h3 class="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2"><Table2 class="w-4 h-4 text-orange-500" /> Daftar Tabel</h3>
		{#if nodes.length === 0}
			<p class="text-xs text-slate-500 text-center py-4">Tidak ada tabel.</p>
		{:else}
			<div class="grid sm:grid-cols-2 gap-2">
				{#each nodes as n}
					<div class="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/60">
						<span class="text-sm font-medium text-slate-200 truncate">{n.data?.name ?? '?'}</span>
						<span class="text-[11px] text-slate-500 shrink-0 ml-2">{colCount(n)} kolom</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
