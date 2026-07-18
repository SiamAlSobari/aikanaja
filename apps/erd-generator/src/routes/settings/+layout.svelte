<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import {
		User,
		UserCog,
		KeyRound,
		Palette,
		Bell,
		CreditCard,
		Database,
		ArrowLeft,
		ChevronDown
	} from 'lucide-svelte';

	let { data, children } = $props();

	const navItems = [
		{ label: 'Profile', href: '/settings/profile', icon: User },
		{ label: 'Account', href: '/settings/account', icon: UserCog },
		{ label: 'API Keys', href: '/settings/api-keys', icon: KeyRound },
		{ label: 'Appearance', href: '/settings/appearance', icon: Palette },
		{ label: 'Notifications', href: '/settings/notifications', icon: Bell },
		{ label: 'Billing', href: '/settings/billing', icon: CreditCard }
	];

	function isActive(href: string): boolean {
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
	}

	let mobileTab = $state(navItems[0].href);
	$effect(() => {
		if (!navItems.some((n) => n.href === page.url.pathname) && page.url.pathname !== '/settings') {
			mobileTab = navItems[0].href;
		}
	});

	function onMobileChange(e: Event) {
		goto((e.currentTarget as HTMLSelectElement).value);
	}
</script>

<div class="min-h-screen bg-slate-950 text-slate-100 flex selection:bg-orange-600/30 selection:text-orange-300">
	<!-- Desktop Sidebar -->
	<aside class="hidden md:flex flex-col w-[248px] shrink-0 border-r border-slate-800/60 bg-slate-900/40 backdrop-blur-sm">
		<!-- Header -->
		<div class="flex items-center gap-3 px-5 h-16 border-b border-slate-800/60">
			<a href="/dashboard" class="flex items-center gap-2.5 group">
				<div class="w-8 h-8 rounded-xl bg-slate-950 border border-orange-600/30 flex items-center justify-center shadow-[0_0_18px_rgba(249,115,22,0.12)] group-hover:border-orange-600/50 transition-colors">
					<Database class="w-4 h-4 text-orange-500" />
				</div>
				<span class="text-sm font-bold text-white tracking-tight">Settings</span>
			</a>
		</div>

		<!-- Back to dashboard -->
		<div class="px-4 pt-4 pb-2">
			<a
				href="/dashboard"
				class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-white hover:bg-slate-800/40 transition-all"
			>
				<ArrowLeft class="w-3.5 h-3.5" /> Back to Dashboard
			</a>
		</div>

		<!-- Nav -->
		<nav class="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
			<p class="px-3 pt-3 pb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Preferences</p>
			{#each navItems as item}
				{@const active = isActive(item.href)}
				<a
					href={item.href}
					class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
						{active
							? 'text-orange-400 bg-orange-600/10'
							: 'text-slate-400 hover:text-white hover:bg-slate-800/40'}"
				>
					{#if active}
						<div class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-orange-500"></div>
					{/if}
					<item.icon class="w-[18px] h-[18px] shrink-0 {active ? 'text-orange-500' : 'text-slate-500 group-hover:text-slate-300'}" />
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>

		<!-- User -->
		<div class="px-4 py-4 border-t border-slate-800/60">
			<div class="flex items-center gap-3">
				{#if data.user?.avatar}
					<img src={data.user.avatar} alt="" class="w-9 h-9 rounded-xl object-cover border border-slate-800" />
				{:else}
					<div class="w-9 h-9 rounded-xl bg-orange-600/12 border border-orange-600/25 flex items-center justify-center text-xs font-bold text-orange-500 shrink-0">
						{data.user?.name?.charAt(0)?.toUpperCase() || '?'}
					</div>
				{/if}
				<div class="flex-1 min-w-0">
					<p class="text-sm font-semibold text-white truncate">{data.user?.name || 'User'}</p>
					<p class="text-[10px] text-slate-500 truncate">{data.user?.email || ''}</p>
				</div>
			</div>
		</div>
	</aside>

	<!-- Mobile Topbar -->
	<header class="md:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center gap-3 px-4 bg-slate-900/90 border-b border-slate-800/60 backdrop-blur-md">
		<a href="/dashboard" class="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
			<ArrowLeft class="w-5 h-5" />
		</a>
		<div class="relative flex-1">
			<select
				bind:value={mobileTab}
				onchange={onMobileChange}
				class="w-full appearance-none bg-slate-950 border border-slate-800 text-sm text-white font-medium rounded-xl pl-3.5 pr-9 py-2 focus:outline-none focus:border-orange-600/40 cursor-pointer"
			>
				{#each navItems as item}
					<option value={item.href}>{item.label}</option>
				{/each}
			</select>
			<ChevronDown class="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
		</div>
	</header>

	<!-- Content -->
	<main class="flex-1 min-w-0 pt-14 md:pt-0 overflow-x-hidden">
		{@render children()}
	</main>
</div>
