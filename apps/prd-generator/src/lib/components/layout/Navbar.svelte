<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { FileText, Menu, X, ArrowRight } from 'lucide-svelte';
	import { base } from '$app/paths';

	let scrolled = $state(false);
	let mobileOpen = $state(false);

	const links = [
		{ label: 'Fitur', href: '#features' },
		{ label: 'Demo', href: '#demo' },
		{ label: 'FAQ', href: '#faq' }
	];

	onMount(() => {
		const onScroll = () => (scrolled = window.scrollY > 40);
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<nav
	class="fixed top-0 inset-x-0 z-50 transition-all duration-500 {scrolled
		? 'py-3'
		: 'py-5'}"
>
	<div
		class="max-w-6xl mx-auto px-5 flex items-center justify-between rounded-2xl transition-all duration-500 {scrolled
			? 'bg-slate-950/80 backdrop-blur-2xl border border-white/5 shadow-2xl shadow-black/40 px-6 py-3'
			: 'bg-transparent px-6 py-0'}"
	>
		<!-- Logo -->
		<a href="{base}/" class="flex items-center gap-2 group">
			<div
				class="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20 group-hover:shadow-orange-600/40 transition-shadow"
			>
				<FileText class="w-4 h-4 text-white" />
			</div>
			<span class="text-base font-bold text-white tracking-tight"
				>Ai<span class="text-orange-400">KanAja</span></span
			>
		</a>

		<!-- Center links: desktop only -->
		<div class="hidden md:flex items-center gap-1">
			{#each links as link}
				<a
					href={link.href}
					class="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
					>{link.label}</a
				>
			{/each}
		</div>

		<!-- Right -->
		<div class="flex items-center gap-3">
			<a
				href="{base}/try"
				class="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-orange-600/25"
			>
				Coba Gratis <ArrowRight class="w-4 h-4" />
			</a>

			<button
				onclick={() => (mobileOpen = !mobileOpen)}
				class="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
				aria-label="Toggle menu"
			>
				{#if mobileOpen}<X class="w-5 h-5" />{:else}<Menu class="w-5 h-5" />{/if}
			</button>
		</div>
	</div>

	<!-- Mobile drawer -->
	{#if mobileOpen}
		<div
			transition:fly={{ y: -8, duration: 200 }}
			class="md:hidden max-w-6xl mx-auto mt-2 mx-5 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-white/5 shadow-2xl overflow-hidden"
		>
			{#each links as link}
				<a
					href={link.href}
					onclick={() => (mobileOpen = false)}
					class="block px-6 py-4 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
					>{link.label}</a
				>
			{/each}
			<a
				href="{base}/try"
				onclick={() => (mobileOpen = false)}
				class="block px-6 py-4 text-sm font-semibold text-orange-400 hover:bg-orange-500/10 transition-colors"
				>Coba Gratis</a
			>
		</div>
	{/if}
</nav>
