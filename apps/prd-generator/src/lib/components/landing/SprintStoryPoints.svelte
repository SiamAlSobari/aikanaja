<script lang="ts">
	import { onMount } from 'svelte';
	import { Layers, Target, Zap } from 'lucide-svelte';

	let sectionEl = $state<HTMLElement | null>(null);

	const sprints = [
		{
			name: 'Sprint 1',
			subtitle: 'MVP Launch',
			points: 21,
			stories: [
				{ name: 'Escrow Payment Engine', points: 8 },
				{ name: 'User Auth & Dashboard', points: 5 },
				{ name: 'PRD Wizard Form', points: 5 },
				{ name: 'Basic Export (MD)', points: 3 }
			]
		},
		{
			name: 'Sprint 2',
			subtitle: 'Expansion',
			points: 34,
			stories: [
				{ name: 'Virtual Stakeholder Review', points: 13 },
				{ name: 'Mermaid.js Auto-Gen', points: 8 },
				{ name: 'AI Copilot In-Editor', points: 8 },
				{ name: 'Quality Audit Engine', points: 5 }
			]
		},
		{
			name: 'Sprint 3',
			subtitle: 'Advanced',
			points: 21,
			stories: [
				{ name: 'Version Diff Viewer', points: 8 },
				{ name: 'PDF Export Engine', points: 5 },
				{ name: 'AGENTS.md Exporter', points: 5 },
				{ name: 'Share Link System', points: 3 }
			]
		}
	];

	onMount(async () => {
		const { gsap } = await import('gsap');
		if (!sectionEl) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && sectionEl) {
						gsap.from(sectionEl.querySelectorAll('.sprint-card'), {
							opacity: 0,
							y: 30,
							scale: 0.97,
							duration: 0.6,
							stagger: 0.12,
							ease: 'power3.out'
						});
						gsap.from(sectionEl.querySelectorAll('.point-bar'), {
							scaleX: 0,
							duration: 0.8,
							stagger: 0.08,
							ease: 'power3.out',
							delay: 0.4,
							transformOrigin: 'left'
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
	<div class="text-center space-y-3 max-w-xl mx-auto mb-14">
		<h2 class="text-xs font-mono font-bold text-orange-400 tracking-widest uppercase">Sprint Planning</h2>
		<h3 class="text-3xl sm:text-5xl font-black text-white tracking-tight">Story Points & Roadmap Otomatis</h3>
		<p class="text-slate-400 text-sm">AI menganalisis kompleksitas dan mengalokasikan User Story ke Sprint berdasarkan Fibonacci Story Points.</p>
	</div>

	<!-- Total stats -->
	<div class="flex items-center justify-center gap-8 mb-10 text-sm">
		<div class="flex items-center gap-2">
			<Target class="w-4 h-4 text-orange-400" />
			<span class="text-slate-400">Total Story Points:</span>
			<span class="text-white font-black text-lg">76</span>
		</div>
		<div class="flex items-center gap-2">
			<Layers class="w-4 h-4 text-amber-400" />
			<span class="text-slate-400">Sprints:</span>
			<span class="text-white font-black text-lg">3</span>
		</div>
		<div class="flex items-center gap-2">
			<Zap class="w-4 h-4 text-yellow-400" />
			<span class="text-slate-400">User Stories:</span>
			<span class="text-white font-black text-lg">12</span>
		</div>
	</div>

	<!-- Sprint 1: Orange -->
	<!-- Sprint 2: Amber -->
	<!-- Sprint 3: Yellow -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-5">
		<!-- Sprint 1 -->
		<div class="sprint-card rounded-2xl bg-[#0a0e17] border border-white/[0.06] p-6 space-y-5 hover:border-orange-500/30 transition-all duration-300">
			<div class="flex items-center justify-between">
				<div>
					<h4 class="text-lg font-black text-white">Sprint 1</h4>
					<p class="text-[11px] text-slate-500 font-mono">MVP Launch</p>
				</div>
				<div class="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center">
					<span class="text-lg font-black text-orange-400">21</span>
				</div>
			</div>
			<div class="space-y-3">
				<div class="space-y-1.5">
					<div class="flex items-center justify-between text-[11px]">
						<span class="text-slate-300 font-medium">Escrow Payment Engine</span>
						<span class="text-orange-400 font-mono font-bold">8 SP</span>
					</div>
					<div class="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
						<div class="point-bar h-full bg-orange-500/60 rounded-full" style="width: 61%"></div>
					</div>
				</div>
				<div class="space-y-1.5">
					<div class="flex items-center justify-between text-[11px]">
						<span class="text-slate-300 font-medium">User Auth & Dashboard</span>
						<span class="text-orange-400 font-mono font-bold">5 SP</span>
					</div>
					<div class="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
						<div class="point-bar h-full bg-orange-500/60 rounded-full" style="width: 38%"></div>
					</div>
				</div>
				<div class="space-y-1.5">
					<div class="flex items-center justify-between text-[11px]">
						<span class="text-slate-300 font-medium">PRD Wizard Form</span>
						<span class="text-orange-400 font-mono font-bold">5 SP</span>
					</div>
					<div class="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
						<div class="point-bar h-full bg-orange-500/60 rounded-full" style="width: 38%"></div>
					</div>
				</div>
				<div class="space-y-1.5">
					<div class="flex items-center justify-between text-[11px]">
						<span class="text-slate-300 font-medium">Basic Export (MD)</span>
						<span class="text-orange-400 font-mono font-bold">3 SP</span>
					</div>
					<div class="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
						<div class="point-bar h-full bg-orange-500/60 rounded-full" style="width: 23%"></div>
					</div>
				</div>
			</div>
			<div class="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-500">
				<span>4 User Stories</span>
				<span class="font-mono font-bold text-orange-400">21 pts</span>
			</div>
		</div>

		<!-- Sprint 2 -->
		<div class="sprint-card rounded-2xl bg-[#0a0e17] border border-white/[0.06] p-6 space-y-5 hover:border-amber-500/30 transition-all duration-300">
			<div class="flex items-center justify-between">
				<div>
					<h4 class="text-lg font-black text-white">Sprint 2</h4>
					<p class="text-[11px] text-slate-500 font-mono">Expansion</p>
				</div>
				<div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
					<span class="text-lg font-black text-amber-400">34</span>
				</div>
			</div>
			<div class="space-y-3">
				<div class="space-y-1.5">
					<div class="flex items-center justify-between text-[11px]">
						<span class="text-slate-300 font-medium">Virtual Stakeholder Review</span>
						<span class="text-amber-400 font-mono font-bold">13 SP</span>
					</div>
					<div class="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
						<div class="point-bar h-full bg-amber-500/60 rounded-full" style="width: 100%"></div>
					</div>
				</div>
				<div class="space-y-1.5">
					<div class="flex items-center justify-between text-[11px]">
						<span class="text-slate-300 font-medium">Mermaid.js Auto-Gen</span>
						<span class="text-amber-400 font-mono font-bold">8 SP</span>
					</div>
					<div class="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
						<div class="point-bar h-full bg-amber-500/60 rounded-full" style="width: 61%"></div>
					</div>
				</div>
				<div class="space-y-1.5">
					<div class="flex items-center justify-between text-[11px]">
						<span class="text-slate-300 font-medium">AI Copilot In-Editor</span>
						<span class="text-amber-400 font-mono font-bold">8 SP</span>
					</div>
					<div class="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
						<div class="point-bar h-full bg-amber-500/60 rounded-full" style="width: 61%"></div>
					</div>
				</div>
				<div class="space-y-1.5">
					<div class="flex items-center justify-between text-[11px]">
						<span class="text-slate-300 font-medium">Quality Audit Engine</span>
						<span class="text-amber-400 font-mono font-bold">5 SP</span>
					</div>
					<div class="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
						<div class="point-bar h-full bg-amber-500/60 rounded-full" style="width: 38%"></div>
					</div>
				</div>
			</div>
			<div class="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-500">
				<span>4 User Stories</span>
				<span class="font-mono font-bold text-amber-400">34 pts</span>
			</div>
		</div>

		<!-- Sprint 3 -->
		<div class="sprint-card rounded-2xl bg-[#0a0e17] border border-white/[0.06] p-6 space-y-5 hover:border-yellow-500/30 transition-all duration-300">
			<div class="flex items-center justify-between">
				<div>
					<h4 class="text-lg font-black text-white">Sprint 3</h4>
					<p class="text-[11px] text-slate-500 font-mono">Advanced</p>
				</div>
				<div class="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center">
					<span class="text-lg font-black text-yellow-400">21</span>
				</div>
			</div>
			<div class="space-y-3">
				<div class="space-y-1.5">
					<div class="flex items-center justify-between text-[11px]">
						<span class="text-slate-300 font-medium">Version Diff Viewer</span>
						<span class="text-yellow-400 font-mono font-bold">8 SP</span>
					</div>
					<div class="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
						<div class="point-bar h-full bg-yellow-500/60 rounded-full" style="width: 61%"></div>
					</div>
				</div>
				<div class="space-y-1.5">
					<div class="flex items-center justify-between text-[11px]">
						<span class="text-slate-300 font-medium">PDF Export Engine</span>
						<span class="text-yellow-400 font-mono font-bold">5 SP</span>
					</div>
					<div class="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
						<div class="point-bar h-full bg-yellow-500/60 rounded-full" style="width: 38%"></div>
					</div>
				</div>
				<div class="space-y-1.5">
					<div class="flex items-center justify-between text-[11px]">
						<span class="text-slate-300 font-medium">AGENTS.md Exporter</span>
						<span class="text-yellow-400 font-mono font-bold">5 SP</span>
					</div>
					<div class="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
						<div class="point-bar h-full bg-yellow-500/60 rounded-full" style="width: 38%"></div>
					</div>
				</div>
				<div class="space-y-1.5">
					<div class="flex items-center justify-between text-[11px]">
						<span class="text-slate-300 font-medium">Share Link System</span>
						<span class="text-yellow-400 font-mono font-bold">3 SP</span>
					</div>
					<div class="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
						<div class="point-bar h-full bg-yellow-500/60 rounded-full" style="width: 23%"></div>
					</div>
				</div>
			</div>
			<div class="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-500">
				<span>4 User Stories</span>
				<span class="font-mono font-bold text-yellow-400">21 pts</span>
			</div>
		</div>
	</div>
</section>
