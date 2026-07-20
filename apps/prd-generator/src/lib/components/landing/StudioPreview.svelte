<script lang="ts">
	import { onMount } from 'svelte';
	import { FileText, UserCheck, GitBranch, BarChart3, CheckCircle2, PanelLeft, PanelRight } from 'lucide-svelte';

	let activeTab = $state<'spec' | 'stakeholder' | 'mermaid' | 'audit'>('spec');
	let sectionEl = $state<HTMLElement | null>(null);

	onMount(async () => {
		const { gsap } = await import('gsap');
		if (!sectionEl) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						gsap.from(sectionEl, {
							opacity: 0,
							y: 40,
							duration: 0.8,
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

	function tabClass(active: boolean): string {
		if (active) return 'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 bg-orange-600/20 border border-orange-500/40 text-orange-300';
		return 'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 text-slate-400 hover:text-slate-200 border border-transparent';
	}

	function iconClass(active: boolean): string {
		if (active) return 'w-4 h-4 text-orange-400';
		return 'w-4 h-4';
	}
</script>

<section bind:this={sectionEl} id="studio" class="max-w-6xl mx-auto px-6 py-20 w-full">
	<div class="text-center space-y-3 mb-12">
		<h2 class="text-xs font-mono font-bold text-orange-400 tracking-widest uppercase">Live Preview</h2>
		<h3 class="text-2xl sm:text-4xl font-extrabold text-white">Lihat Hasil PRD Enterprise & Review AI</h3>
	</div>

	<div class="rounded-3xl bg-[#0a0e17] border border-white/[0.08] shadow-2xl backdrop-blur-2xl overflow-hidden">

		<!-- Title bar — IDE-style -->
		<div class="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
			<div class="flex items-center gap-3">
				<div class="flex items-center gap-1.5">
					<div class="w-3 h-3 rounded-full bg-orange-500/70"></div>
					<div class="w-3 h-3 rounded-full bg-amber-500/50"></div>
					<div class="w-3 h-3 rounded-full bg-emerald-500/40"></div>
				</div>
				<span class="font-mono text-[11px] text-slate-400 font-bold">PRD-THRIFT-ESCROW-V2.1.prd</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[10px] font-bold">
					<CheckCircle2 class="w-3 h-3" /> 98/100
				</span>
			</div>
		</div>

		<!-- Tabs -->
		<div class="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] overflow-x-auto">
			<button onclick={() => activeTab = 'spec'} class={tabClass(activeTab === 'spec')}>
				<FileText class={iconClass(activeTab === 'spec')} /> PRD Sections
			</button>
			<button onclick={() => activeTab = 'stakeholder'} class={tabClass(activeTab === 'stakeholder')}>
				<UserCheck class={iconClass(activeTab === 'stakeholder')} /> Virtual Review
			</button>
			<button onclick={() => activeTab = 'mermaid'} class={tabClass(activeTab === 'mermaid')}>
				<GitBranch class={iconClass(activeTab === 'mermaid')} /> Mermaid.js
			</button>
			<button onclick={() => activeTab = 'audit'} class={tabClass(activeTab === 'audit')}>
				<BarChart3 class={iconClass(activeTab === 'audit')} /> Quality Audit
			</button>
		</div>

		<!-- Split editor: left=source, right=preview -->
		<div class="grid grid-cols-1 lg:grid-cols-2 min-h-[320px]">

			<!-- Left pane: Markdown source -->
			<div class="border-r border-white/[0.06] p-5 bg-[#060911]">
				<div class="flex items-center gap-2 mb-3 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
					<PanelLeft class="w-3 h-3" /> Markdown Source
				</div>
				<div class="font-mono text-[11px] leading-relaxed text-slate-400 space-y-1.5">
					<div><span class="text-orange-500">#</span> <span class="text-slate-200 font-bold">Section 4.2</span></div>
					<div><span class="text-orange-500">##</span> Realtime Escrow Payment</div>
					<div class="text-slate-500">Alur transaksi penguncian saldo</div>
					<div class="text-slate-500">pembeli secara otomatis saat</div>
					<div class="text-slate-500">penawaran tertinggi diajukan.</div>
					<div class="pt-1"><span class="text-orange-500">###</span> <span class="text-amber-400">FR-01</span>: Auto-lock saldo</div>
					<div><span class="text-orange-500">###</span> <span class="text-amber-400">FR-02</span>: WebSocket broadcast</div>
					<div class="pt-1"><span class="text-orange-500">###</span> <span class="text-yellow-400">NFR-01</span>: Latency &lt; 100ms</div>
					<div class="text-slate-600">---</div>
					<div><span class="text-orange-500">```mermaid</span></div>
					<div class="text-amber-300/60 pl-2">sequenceDiagram</div>
					<div class="text-amber-300/60 pl-4">User->>API: POST /bids</div>
					<div class="text-amber-300/60 pl-4">API->>Redis: Validate</div>
					<div><span class="text-orange-500">```</span></div>
				</div>
			</div>

			<!-- Right pane: Rendered preview -->
			<div class="p-5 bg-[#080c14]">
				<div class="flex items-center gap-2 mb-3 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
					<PanelRight class="w-3 h-3" /> Rendered Preview
				</div>

				{#if activeTab === 'spec'}
					<div class="space-y-4">
						<div>
							<h4 class="text-sm font-bold text-white mb-2">Section 4.2: Realtime Escrow Payment</h4>
							<p class="text-xs text-slate-400 leading-relaxed">Alur transaksi penguncian saldo pembeli secara otomatis saat penawaran tertinggi diajukan.</p>
						</div>
						<div class="grid grid-cols-2 gap-3">
							<div class="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
								<p class="text-[10px] font-bold text-orange-400 mb-1">Functional Req</p>
								<ul class="text-[10px] text-slate-400 space-y-0.5 list-disc list-inside">
									<li>FR-01: Auto-lock saldo</li>
									<li>FR-02: WebSocket realtime</li>
								</ul>
							</div>
							<div class="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
								<p class="text-[10px] font-bold text-amber-400 mb-1">Non-Functional Req</p>
								<ul class="text-[10px] text-slate-400 space-y-0.5 list-disc list-inside">
									<li>NFR-01: Latency &lt; 100ms</li>
									<li>NFR-02: Idempotency token</li>
								</ul>
							</div>
						</div>
					</div>
				{:else if activeTab === 'stakeholder'}
					<div class="space-y-3">
						<h4 class="text-xs font-bold text-white mb-2">Evaluasi 3 Persona AI</h4>
						<div class="p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
							<p class="text-[10px] font-bold text-orange-400">Tech Lead</p>
							<p class="text-[10px] text-slate-400 italic">"Redis Pub/Sub untuk distribusi bid realtime."</p>
						</div>
						<div class="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
							<p class="text-[10px] font-bold text-amber-400">QA Engineer</p>
							<p class="text-[10px] text-slate-400 italic">"Edge case: concurrency race condition pada escrow lock."</p>
						</div>
						<div class="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
							<p class="text-[10px] font-bold text-yellow-400">Product Sponsor</p>
							<p class="text-[10px] text-slate-400 italic">"ROI escrow: tingkatkan trust 40%."</p>
						</div>
					</div>
				{:else if activeTab === 'mermaid'}
					<div class="space-y-3">
						<h4 class="text-xs font-bold text-orange-400 mb-2">Sequence Diagram</h4>
						<div class="p-4 rounded-lg bg-[#04060c] border border-white/[0.06] font-mono text-[10px] leading-relaxed text-amber-300/70">
							<div>sequenceDiagram</div>
							<div class="pl-3 text-slate-500">autonumber</div>
							<div class="pl-3">User->>Frontend: Bid Now</div>
							<div class="pl-3">Frontend->>API: POST /bids</div>
							<div class="pl-3">API->>Redis: Validate Bid</div>
							<div class="pl-3">Redis-->>API: OK</div>
							<div class="pl-3">API->>Escrow: Lock Balance</div>
							<div class="pl-3">Escrow-->>User: Notif: Diterima</div>
						</div>
					</div>
				{:else}
					<div class="space-y-4">
						<h4 class="text-xs font-bold text-white mb-2">Quality Audit</h4>
						<div>
							<div class="flex justify-between text-[10px] mb-1">
								<span class="text-slate-300">Zero Ambiguity</span>
								<span class="text-emerald-400 font-mono font-bold">100%</span>
							</div>
							<div class="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
								<div class="h-full bg-gradient-to-r from-orange-500 to-emerald-400 rounded-full w-full"></div>
							</div>
						</div>
						<div>
							<div class="flex justify-between text-[10px] mb-1">
								<span class="text-slate-300">11 Seksi Core</span>
								<span class="text-orange-400 font-mono font-bold">96%</span>
							</div>
							<div class="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
								<div class="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" style="width:96%"></div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
