<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		Trash2,
		RotateCcw,
		AlertTriangle,
		Clock,
		Table2,
		Sparkles,
	} from 'lucide-svelte';

	let { data } = $props();

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
	}

	async function restoreProject(id: string) {
		try {
			const { erdApi } = await import('$lib/api/erd');
			await erdApi.restore(id);
			goto('/dashboard/trash', { invalidateAll: true });
		} catch (err) {
			console.error('[trash.restore]', err);
		}
	}

	async function permanentDelete(id: string, name: string) {
		if (!confirm(`Hapus permanen "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
		try {
			const { erdApi } = await import('$lib/api/erd');
			await erdApi.delete(id);
			goto('/dashboard/trash', { invalidateAll: true });
		} catch (err) {
			console.error('[trash.permanentDelete]', err);
		}
	}
</script>

<svelte:head>
	<title>Trash — SchemaFlow</title>
</svelte:head>

<div class="relative min-h-full">
	<div class="relative p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
		<div class="flex items-start justify-between">
			<div>
				<h1 class="text-2xl font-extrabold text-white tracking-tight">Trash</h1>
				<p class="text-sm text-slate-500 mt-1">Project yang dihapus akan disimpan di sini selama 30 hari.</p>
			</div>
		</div>

		<!-- Info Banner -->
		<div class="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-600/5 border border-amber-600/15">
			<AlertTriangle class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
			<p class="text-xs text-amber-400/80 leading-relaxed">
				Project di trash akan dihapus permanen setelah 30 hari. Anda bisa restore kapan saja sebelum periode tersebut berakhir.
			</p>
		</div>

		{#if data.projects.length > 0}
			<div class="space-y-3">
				{#each data.projects as project}
					<div class="flex items-center gap-4 px-5 py-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
						<div class="w-10 h-10 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-center shrink-0">
							<Table2 class="w-5 h-5 text-slate-600" />
						</div>
						<div class="flex-1 min-w-0">
							<h3 class="text-sm font-semibold text-slate-300 truncate">{project.name}</h3>
							<p class="text-[10px] text-slate-600 mt-0.5">
								Dihapus {formatDate(project.updatedAt)}
							</p>
						</div>
						<div class="flex items-center gap-2 shrink-0">
							<button
								onclick={() => restoreProject(project.id)}
								class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-emerald-400 hover:bg-emerald-600/10 border border-emerald-600/20 hover:border-emerald-600/40 transition-all"
							>
								<RotateCcw class="w-3.5 h-3.5" /> Restore
							</button>
							<button
								onclick={() => permanentDelete(project.id, project.name)}
								class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-600/10 border border-red-600/20 hover:border-red-600/40 transition-all"
							>
								<Trash2 class="w-3.5 h-3.5" /> Delete
							</button>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="relative rounded-2xl border border-slate-800/40 overflow-hidden py-20 text-center">
				<div class="absolute inset-0 bg-grid-pattern opacity-30"></div>
				<div class="relative">
					<div class="w-14 h-14 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center justify-center mx-auto mb-4">
						<Trash2 class="w-6 h-6 text-slate-700" />
					</div>
					<p class="text-sm font-medium text-slate-400 mb-1">Trash kosong</p>
					<p class="text-xs text-slate-600">Project yang dihapus akan muncul di sini.</p>
				</div>
			</div>
		{/if}
	</div>
</div>
