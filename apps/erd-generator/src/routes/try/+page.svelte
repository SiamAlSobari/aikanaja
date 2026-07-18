<script lang="ts">
	import ERDCanvas from '$lib/components/flow/ERDCanvas.svelte';
	import { erdApi } from '$lib/api/erd';
	import { schemaToFlowNodes } from '$lib/utils/schema-transform';
	import type { ErdSchema } from '$lib/types/erd';
	import type { Node, Edge } from '@xyflow/svelte';
	import {
		Sparkles,
		Database,
		ArrowRight,
		LogIn,
		Download,
		Loader2,
		AlertCircle,
		ChevronRight,
		Zap,
		FileCode,
		Table2,
		GitBranch,
		Crown,
		X,
	} from 'lucide-svelte';

	let { data } = $props();

	let prompt = $state('');
	let isGenerating = $state(false);
	let hasGenerated = $derived(data.hasGenerated);
	let error = $state('');
	let schema = $state<ErdSchema | null>(null);
	let nodes = $state.raw<Node[]>([]);
	let edges = $state.raw<Edge[]>([]);
	let showExport = $state(false);
	let showGuestBanner = $state(true);

	const promptSuggestions = [
		{ text: 'E-commerce dengan user, product, order, payment', icon: '🛒' },
		{ text: 'Sistem blog dengan author, post, comment, tag', icon: '📝' },
		{ text: 'Inventory management dengan warehouse, stock', icon: '📦' },
		{ text: 'SaaS billing dengan tenant, subscription, invoice', icon: '💳' },
	];

	function fillPrompt(text: string) {
		prompt = text;
	}

	async function handleGenerate() {
		if (!prompt.trim() || isGenerating) return;
		if (hasGenerated) {
			error = 'Guest mode: hanya 1x generate. Login untuk unlimited.';
			return;
		}

		isGenerating = true;
		error = '';

		try {
			const res = await erdApi.generate(prompt);
			const generated = res.data;
			schema = generated;
			const flow = schemaToFlowNodes(generated);
			nodes = flow.nodes;
			edges = flow.edges;
			hasGenerated = true;
		} catch (err: any) {
			error = err.message || 'Gagal generate schema';
		} finally {
			isGenerating = false;
		}
	}

	function handleExport(format: 'sql' | 'prisma') {
		if (!schema) return;
		erdApi.export({ schema, format, target: 'postgresql' }).then((res) => {
			const blob = new Blob([res.file], { type: 'text/plain' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = res.filename;
			a.click();
			URL.revokeObjectURL(url);
			showExport = false;
		});
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
			handleGenerate();
		}
	}
</script>

<svelte:head>
	<title>Try AiKanAja — Guest Workspace</title>
	<meta name="description" content="Coba buat ERD dari deskripsi teks secara gratis tanpa login." />
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<div class="h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden selection:bg-orange-600/30 selection:text-orange-300">
	<!-- Guest Banner -->
	{#if showGuestBanner}
		<div class="relative flex items-center justify-center gap-3 px-4 py-2 bg-gradient-to-r from-orange-600/15 via-orange-600/10 to-orange-600/15 border-b border-orange-600/20 text-xs z-20">
			<div class="flex items-center gap-2">
				<Crown class="w-3.5 h-3.5 text-orange-400" />
				<span class="text-orange-300 font-medium">Guest Mode</span>
				<span class="text-slate-500">—</span>
				<span class="text-slate-400">Login untuk simpan project & generate unlimited</span>
			</div>
			<a href="/auth/login" class="text-orange-400 hover:text-orange-300 font-semibold underline underline-offset-2 transition-colors">
				Login
			</a>
			<button
				onclick={() => showGuestBanner = false}
				class="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-slate-600 hover:text-slate-400 transition-colors"
			>
				<X class="w-3.5 h-3.5" />
			</button>
		</div>
	{/if}

	<!-- Top Bar -->
	<div class="relative flex items-center justify-between px-5 py-3 bg-slate-900/80 border-b border-slate-800/60 backdrop-blur-sm z-20">
		<div class="flex items-center gap-3">
			<a href="/" class="flex items-center gap-2.5 group">
				<div class="w-8 h-8 rounded-lg bg-slate-900 border border-orange-600/30 flex items-center justify-center shadow-[0_0_15px_rgba(255,62,0,0.1)] group-hover:border-orange-600/50 transition-colors">
					<Database class="w-4 h-4 text-orange-500" />
				</div>
				<span class="text-sm font-bold text-white hidden sm:block">Schema<span class="text-orange-500">Flow</span></span>
			</a>

			{#if schema}
				<div class="hidden sm:flex items-center gap-3 ml-4 pl-4 border-l border-slate-800">
					<div class="flex items-center gap-1.5 text-[11px] text-slate-400">
						<Table2 class="w-3.5 h-3.5 text-orange-500/70" />
						<span>{schema.tables.length} tables</span>
					</div>
					<div class="flex items-center gap-1.5 text-[11px] text-slate-400">
						<GitBranch class="w-3.5 h-3.5 text-teal-500/70" />
						<span>{schema.relations.length} relations</span>
					</div>
				</div>
			{/if}
		</div>

		<div class="flex items-center gap-2.5">
			{#if schema}
				<div class="relative">
					<button
						onclick={() => showExport = !showExport}
						class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-xs font-medium text-slate-300 hover:text-white transition-all"
					>
						<Download class="w-3.5 h-3.5" /> Export
					</button>

					{#if showExport}
						<div class="absolute right-0 top-full mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-black/60 py-1.5 min-w-[180px] z-50 animate-fade-in">
							<div class="px-3 py-1.5 text-[10px] text-slate-600 uppercase tracking-wider font-medium">Format</div>
							<button
								onclick={() => handleExport('sql')}
								class="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
							>
								<FileCode class="w-4 h-4 text-orange-500" />
								<div class="text-left">
									<p class="font-medium">SQL DDL</p>
									<p class="text-[10px] text-slate-500">PostgreSQL, MySQL, SQLite</p>
								</div>
							</button>
							<button
								onclick={() => handleExport('prisma')}
								class="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
							>
								<FileCode class="w-4 h-4 text-teal-500" />
								<div class="text-left">
									<p class="font-medium">Prisma Schema</p>
									<p class="text-[10px] text-slate-500">.prisma file</p>
								</div>
							</button>
						</div>
					{/if}
				</div>
			{/if}

			<a
				href="/auth/login"
				class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-xs font-semibold text-slate-950 transition-all shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 active:scale-[0.98]"
			>
				<LogIn class="w-3.5 h-3.5" /> Login
			</a>
		</div>
	</div>

	<!-- Main Content -->
	<div class="flex-1 flex overflow-hidden">
		<!-- Left Panel - AI Input -->
		<div class="w-[360px] shrink-0 bg-slate-900/50 border-r border-slate-800/60 flex flex-col backdrop-blur-sm">
			<!-- Panel Header -->
			<div class="px-6 py-5 border-b border-slate-800/60">
				<div class="flex items-center gap-2.5 mb-2">
					<div class="w-7 h-7 rounded-lg bg-orange-600/10 border border-orange-600/20 flex items-center justify-center">
						<Sparkles class="w-3.5 h-3.5 text-orange-500" />
					</div>
					<h2 class="text-sm font-bold text-white">AI Generator</h2>
				</div>
				<p class="text-[11px] text-slate-500 leading-relaxed">
					Deskripsikan database yang ingin dibuat, AI akan membuatkan ERD secara otomatis.
				</p>
			</div>

			<!-- Input Area -->
			<div class="flex-1 px-6 py-5 flex flex-col gap-5 overflow-y-auto">
				<!-- Prompt Input -->
				<div class="flex flex-col gap-2.5">
					<label for="prompt" class="text-xs font-medium text-slate-400">Deskripsi Database</label>
					<textarea
						id="prompt"
						bind:value={prompt}
						placeholder="Contoh: Buat sistem e-commerce dengan user, product, order, order_item, dan payment..."
						rows="5"
						disabled={hasGenerated}
						class="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-sm rounded-xl
							focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20
							placeholder:text-slate-600 transition-all resize-none
							disabled:opacity-50 disabled:cursor-not-allowed
							pl-4 pr-4 py-3.5"
					></textarea>
				</div>

				<!-- Suggestions -->
				{#if !hasGenerated}
					<div class="flex flex-col gap-2">
						<span class="text-[10px] text-slate-600 uppercase tracking-wider font-medium">Contoh prompt</span>
						{#each promptSuggestions as suggestion}
							<button
								onclick={() => fillPrompt(suggestion.text)}
								class="text-left flex items-start gap-2.5 text-xs text-slate-500 hover:text-orange-400 px-3.5 py-2.5 rounded-xl
									bg-slate-950/40 hover:bg-slate-800/40 border border-slate-800/40 hover:border-orange-600/20
									transition-all duration-200 leading-relaxed group"
							>
								<span class="text-sm shrink-0 mt-0.5">{suggestion.icon}</span>
								<span>{suggestion.text}</span>
							</button>
						{/each}
					</div>
				{/if}

				<!-- Error -->
				{#if error}
					<div class="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-red-600/10 border border-red-600/20">
						<AlertCircle class="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
						<p class="text-xs text-red-300 leading-relaxed">{error}</p>
					</div>
				{/if}

				<!-- Generate Button -->
				{#if !hasGenerated}
					<button
						onclick={handleGenerate}
						disabled={!prompt.trim() || isGenerating}
						class="group relative flex items-center justify-center gap-2.5 w-full px-5 py-3.5 rounded-xl
							bg-orange-600 hover:bg-orange-700 text-slate-950 font-bold text-sm
							shadow-lg shadow-orange-600/25 hover:shadow-orange-600/40
							transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
							active:scale-[0.99] overflow-hidden"
					>
						<!-- Shimmer effect -->
						<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

						{#if isGenerating}
							<Loader2 class="relative w-4.5 h-4.5 animate-spin" />
							<span class="relative">Generating...</span>
						{:else}
							<Zap class="relative w-4.5 h-4.5" />
							<span class="relative">Generate ERD</span>
							<ArrowRight class="relative w-4 h-4 text-orange-800 group-hover:translate-x-0.5 transition-transform" />
						{/if}
					</button>

					<div class="flex items-center justify-center gap-1.5 text-[10px] text-slate-600">
						<kbd class="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 font-mono text-slate-500">⌘</kbd>
						<span>+</span>
						<kbd class="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 font-mono text-slate-500">Enter</kbd>
						<span class="ml-1">untuk generate</span>
					</div>
				{/if}

				<!-- Login CTA after generate -->
				{#if hasGenerated && schema}
					<div class="mt-auto pt-5 border-t border-slate-800/60">
						<div class="relative p-5 rounded-xl overflow-hidden">
							<!-- Background glow -->
							<div class="absolute inset-0 bg-gradient-to-b from-orange-600/10 to-transparent"></div>
							<div class="absolute inset-0 border border-orange-600/20 rounded-xl"></div>

							<div class="relative">
								<div class="flex items-center gap-2 mb-3">
									<Sparkles class="w-4 h-4 text-orange-500" />
									<span class="text-sm font-bold text-orange-400">Unlock Full Access</span>
								</div>
								<ul class="space-y-2 mb-4">
									{#each ['Unlimited generate', 'Simpan & edit project', 'Export SQL & Prisma', 'Share & collaborate'] as feature}
										<li class="flex items-center gap-2.5 text-[11px] text-slate-400">
											<ChevronRight class="w-3 h-3 text-orange-500 shrink-0" /> {feature}
										</li>
									{/each}
								</ul>
								<a
									href="/auth/login"
									class="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl
										bg-orange-600 hover:bg-orange-700 text-slate-950 font-bold text-sm
										transition-all shadow-lg shadow-orange-600/25 active:scale-[0.99]"
								>
									<LogIn class="w-4 h-4" /> Login untuk Simpan
								</a>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Center - Canvas -->
		<div class="flex-1 relative bg-slate-950">
			{#if nodes.length > 0}
				<ERDCanvas bind:nodes bind:edges />
			{:else}
				<!-- Empty State -->
				<div class="absolute inset-0 flex items-center justify-center">
					<div class="flex flex-col items-center gap-6 max-w-lg text-center px-8">
						<!-- Animated icon group -->
						<div class="relative">
							<!-- Glow -->
							<div class="absolute inset-[-30px] rounded-full bg-orange-600/5 blur-3xl animate-pulse"></div>

							<div class="relative w-24 h-24 rounded-2xl bg-slate-900/80 border border-slate-800/60 flex items-center justify-center shadow-2xl">
								<Table2 class="w-10 h-10 text-slate-700" />
							</div>
							<div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-600/30 flex items-center justify-center animate-bounce shadow-lg shadow-orange-600/10">
								<Sparkles class="w-4 h-4 text-orange-500" />
							</div>
						</div>

						<div class="space-y-3">
							<h3 class="text-xl font-extrabold text-white">Mulai dari Deskripsi</h3>
							<p class="text-sm text-slate-500 leading-relaxed max-w-sm">
								Ketik konsep database di panel kiri, AI akan membuatkan Entity Relationship Diagram secara visual.
							</p>
						</div>

						<!-- Steps -->
						<div class="grid grid-cols-3 gap-4 w-full max-w-xs">
							{#each [
								{ num: '1', label: 'Deskripsikan', icon: Sparkles },
								{ num: '2', label: 'Generate', icon: Zap },
								{ num: '3', label: 'Export', icon: Download },
							] as step}
								<div class="flex flex-col items-center gap-2.5 py-4 rounded-xl bg-slate-900/40 border border-slate-800/40 hover:border-slate-700/50 transition-colors">
									<div class="w-7 h-7 rounded-full bg-orange-600/10 border border-orange-600/25 flex items-center justify-center">
										<span class="text-[11px] font-bold text-orange-500">{step.num}</span>
									</div>
									<span class="text-[11px] text-slate-500 font-medium">{step.label}</span>
								</div>
							{/each}
						</div>

						<!-- Keyboard hint -->
						<div class="flex items-center gap-2 text-[11px] text-slate-600 mt-2">
							<span class="px-2 py-1 rounded-md bg-slate-800/80 border border-slate-700 font-mono text-slate-500 text-[10px]">⌘ Enter</span>
							<span>untuk generate</span>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	@keyframes fade-in {
		from { opacity: 0; transform: translateY(-4px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.animate-fade-in { animation: fade-in 0.2s ease-out; }
</style>
