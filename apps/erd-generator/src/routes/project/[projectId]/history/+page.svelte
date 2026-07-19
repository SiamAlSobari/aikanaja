<script lang="ts">
	import { ArrowLeft, History, RotateCcw, Loader2, Eye, Table2 } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { Version } from '$lib/api/erd';
	import { erdApi } from '$lib/api/erd';
	import { addToast } from '$lib/stores/ui.store.svelte';
	import { goto } from '$app/navigation';

	let { data }: { data: { project: any; versions: Version[] } } = $props();

	let restoring = $state<string | null>(null);

	function tablesOf(v: Version): string[] {
		return (v.schema?.nodes ?? []).map((n: any) => n.data?.name ?? '?');
	}
	function fmt(d: string) {
		return new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
	}

	async function restore(v: Version) {
		if (!confirm(`Kembalikan project ke versi ${fmt(v.createdAt)}?`)) return;
		restoring = v.id;
		try {
			await erdApi.restoreVersion(data.project.id, v.id);
			addToast('success', 'Project dikembalikan ke versi ini');
			goto(`/project/${data.project.id}`);
		} catch (e: any) {
			addToast('error', e.message || 'Gagal restore');
		} finally {
			restoring = null;
		}
	}
</script>

<div class="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-3xl mx-auto space-y-6">
	<div class="flex items-center gap-3">
		<a href="/project/{data.project.id}" class="btn btn-sm btn-ghost rounded-xl text-slate-400 hover:text-white" id="back-to-canvas-btn">
			<ArrowLeft class="w-4 h-4" /> Back to Canvas
		</a>
		<h1 class="text-xl font-bold text-white">Version History</h1>
	</div>

	{#if data.versions.length === 0}
		<div class="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-10 text-center backdrop-blur-sm">
			<History class="w-8 h-8 text-slate-700 mx-auto mb-3" />
			<p class="text-sm text-slate-500">Belum ada versi tersimpan.</p>
		</div>
	{:else}
		<div class="space-y-2" id="version-list-container">
			{#each data.versions as v, i}
				<div class="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-sm hover:border-orange-600/30 transition-colors" id="version-item-{v.id}">
					<div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 {i === 0 ? 'bg-orange-600/15 text-orange-500' : 'bg-slate-800 text-slate-500'}">
						<History class="w-5 h-5" />
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<p class="text-sm font-semibold text-white">{fmt(v.createdAt)}</p>
							{#if i === 0}<span class="text-[10px] font-medium text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">Terbaru</span>{/if}
						</div>
						<p class="text-xs text-slate-500 truncate">{v.description || 'Tanpa deskripsi'}</p>
						<p class="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5"><Table2 class="w-3 h-3" />{tablesOf(v).length} tabel</p>
					</div>
					<div class="flex items-center gap-2 shrink-0">
						<a href="/project/{data.project.id}/history/{v.id}" class="btn btn-xs bg-slate-800 hover:bg-slate-700 text-white rounded-xl border-none gap-1" id="view-version-btn-{v.id}">
							<Eye class="w-3.5 h-3.5" /> Detail
						</a>
						<button onclick={() => restore(v)} disabled={restoring === v.id} class="btn btn-xs bg-orange-600/15 hover:bg-orange-600/25 text-orange-400 border-none font-semibold rounded-xl gap-1 disabled:opacity-50" id="restore-version-btn-{v.id}">
							{#if restoring === v.id}<Loader2 class="w-3.5 h-3.5 animate-spin" />{:else}<RotateCcw class="w-3.5 h-3.5" />{/if} Restore
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
