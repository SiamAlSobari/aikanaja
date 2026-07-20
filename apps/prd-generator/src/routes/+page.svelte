<script lang="ts">
	import DarkVeil from '$lib/components/DarkVeil.svelte';
	import {
		Sparkles,
		FileText,
		Bot,
		ArrowRight,
		Zap,
		ShieldCheck,
		GitBranch,
		CheckCircle2,
		Terminal,
		UserCheck,
		FileCode2,
		BarChart3,
		Wand2,
		Lock,
		Globe,
		Menu,
		X,
		Layers,
		Check,
		Copy,
		ExternalLink,
		ChevronRight,
		Star,
		Code2,
		Sliders
	} from 'lucide-svelte';

	// Interactive states
	let userPrompt = $state('Aplikasi E-Commerce Thrift Barang Bekas dengan Garansi Rekening Bersama (Escrow) & Live Bidding Realtime');
	let isGenerating = $state(false);
	let selectedTab = $state<'spec' | 'stakeholder' | 'mermaid' | 'audit' | 'export'>('spec');
	let mobileNavOpen = $state(false);
	let copiedText = $state(false);

	const promptIdeas = [
		{ label: '🛵 Ojek Online Multi-Stop', text: 'App Ojek Online dengan fitur Multi-Stop & Dynamic Surge Pricing' },
		{ label: '💳 SaaS POS Kasir Multi-Cabang', text: 'SaaS POS Kasir Toko Retail dengan Offline Sync & Laporan Keuangan AI' },
		{ label: '🎓 LMS Mentor AI Realtime', text: 'Platform LMS Belajar Koding dengan Live Playground & Mentor AI Assistant' }
	];

	function selectIdea(text: string) {
		userPrompt = text;
	}

	function handleCopySnippet() {
		copiedText = true;
		setTimeout(() => { copiedText = false; }, 2000);
	}
</script>

<svelte:head>
	<title>AiKanAja PRD — Enterprise AI Product Requirement Document Generator</title>
	<meta
		name="description"
		content="Platform AI generasi baru untuk merancang Product Requirement Document (PRD) 11 seksi enterprise otomatis dengan Gemini 2.0 Flash."
	/>
</svelte:head>

<!-- Root Container with Deep Obsidian Space Aesthetic -->
<div class="relative min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">

	<!-- DarkVeil Canvas WebGL Background Shader -->
	<div class="fixed inset-0 pointer-events-none z-0 opacity-35 mix-blend-screen">
		<DarkVeil hueShift={260} speed={0.35} warpAmount={0.12} noiseIntensity={0.015} />
	</div>

	<!-- Atmospheric Ambient Lights & High-Precision Grid Lines -->
	<div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
		<!-- Top Center Purple Orb Glow -->
		<div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-purple-600/25 via-fuchsia-600/15 to-transparent blur-[160px] rounded-full"></div>
		<!-- Left Accent Glow -->
		<div class="absolute top-[30%] -left-48 w-[500px] h-[500px] bg-indigo-600/15 blur-[150px] rounded-full"></div>
		<!-- Right Cyan Accent Glow -->
		<div class="absolute top-[60%] -right-48 w-[600px] h-[600px] bg-cyan-500/10 blur-[170px] rounded-full"></div>
		<!-- Cyber Mesh Lines Overlay -->
		<div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
	</div>

	<!-- Main Layout Content Wrapper -->
	<div class="relative z-10 flex flex-col justify-between min-h-screen">

		<!-- ==================== ULTRA-PREMIUM NAVBAR ==================== -->
		<header class="sticky top-0 z-50 w-full pt-4 px-4 sm:px-6 lg:px-8">
			<nav class="max-w-7xl mx-auto bg-slate-950/70 backdrop-blur-2xl border border-white/10 rounded-2xl px-5 sm:px-7 py-3.5 shadow-2xl shadow-purple-950/30 flex items-center justify-between transition-all">
				
				<!-- Brand Logo & Badge -->
				<a href="/" class="flex items-center gap-3.5 group">
					<div class="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-500 p-[1px] shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-all duration-300">
						<div class="w-full h-full bg-[#070b14] rounded-[11px] flex items-center justify-center text-purple-400">
							<FileText class="w-5 h-5 group-hover:rotate-6 transition-transform duration-300" />
						</div>
					</div>
					<div class="flex flex-col">
						<div class="flex items-center gap-2">
							<span class="font-black text-xl text-white tracking-tight">
								AiKanAja <span class="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">PRD</span>
							</span>
							<span class="px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-[10px] font-mono font-bold text-purple-300">v2.1</span>
						</div>
						<span class="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Enterprise AI Wizard</span>
					</div>
				</a>

				<!-- Desktop Navigation Links -->
				<div class="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300 tracking-wide">
					<a href="#fitur" class="hover:text-purple-400 transition-colors py-1">Fitur Killer</a>
					<a href="#demo" class="hover:text-purple-400 transition-colors py-1">Live Studio</a>
					<a href="#stakeholder" class="hover:text-purple-400 transition-colors py-1">3 Stakeholder AI</a>
					<a href="#security" class="hover:text-purple-400 transition-colors py-1">Zero-Persistence</a>
				</div>

				<!-- Right Actions -->
				<div class="hidden sm:flex items-center gap-3">
					<a
						href="/try"
						class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all"
					>
						Try Guest `/try`
					</a>
					<a
						href="/dashboard"
						class="relative group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 shadow-xl shadow-purple-500/25 transition-all duration-200 active:scale-95 overflow-hidden"
					>
						<Sparkles class="w-3.5 h-3.5 fill-slate-950" />
						<span>Buka Dashboard</span>
					</a>
				</div>

				<!-- Mobile Hamburger Button -->
				<button
					onclick={() => mobileNavOpen = !mobileNavOpen}
					class="md:hidden p-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-200 hover:bg-white/[0.1] transition-colors"
					aria-label="Toggle menu"
				>
					{#if mobileNavOpen}<X class="w-5 h-5" />{:else}<Menu class="w-5 h-5" />{/if}
				</button>
			</nav>

			<!-- Mobile Nav Menu Dropdown -->
			{#if mobileNavOpen}
				<div class="md:hidden mt-3 max-w-7xl mx-auto p-5 rounded-2xl bg-[#090d16]/95 backdrop-blur-3xl border border-white/10 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2">
					<a href="#fitur" onclick={() => mobileNavOpen = false} class="block text-sm font-medium text-slate-200 hover:text-purple-400">Fitur Killer</a>
					<a href="#demo" onclick={() => mobileNavOpen = false} class="block text-sm font-medium text-slate-200 hover:text-purple-400">Live Studio</a>
					<a href="#stakeholder" onclick={() => mobileNavOpen = false} class="block text-sm font-medium text-slate-200 hover:text-purple-400">3 Stakeholder AI</a>
					<a href="#security" onclick={() => mobileNavOpen = false} class="block text-sm font-medium text-slate-200 hover:text-purple-400">Zero-Persistence Security</a>
					<div class="pt-3 border-t border-white/10 flex flex-col gap-2.5">
						<a href="/try" class="w-full text-center py-2.5 text-xs font-semibold text-slate-200 bg-white/[0.06] rounded-xl border border-white/10">Try Guest `/try`</a>
						<a href="/dashboard" class="w-full text-center py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-purple-400 to-fuchsia-400 rounded-xl">Buka Dashboard</a>
					</div>
				</div>
			{/if}
		</header>

		<!-- ==================== HERO SECTION ==================== -->
		<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 w-full">
			<div class="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
				
				<!-- Engine Live Status Pill -->
				<div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-purple-500/30 text-xs font-semibold text-purple-300 shadow-xl shadow-purple-950/50 backdrop-blur-xl">
					<span class="flex h-2 w-2 relative">
						<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
						<span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
					</span>
					<Bot class="w-4 h-4 text-purple-400" />
					<span>Gemini 2.0 Flash + Groq Multi-AI Engine Ready</span>
				</div>

				<!-- Main Headline -->
				<h1 class="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.06]">
					Rancang <span class="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">PRD Enterprise</span> Tanpa Celah & Siap Eksekusi Koding
				</h1>

				<!-- Subtitle -->
				<p class="text-slate-300 text-base sm:text-xl font-normal leading-relaxed max-w-2xl">
					Ubah gagasan produk menjadi dokumen PRD 11 seksi enterprise lengkap dengan Virtual Stakeholder Review 3 Persona, Mermaid.js Diagram, Audit Ambuitas (0-100), dan Exporter ke <code class="text-purple-300 font-mono text-sm bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">AGENTS.md</code>.
				</p>

				<!-- Interactive Prompt Wizard Bar -->
				<div class="w-full max-w-3xl pt-2">
					<div class="relative p-2.5 rounded-3xl bg-gradient-to-r from-purple-600/30 via-fuchsia-600/30 to-cyan-500/20 border border-purple-500/40 shadow-2xl shadow-purple-950/60 backdrop-blur-2xl transition-all duration-300 hover:border-purple-500/60">
						<div class="flex flex-col sm:flex-row items-center gap-3 bg-[#070b14] rounded-2xl p-2.5">
							<div class="flex items-center gap-3 px-3 w-full sm:flex-1">
								<Wand2 class="w-5 h-5 text-purple-400 shrink-0" />
								<input
									type="text"
									bind:value={userPrompt}
									placeholder="Ketik ide produk Anda di sini..."
									class="w-full bg-transparent text-slate-100 text-sm focus:outline-none placeholder:text-slate-500 font-medium py-2"
								/>
							</div>
							<a
								href="/try"
								class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
							>
								<span>Generate PRD AI</span>
								<ArrowRight class="w-4 h-4" />
							</a>
						</div>
					</div>

					<!-- Quick Prompt Suggestion Pills -->
					<div class="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
						<span class="text-slate-400 font-medium">Contoh ide prompt:</span>
						{#each promptIdeas as idea}
							<button
								onclick={() => selectIdea(idea.text)}
								class="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-purple-950/40 border border-white/10 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 transition-all text-xs font-medium"
							>
								{idea.label}
							</button>
						{/each}
					</div>
				</div>
			</div>
		</section>

		<!-- ==================== LIVE INTERACTIVE STUDIO DECK ==================== -->
		<section id="demo" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
			<div class="text-center space-y-3 mb-10">
				<h2 class="text-xs font-mono font-bold text-purple-400 tracking-widest uppercase">LIVE PREVIEW STUDIO</h2>
				<h3 class="text-2xl sm:text-4xl font-extrabold text-white">Lihat Hasil PRD Enterprise & Review AI</h3>
			</div>

			<!-- Studio Frame -->
			<div class="relative w-full rounded-3xl bg-[#090d16] border border-white/10 p-4 sm:p-7 shadow-2xl shadow-purple-950/40 backdrop-blur-2xl overflow-hidden">
				
				<!-- Window Header Bar -->
				<div class="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10 mb-6">
					<div class="flex items-center gap-3">
						<div class="flex items-center gap-1.5">
							<div class="w-3 h-3 rounded-full bg-rose-500"></div>
							<div class="w-3 h-3 rounded-full bg-amber-500"></div>
							<div class="w-3 h-3 rounded-full bg-emerald-500"></div>
						</div>
						<span class="font-mono text-xs text-slate-300 font-bold bg-white/[0.05] px-3 py-1 rounded-lg border border-white/5">
							THRIFT-ESCROW-V2.1.prd
						</span>
					</div>

					<div class="flex items-center gap-3">
						<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
							<CheckCircle2 class="w-3.5 h-3.5" /> Skor Ambuitas: 98/100 (A+)
						</span>
						<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs">
							<Zap class="w-3.5 h-3.5 text-purple-400" /> Gemini 2.0 Flash
						</span>
					</div>
				</div>

				<!-- Tab Navigation Controls -->
				<div class="flex items-center gap-2 border-b border-white/10 pb-4 mb-6 overflow-x-auto">
					<button
						onclick={() => selectedTab = 'spec'}
						class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 {selectedTab === 'spec' ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300' : 'text-slate-400 hover:text-slate-200 bg-white/[0.02]'}"
					>
						<FileText class="w-4 h-4 text-purple-400" /> 11 Core PRD Sections
					</button>
					<button
						onclick={() => selectedTab = 'stakeholder'}
						class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 {selectedTab === 'stakeholder' ? 'bg-fuchsia-600/20 border border-fuchsia-500/40 text-fuchsia-300' : 'text-slate-400 hover:text-slate-200 bg-white/[0.02]'}"
					>
						<UserCheck class="w-4 h-4 text-fuchsia-400" /> Virtual Stakeholder Review
					</button>
					<button
						onclick={() => selectedTab = 'mermaid'}
						class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 {selectedTab === 'mermaid' ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-300' : 'text-slate-400 hover:text-slate-200 bg-white/[0.02]'}"
					>
						<GitBranch class="w-4 h-4 text-indigo-400" /> Mermaid.js Sequence
					</button>
					<button
						onclick={() => selectedTab = 'audit'}
						class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 {selectedTab === 'audit' ? 'bg-amber-600/20 border border-amber-500/40 text-amber-300' : 'text-slate-400 hover:text-slate-200 bg-white/[0.02]'}"
					>
						<BarChart3 class="w-4 h-4 text-amber-400" /> Audit Skor & Story Points
					</button>
					<button
						onclick={() => selectedTab = 'export'}
						class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 {selectedTab === 'export' ? 'bg-cyan-600/20 border border-cyan-500/40 text-cyan-300' : 'text-slate-400 hover:text-slate-200 bg-white/[0.02]'}"
					>
						<FileCode2 class="w-4 h-4 text-cyan-400" /> AGENTS.md Exporter
					</button>
				</div>

				<!-- Dynamic Content Panels -->
				<div class="min-h-[340px] bg-[#050811] border border-white/10 rounded-2xl p-6 relative">
					{#if selectedTab === 'spec'}
						<div class="space-y-4">
							<div class="flex items-center justify-between border-b border-white/10 pb-3">
								<h4 class="text-base font-bold text-white flex items-center gap-2">
									<FileText class="w-4 h-4 text-purple-400" /> Section 4.2: Realtime Escrow Payment & Bidding Architecture
								</h4>
								<span class="text-xs font-mono text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">Full Enterprise Spec</span>
							</div>

							<div class="prose prose-invert prose-xs max-w-none text-slate-300 leading-relaxed space-y-3">
								<p><strong class="text-purple-300">Deskripsi Alur:</strong> Pengguna mengajukan penawaran (bid) untuk produk secondhand. Dana penawaran tertinggi dikunci secara sementara di rekening escrow internal hingga barang diterima pembeli.</p>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
									<div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
										<p class="font-bold text-xs text-white mb-1">Functional Requirements (FR)</p>
										<ul class="list-disc list-inside text-[11px] text-slate-400 space-y-1">
											<li>FR-01: Auto-lock saldo pembeli saat penawaran sah.</li>
											<li>FR-02: WebSocket broadcast realtime saat ada bid baru.</li>
										</ul>
									</div>
									<div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
										<p class="font-bold text-xs text-white mb-1">Non-Functional Requirements (NFR)</p>
										<ul class="list-disc list-inside text-[11px] text-slate-400 space-y-1">
											<li>NFR-01: Latensi update penawaran &lt; 100ms.</li>
											<li>NFR-02: Idempotency token untuk transaksi penawaran ganda.</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					{:else if selectedTab === 'stakeholder'}
						<div class="space-y-4">
							<div class="flex items-center justify-between border-b border-white/10 pb-3">
								<h4 class="text-base font-bold text-white flex items-center gap-2">
									<UserCheck class="w-4 h-4 text-fuchsia-400" /> Kritik & Masukan dari 3 Stakeholder AI
								</h4>
								<span class="text-xs font-mono text-fuchsia-400 bg-fuchsia-500/10 px-3 py-1 rounded-full border border-fuchsia-500/20">3 Verified Persona Reviews</span>
							</div>

							<div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
								<div class="p-4 rounded-xl bg-white/[0.03] border border-purple-500/30 space-y-2">
									<div class="flex items-center gap-2">
										<span class="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center">CTO</span>
										<div>
											<p class="text-xs font-bold text-white">Chief Technology Officer</p>
											<p class="text-[10px] text-slate-400">Skalabilitas Backend</p>
										</div>
									</div>
									<p class="text-xs text-slate-300 leading-relaxed italic">"Arsitektur database sudah konsisten. Tambahkan instruksi Redis Pub/Sub untuk menghindari bottleneck DB utama saat surge bidding."</p>
								</div>

								<div class="p-4 rounded-xl bg-white/[0.03] border border-fuchsia-500/30 space-y-2">
									<div class="flex items-center gap-2">
										<span class="w-7 h-7 rounded-lg bg-fuchsia-500/20 text-fuchsia-300 font-bold text-xs flex items-center justify-center">PM</span>
										<div>
											<p class="text-xs font-bold text-white">Senior Product Manager</p>
											<p class="text-[10px] text-slate-400">Roadmap & Sprint Scope</p>
										</div>
									</div>
									<p class="text-xs text-slate-300 leading-relaxed italic">"Rincian Story Points Fibonacci 1-13 untuk Sprint 1 sangat rapi dan siap masuk ke backlog Jira/Linear."</p>
								</div>

								<div class="p-4 rounded-xl bg-white/[0.03] border border-pink-500/30 space-y-2">
									<div class="flex items-center gap-2">
										<span class="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-300 font-bold text-xs flex items-center justify-center">UX</span>
										<div>
											<p class="text-xs font-bold text-white">Lead Product Designer</p>
											<p class="text-[10px] text-slate-400">Interaksi & State UI</p>
										</div>
									</div>
									<p class="text-xs text-slate-300 leading-relaxed italic">"Sudah mencakup instruksi micro-animation feedback ketika bid berhasil divalidasi oleh sistem."</p>
								</div>
							</div>
						</div>
					{:else if selectedTab === 'mermaid'}
						<div class="space-y-3 font-mono text-xs">
							<div class="flex items-center justify-between border-b border-white/10 pb-3">
								<span class="text-xs font-bold text-indigo-400 flex items-center gap-2">
									<GitBranch class="w-4 h-4" /> Mermaid.js Sequence & Architecture Diagram Auto-Generated
								</span>
								<button onclick={handleCopySnippet} class="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 bg-white/[0.05] px-2.5 py-1 rounded-lg border border-white/10">
									{#if copiedText}<Check class="w-3.5 h-3.5 text-emerald-400" /> Copied{:else}<Copy class="w-3.5 h-3.5" /> Copy Mermaid Code{/if}
								</button>
							</div>
							<pre class="p-4 rounded-xl bg-[#03050b] border border-white/10 text-indigo-300 overflow-x-auto text-xs leading-relaxed">
sequenceDiagram
    autonumber
    User->>Frontend: Klik Tawar Barang (Bid Now)
    Frontend->>API Gateway: POST /api/bids &#123; itemId, amount &#125;
    API Gateway->>Redis Cache: Validate Current Highest Bid
    Redis Cache-->>API Gateway: OK (Bid Valid)
    API Gateway->>Escrow Engine: Lock Buyer Balance
    Escrow Engine-->>User: Notification: Penawaran Diterima
							</pre>
						</div>
					{:else if selectedTab === 'audit'}
						<div class="space-y-4">
							<div class="flex items-center justify-between border-b border-white/10 pb-3">
								<h4 class="text-base font-bold text-white flex items-center gap-2">
									<BarChart3 class="w-4 h-4 text-amber-400" /> Hasil Audit Ambuitas & Estimasi Sprint
								</h4>
								<span class="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Overall Score: 98/100</span>
							</div>

							<div class="space-y-4 pt-1">
								<div>
									<div class="flex justify-between text-xs mb-1.5">
										<span class="text-slate-200 font-semibold">Kejelasan Spesifikasi Teknis (Zero Ambiguous Phrases)</span>
										<span class="text-amber-400 font-mono font-bold">100%</span>
									</div>
									<div class="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-white/5">
										<div class="h-full bg-gradient-to-r from-amber-500 via-purple-500 to-emerald-400 w-full"></div>
									</div>
								</div>
								<div>
									<div class="flex justify-between text-xs mb-1.5">
										<span class="text-slate-200 font-semibold">Kelengkapan 11 Seksi Core PRD Enterprise</span>
										<span class="text-amber-400 font-mono font-bold">96%</span>
									</div>
									<div class="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-white/5">
										<div class="h-full bg-gradient-to-r from-purple-500 to-fuchsia-400 w-[96%]"></div>
									</div>
								</div>
							</div>
						</div>
					{:else if selectedTab === 'export'}
						<div class="space-y-3 font-mono text-xs">
							<div class="flex items-center justify-between border-b border-white/10 pb-3">
								<span class="text-xs font-bold text-cyan-400 flex items-center gap-2">
									<FileCode2 class="w-4 h-4" /> Ready-to-Use AGENTS.md Exporter (For Antigravity & Cursor)
								</span>
								<button onclick={handleCopySnippet} class="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 bg-white/[0.05] px-2.5 py-1 rounded-lg border border-white/10">
									{#if copiedText}<Check class="w-3.5 h-3.5 text-emerald-400" /> Copied{:else}<Copy class="w-3.5 h-3.5" /> Copy AGENTS.md{/if}
								</button>
							</div>
							<pre class="p-4 rounded-xl bg-[#03050b] border border-white/10 text-cyan-300 overflow-x-auto text-xs leading-relaxed">
# AGENTS.md — AI Coding Assistant Guidance
## Project: Thrifting Escrow App
- Arsitektur: SvelteKit 5 + ElysiaJS + Bun + Prisma SQLite
- Workflow: Implementasikan halaman bidding realtime sesuai PRD Section 4.2
- State Management: Gunakan Svelte 5 Runes ($state, $derived)
							</pre>
						</div>
					{/if}
				</div>
			</div>
		</section>

		<!-- ==================== 4 KILLER FEATURES SECTION ==================== -->
		<section id="fitur" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
			<div class="text-center space-y-4 max-w-2xl mx-auto mb-16">
				<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-semibold">
					KILLER FEATURES
				</div>
				<h2 class="text-3xl sm:text-5xl font-black text-white tracking-tight">
					4 Fitur Pembeda Utama
				</h2>
				<p class="text-slate-400 text-sm sm:text-base leading-relaxed">
					Dirancang khusus untuk Software Architect, Founder Startup, dan Product Lead agar PRD siap dieksekusi tim enginering tanpa revisi berulang.
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<!-- Card 1 -->
				<div class="p-7 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-purple-500/50 transition-all duration-300 space-y-4 group hover:bg-white/[0.04]">
					<div class="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
						<UserCheck class="w-6 h-6" />
					</div>
					<h3 class="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">Virtual Stakeholder Review</h3>
					<p class="text-xs text-slate-400 leading-relaxed">3 Persona AI (CTO, Senior PM, UI/UX Lead) yang memberikan kritik konstruktif dan rekomendasi edge-cases sebelum koding dimulai.</p>
				</div>

				<!-- Card 2 -->
				<div class="p-7 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-fuchsia-500/50 transition-all duration-300 space-y-4 group hover:bg-white/[0.04]">
					<div class="w-12 h-12 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 transition-transform">
						<GitBranch class="w-6 h-6" />
					</div>
					<h3 class="text-lg font-bold text-white group-hover:text-fuchsia-300 transition-colors">Mermaid.js Diagram Generator</h3>
					<p class="text-xs text-slate-400 leading-relaxed">Otomatis menggenerasi diagram sequence, visual arsitektur sistem, dan alur transaksi pengguna dalam format Mermaid.js.</p>
				</div>

				<!-- Card 3 -->
				<div class="p-7 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-amber-500/50 transition-all duration-300 space-y-4 group hover:bg-white/[0.04]">
					<div class="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
						<BarChart3 class="w-6 h-6" />
					</div>
					<h3 class="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">Audit Ambuitas & Story Points</h3>
					<p class="text-xs text-slate-400 leading-relaxed">Mesin audit yang memeriksa kata-kata mengambang dan mengalkulasi estimasi Story Points Fibonacci (1-13) per Sprint.</p>
				</div>

				<!-- Card 4 -->
				<div class="p-7 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/50 transition-all duration-300 space-y-4 group hover:bg-white/[0.04]">
					<div class="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
						<FileCode2 class="w-6 h-6" />
					</div>
					<h3 class="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">AI Agent Exporter</h3>
					<p class="text-xs text-slate-400 leading-relaxed">Ekspor PRD langsung menjadi file `AGENTS.md` atau `PROMPT.md` siap pakai untuk Antigravity, Cursor, atau Claude Code.</p>
				</div>
			</div>
		</section>

		<!-- ==================== ZERO-PERSISTENCE SECURITY BANNER ==================== -->
		<section id="security" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
			<div class="relative p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-950 to-indigo-950/40 border border-purple-500/30 backdrop-blur-2xl flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl shadow-purple-950/30 overflow-hidden">
				
				<div class="space-y-4 max-w-2xl text-left">
					<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
						<Lock class="w-3.5 h-3.5" /> Zero-Persistence Client-Side Security
					</div>
					<h3 class="text-2xl sm:text-4xl font-black text-white">Gunakan Custom API Key (Gemini 2.0 Flash / Groq)</h3>
					<p class="text-slate-300 text-sm sm:text-base leading-relaxed">
						API Key pribadi Anda disimpan <span class="text-purple-300 font-bold">100% aman di LocalStorage browser</span> Anda. Server AiKanAja tidak pernah menyimpan API Key pengguna ke database, memberikan generasi PRD <span class="text-purple-300 font-bold">UNLIMITED</span> secara bebas & tanpa biaya kuota server!
					</p>
				</div>

				<a
					href="/try"
					class="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-400 hover:to-fuchsia-400 text-slate-950 font-black text-sm shadow-xl shadow-purple-500/30 transition-all shrink-0 active:scale-95 flex items-center gap-2"
				>
					<span>Mulai Coba di `/try`</span>
					<ArrowRight class="w-4 h-4" />
				</a>
			</div>
		</section>

		<!-- ==================== FOOTER ==================== -->
		<footer class="border-t border-white/10 bg-[#02050c] py-12">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
				<div class="flex items-center gap-3">
					<div class="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">P</div>
					<div>
						<p class="text-slate-200 font-bold text-sm">AiKanAja PRD Generator</p>
						<p class="text-[11px] text-slate-400">Ekosistem AI Developer Tool AiKanAja</p>
					</div>
				</div>

				<div class="flex flex-wrap items-center gap-6 text-slate-300 font-medium">
					<a href="/try" class="hover:text-purple-400 transition-colors">Guest Try</a>
					<a href="/dashboard" class="hover:text-purple-400 transition-colors">Dashboard</a>
					<a href="https://github.com/SiamAlSobari/aikanaja" target="_blank" rel="noreferrer" class="hover:text-purple-400 transition-colors flex items-center gap-1">
						GitHub <ExternalLink class="w-3 h-3" />
					</a>
				</div>

				<p class="text-slate-400 text-[11px]">&copy; 2026 AiKanAja. All rights reserved.</p>
			</div>
		</footer>
	</div>
</div>
