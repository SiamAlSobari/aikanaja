<script lang="ts">
	import { loginWithGoogle } from '$lib/stores/auth.store.svelte';
	import { Sparkles, ArrowRight, Zap, Shield, Layers } from 'lucide-svelte';

	let isLoading = $state(false);

	async function handleLogin() {
		isLoading = true;
		await loginWithGoogle();
		isLoading = false;
	}
</script>

<svelte:head>
	<title>Login — AiKanAja</title>
</svelte:head>

<div class="space-y-7">
	<!-- Header -->
	<div class="space-y-3">
		<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-600/10 border border-orange-600/25 text-[11px] font-medium text-orange-400 animate-badge-glow">
			<Sparkles class="w-3.5 h-3.5 animate-sparkle" /> AI-Driven Database Modeling
		</div>
		<h1 class="text-2xl font-bold text-white tracking-tight">
			Masuk ke <span class="text-orange-500">Schema</span>Flow
		</h1>
		<p class="text-sm text-slate-400 leading-relaxed">
			Buat, edit, dan ekspor ERD secara visual dengan bantuan AI.
		</p>
	</div>

	<!-- Google Login Button -->
	<button
		onclick={handleLogin}
		disabled={isLoading}
		class="group relative w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl
			bg-slate-800/60 hover:bg-slate-800 text-slate-200 font-semibold text-sm
			border border-slate-700/60 hover:border-orange-600/40
			transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
			active:scale-[0.98] overflow-hidden"
	>
		<!-- Hover glow -->
		<div class="absolute inset-0 bg-gradient-to-r from-orange-600/0 via-orange-600/10 to-orange-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

		{#if isLoading}
			<span class="relative w-5 h-5 border-2 border-orange-500/40 border-t-orange-500 rounded-full animate-spin"></span>
			<span class="relative">Mengalihkan...</span>
		{:else}
			<svg class="relative w-5 h-5 shrink-0" viewBox="0 0 24 24">
				<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
				<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
				<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
				<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
			</svg>
			<span class="relative">Masuk dengan Google</span>
			<ArrowRight class="relative w-4 h-4 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-300" />
		{/if}
	</button>

	<!-- Divider -->
	<div class="flex items-center gap-3">
		<span class="h-px flex-1 bg-gradient-to-r from-transparent to-slate-800"></span>
		<span class="text-[10px] text-slate-600 uppercase tracking-widest font-medium">atau</span>
		<span class="h-px flex-1 bg-gradient-to-l from-transparent to-slate-800"></span>
	</div>

	<!-- Guest CTA -->
	<a
		href="/try"
		class="group flex items-center justify-between w-full px-5 py-4 rounded-xl
			bg-gradient-to-r from-slate-800/40 to-slate-800/20 hover:from-slate-800/60 hover:to-slate-800/40
			border border-slate-800/60 hover:border-orange-600/20
			transition-all duration-300"
	>
		<div class="flex items-center gap-3">
			<div class="relative flex items-center justify-center w-9 h-9 rounded-lg bg-orange-600/10 border border-orange-600/20 group-hover:border-orange-600/40 group-hover:shadow-[0_0_15px_rgba(255,62,0,0.1)] transition-all duration-300">
				<Zap class="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
			</div>
			<div class="text-left">
				<p class="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">Coba Gratis</p>
				<p class="text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors">Tanpa login, 1x generate</p>
			</div>
		</div>
		<ArrowRight class="w-4 h-4 text-slate-600 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-300" />
	</a>

	<!-- Features mini -->
	<div class="grid grid-cols-3 gap-3 pt-1">
		{#each [
			{ icon: Zap, label: 'AI Generate', delay: '0.6s' },
			{ icon: Layers, label: 'Visual ERD', delay: '0.7s' },
			{ icon: Shield, label: 'Export SQL', delay: '0.8s' }
		] as feat}
			<div
				class="group flex flex-col items-center gap-1.5 py-3 rounded-lg
					bg-slate-800/20 hover:bg-slate-800/40 border border-slate-800/40 hover:border-slate-700/50
					transition-all duration-300 cursor-default animate-fade-in-up"
				style="animation-delay: {feat.delay};"
			>
				<feat.icon class="w-4 h-4 text-slate-500 group-hover:text-orange-500 transition-colors duration-300" />
				<span class="text-[10px] text-slate-500 group-hover:text-slate-400 font-medium transition-colors">{feat.label}</span>
			</div>
		{/each}
	</div>

	<!-- Terms -->
	<p class="text-center text-[11px] text-slate-600 leading-relaxed pt-1">
		Dengan masuk, Anda menyetujui <a href="/" class="text-slate-500 hover:text-orange-500 transition-colors">Syarat & Ketentuan</a>
		dan <a href="/" class="text-slate-500 hover:text-orange-500 transition-colors">Kebijakan Privasi</a>.
	</p>
</div>

<style>
	@keyframes badge-glow {
		0%, 100% { box-shadow: 0 0 0 0 rgba(255, 62, 0, 0); }
		50% { box-shadow: 0 0 12px 0 rgba(255, 62, 0, 0.1); }
	}
	.animate-badge-glow { animation: badge-glow 3s ease-in-out infinite; }

	@keyframes sparkle {
		0%, 100% { transform: scale(1) rotate(0deg); }
		50% { transform: scale(1.2) rotate(15deg); }
	}
	:global(.animate-sparkle) { animation: sparkle 2s ease-in-out infinite; }

	@keyframes fade-in-up {
		from { opacity: 0; transform: translateY(8px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.animate-fade-in-up {
		opacity: 0;
		animation: fade-in-up 0.5s ease-out forwards;
	}
</style>
