<script lang="ts">
	import { page } from '$app/state';
	import {
		Database,
		LayoutDashboard,
		Users,
		FolderKanban,
		CreditCard,
		ShieldCheck,
		LogOut,
		ChevronLeft,
		ArrowLeft
	} from 'lucide-svelte';

	let { data, children } = $props();

	const user = $derived(data.user);

	const navItems = [
		{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
		{ label: 'Users', href: '/admin/users', icon: Users },
		{ label: 'Projects', href: '/admin/projects', icon: FolderKanban },
		{ label: 'Payments', href: '/admin/payments', icon: CreditCard },
	];

	function isActive(href: string): boolean {
		if (href === '/admin') return page.url.pathname === '/admin';
		return page.url.pathname.startsWith(href);
	}

	let collapsed = $state(false);
</script>

<div class="h-screen overflow-hidden bg-slate-950 text-slate-100 flex selection:bg-orange-600/30 selection:text-orange-300">
	<aside
		class="hidden lg:flex flex-col {collapsed ? 'w-[76px]' : 'w-[264px]'} shrink-0 border-r border-slate-800/60 bg-slate-900/50 backdrop-blur-sm transition-all duration-300 relative z-30"
	>
		<div class="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-orange-600/5 to-transparent pointer-events-none"></div>

		<div class="relative flex items-center gap-3 px-5 h-16 border-b border-slate-800/60">
			<a href="/admin" class="flex items-center gap-3 group">
				<div class="w-9 h-9 rounded-xl bg-slate-950 border border-orange-600/30 flex items-center justify-center shadow-[0_0_20px_rgba(255,62,0,0.1)] group-hover:border-orange-600/50 transition-colors shrink-0">
					<Database class="w-4.5 h-4.5 text-orange-500" />
				</div>
				{#if !collapsed}
					<span class="text-sm font-bold text-white tracking-tight">Ai<span class="text-orange-500">KanAja</span></span>
				{/if}
			</a>
		</div>

		<nav class="relative flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
			{#if !collapsed}
				<p class="px-3 pt-1 pb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Admin</p>
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

		<div class="relative px-3 py-3 space-y-0.5 border-t border-slate-800/60">
			<a
				href="/dashboard"
				class="flex items-center gap-3 {collapsed ? 'justify-center px-0' : 'px-3'} py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all"
			>
				<ArrowLeft class="w-[18px] h-[18px] shrink-0 text-slate-500" />
				{#if !collapsed}<span>Back to App</span>{/if}
			</a>
			<button
				onclick={() => (collapsed = !collapsed)}
				class="flex items-center gap-3 {collapsed ? 'justify-center px-0' : 'px-3'} py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 transition-all w-full"
			>
				<ChevronLeft class="w-[18px] h-[18px] shrink-0 transition-transform duration-300 {collapsed ? 'rotate-180' : ''}" />
				{#if !collapsed}<span>Collapse</span>{/if}
			</button>
		</div>

		<div class="relative px-4 py-4 border-t border-slate-800/60">
			<div class="flex items-center gap-3">
				<div class="w-9 h-9 rounded-xl bg-orange-600/12 border border-orange-600/25 flex items-center justify-center text-xs font-bold text-orange-500 shrink-0">
					{user?.name?.charAt(0)?.toUpperCase() || 'A'}
				</div>
				{#if !collapsed}
					<div class="flex-1 min-w-0">
						<p class="text-sm font-semibold text-white truncate flex items-center gap-1.5">
							{user?.name || 'Admin'}
							<ShieldCheck class="w-3.5 h-3.5 text-orange-500" />
						</p>
						<p class="text-[10px] text-slate-500 truncate">{user?.email || ''}</p>
					</div>
					<button
						onclick={() => (window.location.href = '/api/auth/logout')}
						class="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800/50 transition-colors"
						title="Logout"
					>
						<LogOut class="w-4 h-4" />
					</button>
				{/if}
			</div>
		</div>
	</aside>

	<main class="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
		{@render children()}
	</main>
</div>
