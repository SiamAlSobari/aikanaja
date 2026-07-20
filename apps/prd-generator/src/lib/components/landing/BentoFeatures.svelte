<script lang="ts">
	import { motion } from '@humanspeak/svelte-motion';
	import {
		Eye,
		Zap,
		Shield,
		FileCode,
		GitBranch,
		BarChart3
	} from 'lucide-svelte';

	const features = [
		{
			icon: Eye,
			title: 'Virtual Stakeholder Review',
			desc: 'AI mensimulasikan kritik dari Tech Lead, QA Engineer, dan Product Sponsor sebelum PRD sampai ke tim nyata.',
			span: 'col-span-2 row-span-2',
			accent: true
		},
		{
			icon: GitBranch,
			title: 'Auto Mermaid Diagrams',
			desc: 'User flow, sequence, dan arsitektur system digenerate otomatis dalam syntax Mermaid.js.',
			span: 'col-span-1 row-span-1',
			accent: false
		},
		{
			icon: Shield,
			title: 'Quality Score 0-100',
			desc: 'Deteksi kalimat samar, inspect completeness setiap user story.',
			span: 'col-span-1 row-span-1',
			accent: false
		},
		{
			icon: Zap,
			title: 'AI Copilot In-Editor',
			desc: 'Revisi acceptance criteria, tambah section, atau expand details langsung dari editor dengan AI copilot.',
			span: 'col-span-1 row-span-1',
			accent: false
		},
		{
			icon: FileCode,
			title: 'Export ke AGENTS.md',
			desc: 'Satu klik ekspor ke format siap baca Cursor, Claude Code, dan Antigravity.',
			span: 'col-span-1 row-span-1',
			accent: false
		},
		{
			icon: BarChart3,
			title: 'Sprint Auto-Plan',
			desc: 'Story points Fibonacci dan roadmap allocation ke Sprint 1/2/3 secara otomatis.',
			span: 'col-span-2 row-span-1',
			accent: false
		}
	];

	function handleMouseMove(e: MouseEvent) {
		const card = e.currentTarget as HTMLElement;
		const rect = card.getBoundingClientRect();
		card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
		card.style.setProperty('--my', `${e.clientY - rect.top}px`);
	}
</script>

<section id="features" class="relative py-28 lg:py-36">
	<!-- Top rule -->
	<div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

	<div class="max-w-6xl mx-auto px-5">
		<!-- Section header: left-aligned, editorial -->
		<div class="mb-20 max-w-xl">
			<span
				class="text-xs font-semibold text-orange-500 uppercase tracking-[0.2em] mb-4 block"
				>Fitur</span
			>
			<h2 class="text-4xl lg:text-5xl font-black tracking-[-0.03em] text-white leading-tight">
				Semua yang Butuh untuk<br />PRD yang Solid.
			</h2>
		</div>

		<!-- Bento Grid -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[180px]">
			{#each features as feat, i}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.2 }}
					transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
					onmousemove={handleMouseMove}
					role="presentation"
					class="group relative rounded-3xl border transition-all duration-500 overflow-hidden cursor-default {feat.span} {feat.accent
						? 'bg-gradient-to-br from-orange-600/10 via-slate-900/60 to-slate-900/60 border-orange-500/20 hover:border-orange-500/40'
						: 'bg-slate-900/40 border-white/5 hover:border-white/10'}"
				>
					<!-- Mouse glow -->
					<div
						class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
						style="background: radial-gradient(circle 200px at var(--mx, 50%) var(--my, 50%), {feat.accent
							? 'rgba(255,62,0,0.08)'
							: 'rgba(255,255,255,0.03)'}, transparent 80%);"
					></div>

					<div class="relative z-10 p-6 lg:p-8 flex flex-col h-full {feat.accent ? 'justify-between' : 'justify-end'}">
						{#if feat.accent}
							<div>
								<div
									class="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center mb-5"
								>
									<feat.icon class="w-6 h-6 text-orange-400" />
								</div>
								<h3
									class="text-2xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors"
								>
									{feat.title}
								</h3>
								<p class="text-sm text-slate-400 leading-relaxed max-w-sm">{feat.desc}</p>
							</div>
							<div class="flex items-center gap-3 mt-6 text-[11px] text-slate-500 font-mono">
								<span class="px-2 py-1 rounded-md bg-white/5">Tech Lead</span>
								<span class="px-2 py-1 rounded-md bg-white/5">QA Engineer</span>
								<span class="px-2 py-1 rounded-md bg-white/5">Business</span>
							</div>
						{:else}
							<div>
								<feat.icon
									class="w-5 h-5 text-orange-500/70 mb-3 group-hover:text-orange-400 transition-colors"
								/>
								<h3
									class="text-base font-bold text-white mb-2 group-hover:text-orange-400 transition-colors"
								>
									{feat.title}
								</h3>
								<p class="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
							</div>
						{/if}
					</div>
				</motion.div>
			{/each}
		</div>
	</div>
</section>
