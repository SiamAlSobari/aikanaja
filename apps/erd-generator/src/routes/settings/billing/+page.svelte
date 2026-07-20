<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { CreditCard, Check, Loader2, ArrowUpRight, Receipt } from 'lucide-svelte';
	import type { BillingInfo, PlanTier } from '$lib/api/erd';
	import { erdApi } from '$lib/api/erd';
	import { addToast } from '$lib/stores/ui.store.svelte';

	let { data }: { data: { billing: BillingInfo | null } } = $props();

	const PLAN_META: Record<PlanTier, { name: string; price: string; tables: string; accent: string }> = {
		free: { name: 'Free', price: 'Rp 0', tables: '5 generate', accent: 'slate' },
		pro: { name: 'Pro', price: 'Rp 7.000/bln', tables: '20 generate', accent: 'orange' },
		team: { name: 'Team', price: 'Rp 15.000/bln', tables: '50 generate', accent: 'violet' }
	};

	let billing = $derived(data.billing);
	let plan = $derived(billing?.plan ?? 'free');
	let meta = $derived(PLAN_META[plan]);
	let usage = $derived(billing?.usage);
	let unlimited = $derived(!usage || usage.limit === -1);
	let pct = $derived(usage && usage.limit > 0 ? Math.min(100, Math.round((usage.count / usage.limit) * 100)) : 0);

	let cancelling = $state(false);
	async function cancel() {
		if (!confirm('Batalkan langganan? Anda kembali ke plan Free.')) return;
		cancelling = true;
		try {
			await erdApi.cancelSubscription();
			addToast('success', 'Langganan dibatalkan');
			await invalidateAll();
		} catch (e: any) {
			addToast('error', e.message || 'Gagal batalkan');
		} finally {
			cancelling = false;
		}
	}

	function fmt(date: string) {
		return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
	}
	function statusBadge(s: string) {
		if (s === 'verified') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
		if (s === 'pending') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
		return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
	}
</script>

<div class="max-w-3xl mx-auto px-6 py-8 md:py-12">
	<div class="flex items-center gap-3 mb-8">
		<div class="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-600/20 flex items-center justify-center">
			<CreditCard class="w-5 h-5 text-orange-500" />
		</div>
		<div>
			<h1 class="text-xl font-bold text-white">Billing</h1>
			<p class="text-xs text-slate-500">Kelola plan dan langganan Anda</p>
		</div>
	</div>

	{#if !billing}
		<div class="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-center text-slate-500 text-sm">
			Gagal memuat info billing.
		</div>
	{:else}
		<!-- Plan card -->
		<div class="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-orange-600/15 to-slate-900/60 border border-orange-600/20">
			<div class="flex flex-wrap items-start justify-between gap-4">
				<div>
					<p class="text-[11px] font-semibold uppercase tracking-widest text-orange-400/80">Plan Aktif</p>
					<h2 class="mt-1 text-2xl font-bold text-white">{meta.name}</h2>
					<p class="text-sm text-slate-400 mt-0.5">{meta.price} · {meta.tables}</p>
				</div>
				<span class="px-3 py-1 rounded-full text-xs font-medium border {plan === 'free' ? 'text-slate-400 bg-slate-500/10 border-slate-500/20' : 'text-orange-400 bg-orange-500/10 border-orange-500/20'}">
					{billing.status}
				</span>
			</div>

			<!-- Usage -->
			<div class="mt-5">
				<div class="flex items-center justify-between text-xs mb-1.5">
					<span class="text-slate-400">Penggunaan tabel</span>
					<span class="text-slate-300 font-medium">{unlimited ? 'Unlimited' : `${usage.count} / ${usage.limit}`}</span>
				</div>
				<div class="h-2 rounded-full bg-slate-800 overflow-hidden">
					<div class="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all" style="width:{unlimited ? 100 : pct}%"></div>
				</div>
			</div>

			<div class="mt-6 flex flex-wrap gap-3">
				{#if plan === 'free'}
					<a href="/settings/billing/upgrade" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-slate-950 text-sm font-bold shadow-lg shadow-orange-600/20 transition-all active:scale-[0.98]">
						<ArrowUpRight class="w-4 h-4" /> Upgrade Plan
					</a>
				{:else}
					<a href="/settings/billing/upgrade" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-all">
						<ArrowUpRight class="w-4 h-4" /> Ganti Plan
					</a>
					<button onclick={cancel} disabled={cancelling} class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/15 text-sm font-medium border border-rose-500/20 transition-all disabled:opacity-50">
						{#if cancelling}<Loader2 class="w-4 h-4 animate-spin" />{:else}Batalkan Langganan{/if}
					</button>
				{/if}
			</div>
		</div>

		<!-- Payment history -->
		<div class="mt-8">
			<div class="flex items-center justify-between mb-3">
				<h3 class="text-sm font-semibold text-white flex items-center gap-2"><Receipt class="w-4 h-4 text-slate-500" /> Riwayat Pembayaran</h3>
				<a href="/settings/billing/payment" class="text-xs text-orange-400 hover:text-orange-300">Lihat semua</a>
			</div>
			{#if billing.payments.length === 0}
				<p class="text-sm text-slate-600 p-5 rounded-xl bg-slate-900/30 border border-slate-800/50 text-center">Belum ada pembayaran.</p>
			{:else}
				<div class="space-y-2">
					{#each billing.payments.slice(0, 4) as p}
						<a href="/settings/billing/payment/{p.id}" class="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-orange-600/30 transition-all">
							<div class="flex items-center gap-3">
								<div class="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-white">{PLAN_META[p.plan].name}</div>
								<div>
									<p class="text-sm font-medium text-white">Plan {PLAN_META[p.plan].name}</p>
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
	{/if}
</div>
