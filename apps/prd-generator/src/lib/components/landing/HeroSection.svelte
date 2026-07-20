<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { ArrowRight, Sparkles, FileText, Wand2 } from 'lucide-svelte';

	let promptInput = $state('Aplikasi E-Commerce Thrifting dengan sistem Rekening Bersama (Escrow)');
	let promptExamples = [
		'App Ojek Online Multi-Stop & Surge Pricing',
		'SaaS POS Kasir Toko Retail Multi-Cabang',
		'LMS Belajar Koding dengan AI Mentor Realtime'
	];

	let sectionEl = $state<HTMLElement | null>(null);
	let typedText = $state('');
	const fullText = 'Alur transaksi penguncian saldo pembeli secara otomatis saat penawaran tertinggi diajukan. Saldo escrow ditahan hingga barang diterima.';
	let typingIdx = $state(0);

	let cleanupTyping: ReturnType<typeof setInterval> | undefined;

	onMount(async () => {
		const { gsap } = await import('gsap');
		if (!sectionEl) return;

		// Hero entrance animation
		const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
		tl.from('.hero-badge', { opacity: 0, y: 20, duration: 0.6 })
			.from('.hero-title-line', { opacity: 0, y: 50, duration: 0.8, stagger: 0.12 }, '-=0.3')
			.from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
			.from('.hero-prompt', { opacity: 0, y: 30, scale: 0.97, duration: 0.7 }, '-=0.3')
			.from('.hero-pills', { opacity: 0, y: 15, duration: 0.5 }, '-=0.3')
			.from('.hero-card', { opacity: 0, x: 40, duration: 0.8 }, '-=1.2');

		// Typing effect on the floating card
		cleanupTyping = setInterval(() => {
			if (typingIdx < fullText.length) {
				typedText += fullText[typingIdx];
				typingIdx++;
			} else if (cleanupTyping) {
				clearInterval(cleanupTyping);
			}
		}, 18);
	});

	onDestroy(() => {
		if (cleanupTyping) clearInterval(cleanupTyping);
	});
</script>

<section bind:this={sectionEl} class="relative w-full overflow-hidden">
	<div class="max-w-7xl mx-auto px-6 pt-28 pb-20 md:pt-36 md:pb-28 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

		<!-- Left: Editorial Typography -->
		<div class="lg:col-span-7 space-y-7 relative z-10">
			<div class="hero-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/25 text-xs font-semibold text-orange-400 backdrop-blur-xl">
				<span class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
				<Sparkles class="w-3.5 h-3.5" />
				<span>Gemini 2.0 Flash + Groq Speed Engine</span>
			</div>

			<h1 class="space-y-0.5">
				<span class="hero-title-line block text-5xl sm:text-6xl lg:text-[4.5rem] font-black tracking-tight text-white leading-[1.05]">
					Rancang PRD
				</span>
				<span class="hero-title-line block text-5xl sm:text-6xl lg:text-[4.5rem] font-black tracking-tight leading-[1.05]">
					<span class="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
						Software Enterprise
					</span>
				</span>
				<span class="hero-title-line block text-5xl sm:text-6xl lg:text-[4.5rem] font-black tracking-tight text-white leading-[1.05]">
					Otomatis
				</span>
			</h1>

			<p class="hero-subtitle text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
				Ubah gagasan produk menjadi Dokumen PRD <span class="text-orange-400 font-semibold">11 seksi enterprise</span> lengkap dengan Virtual Stakeholder Review, Mermaid.js Diagram, dan Exporter ke <code class="text-orange-300 font-mono text-sm bg-orange-950/50 px-2 py-0.5 rounded border border-orange-500/20">AGENTS.md</code>.
			</p>

			<!-- Prompt Input -->
			<div class="hero-prompt max-w-2xl">
				<div class="p-[1px] rounded-2xl bg-gradient-to-r from-orange-500/40 via-amber-500/30 to-orange-500/40">
					<div class="flex items-center gap-3 bg-[#0a0e17] rounded-2xl p-3">
						<div class="flex items-center gap-3 px-3 flex-1">
							<Wand2 class="w-5 h-5 text-orange-400 shrink-0" />
							<input
								type="text"
								bind:value={promptInput}
								placeholder="Tuliskan gagasan produk Anda..."
								class="w-full bg-transparent text-slate-100 text-sm focus:outline-none placeholder:text-slate-500 font-medium py-1.5"
							/>
						</div>
						<a
							href="/try"
							class="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 shrink-0 active:scale-95"
						>
							Generate
							<ArrowRight class="w-4 h-4" />
						</a>
					</div>
				</div>

				<div class="hero-pills flex flex-wrap items-center gap-2 mt-4 text-xs">
					<span class="text-slate-500 font-medium">Contoh:</span>
					{#each promptExamples as ex}
						<button
							onclick={() => promptInput = ex}
							class="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-orange-950/40 border border-white/[0.06] hover:border-orange-500/30 text-slate-400 hover:text-orange-300 transition-all text-xs font-medium"
						>
							{ex}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Right: Floating Document Preview Card with typing animation -->
		<div class="hero-card lg:col-span-5 flex justify-center lg:justify-end relative z-10">
			<div class="relative w-full max-w-md">
				<div class="relative rounded-3xl bg-[#0c1019] border border-white/[0.08] shadow-2xl overflow-hidden group">
					<!-- Card header bar -->
					<div class="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
						<div class="flex items-center gap-2">
							<div class="w-3 h-3 rounded-full bg-orange-500/70"></div>
							<div class="w-3 h-3 rounded-full bg-amber-500/50"></div>
							<div class="w-3 h-3 rounded-full bg-emerald-500/40"></div>
						</div>
						<span class="font-mono text-[10px] text-slate-500">PRD-thrifting-v2.1.prd</span>
					</div>

					<!-- Document content -->
					<div class="p-6 space-y-4">
						<!-- Section label -->
						<div class="flex items-center gap-2 text-orange-400">
							<FileText class="w-3.5 h-3.5" />
							<span class="text-[10px] font-mono font-bold tracking-wider uppercase">Section 4.2 — Escrow Payment</span>
						</div>

						<!-- Typing paragraph -->
						<div class="min-h-[60px]">
							<p class="text-xs text-slate-300 leading-relaxed">
								{typedText}<span class="animate-pulse text-orange-400 font-bold">|</span>
							</p>
						</div>

						<!-- Mini FR/NFR cards -->
						<div class="grid grid-cols-2 gap-3">
							<div class="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
								<p class="text-[10px] font-bold text-orange-400 mb-1.5">Functional Req</p>
								<div class="space-y-1.5">
									<div class="flex items-center gap-1.5">
										<span class="w-1 h-1 rounded-full bg-orange-500"></span>
										<span class="text-[10px] text-slate-400">Auto-lock saldo</span>
									</div>
									<div class="flex items-center gap-1.5">
										<span class="w-1 h-1 rounded-full bg-orange-500"></span>
										<span class="text-[10px] text-slate-400">WebSocket broadcast</span>
									</div>
								</div>
							</div>
							<div class="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
								<p class="text-[10px] font-bold text-amber-400 mb-1.5">User Stories</p>
								<div class="space-y-1.5">
									<div class="flex items-center gap-1.5">
										<span class="w-1 h-1 rounded-full bg-amber-500"></span>
										<span class="text-[10px] text-slate-400">As a buyer...</span>
									</div>
									<div class="flex items-center gap-1.5">
										<span class="w-1 h-1 rounded-full bg-amber-500"></span>
										<span class="text-[10px] text-slate-400">As a seller...</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Quality score -->
						<div class="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
							<div class="flex-1">
								<div class="flex justify-between text-[10px] mb-1">
									<span class="text-slate-300 font-semibold">Quality Score</span>
									<span class="text-emerald-400 font-mono font-bold">96/100</span>
								</div>
								<div class="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
									<div class="h-full bg-gradient-to-r from-orange-500 to-emerald-400 rounded-full" style="width: 96%"></div>
								</div>
							</div>
							<span class="text-lg font-black text-emerald-400">A+</span>
						</div>
					</div>
				</div>

				<!-- Decorative accents -->
				<div class="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
				<div class="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-500/8 rounded-full blur-3xl pointer-events-none"></div>
			</div>
		</div>
	</div>
</section>
