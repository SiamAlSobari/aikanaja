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
		UserCheck,
		FileCode2,
		BarChart3,
		Wand2,
		Lock,
		CheckCircle2,
		Menu,
		X
	} from 'lucide-svelte';

	let promptInput = $state('Aplikasi E-Commerce Thrifting dengan sistem Rekening Bersama (Escrow) & Realtime Bidding');
	let activeTab = $state<'spec' | 'stakeholder' | 'mermaid' | 'audit'>('spec');
	let mobileMenuOpen = $state(false);

	const promptExamples = [
		'App Ojek Online Multi-Stop & Surge Pricing',
		'SaaS POS Kasir Toko Retail Multi-Cabang',
		'LMS Belajar Koding dengan AI Mentor Realtime'
	];
</script>

<svelte:head>
	<title>AiKanAja PRD — Enterprise AI Product Requirement Document Generator</title>
	<meta name="description" content="Platform AI pembuat Product Requirement Document (PRD) 11 seksi enterprise otomatis dengan Gemini 2.0 Flash." />
</svelte:head>

<!-- Root Container with Deep Obsidian Space Theme -->
<div class="relative min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">

	<!-- DarkVeil Canvas WebGL Shader Background -->
	<div class="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen">
		<DarkVeil hueShift={260} speed={0.35} warpAmount={0.12} noiseIntensity={0.015} />
	</div>

	<!-- Background Ambient Glow & Subtle Grid -->
	<div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
		<div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-purple-600/20 via-fuchsia-600/10 to-transparent blur-[160px] rounded-full"></div>
		<div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
	</div>

	<!-- Main Layout -->
	<div class="relative z-10 flex flex-col justify-between min-h-screen">

		<!-- ==================== CLEAN FLOATING NAVBAR ==================== -->
		<header class="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8">
			<nav class="max-w-6xl mx-auto bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl px-6 py-3.5 shadow-2xl flex items-center justify-between">
				
				<!-- Brand Logo -->
				<a href="/" class="flex items-center gap-3 group">
					<div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-500 p-[1px] shadow-lg shadow-purple-500/30">
						<div class="w-full h-full bg-[#070b14] rounded-[11px] flex items-center justify-center text-purple-400">
							<FileText class="w-4 h-4" />
						</div>
					</div>
					<div class="flex flex-col">
						<span class="font-extrabold text-lg text-white tracking-tight leading-none">
							AiKanAja <span class="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">PRD</span>
						</span>
						<span class="text-[9px] text-slate-400 font-mono tracking-widest uppercase mt-0.5">Enterprise AI</span>
					</div>
				</a>

				<!-- Navigation Links -->
				<div class="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
					<a href="#fitur" class="hover:text-purple-400 transition-colors">Fitur Principal</a>
					<a href="#studio" class="hover:text-purple-400 transition-colors">Live Studio</a>
					<a href="#keamanan" class="hover:text-purple-400 transition-colors">Keamanan Key</a>
				</div>

				<!-- Header CTA Buttons -->
				<div class="hidden sm:flex items-center gap-3">
					<a
						href="/try"
						class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.05] border border-white/10 transition-all"
					>
						Try Mode `/try`
					</a>
					<a
						href="/dashboard"
						class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 shadow-xl shadow-purple-500/25 transition-all active:scale-95"
					>
						<Sparkles class="w-3.5 h-3.5 fill-slate-950" />
						<span>Dashboard</span>
					</a>
				</div>

				<!-- Mobile Menu Button -->
				<button
					onclick={() => mobileMenuOpen = !mobileMenuOpen}
					class="md:hidden p-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-200"
				>
					{#if mobileMenuOpen}<X class="w-5 h-5" />{:else}<Menu class="w-5 h-5" />{/if}
				</button>
			</nav>

			{#if mobileMenuOpen}
				<div class="md:hidden mt-3 max-w-6xl mx-auto p-5 rounded-2xl bg-[#090d16]/95 backdrop-blur-3xl border border-white/10 space-y-3 shadow-2xl">
					<a href="#fitur" onclick={() => mobileMenuOpen = false} class="block text-sm text-slate-200">Fitur Principal</a>
					<a href="#studio" onclick={() => mobileMenuOpen = false} class="block text-sm text-slate-200">Live Studio</a>
					<a href="#keamanan" onclick={() => mobileMenuOpen = false} class="block text-sm text-slate-200">Keamanan Key</a>
					<div class="pt-2 border-t border-white/10 flex flex-col gap-2">
						<a href="/try" class="w-full text-center py-2 text-xs font-semibold text-slate-200 bg-white/[0.05] rounded-xl">Try Mode</a>
						<a href="/dashboard" class="w-full text-center py-2 text-xs font-bold text-slate-950 bg-purple-400 rounded-xl">Dashboard</a>
					</div>
				</div>
			{/if}
		</header>

		<!-- ==================== HERO SECTION ==================== -->
		<section class="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center w-full">
			<div class="space-y-8">
				
				<!-- Engine Badge -->
				<div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-purple-500/30 text-xs font-semibold text-purple-300 backdrop-blur-xl">
					<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
					<Bot class="w-4 h-4 text-purple-400" />
					<span>Gemini 2.0 Flash + Groq Speed Engine</span>
				</div>

				<!-- Main Title -->
				<h1 class="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
					Rancang <span class="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">PRD Software Enterprise</span> Presisi Tinggi & Otomatis
				</h1>

				<!-- Subtitle -->
				<p class="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
					Ubah gagasan produk menjadi Dokumen PRD 11 seksi enterprise lengkap dengan Virtual Stakeholder Review 3 Persona, Mermaid.js Diagram, Audit Ambuitas, dan Exporter ke <code class="text-purple-300 font-mono text-sm bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">AGENTS.md</code>.
				</p>

				<!-- Interactive Prompt Input Box -->
				<div class="max-w-3xl mx-auto pt-2">
					<div class="p-2.5 rounded-3xl bg-gradient-to-r from-purple-600/30 via-fuchsia-600/30 to-cyan-500/20 border border-purple-500/40 shadow-2xl backdrop-blur-2xl">
						<div class="flex flex-col sm:flex-row items-center gap-3 bg-[#070b14] rounded-2xl p-3">
							<div class="flex items-center gap-3 px-3 w-full sm:flex-1">
								<Wand2 class="w-5 h-5 text-purple-400 shrink-0" />
								<input
									type="text"
									bind:value={promptInput}
									placeholder="Tuliskan gagasan produk Anda..."
									class="w-full bg-transparent text-slate-100 text-sm focus:outline-none placeholder:text-slate-500 font-medium py-1.5"
								/>
							</div>
							<a
								href="/try"
								class="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-slate-950 font-black text-xs shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
							>
								<span>Generate PRD</span>
								<ArrowRight class="w-4 h-4" />
							</a>
						</div>
					</div>

					<!-- Prompt Idea Pills -->
					<div class="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
						<span class="text-slate-500 font-medium">Contoh prompt:</span>
						{#each promptExamples as ex}
							<button
								onclick={() => promptInput = ex}
								class="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-purple-950/40 border border-white/10 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 transition-all text-xs font-medium"
							>
								{ex}
							</button>
						{/each}
					</div>
				</div>

			</div>
		</section>

		<!-- ==================== LIVE STUDIO PREVIEW DECK ==================== -->
		<section id="studio" class="max-w-6xl mx-auto px-6 py-12 w-full">
			<div class="text-center space-y-3 mb-10">
				<h2 class="text-xs font-mono font-bold text-purple-400 tracking-widest uppercase">INTERACTIVE LIVE STUDIO</h2>
				<h3 class="text-2xl sm:text-4xl font-extrabold text-white">Lihat Hasil PRD Enterprise & Review AI</h3>
			</div>

			<div class="rounded-3xl bg-[#090d16] border border-white/10 p-5 sm:p-8 shadow-2xl backdrop-blur-2xl">
				
				<!-- Studio Top Bar -->
				<div class="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10 mb-6">
					<div class="flex items-center gap-3">
						<div class="flex items-center gap-1.5">
							<div class="w-3 h-3 rounded-full bg-rose-500"></div>
							<div class="w-3 h-3 rounded-full bg-amber-500"></div>
							<div class="w-3 h-3 rounded-full bg-emerald-500"></div>
						</div>
						<span class="font-mono text-xs text-slate-300 font-bold bg-white/[0.05] px-3 py-1 rounded-lg border border-white/5">
							PRD-THRIFT-ESCROW-V2.1.prd
						</span>
					</div>

					<div class="flex items-center gap-3">
						<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
							<CheckCircle2 class="w-3.5 h-3.5" /> Skor Ambuitas: 98/100 (Grade A+)
						</span>
					</div>
				</div>

				<!-- Navigation Tabs -->
				<div class="flex items-center gap-2 border-b border-white/10 pb-4 mb-6 overflow-x-auto">
					<button
						onclick={() => activeTab = 'spec'}
						class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 {activeTab === 'spec' ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300' : 'text-slate-400 hover:text-slate-200'}"
					>
						<FileText class="w-4 h-4 text-purple-400" /> 11 Core PRD Sections
					</button>
					<button
						onclick={() => activeTab = 'stakeholder'}
						class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 {activeTab === 'stakeholder' ? 'bg-fuchsia-600/20 border border-fuchsia-500/40 text-fuchsia-300' : 'text-slate-400 hover:text-slate-200'}"
					>
						<UserCheck class="w-4 h-4 text-fuchsia-400" /> Virtual Stakeholder Review
					</button>
					<button
						onclick={() => activeTab = 'mermaid'}
						class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 {activeTab === 'mermaid' ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-300' : 'text-slate-400 hover:text-slate-200'}"
					>
						<GitBranch class="w-4 h-4 text-indigo-400" /> Mermaid.js Sequence
					</button>
					<button
						onclick={() => activeTab = 'audit'}
						class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 {activeTab === 'audit' ? 'bg-amber-600/20 border border-amber-500/40 text-amber-300' : 'text-slate-400 hover:text-slate-200'}"
					>
						<BarChart3 class="w-4 h-4 text-amber-400" /> Audit Ambuitas (0-100)
					</button>
				</div>

				<!-- Panel View -->
				<div class="min-h-[300px] bg-[#050811] border border-white/10 rounded-2xl p-6">
					{#if activeTab === 'spec'}
						<div class="space-y-4">
							<h4 class="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
								<FileText class="w-4 h-4 text-purple-400" /> Section 4.2: Realtime Escrow Payment & Bidding Architecture
							</h4>
							<p class="text-xs text-slate-300 leading-relaxed">
								Alur transaksi penguncian saldo pembeli secara otomatis saat penawaran tertinggi diajukan. Saldo escrow ditahan di sistem hingga barang diterima dan dikonfirmasi pembeli.
							</p>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
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
										<li>NFR-02: Idempotency token untuk transaksi ganda.</li>
									</ul>
								</div>
							</div>
						</div>
					{:else if activeTab === 'stakeholder'}
						<div class="space-y-4">
							<h4 class="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
								<UserCheck class="w-4 h-4 text-fuchsia-400" /> Hasil Evaluasi 3 Persona Stakeholder AI
							</h4>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
								<div class="p-4 rounded-xl bg-white/[0.03] border border-purple-500/30 space-y-2">
									<p class="text-xs font-bold text-white">CTO (Chief Technology Officer)</p>
									<p class="text-[11px] text-slate-300 italic">"Gunakan Redis Pub/Sub untuk mendistribusikan lalu lintas bid realtime agar database tidak bottleneck."</p>
								</div>
								<div class="p-4 rounded-xl bg-white/[0.03] border border-fuchsia-500/30 space-y-2">
									<p class="text-xs font-bold text-white">Senior Product Manager</p>
									<p class="text-[11px] text-slate-300 italic">"Rincian Story Points Fibonacci 1-13 untuk Sprint 1 sangat realistis untuk dieksekusi 4 engineer."</p>
								</div>
								<div class="p-4 rounded-xl bg-white/[0.03] border border-pink-500/30 space-y-2">
									<p class="text-xs font-bold text-white">Lead UI/UX Designer</p>
									<p class="text-[11px] text-slate-300 italic">"Desain interaksi sudah mencakup empty state & micro-animations saat penawaran berhasil."</p>
								</div>
							</div>
						</div>
					{:else if activeTab === 'mermaid'}
						<div class="space-y-3 font-mono text-xs">
							<h4 class="text-xs font-bold text-indigo-400 flex items-center gap-2 border-b border-white/10 pb-3">
								<GitBranch class="w-4 h-4" /> Mermaid.js Sequence Diagram Auto-Generated
							</h4>
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
					{:else if activeTab === 'audit'}
						<div class="space-y-4">
							<h4 class="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
								<BarChart3 class="w-4 h-4 text-amber-400" /> Hasil Audit Ambuitas & Story Points
							</h4>
							<div class="space-y-3">
								<div>
									<div class="flex justify-between text-xs mb-1">
										<span class="text-slate-200 font-semibold">Kejelasan Spesifikasi Teknis (Zero Ambiguity)</span>
										<span class="text-amber-400 font-mono font-bold">100%</span>
									</div>
									<div class="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
										<div class="h-full bg-gradient-to-r from-amber-500 to-emerald-400 w-full"></div>
									</div>
								</div>
								<div>
									<div class="flex justify-between text-xs mb-1">
										<span class="text-slate-200 font-semibold">Kelengkapan 11 Seksi Core PRD Enterprise</span>
										<span class="text-amber-400 font-mono font-bold">96%</span>
									</div>
									<div class="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
										<div class="h-full bg-gradient-to-r from-purple-500 to-fuchsia-400 w-[96%]"></div>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>

			</div>
		</section>

		<!-- ==================== 4 KILLER FEATURES ==================== -->
		<section id="fitur" class="max-w-6xl mx-auto px-6 py-20 w-full">
			<div class="text-center space-y-3 max-w-xl mx-auto mb-14">
				<h2 class="text-xs font-mono font-bold text-purple-400 tracking-widest uppercase">FITUR UTAMA</h2>
				<h3 class="text-3xl sm:text-5xl font-black text-white tracking-tight">4 Fitur Pembeda Utama</h3>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div class="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-purple-500/50 transition-all space-y-3">
					<div class="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold">
						<UserCheck class="w-5 h-5" />
					</div>
					<h4 class="text-base font-bold text-white">Virtual Stakeholder Review</h4>
					<p class="text-xs text-slate-400 leading-relaxed">3 Persona AI (CTO, Senior PM, UI/UX Lead) memberikan masukan konstruktif sebelum koding dimulai.</p>
				</div>

				<div class="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-fuchsia-500/50 transition-all space-y-3">
					<div class="w-10 h-10 rounded-xl bg-fuchsia-500/15 text-fuchsia-400 flex items-center justify-center font-bold">
						<GitBranch class="w-5 h-5" />
					</div>
					<h4 class="text-base font-bold text-white">Mermaid.js Diagram Auto-Gen</h4>
					<p class="text-xs text-slate-400 leading-relaxed">Generasi otomatis diagram sequence, arsitektur sistem, dan alur transaksi pengguna dalam Mermaid.js.</p>
				</div>

				<div class="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-amber-500/50 transition-all space-y-3">
					<div class="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
						<BarChart3 class="w-5 h-5" />
					</div>
					<h4 class="text-base font-bold text-white">Audit Ambuitas & Story Points</h4>
					<p class="text-xs text-slate-400 leading-relaxed">Memeriksa klausa ambigu dan mengalkulasi estimasi Story Points Fibonacci (1-13) per Sprint.</p>
				</div>

				<div class="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/50 transition-all space-y-3">
					<div class="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-bold">
						<FileCode2 class="w-5 h-5" />
					</div>
					<h4 class="text-base font-bold text-white">AI Agent Exporter</h4>
					<p class="text-xs text-slate-400 leading-relaxed">Ekspor PRD menjadi file `AGENTS.md` atau `PROMPT.md` siap dimasukkan ke Antigravity, Cursor, atau Claude Code.</p>
				</div>
			</div>
		</section>

		<!-- ==================== ZERO-PERSISTENCE SECURITY BANNER ==================== -->
		<section id="keamanan" class="max-w-6xl mx-auto px-6 py-12 w-full">
			<div class="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-950 to-indigo-950/40 border border-purple-500/30 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-8">
				<div class="space-y-3 max-w-xl text-left">
					<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
						<Lock class="w-3.5 h-3.5" /> 100% Client-Side LocalStorage Security
					</div>
					<h3 class="text-2xl sm:text-3xl font-black text-white">Gunakan Custom API Key (Gemini / Groq)</h3>
					<p class="text-slate-300 text-sm leading-relaxed">
						API Key pribadi Anda disimpan 100% aman di LocalStorage browser Anda. Tidak disimpan di database server, memberikan generasi PRD <span class="text-purple-300 font-bold">UNLIMITED</span> tanpa memotong kuota server!
					</p>
				</div>
				<a
					href="/try"
					class="px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-400 hover:to-fuchsia-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-purple-500/30 transition-all shrink-0 active:scale-95 flex items-center gap-2"
				>
					<span>Mulai Coba di `/try`</span>
					<ArrowRight class="w-4 h-4" />
				</a>
			</div>
		</section>

		<!-- ==================== FOOTER ==================== -->
		<footer class="border-t border-white/10 bg-[#02050c] py-10">
			<div class="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
				<div class="flex items-center gap-3">
					<div class="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">P</div>
					<span class="text-slate-300 font-bold">AiKanAja PRD Generator</span>
					<span>— Ekosistem AiKanAja</span>
				</div>
				<p>&copy; 2026 AiKanAja. Zero-Persistence Enterprise Architecture.</p>
			</div>
		</footer>

	</div>
</div>
