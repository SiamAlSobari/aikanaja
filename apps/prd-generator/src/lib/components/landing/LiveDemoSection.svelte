<script lang="ts">
	import { onMount } from 'svelte';
	import { motion } from '@humanspeak/svelte-motion';
	import { Wand2, ArrowRight, FileText, Check } from 'lucide-svelte';

	let currentStep = $state(0);
	const wizardSteps = [
		{ label: 'Visi Produk', value: 'Platform SaaS project management' },
		{ label: 'Target User', value: 'Product Manager & Developer' },
		{ label: 'Tech Stack', value: 'SvelteKit + Elysia + SQLite' }
	];

	onMount(() => {
		const iv = setInterval(() => {
			currentStep = (currentStep + 1) % wizardSteps.length;
		}, 3000);
		return () => clearInterval(iv);
	});
</script>

<section id="demo" class="relative py-28 lg:py-36">
	<div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

	<div class="max-w-6xl mx-auto px-5">
		<!-- Header -->
		<div class="mb-16 max-w-xl">
			<span
				class="text-xs font-semibold text-orange-500 uppercase tracking-[0.2em] mb-4 block"
				>Demo</span
			>
			<h2 class="text-4xl lg:text-5xl font-black tracking-[-0.03em] text-white leading-tight">
				Dari Ide ke PRD<br />Dalam 30 Detik.
			</h2>
		</div>

		<!-- Split demo -->
		<div class="grid lg:grid-cols-2 gap-8 items-stretch">
			<!-- Left: Wizard Input -->
			<motion.div
				initial={{ opacity: 0, x: -30 }}
				whileInView={{ opacity: 1, x: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
				class="rounded-3xl bg-slate-900/50 border border-white/5 p-8 flex flex-col"
			>
				<div class="flex items-center gap-3 mb-8">
					<div
						class="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center"
					>
						<Wand2 class="w-5 h-5 text-orange-400" />
					</div>
					<div>
						<h3 class="text-base font-bold text-white">AI Wizard</h3>
						<p class="text-xs text-slate-500">Isi panduan singkat</p>
					</div>
				</div>

				<div class="space-y-4 flex-1">
					{#each wizardSteps as step, i}
						<div
							class="rounded-2xl border p-4 transition-all duration-500 {i ===
							currentStep
								? 'bg-orange-500/5 border-orange-500/25 shadow-lg shadow-orange-500/5'
								: 'bg-white/[0.02] border-white/5'}"
						>
							<div
								class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2"
								>{step.label}</div
							>
							<div class="text-sm text-white font-medium">
								{i <= currentStep ? step.value : '••••••••••••'}
							</div>
							{#if i <= currentStep}
								<div class="flex items-center gap-1.5 mt-2 text-[10px] text-orange-500/70">
									<Check class="w-3 h-3" /> Selesai
								</div>
							{/if}
						</div>
					{/each}
				</div>

				<div
					class="mt-6 flex items-center justify-between text-[11px] text-slate-600 font-mono"
				>
					<span>Step {Math.min(currentStep + 1, 3)}/3</span>
					<div class="flex gap-1.5">
						{#each [0, 1, 2] as dot}
							<div
								class="w-1.5 h-1.5 rounded-full transition-all {dot <=
								currentStep
									? 'bg-orange-500'
									: 'bg-white/10'}"
							></div>
						{/each}
					</div>
				</div>
			</motion.div>

			<!-- Arrow divider (desktop) -->
			<div
				class="hidden lg:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
			>
				<!-- This is positioned by the grid parent, not used on lg -->
			</div>

			<!-- Right: Generated PRD Output -->
			<motion.div
				initial={{ opacity: 0, x: 30 }}
				whileInView={{ opacity: 1, x: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
				class="rounded-3xl bg-slate-950 border border-white/5 overflow-hidden flex flex-col"
			>
				<!-- Header -->
				<div
					class="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-white/[0.02]"
				>
					<FileText class="w-4 h-4 text-orange-500/70" />
					<span class="text-xs font-semibold text-white">PRD Generated</span>
					<span
						class="ml-auto text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono"
						>✓ Complete</span
					>
				</div>

				<!-- PRD content preview -->
				<div class="p-6 space-y-5 flex-1 font-mono text-[11px]">
					<div>
						<span class="text-orange-500 font-bold"># Executive Summary</span>
						<p class="text-slate-400 mt-1.5 leading-relaxed">
							Platform SaaS untuk manajemen proyek dengan fitur workspace, task board, time
							tracking, dan billing. Target: Product Manager & Developer.
						</p>
					</div>
					<div>
						<span class="text-orange-500 font-bold">## User Stories</span>
						<div class="mt-2 space-y-1.5">
							<div class="flex gap-2 text-slate-400">
								<span class="text-orange-400 shrink-0">US-01</span>
								<span>Sebagai PM, saya ingin membuat workspace baru</span>
							</div>
							<div class="flex gap-2 text-slate-400">
								<span class="text-orange-400 shrink-0">US-02</span>
								<span>Sebagai Dev, saya ingin menugaskan task ke anggota</span>
							</div>
							<div class="flex gap-2 text-slate-400">
								<span class="text-orange-400 shrink-0">US-03</span>
								<span>Sebagai PM, saya ingin melacak waktu pengerjaan</span>
							</div>
						</div>
					</div>
					<div>
						<span class="text-orange-500 font-bold">## Sprint Roadmap</span>
						<div class="mt-2 grid grid-cols-3 gap-2">
							<div class="rounded-lg bg-white/[0.03] border border-white/5 p-2.5 text-center">
								<div class="text-white font-bold">Sprint 1</div>
								<div class="text-slate-500 text-[10px]">13 pts</div>
							</div>
							<div class="rounded-lg bg-white/[0.03] border border-white/5 p-2.5 text-center">
								<div class="text-white font-bold">Sprint 2</div>
								<div class="text-slate-500 text-[10px]">8 pts</div>
							</div>
							<div class="rounded-lg bg-white/[0.03] border border-white/5 p-2.5 text-center">
								<div class="text-white font-bold">Sprint 3</div>
								<div class="text-slate-500 text-[10px]">5 pts</div>
							</div>
						</div>
					</div>
					<div>
						<span class="text-orange-500 font-bold">## Quality Audit</span>
						<div class="mt-2 flex items-center gap-3">
							<div
								class="h-2 flex-1 rounded-full bg-white/5 overflow-hidden"
							>
								<div class="h-full w-[82%] rounded-full bg-gradient-to-r from-orange-500 to-emerald-500"></div>
							</div>
							<span class="text-emerald-400 font-bold">82/100</span>
						</div>
					</div>
				</div>

				<!-- Bottom -->
				<div
					class="px-5 py-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-600 font-mono"
				>
					<span>4 sections · 3 user stories</span>
					<span class="text-orange-500/70">34 story points total</span>
				</div>
			</motion.div>
		</div>
	</div>
</section>
