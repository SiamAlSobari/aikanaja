<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		LayoutTemplate,
		Search,
		ArrowRight,
		Sparkles,
		ShoppingCart,
		FileText,
		Boxes,
		MessageCircle,
		GraduationCap,
	} from 'lucide-svelte';

	let { data } = $props();

	const categoryIcons: Record<string, typeof ShoppingCart> = {
		'E-commerce': ShoppingCart,
		Blog: FileText,
		Inventory: Boxes,
		'Social Media': MessageCircle,
		School: GraduationCap,
	};

	const categoryColors: Record<string, string> = {
		'E-commerce': 'from-orange-600/15 to-orange-600/5',
		Blog: 'from-teal-600/15 to-teal-600/5',
		Inventory: 'from-blue-600/15 to-blue-600/5',
		'Social Media': 'from-purple-600/15 to-purple-600/5',
		School: 'from-amber-600/15 to-amber-600/5',
	};

	let searchQuery = $state('');
	let selectedCategory = $state('all');

	const categories = $derived(() => {
		const cats = new Set<string>(data.templates.map((t: any) => t.category));
		return ['all', ...cats];
	});

	const filtered = $derived(() =>
		data.templates.filter((t: any) => {
			const matchSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchCat = selectedCategory === 'all' || t.category === selectedCategory;
			return matchSearch && matchCat;
		})
	);

	function handleCardMouseMove(e: MouseEvent) {
		const card = e.currentTarget as HTMLElement;
		const rect = card.getBoundingClientRect();
		card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
		card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
	}
</script>

<svelte:head>
	<title>Templates — SchemaFlow</title>
</svelte:head>

<div class="relative min-h-full">
	<div class="absolute top-0 left-0 w-[400px] h-[300px] bg-teal-600/3 blur-[100px] pointer-events-none"></div>

	<div class="relative p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
		<div>
			<h1 class="text-2xl font-extrabold text-white tracking-tight">Templates</h1>
			<p class="text-sm text-slate-500 mt-1">Gunakan template siap pakai untuk membuat ERD dengan cepat.</p>
		</div>

		<div class="flex flex-wrap items-center gap-3">
			<div class="flex-1 min-w-[200px] max-w-md relative">
				<Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search templates..."
					class="w-full bg-slate-900/60 border border-slate-800 text-slate-200 text-sm rounded-xl
						focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20
						placeholder:text-slate-600 pl-10 pr-4 py-2.5"
				/>
			</div>
			<div class="flex items-center gap-1.5 flex-wrap">
				{#each categories() as cat}
					<button
						onclick={() => selectedCategory = cat}
						class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all
							{selectedCategory === cat
								? 'bg-orange-600/15 text-orange-400 border border-orange-600/25'
								: 'text-slate-500 hover:text-slate-300 border border-transparent hover:bg-slate-800/40'}"
					>
						{cat === 'all' ? 'All' : cat}
					</button>
				{/each}
			</div>
		</div>

		{#if filtered().length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each filtered() as template}
					{@const Icon = categoryIcons[template.category] || LayoutTemplate}
					{@const gradient = categoryColors[template.category] || 'from-slate-600/15 to-slate-600/5'}
					<a
						href="/dashboard/templates/{template.id}"
						onmousemove={handleCardMouseMove}
						class="group relative rounded-2xl bg-slate-900/40 border border-slate-800/60 hover:border-orange-600/25 transition-all duration-300 overflow-hidden flex flex-col"
					>
						<div
							class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
							style="background: radial-gradient(circle 250px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 62, 0, 0.04), transparent 80%);"
						></div>

						<div class="relative p-5 flex-1">
							<div class="flex items-start justify-between mb-4">
								<div class="w-11 h-11 rounded-xl bg-gradient-to-br {gradient} flex items-center justify-center">
									<Icon class="w-5 h-5 text-slate-400" />
								</div>
								<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800/60 border border-slate-700/50 text-slate-400">
									{template.category}
								</span>
							</div>
							<h3 class="text-sm font-bold text-white group-hover:text-orange-400 transition-colors mb-1.5">
								{template.name}
							</h3>
							<p class="text-xs text-slate-500 leading-relaxed line-clamp-2">
								{template.description || 'No description'}
							</p>
						</div>

						<div class="relative flex items-center justify-between px-5 py-3 border-t border-slate-800/60">
							<span class="text-[10px] text-slate-600">
								{template.schema?.tables?.length || 0} tables
							</span>
							<span class="flex items-center gap-1 text-[10px] text-orange-500/60 font-medium group-hover:text-orange-500 transition-colors">
								Use Template <ArrowRight class="w-3 h-3" />
							</span>
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<div class="relative rounded-2xl border border-slate-800/40 overflow-hidden py-20 text-center">
				<div class="absolute inset-0 bg-grid-pattern opacity-30"></div>
				<div class="relative">
					<div class="w-14 h-14 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center justify-center mx-auto mb-4">
						<LayoutTemplate class="w-6 h-6 text-slate-700" />
					</div>
					<p class="text-sm font-medium text-slate-400">Tidak ada template ditemukan</p>
				</div>
			</div>
		{/if}
	</div>
</div>
