<script lang="ts">
	import { ChevronLeft, ChevronRight, Check, X, Eye } from 'lucide-svelte';
	import AdminHeader from '$lib/components/features/admin/AdminHeader.svelte';
	import type { AdminPayment } from '$lib/api/admin';

	let { data } = $props();
	const payments = $derived(data.payments as AdminPayment[]);
	const pagination = $derived(data.pagination);
	const current = $derived(Number(data.page) || 1);
	const tab = $derived(data.status || 'pending');

	const tabs = [
		{ key: 'pending', label: 'Pending' },
		{ key: 'verified', label: 'Verified' },
		{ key: 'rejected', label: 'Rejected' },
	];

	function statusBadge(status: string) {
		if (status === 'verified') return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
		if (status === 'pending') return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
		return 'bg-red-500/15 text-red-300 border-red-500/30';
	}

	function planTone(plan: string) {
		if (plan === 'team') return 'text-violet-300';
		if (plan === 'pro') return 'text-emerald-300';
		return 'text-slate-300';
	}

	function fmtDate(iso: string) {
		return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
	}
</script>

<AdminHeader title="Payments" subtitle="Verifikasi pembayaran & terapkan plan pengguna" />

<div class="px-6 lg:px-10 pb-10">
	<!-- Tabs -->
	<div class="flex items-center gap-1 rounded-xl border border-slate-800/70 bg-slate-900/40 p-1 w-fit">
		{#each tabs as t}
			<a
				href="/admin/payments?status={t.key}"
				class="rounded-lg px-4 py-2 text-xs font-semibold transition-colors
					{tab === t.key ? 'bg-orange-600/15 text-orange-300' : 'text-slate-400 hover:text-white'}"
			>
				{t.label}
			</a>
		{/each}
	</div>

	<div class="mt-5 overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/40">
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-slate-800/70 text-left text-[11px] uppercase tracking-wider text-slate-500">
						<th class="px-5 py-3 font-semibold">User</th>
						<th class="px-5 py-3 font-semibold">Plan Diminta</th>
						<th class="px-5 py-3 font-semibold">Amount</th>
						<th class="px-5 py-3 font-semibold">Status</th>
						<th class="px-5 py-3 font-semibold">Date</th>
						<th class="px-5 py-3 font-semibold text-right">Action</th>
					</tr>
				</thead>
				<tbody>
					{#each payments as p}
						<tr class="border-b border-slate-800/40 last:border-0 hover:bg-slate-800/20 transition-colors">
							<td class="px-5 py-3.5">
								<div class="min-w-0">
									<p class="font-medium text-white truncate">{p.user?.name}</p>
									<p class="text-[11px] text-slate-500 truncate">{p.user?.email}</p>
								</div>
							</td>
							<td class="px-5 py-3.5">
								<span class="text-sm font-bold capitalize {planTone(p.plan)}">{p.plan}</span>
							</td>
							<td class="px-5 py-3.5 text-slate-300 tabular-nums">
								{p.amount ? 'Rp ' + p.amount.toLocaleString('id-ID') : '—'}
							</td>
							<td class="px-5 py-3.5">
								<span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize {statusBadge(p.status)}">{p.status}</span>
							</td>
							<td class="px-5 py-3.5 text-slate-400">{fmtDate(p.createdAt)}</td>
							<td class="px-5 py-3.5 text-right">
								<div class="flex items-center justify-end gap-2">
									<a
										href="/admin/payments/{p.id}"
										class="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:border-orange-600/40 transition-colors"
									>
										<Eye class="w-3.5 h-3.5" /> Detail
									</a>
									{#if p.status === 'pending'}
										<a
											href="/admin/payments/{p.id}"
											class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
										>
											<Check class="w-3.5 h-3.5" /> Approve
										</a>
									{/if}
								</div>
							</td>
						</tr>
					{:else}
						<tr><td colspan="6" class="px-5 py-10 text-center text-sm text-slate-500">Tidak ada pembayaran dengan status “{tab}”.</td></tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	{#if pagination && pagination.totalPages > 1}
		<div class="mt-5 flex items-center justify-between text-sm">
			<p class="text-slate-500">Halaman {current} dari {pagination.totalPages} · {pagination.total} payment</p>
			<div class="flex items-center gap-2">
				<a
					href="/admin/payments?status={tab}&page={Math.max(1, current - 1)}"
					class="flex items-center gap-1 rounded-lg border border-slate-700/60 px-3 py-1.5 text-slate-300 hover:text-white hover:border-orange-600/40 disabled:opacity-40 transition-colors"
					class:pointer-events-none={current <= 1}
				>
					<ChevronLeft class="w-4 h-4" /> Prev
				</a>
				<a
					href="/admin/payments?status={tab}&page={Math.min(pagination.totalPages, current + 1)}"
					class="flex items-center gap-1 rounded-lg border border-slate-700/60 px-3 py-1.5 text-slate-300 hover:text-white hover:border-orange-600/40 disabled:opacity-40 transition-colors"
					class:pointer-events-none={current >= pagination.totalPages}
				>
					Next <ChevronRight class="w-4 h-4" />
				</a>
			</div>
		</div>
	{/if}
</div>
