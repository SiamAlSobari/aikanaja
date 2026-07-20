<script lang="ts">
	import { Sparkles, FileText, Bot, ArrowRight, Zap, ShieldCheck, Layers, GitBranch, Share2 } from 'lucide-svelte';
</script>

<svelte:head>
	<title>AiKanAja — AI PRD Generator</title>
	<meta name="description" content="Generate Enterprise Product Requirement Documents (PRD) automatically with Gemini 2.0 Flash AI." />
</svelte:head>

<div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-purple-500 selection:text-white">
	<!-- Navbar -->
	<header class="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
		<div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="w-9 h-9 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold shadow-lg shadow-purple-500/10">
					<FileText class="w-5 h-5" />
				</div>
				<span class="font-bold text-lg text-white tracking-tight">AiKanAja <span class="text-purple-400 font-medium">PRD</span></span>
			</div>
			<div class="flex items-center gap-4">
				<a href="/try" class="text-xs text-slate-400 hover:text-white transition-colors font-medium">Coba Tanpa Login</a>
				<a href="/dashboard" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-slate-950 font-bold text-xs shadow-lg shadow-purple-600/20 transition-all active:scale-95">
					<Sparkles class="w-3.5 h-3.5" /> Dashboard
				</a>
			</div>
		</div>
	</header>

	<!-- Hero section -->
	<main class="flex-1 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center justify-center space-y-8">
		<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold tracking-wide">
			<Bot class="w-4 h-4" /> Powered by Gemini 2.0 Flash + Zero-Persistence
		</div>

		<h1 class="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl leading-tight">
			Rancang <span class="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">PRD Enterprise</span> Otomatis & Presisi Tinggi
		</h1>

		<p class="text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
			Buat Dokumen Spesifikasi Produk (PRD) 11 seksi enterprise lengkap dengan Virtual Stakeholder Review, Mermaid.js Diagram, Audit Skor Ambuitas, dan Ekspor ke AGENTS.md.
		</p>

		<div class="flex flex-wrap items-center justify-center gap-4 pt-4">
			<a href="/try" class="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-slate-950 font-bold text-sm shadow-xl shadow-purple-600/25 transition-all active:scale-95">
				<Sparkles class="w-4 h-4" /> Buat PRD Sekarang <ArrowRight class="w-4 h-4" />
			</a>
			<a href="/dashboard" class="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm transition-all">
				<FileText class="w-4 h-4 text-purple-400" /> Buka Proyek Saya
			</a>
		</div>

		<!-- Grid Features -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-16 w-full max-w-5xl">
			<div class="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm space-y-3">
				<div class="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
					<Bot class="w-5 h-5" />
				</div>
				<h3 class="text-base font-bold text-white">Virtual Stakeholder Review</h3>
				<p class="text-xs text-slate-400 leading-relaxed">Review otomatis 3 Persona (CTO, Senior PM, Product Designer) untuk mengkritik edge cases dan kelengkapan PRD.</p>
			</div>

			<div class="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm space-y-3">
				<div class="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
					<Zap class="w-5 h-5" />
				</div>
				<h3 class="text-base font-bold text-white">Quality & Ambiguity Score</h3>
				<p class="text-xs text-slate-400 leading-relaxed">Audit otomatis (0-100) yang mendeteksi frasa ambigu, dependensi yang hilang, dan menghitung estimasi Story Points.</p>
			</div>

			<div class="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm space-y-3">
				<div class="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
					<ShieldCheck class="w-5 h-5" />
				</div>
				<h3 class="text-base font-bold text-white">Zero-Persistence Security</h3>
				<p class="text-xs text-slate-400 leading-relaxed">Custom API Key 100% tersimpan di browser LocalStorage Anda. Generate unlimited tanpa memotong kuota server.</p>
			</div>
		</div>
	</main>

	<!-- Footer -->
	<footer class="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
		&copy; 2026 AiKanAja Ecosystem. All rights reserved.
	</footer>
</div>
