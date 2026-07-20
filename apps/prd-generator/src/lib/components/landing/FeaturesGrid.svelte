<script lang="ts">
	import { onMount } from 'svelte';
	import { UserCheck, GitBranch, BarChart3, FileCode2, ArrowRight, MessageSquare, GitMerge, Target, Terminal } from 'lucide-svelte';

	let sectionEl = $state<HTMLElement | null>(null);

	function handleCardMouseMove(e: MouseEvent) {
		const card = e.currentTarget as HTMLElement;
		const rect = card.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		card.style.setProperty('--mouse-x', `${x}px`);
		card.style.setProperty('--mouse-y', `${y}px`);
	}

	onMount(async () => {
		const { gsap } = await import('gsap');
		if (!sectionEl) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && sectionEl) {
						gsap.from(sectionEl.querySelectorAll('.feat-card'), {
							opacity: 0,
							y: 40,
							duration: 0.7,
							stagger: 0.1,
							ease: 'power3.out'
						});
						observer.disconnect();
					}
				});
			},
			{ threshold: 0.08 }
		);
		observer.observe(sectionEl);
	});
</script>

<section bind:this={sectionEl} id="fitur" class="max-w-6xl mx-auto px-6 py-24 w-full">
	<div class="text-center space-y-3 max-w-xl mx-auto mb-16">
		<h2 class="text-xs font-mono font-bold text-orange-400 tracking-widest uppercase">Killer Features</h2>
		<h3 class="text-3xl sm:text-5xl font-black text-white tracking-tight">4 Fitur Pembeda Utama</h3>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-12 gap-5">

		<!-- CARD 1: Virtual Stakeholder Review — Large card with persona avatars -->
		<div
			class="feat-card md:col-span-7 group relative rounded-3xl bg-[#0a0e17] border border-white/[0.06] hover:border-orange-500/30 p-8 overflow-hidden transition-all duration-500"
			onmousemove={handleCardMouseMove}
			role="presentation"
		>
			<div class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style="background: radial-gradient(circle 400px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 140, 50, 0.04), transparent 70%);"></div>

			<!-- Decorative corner line -->
			<div class="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
				<div class="absolute top-0 right-0 w-[1px] h-20 bg-gradient-to-b from-orange-500/40 to-transparent"></div>
				<div class="absolute top-0 right-0 w-20 h-[1px] bg-gradient-to-l from-orange-500/40 to-transparent"></div>
			</div>

			<div class="relative z-10 space-y-6">
				<div class="flex items-start justify-between">
					<div class="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
						<UserCheck class="w-6 h-6 text-orange-400" />
					</div>
					<span class="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 text-[10px] font-mono font-bold tracking-wider">KILLER FEATURE</span>
				</div>

				<div class="space-y-2">
					<h4 class="text-2xl font-black text-white group-hover:text-orange-300 transition-colors">Virtual Stakeholder Review</h4>
					<p class="text-sm text-slate-400 leading-relaxed max-w-lg">3 Persona AI memberikan masukan kritis sebelum PRD diberikan ke tim nyata.</p>
				</div>

				<!-- Persona cards — mini avatars -->
				<div class="grid grid-cols-3 gap-3">
					<div class="p-3 rounded-xl bg-white/[0.03] border border-orange-500/20 space-y-1.5">
						<div class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
							<span class="text-[10px] font-black text-white">TL</span>
						</div>
						<p class="text-[11px] font-bold text-orange-400">Tech Lead</p>
						<p class="text-[10px] text-slate-500 leading-tight">Arsitektur & bottleneck</p>
					</div>
					<div class="p-3 rounded-xl bg-white/[0.03] border border-amber-500/20 space-y-1.5">
						<div class="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
							<span class="text-[10px] font-black text-white">QA</span>
						</div>
						<p class="text-[11px] font-bold text-amber-400">QA Engineer</p>
						<p class="text-[10px] text-slate-500 leading-tight">Edge cases & boundary</p>
					</div>
					<div class="p-3 rounded-xl bg-white/[0.03] border border-yellow-500/20 space-y-1.5">
						<div class="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
							<span class="text-[10px] font-black text-white">PS</span>
						</div>
						<p class="text-[11px] font-bold text-yellow-400">Sponsor</p>
						<p class="text-[10px] text-slate-500 leading-tight">ROI & nilai bisnis</p>
					</div>
				</div>
			</div>
		</div>

		<!-- CARD 2: Mermaid.js — Tall card with mini diagram preview -->
		<div
			class="feat-card md:col-span-5 group relative rounded-3xl bg-[#0a0e17] border border-white/[0.06] hover:border-amber-500/30 p-8 overflow-hidden transition-all duration-500"
			onmousemove={handleCardMouseMove}
			role="presentation"
		>
			<div class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style="background: radial-gradient(circle 300px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(245, 158, 11, 0.04), transparent 70%);"></div>

			<div class="relative z-10 space-y-5">
				<div class="flex items-center justify-between">
					<div class="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
						<GitBranch class="w-6 h-6 text-amber-400" />
					</div>
				</div>

				<div class="space-y-2">
					<h4 class="text-xl font-black text-white group-hover:text-amber-300 transition-colors">Mermaid.js Diagram Auto-Gen</h4>
					<p class="text-sm text-slate-400 leading-relaxed">Diagram sequence, arsitektur, dan user flow otomatis.</p>
				</div>

				<!-- Mini diagram mockup -->
				<div class="p-4 rounded-xl bg-[#060911] border border-white/[0.06] font-mono text-[10px] text-amber-300/70 leading-relaxed space-y-0.5">
					<div><span class="text-amber-500">sequenceDiagram</span></div>
					<div class="pl-3"><span class="text-slate-500">autonumber</span></div>
					<div class="pl-3">User->>Frontend: <span class="text-slate-300">Submit Form</span></div>
					<div class="pl-3">Frontend->>API: <span class="text-slate-300">POST /data</span></div>
					<div class="pl-3">API-->>User: <span class="text-slate-300">Response OK</span></div>
				</div>
			</div>
		</div>

		<!-- CARD 3: Quality Audit — Card with animated score meter -->
		<div
			class="feat-card md:col-span-5 group relative rounded-3xl bg-[#0a0e17] border border-white/[0.06] hover:border-orange-500/30 p-8 overflow-hidden transition-all duration-500"
			onmousemove={handleCardMouseMove}
			role="presentation"
		>
			<div class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style="background: radial-gradient(circle 300px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 140, 50, 0.04), transparent 70%);"></div>

			<div class="relative z-10 space-y-5">
				<div class="flex items-center justify-between">
					<div class="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
						<BarChart3 class="w-6 h-6 text-orange-400" />
					</div>
				</div>

				<div class="space-y-2">
					<h4 class="text-xl font-black text-white group-hover:text-orange-300 transition-colors">Audit Ambuitas & Story Points</h4>
					<p class="text-sm text-slate-400 leading-relaxed">Zero-ambiguity check + estimasi Fibonacci per sprint.</p>
				</div>

				<!-- Score gauge -->
				<div class="flex items-center gap-4 p-4 rounded-xl bg-[#060911] border border-white/[0.06]">
					<div class="relative w-16 h-16 shrink-0">
						<svg class="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
							<circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="5" />
							<circle cx="32" cy="32" r="28" fill="none" stroke="url(#gauge-gradient)" stroke-width="5" stroke-linecap="round" stroke-dasharray="176" stroke-dashoffset="7" />
							<defs>
								<linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" stop-color="#f97316" />
									<stop offset="100%" stop-color="#22c55e" />
								</linearGradient>
							</defs>
						</svg>
						<span class="absolute inset-0 flex items-center justify-center text-sm font-black text-white">96</span>
					</div>
					<div class="space-y-1.5 flex-1">
						<div class="flex justify-between text-[10px]">
							<span class="text-slate-400">Ambiguity Score</span>
							<span class="text-emerald-400 font-bold">A+</span>
						</div>
						<div class="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
							<div class="h-full bg-gradient-to-r from-orange-500 to-emerald-400 rounded-full" style="width: 96%"></div>
						</div>
						<p class="text-[9px] text-slate-600">11/11 seksi terpenuhi</p>
					</div>
				</div>
			</div>
		</div>

		<!-- CARD 4: AI Agent Export — Large card with terminal preview -->
		<div
			class="feat-card md:col-span-7 group relative rounded-3xl bg-[#0a0e17] border border-white/[0.06] hover:border-amber-500/30 p-8 overflow-hidden transition-all duration-500"
			onmousemove={handleCardMouseMove}
			role="presentation"
		>
			<div class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style="background: radial-gradient(circle 400px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(245, 158, 11, 0.04), transparent 70%);"></div>

			<!-- Decorative corner -->
			<div class="absolute bottom-0 left-0 w-32 h-32 overflow-hidden pointer-events-none">
				<div class="absolute bottom-0 left-0 w-[1px] h-20 bg-gradient-to-t from-amber-500/40 to-transparent"></div>
				<div class="absolute bottom-0 left-0 w-20 h-[1px] bg-gradient-to-r from-amber-500/40 to-transparent"></div>
			</div>

			<div class="relative z-10 space-y-6">
				<div class="flex items-start justify-between">
					<div class="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
						<FileCode2 class="w-6 h-6 text-amber-400" />
					</div>
					<span class="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold tracking-wider">ONE-CLICK</span>
				</div>

				<div class="space-y-2">
					<h4 class="text-2xl font-black text-white group-hover:text-amber-300 transition-colors">AI Coding Agent Prompt Exporter</h4>
					<p class="text-sm text-slate-400 leading-relaxed max-w-lg">Ekspor PRD menjadi spesifikasi terstruktur siap dibaca Cursor, Claude Code, atau Antigravity.</p>
				</div>

				<!-- Terminal mockup -->
				<div class="p-4 rounded-xl bg-[#060911] border border-white/[0.06] space-y-2">
					<div class="flex items-center gap-2 text-[10px] font-mono text-slate-500">
						<Terminal class="w-3 h-3 text-amber-400" />
						<span>export-agents.md</span>
					</div>
					<div class="font-mono text-[11px] space-y-1 text-slate-400">
						<div><span class="text-amber-500">#</span> <span class="text-slate-300">PRD: E-Commerce Thrifting v2.1</span></div>
						<div><span class="text-amber-500">##</span> Tech Stack: SvelteKit + Elysia + SQLite</div>
						<div><span class="text-amber-500">##</span> Sprint 1: 8 story points</div>
						<div><span class="text-amber-500">##</span> FR-01: Escrow Payment Engine</div>
						<div class="text-slate-600">...</div>
						<div><span class="text-emerald-500">✓</span> <span class="text-slate-500">Ready for AI Coding Agent</span></div>
					</div>
				</div>

				<div class="flex items-center gap-4 text-[11px] text-slate-500">
					<span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Cursor</span>
					<span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>Claude Code</span>
					<span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>Antigravity</span>
				</div>
			</div>
		</div>

	</div>
</section>
