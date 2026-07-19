<script lang="ts">
	import { page } from '$app/state';
	import { ChevronLeft, ChevronRight, ShieldCheck, User as UserIcon } from 'lucide-svelte';
	import AdminHeader from '$lib/components/features/admin/AdminHeader.svelte';
	import type { AdminUser } from '$lib/api/admin';

	let { data } = $props();
	const users = $derived(data.users as AdminUser[]);
	const pagination = $derived(data.pagination);
	const current = $derived(Number(data.page) || 1);

	function roleBadge(role: string) {
		if (role === 'admin')
			return 'bg-orange-500/15 text-orange-300 border-orange-500/30';
		if (role === 'pro' || role === 'team')
			return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
		return 'bg-slate-700/30 text-slate-300 border-slate-600/40';
	}

	function fmtDate(iso: string) {
		return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
	}
</script>

<AdminHeader title="Users" subtitle="Semua user terdaftar di platform" />

<div class="px-6 lg:px-10 pb-10">
	<div class="overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/40">
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-slate-800/70 text-left text-[11px] uppercase tracking-wider text-slate-500">
						<th class="px-5 py-3 font-semibold">User</th>
						<th class="px-5 py-3 font-semibold">Role</th>
						<th class="px-5 py-3 font-semibold">Projects</th>
						<th class="px-5 py-3 font-semibold">Joined</th>
						<th class="px-5 py-3 font-semibold text-right">Action</th>
					</tr>
				</thead>
				<tbody>
					{#each users as u}
						<tr class="border-b border-slate-800/40 last:border-0 hover:bg-slate-800/20 transition-colors">
							<td class="px-5 py-3.5">
								<div class="flex items-center gap-3">
									<div class="w-9 h-9 rounded-xl bg-orange-600/12 border border-orange-600/25 flex items-center justify-center text-xs font-bold text-orange-500 shrink-0">
										{u.name?.charAt(0)?.toUpperCase() || '?'}
									</div>
									<div class="min-w-0">
										<p class="font-medium text-white truncate flex items-center gap-1.5">
											{u.name}
											{#if u.role === 'admin'}<ShieldCheck class="w-3.5 h-3.5 text-orange-500" />{/if}
										</p>
										<p class="text-[11px] text-slate-500 truncate">{u.email}</p>
									</div>
								</div>
							</td>
							<td class="px-5 py-3.5">
								<span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold {roleBadge(u.role)}">
									{u.role}
								</span>
							</td>
							<td class="px-5 py-3.5 text-slate-300 tabular-nums">{u._count?.erdProjects ?? 0}</td>
							<td class="px-5 py-3.5 text-slate-400">{fmtDate(u.createdAt)}</td>
							<td class="px-5 py-3.5 text-right">
								<a
									href="/admin/users/{u.id}"
									class="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:border-orange-600/40 hover:bg-slate-800/50 transition-colors"
								>
									<UserIcon class="w-3.5 h-3.5" /> Detail
								</a>
							</td>
						</tr>
					{:else}
						<tr><td colspan="5" class="px-5 py-10 text-center text-sm text-slate-500">Belum ada user.</td></tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	{#if pagination && pagination.totalPages > 1}
		<div class="mt-5 flex items-center justify-between text-sm">
			<p class="text-slate-500">
				Halaman {current} dari {pagination.totalPages} · {pagination.total} user
			</p>
			<div class="flex items-center gap-2">
				<a
					href="/admin/users?page={Math.max(1, current - 1)}"
					class="flex items-center gap-1 rounded-lg border border-slate-700/60 px-3 py-1.5 text-slate-300 hover:text-white hover:border-orange-600/40 disabled:opacity-40 transition-colors"
					class:pointer-events-none={current <= 1}
				>
					<ChevronLeft class="w-4 h-4" /> Prev
				</a>
				<a
					href="/admin/users?page={Math.min(pagination.totalPages, current + 1)}"
					class="flex items-center gap-1 rounded-lg border border-slate-700/60 px-3 py-1.5 text-slate-300 hover:text-white hover:border-orange-600/40 disabled:opacity-40 transition-colors"
					class:pointer-events-none={current >= pagination.totalPages}
				>
					Next <ChevronRight class="w-4 h-4" />
				</a>
			</div>
		</div>
	{/if}
</div>
