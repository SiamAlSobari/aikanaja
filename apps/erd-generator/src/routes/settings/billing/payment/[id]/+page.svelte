<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { Loader2, ChevronLeft, ImageUp, CheckCircle2, Clock, Wallet } from 'lucide-svelte';
	import { erdApi, type Payment } from '$lib/api/erd';
	import { api } from '$lib/api/client';
	import { addToast } from '$lib/stores/ui.store.svelte';

	const id = page.params.id;
	const DANA = '08826545202';
	const WA = 'https://wa.me/628826545202';
	const META: Record<string, { name: string; accent: string }> = {
		free: { name: 'Free', accent: 'slate' },
		pro: { name: 'Pro', accent: 'orange' },
		team: { name: 'Team', accent: 'violet' }
	};

	let payment = $state<Payment | null>(null);
	let loading = $state(true);
	let error = $state('');

	let proofUrl = $state('');
	let uploading = $state(false);
	let submitting = $state(false);

	onMount(async () => {
		try {
			const paymentId = id || '';
			const res: any = await erdApi.getPayment(paymentId);
			payment = res.data ?? res;
			proofUrl = payment?.proof ?? '';
		} catch (e: any) {
			error = e.message || 'Gagal memuat';
		} finally {
			loading = false;
		}
	});

	async function onFile(e: Event) {
		const file = (e.currentTarget as HTMLInputElement).files?.[0];
		if (!file) return;
		uploading = true;
		try {
			const dataUrl = await new Promise<string>((resolve, reject) => {
				const r = new FileReader();
				r.onload = () => resolve(r.result as string);
				r.onerror = reject;
				r.readAsDataURL(file);
			});
			const res = await api.post<{ data: { url: string } }>('/session/upload/avatar', { file: dataUrl });
			proofUrl = res.data.url;
			addToast('success', 'Bukti terunggah');
		} catch (e: any) {
			addToast('error', e.message || 'Gagal unggah');
		} finally {
			uploading = false;
			(e.currentTarget as HTMLInputElement).value = '';
		}
	}

	async function submit() {
		if (!proofUrl) return;
		submitting = true;
		try {
			await erdApi.uploadProof(id || '', proofUrl);
			addToast('success', 'Bukti dikirim, menunggu verifikasi');
			const res: any = await erdApi.getPayment(id || '');
			payment = res.data ?? res;
		} catch (e: any) {
			addToast('error', e.message || 'Gagal kirim');
		} finally {
			submitting = false;
		}
	}

	function fmt(d: string) {
		return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
	}
	function statusBadge(s: string) {
		if (s === 'verified') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
		if (s === 'pending') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
		return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
	}
</script>

<div class="max-w-2xl mx-auto px-6 py-8 md:py-12">
	<a href="/settings/billing/payment" class="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-white mb-5 transition-colors">
		<ChevronLeft class="w-3.5 h-3.5" /> Riwayat Pembayaran
	</a>

	{#if loading}
		<div class="flex justify-center py-12"><Loader2 class="w-6 h-6 animate-spin text-orange-500" /></div>
	{:else if error}
		<p class="text-sm text-rose-400 p-5 rounded-xl bg-rose-500/10 border border-rose-500/20">{error}</p>
	{:else if payment}
		<div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="w-12 h-12 rounded-xl bg-orange-600/15 flex items-center justify-center text-base font-bold text-orange-500">{META[payment.plan].name}</div>
					<div>
						<h1 class="text-lg font-bold text-white">Plan {META[payment.plan].name}</h1>
						<p class="text-xs text-slate-500">{fmt(payment.createdAt)}</p>
					</div>
				</div>
				<span class="px-3 py-1 rounded-full text-xs font-medium border {statusBadge(payment.status)}">{payment.status}</span>
			</div>

			<div class="mt-5 grid grid-cols-2 gap-3 text-sm">
				<div class="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60"><p class="text-[11px] text-slate-500">Jumlah</p><p class="font-semibold text-white mt-0.5">Rp {payment.amount.toLocaleString('id-ID')}</p></div>
				<div class="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60"><p class="text-[11px] text-slate-500">Metode</p><p class="font-semibold text-white mt-0.5 capitalize">{payment.method}</p></div>
			</div>
		</div>

		{#if payment.status === 'pending'}
			<!-- Transfer instructions -->
			<div class="mt-5 p-5 rounded-2xl bg-orange-600/[0.06] border border-orange-600/20">
				<h2 class="text-sm font-semibold text-white flex items-center gap-2"><Wallet class="w-4 h-4 text-orange-500" /> Cara Bayar</h2>
				<ol class="mt-3 space-y-2 text-sm text-slate-300 list-decimal list-inside">
					<li>Transfer <span class="font-semibold text-white">Rp {payment.amount.toLocaleString('id-ID')}</span> ke Dana <span class="font-mono text-orange-400">{DANA}</span></li>
					<li>Screenshot bukti transfer</li>
					<li>Upload bukti di bawah ini</li>
					<li>Kirim WA ke <a href={WA} target="_blank" rel="noreferrer" class="text-orange-400 hover:underline">{WA}</a> (opsional)</li>
				</ol>
			</div>

			<!-- Proof upload -->
			<div class="mt-5 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60">
				<h2 class="text-sm font-semibold text-white">Bukti Transfer</h2>
				{#if proofUrl}
					<img src={proofUrl} alt="bukti" class="mt-3 w-full max-w-xs rounded-xl border border-slate-800" />
				{/if}
				<div class="mt-3 flex flex-wrap items-center gap-3">
					<label class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-orange-400 hover:text-orange-300 bg-orange-600/10 hover:bg-orange-600/15 border border-orange-600/20 transition-all cursor-pointer">
						{#if uploading}<Loader2 class="w-3.5 h-3.5 animate-spin" />{:else}<ImageUp class="w-3.5 h-3.5" />{/if}
						{uploading ? 'Mengunggah…' : (proofUrl ? 'Ganti Bukti' : 'Upload Bukti')}
						<input type="file" accept="image/*" class="hidden" onchange={onFile} />
					</label>
					{#if proofUrl && !payment.proof}
						<button onclick={submit} disabled={submitting} class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-slate-950 text-sm font-bold shadow-lg shadow-orange-600/20 transition-all disabled:opacity-50">
							{#if submitting}<Loader2 class="w-4 h-4 animate-spin" />{:else}<CheckCircle2 class="w-4 h-4" />{/if} Kirim Bukti
						</button>
					{/if}
				</div>
				{#if payment.proof}
					<p class="mt-3 flex items-center gap-2 text-xs text-amber-400"><Clock class="w-3.5 h-3.5" /> Menunggu verifikasi admin (max 1x24 jam).</p>
				{/if}
			</div>
		{:else if payment.status === 'verified'}
			<div class="mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 flex items-center gap-2">
				<CheckCircle2 class="w-4 h-4" /> Pembayaran terverifikasi. Plan Anda aktif.
			</div>
		{:else}
			<div class="mt-5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400">
				Pembayaran ditolak. Silakan ajukan ulang upgrade.
			</div>
		{/if}
	{/if}
</div>
