<script lang="ts">
	import { goto } from '$app/navigation';
	import ProjectCard from '$lib/components/features/project/ProjectCard.svelte';
	import { openNewProject } from '$lib/stores/new-project.store.svelte';
	import {
		Plus,
		Search,
		Grid3X3,
		List,
		ChevronDown,
		ArrowUpDown,
		Database,
		Sparkles,
		Zap,
		Table2,
		Clock,
		ExternalLink,
		Trash2,
	} from 'lucide-svelte';

	let { data } = $props();

	let searchQuery = $derived(data.filters.search || '');
	let viewMode = $state<'grid' | 'list'>('grid');
	let showSortMenu = $state(false);
	let showFilterMenu = $state(false);

	const sortOptions = [
		{ label: 'Newest', value: 'updatedAt', order: 'desc' },
		{ label: 'Oldest', value: 'updatedAt', order: 'asc' },
		{ label: 'Name A-Z', value: 'name', order: 'asc' },
		{ label: 'Name Z-A', value: 'name', order: 'desc' },
	];

	const filterOptions = [
		{ label: 'All', value: 'all' },
		{ label: 'Active', value: 'active' },
		{ label: 'Shared', value: 'shared' },
		{ label: 'Trash', value: 'deleted' },
	];

	const currentSort = $derived(
		sortOptions.find((s) => s.value === data.filters.sort && s.order === data.filters.order) || sortOptions[0]
	);
	const currentFilter = $derived(
		filterOptions.find((f) => f.value === data.filters.filter) || filterOptions[1]
	);

	function buildUrl(updates: Record<string, string>) {
		const params = new URLSearchParams({
			page: String(data.filters.page),
			limit: String(data.filters.limit),
			sort: data.filters.sort,
			order: data.filters.order,
			filter: data.filters.filter,
			search: data.filters.search,
		});
		Object.entries(updates).forEach(([k, v]) => params.set(k, v));
		if ('page' in updates === false) params.set('page', '1');
		return `/dashboard/projects?${params}`;
	}

	function handleSort(sort: string, order: string) {
		showSortMenu = false;
		goto(buildUrl({ sort, order }));
	}

	function handleFilter(filter: string) {
		showFilterMenu = false;
		goto(buildUrl({ filter }));
	}

	function handleSearch(e: Event) {
		e.preventDefault();
		goto(buildUrl({ search: searchQuery }));
	}

	function handlePageChange(newPage: number) {
		goto(buildUrl({ page: String(newPage) }));
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);
		if (hours < 1) return 'Just now';
		if (hours < 24) return `${hours}h ago`;
		if (days < 7) return `${days}d ago`;
		return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
	}

	function truncate(str: string, len: number): string {
		if (!str) return '';
		return str.length > len ? str.slice(0, len) + '...' : str;
	}



	async function deleteProject(id: string, name: string) {
		if (!confirm(`Delete "${name}"? It will be moved to trash.`)) return;
		try {
			const { erdApi } = await import('$lib/api/erd');
			await erdApi.delete(id);
			goto(buildUrl({}), { invalidateAll: true });
		} catch (err) {
			console.error('[projects.delete]', err);
		}
	}

	function handleCardMouseMove(e: MouseEvent) {
		const card = e.currentTarget as HTMLElement;
		const rect = card.getBoundingClientRect();
		card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
		card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
	}
</script>

<svelte:head>
	<title>Projects — AiKanAja</title>
</svelte:head>

<div class="relative min-h-full">
	<div class="absolute top-0 right-0 w-[400px] h-[300px] bg-orange-600/3 blur-[100px] pointer-events-none"></div>

	<div class="relative p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
		<!-- Header -->
		<div class="flex items-start justify-between gap-4 animate-fade-in-up">
			<div>
				<h1 class="text-2xl font-extrabold text-white tracking-tight">Projects</h1>
				<p class="text-sm text-slate-500 mt-1">{data.pagination.total} project{data.pagination.total !== 1 ? 's' : ''}</p>
			</div>
			<button
				onclick={openNewProject}
				class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-slate-950 font-bold text-xs shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 transition-all active:scale-[0.98]"
			>
				<Plus class="w-4 h-4" /> New Project
			</button>
		</div>

		<!-- Toolbar -->
		<div class="flex flex-wrap items-center gap-3 animate-fade-in-up" style="animation-delay: 80ms;">
			<form onsubmit={handleSearch} class="flex-1 min-w-[200px] max-w-md">
				<div class="relative">
					<Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search projects..."
						class="w-full bg-slate-900/50 border border-slate-800/60 text-slate-200 text-sm rounded-xl
							focus:outline-none focus:border-orange-600/40 focus:ring-1 focus:ring-orange-600/15
							placeholder:text-slate-600 pl-10 pr-4 py-2.5 transition-colors"
					/>
				</div>
			</form>

			<div class="relative">
				<button
					onclick={() => { showFilterMenu = !showFilterMenu; showSortMenu = false; }}
					class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:border-slate-700 text-sm text-slate-300 transition-colors"
				>
					{currentFilter.label}
					<ChevronDown class="w-3.5 h-3.5 text-slate-500" />
				</button>
				{#if showFilterMenu}
					<div class="absolute right-0 top-full mt-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-black/60 py-1 min-w-[140px] z-30">
						{#each filterOptions as opt}
							<button
								onclick={() => handleFilter(opt.value)}
								class="w-full px-3 py-2 text-xs text-left {opt.value === data.filters.filter ? 'text-orange-400 bg-orange-600/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} transition-colors"
							>{opt.label}</button>
						{/each}
					</div>
				{/if}
			</div>

			<div class="relative">
				<button
					onclick={() => { showSortMenu = !showSortMenu; showFilterMenu = false; }}
					class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:border-slate-700 text-sm text-slate-300 transition-colors"
				>
					<ArrowUpDown class="w-3.5 h-3.5 text-slate-500" />
					{currentSort.label}
				</button>
				{#if showSortMenu}
					<div class="absolute right-0 top-full mt-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-black/60 py-1 min-w-[160px] z-30">
						{#each sortOptions as opt}
							<button
								onclick={() => handleSort(opt.value, opt.order)}
								class="w-full px-3 py-2 text-xs text-left {opt.value === data.filters.sort && opt.order === data.filters.order ? 'text-orange-400 bg-orange-600/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} transition-colors"
							>{opt.label}</button>
						{/each}
					</div>
				{/if}
			</div>

			<div class="flex items-center bg-slate-900/50 border border-slate-800/60 rounded-xl overflow-hidden">
				<button
					onclick={() => viewMode = 'grid'}
					class="p-2.5 {viewMode === 'grid' ? 'bg-slate-800 text-orange-400' : 'text-slate-500 hover:text-slate-300'} transition-colors"
				>
					<Grid3X3 class="w-4 h-4" />
				</button>
				<button
					onclick={() => viewMode = 'list'}
					class="p-2.5 {viewMode === 'list' ? 'bg-slate-800 text-orange-400' : 'text-slate-500 hover:text-slate-300'} transition-colors"
				>
					<List class="w-4 h-4" />
				</button>
			</div>
		</div>

		<!-- Projects -->
		{#if data.projects.length > 0}
			{#if viewMode === 'grid'}
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
					{#each data.projects as project, i}
						<ProjectCard {project} onDelete={deleteProject} animationDelay={150 + i * 50} />
					{/each}
				</div>
			{:else}
				<div class="space-y-2">
					{#each data.projects as project, i}
						<div
							onmousemove={handleCardMouseMove}
							role="presentation"
							class="group relative flex items-center gap-4 px-4 py-3.5 rounded-xl overflow-hidden transition-all duration-200 animate-fade-in-up"
							style="animation-delay: {150 + i * 40}ms;"
						>
							<div class="absolute inset-0 bg-slate-900/30 border border-slate-800/30 rounded-xl group-hover:border-orange-600/20 group-hover:bg-slate-900/50 transition-all"></div>
							<div
								class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
								style="background: radial-gradient(circle 300px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 62, 0, 0.03), transparent 80%);"
							></div>

							<div class="relative w-9 h-9 rounded-lg bg-orange-600/10 border border-orange-600/15 flex items-center justify-center shrink-0">
								<Table2 class="w-4 h-4 text-orange-500/70" />
							</div>
							<div class="relative flex-1 min-w-0">
								<a href="/project/{project.id}">
									<h3 class="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors truncate">{project.name}</h3>
									<p class="text-[11px] text-slate-500 truncate mt-0.5">{project.description || 'No description'}</p>
								</a>
							</div>
							<div class="relative flex items-center gap-3 shrink-0">
								<span class="hidden sm:flex items-center gap-1 text-[10px] text-slate-600">
									<Clock class="w-3 h-3" /> {formatDate(project.updatedAt)}
								</span>
								<a href="/project/{project.id}" class="p-1.5 rounded-lg text-slate-600 hover:text-orange-400 hover:bg-slate-800/50 transition-colors">
									<ExternalLink class="w-3.5 h-3.5" />
								</a>
								<button onclick={() => deleteProject(project.id, project.name)} class="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-slate-800/50 transition-colors">
									<Trash2 class="w-3.5 h-3.5" />
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Pagination -->
			{#if data.pagination.totalPages > 1}
				<div class="flex items-center justify-center gap-2 pt-4 animate-fade-in-up" style="animation-delay: 400ms;">
					<button
						onclick={() => handlePageChange(data.pagination.page - 1)}
						disabled={data.pagination.page <= 1}
						class="px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
					>Prev</button>
					{#each { length: data.pagination.totalPages } as _, i}
						{@const p = i + 1}
						{#if p === 1 || p === data.pagination.totalPages || Math.abs(p - data.pagination.page) <= 1}
							<button
								onclick={() => handlePageChange(p)}
								class="w-9 h-9 rounded-lg text-xs font-medium {p === data.pagination.page ? 'bg-orange-600 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-800'} transition-colors"
							>{p}</button>
						{:else if p === 2 && data.pagination.page > 3}
							<span class="text-slate-600 text-xs">...</span>
						{:else if p === data.pagination.totalPages - 1 && data.pagination.page < data.pagination.totalPages - 2}
							<span class="text-slate-600 text-xs">...</span>
						{/if}
					{/each}
					<button
						onclick={() => handlePageChange(data.pagination.page + 1)}
						disabled={data.pagination.page >= data.pagination.totalPages}
						class="px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
					>Next</button>
				</div>
			{/if}
		{:else}
			<div class="relative rounded-2xl overflow-hidden animate-fade-in-up" style="animation-delay: 200ms;">
				<div class="absolute inset-0 bg-grid-pattern opacity-20"></div>
				<div class="absolute inset-0 border border-slate-800/30 rounded-2xl"></div>
				<div class="relative py-20 px-8 text-center">
					<div class="relative inline-block mb-5">
						<div class="w-16 h-16 rounded-2xl bg-slate-900/60 border border-slate-800/50 flex items-center justify-center">
							<Database class="w-7 h-7 text-slate-700" />
						</div>
						<div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-orange-600/20 border border-orange-600/30 flex items-center justify-center">
							<Sparkles class="w-3 h-3 text-orange-500" />
						</div>
					</div>
					<p class="text-base font-semibold text-slate-400 mb-1">
						{data.filters.search ? 'No results found' : 'No projects yet'}
					</p>
					<p class="text-xs text-slate-600 mb-6 max-w-sm mx-auto">
						{data.filters.search ? `No projects matching "${data.filters.search}"` : 'Create your first ERD from a text description.'}
					</p>
					{#if !data.filters.search}
						<button
							onclick={openNewProject}
							class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-slate-950 font-bold text-xs shadow-lg shadow-orange-600/20 transition-all active:scale-[0.98]"
						>
							<Zap class="w-3.5 h-3.5" /> Get Started
						</button>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>



<style>
	@keyframes fade-in-up {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.animate-fade-in-up {
		opacity: 0;
		animation: fade-in-up 0.4s ease-out forwards;
	}
	@keyframes fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	@keyframes scale-in {
		from { opacity: 0; transform: scale(0.95); }
		to { opacity: 1; transform: scale(1); }
	}
</style>
