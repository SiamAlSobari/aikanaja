<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { motion } from '@humanspeak/svelte-motion';
	import { ArrowRight, Sparkles, Play } from 'lucide-svelte';

	let activeLine = $state(0);
	const previewLines = [
		{ type: 'heading', text: '## Executive Summary' },
		{ type: 'text', text: 'Platform SaaS untuk manajemen proyek...' },
		{ type: 'heading', text: '## User Stories' },
		{ type: 'story', text: 'US-01: Sebagai PM, saya ingin membuat workspace' },
		{ type: 'story', text: 'US-02: Sebagai Dev, saya ingin menugaskan task' },
		{ type: 'heading', text: '## Sprint Roadmap' },
		{ type: 'meta', text: 'Sprint 1 (MVP): 13 pts · Sprint 2: 8 pts' },
		{ type: 'heading', text: '## Quality Score' },
		{ type: 'score', text: '██████████░░░░ 78/100' },
	];

	onMount(() => {
		const iv = setInterval(() => {
			activeLine = (activeLine + 1) % previewLines.length;
		}, 2200);
		return () => clearInterval(iv);
	});
</script>

<section class="relative min-h-screen flex items-end pb-20 pt-32 overflow-hidden">
	<!-- Orange gradient concentrated at top -->
	<div
		class="absolute top-0 left-0 right-0 h-[70vh] pointer-events-none"
		style="background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,62,0,0.12) 0%, transparent 70%);"
	></div>

	<div class="max-w-6xl mx-auto px-5 w-full relative z-10">
		<div class="grid lg:grid-cols-12 gap-12 lg:gap-8 items-end">
			<!-- Left: massive editorial headline -->
			<div class="lg:col-span-7 space-y-8">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
				>
					<div
						class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-medium text-orange-400 mb-6"
					>
						<Sparkles class="w-3 h-3" /> AI-Guided PRD Wizard
					</div>

					<h1
						class="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-[-0.04em] text-white leading-[0.9]"
					>
						PRD<br />
						<span class="text-orange-500">Tanpa</span><br />
						Tulisan Tangan.
					</h1>
				</motion.div>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
					class="text-lg text-slate-400 max-w-md leading-relaxed"
				>
					Ketik visi produk Anda. AI menyusun PRD komprehensif — user stories, acceptance
					criteria, sprint plan, dan diagram — dalam hitungan menit.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
					class="flex flex-wrap items-center gap-4"
				>
					<a
						href="{base}/try"
						class="group inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-base transition-all hover:shadow-xl hover:shadow-orange-600/20"
					>
						Mulai Sekarang
						<ArrowRight
							class="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform"
						/>
					</a>
					<a
						href="#demo"
						class="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl text-slate-400 hover:text-white font-medium text-base transition-colors"
					>
						<div
							class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors"
						>
							<Play class="w-3.5 h-3.5 ml-0.5" />
						</div>
						Lihat Demo
					</a>
				</motion.div>
			</div>

			<!-- Right: floating PRD preview card -->
			<motion.div
				initial={{ opacity: 0, x: 40, rotateY: -8 }}
				animate={{ opacity: 1, x: 0, rotateY: 0 }}
				transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
				class="lg:col-span-5"
				style="perspective: 1200px;"
			>
				<div
					class="relative rounded-3xl bg-slate-900/60 border border-white/5 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden"
				>
					<!-- Fake window chrome -->
					<div
						class="flex items-center gap-2 px-5 py-3.5 border-b border-white/5"
					>
						<div class="flex gap-1.5">
							<div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
							<div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
							<div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
						</div>
						<span class="text-[11px] text-slate-600 font-mono ml-2">prd-preview.md</span>
						<span class="ml-auto text-[10px] text-orange-500/60 font-mono flex items-center gap-1.5">
							<span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
							Generating...
						</span>
					</div>

					<!-- Content lines -->
					<div class="p-5 space-y-1 font-mono text-[12px] leading-relaxed">
						{#each previewLines as line, i}
							<div
								class="px-2.5 py-1.5 rounded-lg transition-all duration-500 {i ===
								activeLine
									? 'bg-orange-500/10 border-l-2 border-orange-500'
									: 'border-l-2 border-transparent'}"
							>
								{#if line.type === 'heading'}
									<span class="text-white font-bold">{line.text}</span>
								{:else if line.type === 'story'}
									<span class="text-orange-400/80">{line.text}</span>
								{:else if line.type === 'score'}
									<span class="text-emerald-400">{line.text}</span>
								{:else if line.type === 'meta'}
									<span class="text-slate-500">{line.text}</span>
								{:else}
									<span class="text-slate-400">{line.text}</span>
								{/if}
							</div>
						{/each}
					</div>

					<!-- Bottom bar -->
					<div
						class="px-5 py-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-600 font-mono"
					>
						<span>SvelteKit 5 · TypeScript</span>
						<span class="text-orange-500/70">8 sections · 34 story points</span>
					</div>
				</div>
			</motion.div>
		</div>
	</div>
</section>
