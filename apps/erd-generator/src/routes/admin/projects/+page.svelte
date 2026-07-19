<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import AdminHeader from '$lib/components/features/admin/AdminHeader.svelte';
	import type { AdminProject } from '$lib/api/admin';

	let { data } = $props();
	const projects = $derived(data.projects as AdminProject[]);
	const pagination = $derived(data.pagination);
	const current = $derived(Number(data.page) || 1);

	function statusBadge(status: string) {
		if (status === 'active') return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
		if (status === 'deleted') return 'bg-red-500/15 text-red-300 border-red-500/30';
		return 'bg-slate-700/30 text-slate-300 border-slate-600/40';
	}

	function fmtDate(iso: string) {
		return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
	}
</script>

<AdminHeader title="Projects" subtitle="Semua project ERD di platform" />

<div class="px-6 lg:px-10 pb-10">
	<div class="overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/40">
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-slate-800/70 text-left text-[11px] uppercase tracking-wider text-slate-500">
						<th class="px-5 py-3 font-semibold">Project</th>
						<th class="px-5 py-3 font-semibold">Owner</th>
						<th class="px-5 py-3 font-semibold">Status</th>
						<th class="px-5 py-3 font-semibold">Visibility</th>
						<th class="px-5 py-3 font-semibold">Created</th>
					</tr>
				</thead>
				<tbody>
					{#each projects as p}
						<tr class="border-b border-slate-800/40 last:border-0 hover:bg-slate-800/20 transition-colors">
							<td class="px-5 py-3.5 font-medium text-white">{p.name}</td>
							<td class="px-5 py-3.5 text-slate-300">
								<span class="flex items-center gap-2">
									<span class="w-6 h-6 rounded-lg bg-orange-600/12 border border-orange-600/25 flex items-center justify-center text-[10px] font-bold text-orange-500">
										{p.user?.name?.charAt(0)?.toUpperCase() || '?'}
									</span>
									<span class="truncate max-w-[160px]">{p.user?.name}</span>
								</span>
							</td>
							<td class="px-5 py-3.5">
								<span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize {statusBadge(p.status)}">{p.status}</span>
							</td>
							<td class="px-5 py-3.5 text-slate-400 capitalize">{p.visibility}</td>
							<td class="px-5 py-3.5 text-slate-400">{fmtDate(p.createdAt)}</td>
						</tr>
					{:else}
						<tr><td colspan="5" class="px-5 py-10 text-center text-sm text-slate-500">Belum ada project.</td></tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	{#if pagination && pagination.totalPages > 1}
		<div class="mt-5 flex items-center justify-between text-sm">
			<p class="text-slate-500">Halaman {current} dari {pagination.totalPages} · {pagination.total} project</p>
			<div class="flex items-center gap-2">
				<a
					href="/admin/projects?page={Math.max(1, current - 1)}"
					class="flex items-center gap-1 rounded-lg border border-slate-700/60 px-3 py-1.5 text-slate-300 hover:text-white hover:border-orange-600/40 disabled:opacity-40 transition-colors"
					class:pointer-events-none={current <= 1}
				>
					<ChevronLeft class="w-4 h-4" /> Prev
				</a>
				<a
					href="/admin/projects?page={Math.min(pagination.totalPages, current + 1)}"
					class="flex items-center gap-1 rounded-lg border border-slate-700/60 px-3 py-1.5 text-slate-300 hover:text-white hover:border-orange-600/40 disabled:opacity-40 transition-colors"
					class:pointer-events-none={current >= pagination.totalPages}
				>
					Next <ChevronRight class="w-4 h-4" />
				</a>
			</div>
		</div>
	{/if}
</div>
