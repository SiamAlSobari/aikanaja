<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { Database, Menu, X } from 'lucide-svelte';
	import { base } from '$app/paths';
	import { motion } from '@humanspeak/svelte-motion';

	let user = $state<{ name?: string; email?: string } | null>(null);
	let mobileOpen = $state(false);

	const navLinks = [
		{ label: 'Fitur', href: '#features' },
		{ label: 'Komparasi', href: '#comparison' },
		{ label: 'Integrasi', href: '#orbit' },
		{ label: 'FAQ', href: '#faq' }
	];

	onMount(async () => {
		try {
			const res = await fetch('/api/session', { credentials: 'include' });
			if (res.ok) {
				const j = await res.json();
				user = j.data ?? null;
			}
		} catch {
			/* tamu — biarkan null */
		}
	});
</script>

<div
	class="fixed left-0 right-0 z-50 px-3 sm:px-4 top-3 transition-all duration-300 ease-out"
>
	<header
		class="mx-auto flex items-center justify-between max-w-5xl rounded-2xl border border-white/10 bg-slate-900/70 px-4 sm:px-5 h-14 backdrop-blur-xl shadow-xl shadow-black/30 transition-all duration-300 ease-out"
	>
		<!-- Logo -->
		<a href="{base}/" class="flex items-center gap-2.5 group shrink-0">
			<div class="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/5 border border-orange-500/30 shadow-[0_0_18px_rgba(249,115,22,0.18)] group-hover:shadow-[0_0_22px_rgba(249,115,22,0.28)] transition-all">
				<Database class="w-4.5 h-4.5 text-orange-500" />
			</div>
			<span class="text-lg font-bold tracking-tight text-white">Ai<span class="text-orange-500">KanAja</span></span>
		</a>

		<!-- Desktop nav -->
		<nav class="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
			{#each navLinks as link}
				<a href={link.href} class="hover:text-white transition-colors relative after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-300">{link.label}</a>
			{/each}
		</nav>

		<!-- Right actions -->
		<div class="flex items-center gap-2.5 shrink-0">
			{#if user}
				<motion.a
					href="{base}/dashboard"
					whileHover={{ scale: 1.04 }}
					whileTap={{ scale: 0.97 }}
					transition={{ type: 'spring', stiffness: 400, damping: 17 }}
					class="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-950 bg-orange-500 hover:bg-orange-400 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
				>
					Dashboard
				</motion.a>
			{:else}
				<motion.a
					href="{base}/auth/login"
					whileHover={{ scale: 1.04 }}
					whileTap={{ scale: 0.97 }}
					transition={{ type: 'spring', stiffness: 400, damping: 17 }}
					class="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/25 hover:bg-orange-500/20 hover:border-orange-500/40 transition-all"
				>
					Masuk
				</motion.a>
			{/if}

			<!-- Mobile toggle -->
			<button
				onclick={() => (mobileOpen = !mobileOpen)}
				class="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
				aria-label="Menu"
			>
				{#if mobileOpen}<X class="w-5 h-5" />{:else}<Menu class="w-5 h-5" />{/if}
			</button>
		</div>
	</header>

	<!-- Mobile menu -->
	{#if mobileOpen}
		<div
			transition:fly={{ y: -6, duration: 200 }}
			class="md:hidden mx-3 sm:mx-4 mt-2 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-xl shadow-black/40 p-2 overflow-hidden"
		>
			{#each navLinks as link}
				<a
					href={link.href}
					onclick={() => (mobileOpen = false)}
					class="block px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
				>{link.label}</a>
			{/each}
		</div>
	{/if}
</div>
