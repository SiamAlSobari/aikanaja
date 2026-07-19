<script lang="ts">
	import Sparkline from '$lib/components/ui/Sparkline.svelte';
	import {
		FolderKanban,
		Sparkles,
		ArrowRight,
		Plus,
		Zap,
		Clock,
		ExternalLink,
		Table2,
		TrendingUp,
		TrendingDown,
		Activity,
		FileCode,
		GitBranch,
	} from 'lucide-svelte';
	import { openNewProject } from '$lib/stores/new-project.store.svelte';

	let { data } = $props();
	const user = $derived(data.user);
	const recentProjects = $derived(data.recentProjects || []);
	const totalProjects = $derived(data.totalProjects || 0);
	const usage = $derived(data.usage);
	const stats = $derived(data.stats);

	function handleCardMouseMove(e: MouseEvent) {
		const card = e.currentTarget as HTMLElement;
		const rect = card.getBoundingClientRect();
		card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
		card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);
		if (hours < 1) return 'Baru saja';
		if (hours < 24) return `${hours}j lalu`;
		if (days < 7) return `${days}h lalu`;
		return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
	}

	function truncate(str: string, len: number): string {
		if (!str) return '';
		return str.length > len ? str.slice(0, len) + '...' : str;
	}

	const statCards = $derived([
		{
			label: 'Total Projects',
			value: String(totalProjects),
			icon: FolderKanban,
			trend: totalProjects > 0 ? 'up' : 'neutral',
			sparkline: [2, 3, 4, 4, 5, totalProjects].map(Number),
			color: '#f97316',
			bgClass: 'from-orange-600/8 to-orange-600/2',
			iconBg: 'bg-orange-600/12 border-orange-600/20',
			iconColor: 'text-orange-500',
		},
		{
			label: 'Generated',
			value: String(stats.monthlyGenerates || usage.count || 0),
			icon: Sparkles,
			trend: 'up',
			sparkline: [0, 1, 2, 3, 2, 4].map(Number),
			color: '#14b8a6',
			bgClass: 'from-teal-600/8 to-teal-600/2',
			iconBg: 'bg-teal-600/12 border-teal-600/20',
			iconColor: 'text-teal-500',
		},
		{
			label: 'Quota Left',
			value: usage.isUnlimited ? '∞' : String(usage.remaining || 0),
			icon: Zap,
			trend: 'neutral',
			sparkline: [10, 9, 8, 8, 7, usage.remaining || 0].map(Number),
			color: '#3b82f6',
			bgClass: 'from-blue-600/8 to-blue-600/2',
			iconBg: 'bg-blue-600/12 border-blue-600/20',
			iconColor: 'text-blue-500',
		},
		{
			label: 'Plan',
			value: 'Free',
			icon: TrendingUp,
			trend: 'neutral',
			sparkline: [],
			color: '#a855f7',
			bgClass: 'from-purple-600/8 to-purple-600/2',
			iconBg: 'bg-purple-600/12 border-purple-600/20',
			iconColor: 'text-purple-500',
		},
	]);
</script>

<svelte:head>
	<title>Dashboard — AiKanAja</title>
</svelte:head>

<div class="relative min-h-full">
	<div class="absolute top-0 right-0 w-[600px] h-[400px] bg-orange-600/3 blur-[120px] pointer-events-none"></div>
	<div class="absolute bottom-0 left-0 w-[400px] h-[300px] bg-teal-600/2 blur-[100px] pointer-events-none"></div>

	<div class="relative p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
		<!-- Header -->
		<div class="flex items-start justify-between gap-4">
			<div class="space-y-1">
				<h1 class="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
					Welcome back, <span class="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">{user?.name?.split(' ')[0] || 'User'}</span>
				</h1>
				<p class="text-sm text-slate-500">Here's what's happening with your projects.</p>
			</div>
		<button
			onclick={openNewProject}
			class="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-slate-950 font-bold text-xs shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 transition-all active:scale-[0.98]"
		>
				<Plus class="w-4 h-4" /> New Project
			</button>
		</div>

		<!-- Stats Grid -->
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
			{#each statCards as stat, i}
				<div
					onmousemove={handleCardMouseMove}
					role="presentation"
					class="group relative rounded-2xl overflow-hidden transition-all duration-300 animate-fade-in-up"
					style="animation-delay: {i * 80}ms;"
				>
					<!-- Background layers -->
					<div class="absolute inset-0 bg-gradient-to-br {stat.bgClass}"></div>
					<div class="absolute inset-0 border border-slate-800/40 rounded-2xl group-hover:border-slate-700/50 transition-colors"></div>
					<div
						class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
						style="background: radial-gradient(circle 200px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 62, 0, 0.04), transparent 80%);"
					></div>

					<div class="relative p-5">
						<div class="flex items-start justify-between mb-4">
							<div class="w-10 h-10 rounded-xl border flex items-center justify-center {stat.iconBg}">
								<stat.icon class="w-5 h-5 {stat.iconColor}" />
							</div>
							{#if stat.sparkline.length > 1}
								<Sparkline values={stat.sparkline} color={stat.color} width={64} height={28} />
							{/if}
						</div>
						<p class="text-3xl font-extrabold text-white mb-1 tracking-tight">{stat.value}</p>
						<div class="flex items-center gap-2">
							<span class="text-[11px] text-slate-500 font-medium">{stat.label}</span>
							{#if stat.trend === 'up'}
								<span class="flex items-center gap-0.5 text-[10px] text-emerald-500 font-medium">
									<TrendingUp class="w-3 h-3" /> +
								</span>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Quick Actions -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
		<button
			onclick={openNewProject}
			onmousemove={handleCardMouseMove}
				class="group relative flex items-center gap-5 p-6 rounded-2xl overflow-hidden text-left w-full transition-all duration-300 animate-fade-in-up"
				style="animation-delay: 350ms;"
			>
				<div class="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-orange-600/3 border border-orange-600/15 rounded-2xl group-hover:border-orange-600/30 transition-colors"></div>
				<div
					class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
					style="background: radial-gradient(circle 300px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 62, 0, 0.06), transparent 80%);"
				></div>
				<div class="relative w-12 h-12 rounded-xl bg-orange-600/15 border border-orange-600/25 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,62,0,0.15)] transition-all">
					<Zap class="w-5 h-5 text-orange-500" />
				</div>
				<div class="relative flex-1">
					<p class="text-sm font-bold text-white mb-0.5">Buat ERD Baru</p>
					<p class="text-xs text-slate-500">Generate dari deskripsi teks dengan AI</p>
				</div>
				<ArrowRight class="relative w-5 h-5 text-slate-600 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
			</button>

			<a
				href="/dashboard/templates"
				onmousemove={handleCardMouseMove}
				class="group relative flex items-center gap-5 p-6 rounded-2xl overflow-hidden transition-all duration-300 animate-fade-in-up"
				style="animation-delay: 430ms;"
			>
				<div class="absolute inset-0 bg-slate-900/30 border border-slate-800/40 rounded-2xl group-hover:border-slate-700/50 transition-colors"></div>
				<div
					class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
					style="background: radial-gradient(circle 300px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 62, 0, 0.03), transparent 80%);"
				></div>
				<div class="relative w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center group-hover:scale-110 transition-all">
					<Sparkles class="w-5 h-5 text-slate-400 group-hover:text-orange-400 transition-colors" />
				</div>
				<div class="relative flex-1">
					<p class="text-sm font-bold text-white mb-0.5">Browse Templates</p>
					<p class="text-xs text-slate-500">Gunakan template siap pakai</p>
				</div>
				<ArrowRight class="relative w-5 h-5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
			</a>
		</div>

		<!-- Main Content Grid -->
		<div class="grid lg:grid-cols-3 gap-6">
			<!-- Recent Projects (2 cols) -->
			<div class="lg:col-span-2 space-y-4 animate-fade-in-up" style="animation-delay: 500ms;">
				<div class="flex items-center justify-between">
					<h2 class="text-base font-bold text-white">Recent Projects</h2>
					{#if recentProjects.length > 0}
						<a href="/dashboard/projects" class="text-xs text-orange-500 hover:text-orange-400 font-semibold transition-colors flex items-center gap-1">
							View all <ArrowRight class="w-3 h-3" />
						</a>
					{/if}
				</div>

				{#if recentProjects.length > 0}
					<div class="space-y-2.5">
						{#each recentProjects as project, i}
							<a
								href="/project/{project.id}"
								onmousemove={handleCardMouseMove}
								class="group relative flex items-center gap-4 px-4 py-3.5 rounded-xl overflow-hidden transition-all duration-200 animate-fade-in-up"
								style="animation-delay: {550 + i * 60}ms;"
							>
								<div class="absolute inset-0 bg-slate-900/30 border border-slate-800/30 rounded-xl group-hover:border-orange-600/20 group-hover:bg-slate-900/50 transition-all"></div>
								<div
									class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
									style="background: radial-gradient(circle 200px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 62, 0, 0.03), transparent 80%);"
								></div>

								<div class="relative w-9 h-9 rounded-lg bg-orange-600/10 border border-orange-600/15 flex items-center justify-center shrink-0">
									<Table2 class="w-4 h-4 text-orange-500/70" />
								</div>
								<div class="relative flex-1 min-w-0">
									<p class="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors truncate">
										{truncate(project.name, 35)}
									</p>
									<p class="text-[11px] text-slate-500 truncate mt-0.5">
										{project.description || 'No description'}
									</p>
								</div>
								<div class="relative flex items-center gap-3 shrink-0">
									<span class="hidden sm:flex items-center gap-1 text-[10px] text-slate-600">
										<Clock class="w-3 h-3" /> {formatDate(project.updatedAt)}
									</span>
									<ExternalLink class="w-3.5 h-3.5 text-slate-700 group-hover:text-orange-500 transition-colors" />
								</div>
							</a>
						{/each}
					</div>
				{:else}
					<!-- Empty State -->
					<div class="relative rounded-2xl overflow-hidden">
						<div class="absolute inset-0 bg-grid-pattern opacity-20"></div>
						<div class="absolute inset-0 border border-slate-800/30 rounded-2xl"></div>
						<div class="relative py-14 px-8 text-center">
							<div class="relative inline-block mb-4">
								<div class="w-14 h-14 rounded-2xl bg-slate-900/60 border border-slate-800/50 flex items-center justify-center">
									<Table2 class="w-6 h-6 text-slate-700" />
								</div>
								<div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-md bg-orange-600/20 border border-orange-600/30 flex items-center justify-center animate-bounce">
									<Plus class="w-2.5 h-2.5 text-orange-500" />
								</div>
							</div>
							<p class="text-sm font-medium text-slate-400 mb-1">No projects yet</p>
							<p class="text-xs text-slate-600 mb-4 max-w-xs mx-auto">Create your first ERD from a text description.</p>
						<button
							onclick={openNewProject}
							class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-slate-950 font-bold text-xs shadow-lg shadow-orange-600/20 transition-all active:scale-[0.98]"
						>
								<Zap class="w-3.5 h-3.5" /> Get Started
							</button>
						</div>
					</div>
				{/if}
			</div>

			<!-- Activity Feed (1 col) -->
			<div class="space-y-4 animate-fade-in-up" style="animation-delay: 600ms;">
				<div class="flex items-center justify-between">
					<h2 class="text-base font-bold text-white">Recent Activity</h2>
					<a href="/dashboard/activity" class="text-xs text-orange-500 hover:text-orange-400 font-semibold transition-colors">
						View all
					</a>
				</div>

				{#if stats.recentActivities && stats.recentActivities.length > 0}
					<div class="space-y-1">
						{#each stats.recentActivities as act, i}
							<div class="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-900/30 transition-colors animate-fade-in-up" style="animation-delay: {650 + i * 50}ms;">
								<div class="w-2 h-2 rounded-full bg-orange-500/50 mt-1.5 shrink-0"></div>
								<div class="flex-1 min-w-0">
									<p class="text-xs text-slate-400 leading-relaxed">{act.message}</p>
									<p class="text-[10px] text-slate-600 mt-0.5">{formatDate(act.createdAt)}</p>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="px-4 py-10 text-center">
						<Activity class="w-8 h-8 text-slate-800 mx-auto mb-2" />
						<p class="text-xs text-slate-600">No activity yet</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Footer info -->
		<div class="flex items-center justify-center gap-6 py-2 animate-fade-in-up" style="animation-delay: 700ms;">
			{#each [{ icon: FileCode, label: 'SQL DDL' }, { icon: FileCode, label: 'Prisma' }, { icon: GitBranch, label: 'Visual ERD' }] as fmt}
				<div class="flex items-center gap-1.5 text-[10px] text-slate-700">
					<fmt.icon class="w-3 h-3" />
					<span>{fmt.label}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	@keyframes fade-in-up {
		from { opacity:0; transform: translateY(12px); }
		to { opacity:1; transform: translateY(0); }
	}
	.animate-fade-in-up {
		opacity:0;
		animation: fade-in-up 0.5s ease-out forwards;
	}
</style>
