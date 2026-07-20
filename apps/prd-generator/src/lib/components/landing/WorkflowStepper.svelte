<script lang="ts">
	import { onMount } from 'svelte';
	import { Wand2, FileText, Bot, Download, ChevronRight } from 'lucide-svelte';

	let sectionEl = $state<HTMLElement | null>(null);

	const steps = [
		{
			icon: Wand2,
			num: '01',
			title: 'Interactive Wizard',
			desc: 'Jawab panduan singkat seputar visi produk, target user, dan tech stack.',
			detail: '5 menit'
		},
		{
			icon: FileText,
			num: '02',
			title: 'AI Auto-Generation',
			desc: 'AI menggenerasi PRD 11 seksi dalam format Markdown dengan diagram Mermaid.js.',
			detail: '< 60 detik'
		},
		{
			icon: Bot,
			num: '03',
			title: 'Copilot & Audit',
			desc: 'Revisi dengan AI Copilot, jalankan Virtual Stakeholder Review & Quality Audit.',
			detail: 'Interactive'
		},
		{
			icon: Download,
			num: '04',
			title: 'Export & Share',
			desc: 'Ekspor ke Markdown, PDF, JSON Spec, atau AGENTS.md untuk AI Coding Agent.',
			detail: 'One-click'
		}
	];

	onMount(async () => {
		const { gsap } = await import('gsap');
		if (!sectionEl) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && sectionEl) {
						const items = sectionEl.querySelectorAll('.wf-step');
						const arrows = sectionEl.querySelectorAll('.wf-arrow');
						gsap.from(items, {
							opacity: 0,
							y: 30,
							duration: 0.5,
							stagger: 0.12,
							ease: 'power3.out'
						});
						gsap.from(arrows, {
							opacity: 0,
							x: -10,
							duration: 0.3,
							stagger: 0.12,
							ease: 'power3.out',
							delay: 0.5
						});
						observer.disconnect();
					}
				});
			},
			{ threshold: 0.1 }
		);
		observer.observe(sectionEl);
	});
</script>

<section bind:this={sectionEl} class="max-w-6xl mx-auto px-6 py-24 w-full">
	<div class="text-center space-y-3 max-w-xl mx-auto mb-16">
		<h2 class="text-xs font-mono font-bold text-orange-400 tracking-widest uppercase">Workflow</h2>
		<h3 class="text-3xl sm:text-5xl font-black text-white tracking-tight">4 Langkah Menuju PRD Enterprise</h3>
	</div>

	<!-- Horizontal flow — stacked on mobile, inline on desktop -->
	<div class="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-0">
		{#each steps as step, i}
			{@const Icon = step.icon}
			<!-- Step card -->
			<div class="wf-step flex-1 group">
				<div class="h-full p-6 rounded-2xl bg-[#0a0e17] border border-white/[0.06] hover:border-orange-500/25 transition-all duration-300 relative">
					<!-- Step number badge -->
					<div class="absolute -top-3 left-6 px-2.5 py-0.5 rounded-lg bg-orange-500 text-slate-950 text-[10px] font-black">
						STEP {step.num}
					</div>

					<div class="space-y-4 pt-2">
						<div class="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/25 flex items-center justify-center">
							<Icon class="w-5 h-5 text-orange-400" />
						</div>

						<div class="space-y-1.5">
							<h4 class="text-base font-bold text-white">{step.title}</h4>
							<p class="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
						</div>

						<div class="flex items-center gap-1.5 text-[10px] font-mono text-orange-400/70">
							<span class="w-1.5 h-1.5 rounded-full bg-orange-500/50"></span>
							{step.detail}
						</div>
					</div>
				</div>
			</div>

			<!-- Arrow connector (desktop only) -->
			{#if i < steps.length - 1}
				<div class="wf-arrow hidden lg:flex items-center justify-center w-8 shrink-0">
					<ChevronRight class="w-5 h-5 text-orange-500/40" />
				</div>
			{/if}
		{/each}
	</div>
</section>
