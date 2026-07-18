<script lang="ts">
	import { Database, ArrowRight } from 'lucide-svelte';
	import { base } from '$app/paths';

	let { isScrolled }: { isScrolled: boolean } = $props();
</script>

<div
	class="fixed left-0 right-0 z-50 transition-all duration-200 ease-out {isScrolled
		? 'top-2 px-4 py-0'
		: 'top-0 px-0 py-0'}"
>
	<header
		class="mx-auto transition-all duration-200 ease-out will-change-transform {isScrolled
			? 'max-w-4xl rounded-full border border-orange-500/20 bg-slate-900/80 backdrop-blur-md px-6 shadow-xl shadow-orange-500/5'
			: 'max-w-full rounded-none border-b border-transparent bg-transparent px-6'} h-16 flex items-center justify-between"
	>
		<div class="flex items-center gap-3">
			<div
				class="relative flex items-center justify-center w-9 h-9 rounded-full bg-slate-900 border border-orange-600/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
			>
				<Database class="w-4.5 h-4.5 text-orange-500 animate-pulse" />
			</div>
			<span class="text-lg font-bold tracking-tight text-white"
				>Schema<span class="text-orange-500">Flow</span></span
			>
		</div>

		<nav
			class="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-400"
		>
			<a href="#features" class="hover:text-orange-500 transition-colors">Fitur Utama</a>
			<a href="#comparison" class="hover:text-orange-500 transition-colors">Komparasi</a>
			<a href="#orbit" class="hover:text-orange-500 transition-colors">Integrasi</a>
			<a href="#faq" class="hover:text-orange-500 transition-colors">Faq</a>
		</nav>

		<a
			href="{base}/try"
			class="relative overflow-hidden rounded-full px-5 py-2 text-xs font-bold text-slate-100 bg-slate-950 border border-orange-600/30 shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:border-orange-500 transition-all duration-350 flex items-center gap-1.5 active:scale-95"
		>
			Coba Gratis <ArrowRight class="w-3.5 h-3.5 text-orange-500" />
		</a>
	</header>
</div>
