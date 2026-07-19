<script lang="ts">
	import { page } from '$app/state';
	import { AlertTriangle, Home, ArrowLeft } from 'lucide-svelte';

	const status = $derived(page.status);
	const message = $derived(page.error?.message ?? 'Terjadi kesalahan');
</script>

<div class="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
	<div class="text-center max-w-md">
		<div class="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
			<AlertTriangle class="w-8 h-8 text-rose-400" />
		</div>
		<h1 class="text-5xl font-bold text-white">{status}</h1>
		<p class="mt-3 text-slate-400">{message}</p>
		<div class="mt-8 flex items-center justify-center gap-3">
			<a href="/" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-slate-950 text-sm font-bold shadow-lg shadow-orange-600/20 transition-all active:scale-[0.98]">
				<Home class="w-4 h-4" /> Beranda
			</a>
			<button onclick={() => history.back()} class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-all">
				<ArrowLeft class="w-4 h-4" /> Kembali
			</button>
		</div>
	</div>
</div>
