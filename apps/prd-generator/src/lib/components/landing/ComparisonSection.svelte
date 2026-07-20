<script lang="ts">
	import { onMount } from 'svelte';
	import { Check, X, Minus } from 'lucide-svelte';

	let sectionEl = $state<HTMLElement | null>(null);

	const features = [
		{ label: '11 Seksi PRD Enterprise', prd: true, manual: false, notion: false },
		{ label: 'Virtual Stakeholder Review 3 Persona', prd: true, manual: false, notion: false },
		{ label: 'Mermaid.js Auto-Generated Diagrams', prd: true, manual: 'partial', notion: false },
		{ label: 'Audit Ambuitas & Quality Score', prd: true, manual: false, notion: false },
		{ label: 'Story Points Fibonacci & Sprint Planning', prd: true, manual: false, notion: 'partial' },
		{ label: 'AI Copilot In-Editor', prd: true, manual: 'partial', notion: false },
		{ label: 'Export ke AGENTS.md / PROMPT.md', prd: true, manual: false, notion: false },
		{ label: 'Visual Version Diff (Git-style)', prd: true, manual: false, notion: 'partial' },
		{ label: 'Custom API Key (Zero-Persistence)', prd: true, manual: false, notion: false },
		{ label: 'Multi-Format Export (MD, PDF, JSON)', prd: true, manual: false, notion: 'partial' }
	];

	function renderCell(val: boolean | string) {
		if (val === true) return 'check';
		if (val === false) return 'cross';
		return 'partial';
	}

	onMount(async () => {
		const { gsap } = await import('gsap');
		if (!sectionEl) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						gsap.from(sectionEl, {
							opacity: 0,
							y: 30,
							duration: 0.7,
							ease: 'power3.out'
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

<section bind:this={sectionEl} class="max-w-5xl mx-auto px-6 py-24 w-full">
	<div class="text-center space-y-3 max-w-xl mx-auto mb-14">
		<h2 class="text-xs font-mono font-bold text-orange-400 tracking-widest uppercase">Perbandingan</h2>
		<h3 class="text-3xl sm:text-5xl font-black text-white tracking-tight">Kenapa PRD Generator?</h3>
	</div>

	<div class="rounded-3xl bg-[#0a0e17] border border-white/[0.08] overflow-hidden shadow-2xl">
		<!-- Table header -->
		<div class="grid grid-cols-4 border-b border-white/[0.06]">
			<div class="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Fitur</div>
			<div class="p-5 text-center">
				<span class="inline-flex px-3 py-1.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-black">
					PRD Generator
				</span>
			</div>
			<div class="p-5 text-center text-xs font-bold text-slate-400">Manual ChatGPT</div>
			<div class="p-5 text-center text-xs font-bold text-slate-400">Notion Templates</div>
		</div>

		<!-- Table rows -->
		{#each features as feat, i}
			<div class="grid grid-cols-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01] transition-colors">
				<div class="p-4 text-sm text-slate-300 font-medium flex items-center">{feat.label}</div>
				<div class="p-4 flex items-center justify-center">
					{#if renderCell(feat.prd) === 'check'}
						<div class="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
							<Check class="w-3.5 h-3.5 text-orange-400" />
						</div>
					{:else}
						<X class="w-4 h-4 text-slate-600" />
					{/if}
				</div>
				<div class="p-4 flex items-center justify-center">
					{#if renderCell(feat.manual) === 'check'}
						<div class="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center">
							<Check class="w-3.5 h-3.5 text-emerald-400" />
						</div>
					{:else if renderCell(feat.manual) === 'partial'}
						<Minus class="w-4 h-4 text-slate-500" />
					{:else}
						<X class="w-4 h-4 text-slate-600" />
					{/if}
				</div>
				<div class="p-4 flex items-center justify-center">
					{#if renderCell(feat.notion) === 'check'}
						<div class="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center">
							<Check class="w-3.5 h-3.5 text-emerald-400" />
						</div>
					{:else if renderCell(feat.notion) === 'partial'}
						<Minus class="w-4 h-4 text-slate-500" />
					{:else}
						<X class="w-4 h-4 text-slate-600" />
					{/if}
				</div>
			</div>
		{/each}
	</div>
</section>
