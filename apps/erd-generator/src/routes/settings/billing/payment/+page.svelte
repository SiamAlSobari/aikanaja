<script lang="ts">
	import { onMount } from 'svelte';
	import { Receipt, Loader2, ChevronLeft } from 'lucide-svelte';
	import { erdApi, type Payment } from '$lib/api/erd';

	let payments = $state<Payment[]>([]);
	let loading = $state(true);
	let error = $state('');

	const META: Record<string, { name: string }> = { free: { name: 'Free' }, pro: { name: 'Pro' }, team: { name: 'Team' } };

	onMount(async () => {
		try {
			const b = await erdApi.getBilling();
			payments = b.payments;
		} catch (e: any) {
			error = e.message || 'Gagal memuat';
		} finally {
			loading = false;
		}
	});

	function statusBadge(s: string) {
		if (s === 'verified') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
		if (s === 'pending') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
		return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
	}
	function fmt(d: string) {
		return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
	}
</script>

<div class="max-w-3xl mx-auto px-6 py-8 md:py-12">
	<div class="flex items-center gap-3 mb-8">
		<div class="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-600/20 flex items-center justify-center">
			<Receipt class="w-5 h-5 text-orange-500" />
		</div>
		<div>
			<h1 class="text-xl font-bold text-white">Riwayat Pembayaran</h1>
			<p class="text-xs text-slate-500">Semua transaksi upgrade plan</p>
		</div>
	</div>

	<a href="/settings/billing" class="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-white mb-5 transition-colors">
		<ChevronLeft class="w-3.5 h-3.5" /> Kembali ke Billing
	</a>

	{#if loading}
		<div class="flex justify-center py-12"><Loader2 class="w-6 h-6 animate-spin text-orange-500" /></div>
	{:else if error}
		<p class="text-sm text-rose-400 p-5 rounded-xl bg-rose-500/10 border border-rose-500/20">{error}</p>
	{:else if payments.length === 0}
		<p class="text-sm text-slate-600 p-8 rounded-xl bg-slate-900/30 border border-slate-800/50 text-center">Belum ada pembayaran.</p>
	{:else}
		<div class="space-y-2">
			{#each payments as p}
				<a href="/settings/billing/payment/{p.id}" class="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-orange-600/30 transition-all">
					<div class="flex items-center gap-3">
						<div class="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-white">{META[p.plan].name}</div>
						<div>
							<p class="text-sm font-medium text-white">Plan {META[p.plan].name}</p>
							<p class="text-[11px] text-slate-500">{fmt(p.createdAt)} · {p.method}</p>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<span class="px-2.5 py-1 rounded-full text-[11px] font-medium border {statusBadge(p.status)}">{p.status}</span>
						<span class="text-sm font-semibold text-slate-200">Rp {p.amount.toLocaleString('id-ID')}</span>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
