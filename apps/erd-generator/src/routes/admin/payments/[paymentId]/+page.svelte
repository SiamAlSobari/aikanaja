<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Check, X, ChevronLeft, ShieldCheck, ImageOff } from 'lucide-svelte';
	import AdminHeader from '$lib/components/features/admin/AdminHeader.svelte';
	import { adminApi, type AdminPayment } from '$lib/api/admin';
	import { addToast } from '$lib/stores/ui.store.svelte';

	let { data } = $props();
	const payment = $derived(data.payment as AdminPayment | null);

	let busy = $state(false);

	function planTone(plan: string) {
		if (plan === 'team') return 'text-violet-300';
		if (plan === 'pro') return 'text-emerald-300';
		return 'text-slate-300';
	}

	function statusBadge(status: string) {
		if (status === 'verified') return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
		if (status === 'pending') return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
		return 'bg-red-500/15 text-red-300 border-red-500/30';
	}

	function fmtDate(iso: string) {
		return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
	}

	async function act(fn: () => Promise<unknown>, successMsg: string) {
		if (!payment) return;
		busy = true;
		try {
			await fn();
			addToast('success', successMsg);
			goto(page.url.pathname, { invalidateAll: true });
		} catch (e: any) {
			addToast('error', e.message || 'Gagal memproses');
		} finally {
			busy = false;
		}
	}
</script>

<AdminHeader title="Detail Pembayaran" subtitle="Review bukti transfer & terapkan plan">
	<a
		href="/admin/payments?status={payment?.status || 'pending'}"
		class="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:border-orange-600/40 transition-colors"
	>
		<ChevronLeft class="w-4 h-4" /> Payments
	</a>
</AdminHeader>

<div class="px-6 lg:px-10 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
	<!-- Info -->
	<div class="lg:col-span-2 space-y-5">
		<div class="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<div>
					<p class="text-[11px] uppercase tracking-wider text-slate-500">Plan Diminta</p>
					<p class="mt-1 text-2xl font-bold capitalize {planTone(payment?.plan ?? '')}">{payment?.plan}</p>
				</div>
				<span class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize {statusBadge(payment?.status ?? '')}">
					{payment?.status}
				</span>
			</div>

			<div class="mt-5 grid grid-cols-2 gap-4 text-sm">
				<div>
					<p class="text-[11px] uppercase tracking-wider text-slate-500">Jumlah</p>
					<p class="mt-0.5 font-medium text-white">{payment?.amount ? 'Rp ' + payment.amount.toLocaleString('id-ID') : '—'}</p>
				</div>
				<div>
					<p class="text-[11px] uppercase tracking-wider text-slate-500">Metode</p>
					<p class="mt-0.5 font-medium text-white capitalize">{payment?.method || '—'}</p>
				</div>
				<div>
					<p class="text-[11px] uppercase tracking-wider text-slate-500">Dibuat</p>
					<p class="mt-0.5 text-slate-300">{payment ? fmtDate(payment.createdAt) : ''}</p>
				</div>
				<div>
					<p class="text-[11px] uppercase tracking-wider text-slate-500">Diverifikasi</p>
					<p class="mt-0.5 text-slate-300">{payment?.verifiedAt ? fmtDate(payment.verifiedAt) : '—'}</p>
				</div>
			</div>
		</div>

		<!-- Proof -->
		<div class="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6">
			<h2 class="text-sm font-semibold text-white">Bukti Transfer</h2>
			{#if payment?.proof}
				{#if payment.proof.startsWith('data:') || payment.proof.startsWith('http')}
					<img src={payment.proof} alt="Bukti transfer" class="mt-3 max-h-80 w-full rounded-xl border border-slate-800 object-contain bg-slate-950" />
				{:else}
					<a
						href={payment.proof}
						target="_blank"
						rel="noreferrer"
						class="mt-3 inline-block break-all rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-orange-400 hover:underline"
					>
						{payment.proof}
					</a>
				{/if}
			{:else}
				<div class="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 px-4 py-6 text-sm text-slate-500">
					<ImageOff class="w-4 h-4" /> Belum ada bukti transfer.
				</div>
			{/if}
		</div>
	</div>

	<!-- User + Actions -->
	<div class="space-y-5">
		<div class="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6">
			<h2 class="text-sm font-semibold text-white">User</h2>
			<div class="mt-3 flex items-center gap-3">
				<div class="w-11 h-11 rounded-xl bg-orange-600/12 border border-orange-600/25 flex items-center justify-center text-sm font-bold text-orange-500">
					{payment?.user?.name?.charAt(0)?.toUpperCase() || '?'}
				</div>
				<div class="min-w-0">
					<p class="font-medium text-white truncate flex items-center gap-1.5">
						{payment?.user?.name}
						{#if (payment?.user as any)?.role === 'admin'}<ShieldCheck class="w-3.5 h-3.5 text-orange-500" />{/if}
					</p>
					<p class="text-[11px] text-slate-500 truncate">{payment?.user?.email}</p>
				</div>
			</div>
			{#if payment?.user?.id}
				<a
					href="/admin/users/{payment.user.id}"
					class="mt-4 block rounded-xl border border-slate-700 px-4 py-2.5 text-center text-xs font-semibold text-slate-200 hover:border-orange-600/40 hover:bg-slate-800/50 transition-colors"
				>
					Lihat Profil User
				</a>
			{/if}
		</div>

		{#if payment?.status === 'pending'}
			<div class="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6">
				<h2 class="text-sm font-semibold text-white">Tindakan</h2>
				<p class="mt-1 text-[11px] text-slate-500">Approve akan menerapkan plan <span class="capitalize font-semibold text-orange-400">{payment.plan}</span> & akses unlimited.</p>
				<div class="mt-4 flex flex-col gap-2">
					<button
						onclick={() => act(() => adminApi.verifyPayment(payment.id), 'Pembayaran diverifikasi & plan diterapkan')}
						disabled={busy}
						class="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-40 transition-colors"
					>
						{#if busy}<span class="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>{:else}<Check class="w-4 h-4" />{/if}
						Approve & Apply
					</button>
					<button
						onclick={() => act(() => adminApi.rejectPayment(payment.id), 'Pembayaran ditolak')}
						disabled={busy}
						class="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-40 transition-colors"
					>
						<X class="w-4 h-4" /> Reject
					</button>
				</div>
			</div>
		{:else}
			<div class="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6 text-center">
				<p class="text-sm text-slate-400">Pembayaran ini sudah <span class="font-semibold capitalize">{payment?.status}</span>.</p>
				<p class="mt-1 text-[11px] text-slate-500">Tidak ada tindakan tersedia.</p>
			</div>
		{/if}
	</div>
</div>
