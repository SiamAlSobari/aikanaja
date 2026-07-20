<script lang="ts">
	import { page } from '$app/state';
	import {
		Database,
		LayoutDashboard,
		FolderKanban,
		LayoutTemplate,
		Activity,
		Trash2,
		Settings,
		LogOut,
		Plus,
		ChevronLeft,
		ShieldCheck,
	} from 'lucide-svelte';
	import NewProjectModal from '$lib/components/features/project/NewProjectModal.svelte';
	import { openNewProject } from '$lib/stores/new-project.store.svelte';

	let { data, children } = $props();

	const user = $derived(data.user);

	const navItems = $derived([
		{ label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
		{ label: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
		{ label: 'Templates', href: '/dashboard/templates', icon: LayoutTemplate },
		{ label: 'Activity', href: '/dashboard/activity', icon: Activity },
		{ label: 'Trash', href: '/dashboard/trash', icon: Trash2 },
		...(user?.role === 'admin'
			? [{ label: 'Admin', href: '/admin', icon: ShieldCheck }]
			: []),
	]);

	const bottomItems = [
		{ label: 'Settings', href: '/settings', icon: Settings },
	];

	function isActive(href: string): boolean {
		if (href === '/dashboard') return page.url.pathname === '/dashboard';
		return page.url.pathname.startsWith(href);
	}

	let collapsed = $state(false);
	let mobileOpen = $state(false);
</script>

<div class="h-screen overflow-hidden bg-slate-950 text-slate-100 flex selection:bg-orange-600/30 selection:text-orange-300">
	<!-- Desktop Sidebar -->
	<aside
		class="hidden lg:flex flex-col {collapsed ? 'w-[76px]' : 'w-[264px]'} shrink-0 border-r border-slate-800/60 bg-slate-900/50 backdrop-blur-sm transition-all duration-300 relative z-30"
	>
		<!-- Sidebar glow -->
		<div class="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-orange-600/5 to-transparent pointer-events-none"></div>

		<!-- Logo -->
		<div class="relative flex items-center gap-3 px-5 h-16 border-b border-slate-800/60">
			<a href="/" class="flex items-center gap-3 group">
				<div class="w-9 h-9 rounded-xl bg-slate-950 border border-orange-600/30 flex items-center justify-center shadow-[0_0_20px_rgba(255,62,0,0.1)] group-hover:border-orange-600/50 transition-colors shrink-0">
					<Database class="w-4.5 h-4.5 text-orange-500" />
				</div>
				{#if !collapsed}
					<span class="text-sm font-bold text-white tracking-tight">Ai<span class="text-orange-500">KanAja</span></span>
				{/if}
			</a>
		</div>

		<!-- New Project -->
		<div class="relative px-4 pt-5 pb-3">
			<button
				onclick={openNewProject}
				class="group relative flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-slate-950 font-bold text-xs shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 transition-all active:scale-[0.98] overflow-hidden"
			>
				<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
				<Plus class="relative w-4 h-4" />
				{#if !collapsed}
					<span class="relative">New Project</span>
				{/if}
			</button>
		</div>

		<!-- Nav -->
		<nav class="relative flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
			{#if !collapsed}
				<p class="px-3 pt-3 pb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Menu</p>
			{/if}
			{#each navItems as item}
				{@const active = isActive(item.href)}
				<a
					href={item.href}
					class="flex items-center gap-3 {collapsed ? 'justify-center px-0' : 'px-3'} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
						{active
							? 'text-orange-400 bg-orange-600/10'
							: 'text-slate-400 hover:text-white hover:bg-slate-800/40'}"
				>
					{#if active}
						<div class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-orange-500"></div>
					{/if}
					<item.icon class="w-[18px] h-[18px] shrink-0 {active ? 'text-orange-500' : 'text-slate-500 group-hover:text-slate-300'}" />
					{#if !collapsed}
						<span>{item.label}</span>
					{/if}
					{#if collapsed}
						<div class="absolute left-full ml-2 px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
							{item.label}
						</div>
					{/if}
				</a>
			{/each}
		</nav>

		<!-- Bottom -->
		<div class="relative px-3 py-3 space-y-0.5 border-t border-slate-800/60">
			{#each bottomItems as item}
				{@const active = isActive(item.href)}
				<a
					href={item.href}
					class="flex items-center gap-3 {collapsed ? 'justify-center px-0' : 'px-3'} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
						{active
							? 'text-orange-400 bg-orange-600/10'
							: 'text-slate-400 hover:text-white hover:bg-slate-800/40'}"
				>
					<item.icon class="w-[18px] h-[18px] shrink-0 {active ? 'text-orange-500' : 'text-slate-500 group-hover:text-slate-300'}" />
					{#if !collapsed}
						<span>{item.label}</span>
					{:else}
						<div class="absolute left-full ml-2 px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
							{item.label}
						</div>
					{/if}
				</a>
			{/each}

			<button
				onclick={() => collapsed = !collapsed}
				class="flex items-center gap-3 {collapsed ? 'justify-center px-0' : 'px-3'} py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 transition-all w-full"
			>
				<ChevronLeft class="w-[18px] h-[18px] shrink-0 transition-transform duration-300 {collapsed ? 'rotate-180' : ''}" />
				{#if !collapsed}
					<span>Collapse</span>
				{/if}
			</button>
		</div>

		<!-- User -->
		<div class="relative px-4 py-4 border-t border-slate-800/60">
			<div class="flex items-center gap-3">
				{#if user?.avatar}
					<img src={user.avatar} alt="" class="w-9 h-9 rounded-xl object-cover border border-slate-800" />
				{:else}
					<div class="w-9 h-9 rounded-xl bg-orange-600/12 border border-orange-600/25 flex items-center justify-center text-xs font-bold text-orange-500 shrink-0">
						{user?.name?.charAt(0)?.toUpperCase() || '?'}
					</div>
				{/if}
				{#if !collapsed}
					<div class="flex-1 min-w-0">
						<p class="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
						<p class="text-[10px] text-slate-500 truncate">{user?.email || ''}</p>
					</div>
					<button
						onclick={() => { window.location.href = '/api/auth/logout'; }}
						class="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800/50 transition-colors"
						title="Logout"
					>
						<LogOut class="w-4 h-4" />
					</button>
				{/if}
			</div>
		</div>
	</aside>

	<!-- Mobile Header -->
	<header class="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 bg-slate-900/90 border-b border-slate-800/60 backdrop-blur-md">
		<button
			onclick={() => mobileOpen = !mobileOpen}
			class="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
		>
			<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
				{#if mobileOpen}
					<path d="M18 6L6 18M6 6l12 12"/>
				{:else}
					<path d="M4 7h16M4 12h16M4 17h16"/>
				{/if}
			</svg>
		</button>

		<a href="/" class="flex items-center gap-2">
			<div class="w-7 h-7 rounded-lg bg-slate-950 border border-orange-600/30 flex items-center justify-center">
				<Database class="w-3.5 h-3.5 text-orange-500" />
			</div>
			<span class="text-sm font-bold text-white">Ai<span class="text-orange-500">KanAja</span></span>
		</a>

		<button onclick={openNewProject} class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 text-xs font-bold text-slate-950 shadow-lg shadow-orange-600/20 transition-all active:scale-[0.98]">
			<Plus class="w-3.5 h-3.5" /> New
		</button>
	</header>

	<!-- Mobile Sidebar Overlay -->
	{#if mobileOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
		<div
			role="none"
			class="lg:hidden fixed inset-0 z-50"
			onclick={() => mobileOpen = false}
		>
			<div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
			<div
				role="none"
				class="absolute left-0 top-0 bottom-0 w-[280px] bg-slate-900/95 border-r border-slate-800/60 flex flex-col backdrop-blur-xl"
				onclick={(e) => e.stopPropagation()}
			>
				<!-- Logo -->
				<div class="flex items-center gap-3 px-5 h-14 border-b border-slate-800/60">
					<div class="w-8 h-8 rounded-lg bg-slate-950 border border-orange-600/30 flex items-center justify-center">
						<Database class="w-4 h-4 text-orange-500" />
					</div>
					<span class="text-sm font-bold text-white">Ai<span class="text-orange-500">KanAja</span></span>
				</div>

				<!-- New Project -->
				<div class="px-4 pt-4 pb-2">
					<button
						onclick={() => { mobileOpen = false; openNewProject(); }}
						class="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-orange-600 text-slate-950 font-bold text-xs transition-all active:scale-[0.98]"
					>
						<Plus class="w-4 h-4" /> New Project
					</button>
				</div>

				<!-- Nav -->
				<nav class="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
					<p class="px-3 pt-3 pb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Menu</p>
					{#each [...navItems, ...bottomItems] as item}
						{@const active = isActive(item.href)}
						<a
							href={item.href}
							onclick={() => mobileOpen = false}
							class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative
								{active
									? 'text-orange-400 bg-orange-600/10'
									: 'text-slate-400 hover:text-white hover:bg-slate-800/40'}"
						>
							{#if active}
								<div class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-orange-500"></div>
							{/if}
							<item.icon class="w-[18px] h-[18px] {active ? 'text-orange-500' : 'text-slate-500'}" />
							<span>{item.label}</span>
						</a>
					{/each}
				</nav>

				<!-- User -->
				<div class="px-4 py-4 border-t border-slate-800/60">
					<div class="flex items-center gap-3">
						<div class="w-9 h-9 rounded-xl bg-orange-600/12 border border-orange-600/25 flex items-center justify-center text-xs font-bold text-orange-500">
							{user?.name?.charAt(0)?.toUpperCase() || '?'}
						</div>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
							<p class="text-[10px] text-slate-500 truncate">{user?.email || ''}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Main Content -->
	<main class="flex-1 min-w-0 pt-14 lg:pt-0 overflow-y-auto overflow-x-hidden">
		{@render children()}
	</main>

	<NewProjectModal />
</div>
