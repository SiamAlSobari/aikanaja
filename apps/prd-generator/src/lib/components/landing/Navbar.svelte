<script lang="ts">
	import { FileText, Menu, X } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let scrolled = $state(false);
	let mobileOpen = $state(false);

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 20;
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	let navClass = $derived(
		scrolled
			? 'max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5 rounded-2xl bg-slate-950/90 backdrop-blur-2xl border border-white/[0.08] shadow-2xl transition-all duration-300'
			: 'max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5 rounded-2xl bg-slate-950/40 backdrop-blur-xl border border-white/[0.04] transition-all duration-300'
	);
</script>

<header class="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 transition-all duration-300">
	<nav class={navClass}>

		<!-- Brand -->
		<a href="/" class="flex items-center gap-3 group">
			<div class="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 p-[1px] shadow-lg shadow-orange-500/20">
				<div class="w-full h-full bg-[#0a0e17] rounded-[11px] flex items-center justify-center text-orange-400">
					<FileText class="w-4 h-4" />
				</div>
			</div>
			<div class="flex flex-col">
				<span class="font-extrabold text-lg text-white tracking-tight leading-none">
					AiKanAja <span class="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">PRD</span>
				</span>
				<span class="text-[9px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">Enterprise AI</span>
			</div>
		</a>

		<!-- Desktop Nav -->
		<div class="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
			<a href="#fitur" class="hover:text-orange-400 transition-colors">Fitur</a>
			<a href="#studio" class="hover:text-orange-400 transition-colors">Studio</a>
			<a href="#keamanan" class="hover:text-orange-400 transition-colors">Keamanan</a>
		</div>

		<!-- Desktop CTA -->
		<div class="hidden sm:flex items-center gap-3">
			<a
				href="/try"
				class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] border border-white/[0.06] transition-all"
			>
				Try Mode
			</a>
			<a
				href="/dashboard"
				class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-300 hover:to-amber-300 shadow-lg shadow-orange-500/20 transition-all active:scale-95"
			>
				Dashboard
			</a>
		</div>

		<!-- Mobile toggle -->
		<button
			onclick={() => mobileOpen = !mobileOpen}
			class="md:hidden p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-slate-200"
		>
			{#if mobileOpen}<X class="w-5 h-5" />{:else}<Menu class="w-5 h-5" />{/if}
		</button>
	</nav>

	<!-- Mobile menu -->
	{#if mobileOpen}
		<div class="md:hidden mt-3 max-w-6xl mx-auto p-5 rounded-2xl bg-[#0a0e17]/95 backdrop-blur-3xl border border-white/[0.08] space-y-3 shadow-2xl">
			<a href="#fitur" onclick={() => mobileOpen = false} class="block text-sm text-slate-200">Fitur</a>
			<a href="#studio" onclick={() => mobileOpen = false} class="block text-sm text-slate-200">Studio</a>
			<a href="#keamanan" onclick={() => mobileOpen = false} class="block text-sm text-slate-200">Keamanan</a>
			<div class="pt-2 border-t border-white/[0.06] flex flex-col gap-2">
				<a href="/try" class="w-full text-center py-2 text-xs font-semibold text-slate-200 bg-white/[0.04] rounded-xl">Try Mode</a>
				<a href="/dashboard" class="w-full text-center py-2 text-xs font-bold text-slate-950 bg-orange-500 rounded-xl">Dashboard</a>
			</div>
		</div>
	{/if}
</header>
