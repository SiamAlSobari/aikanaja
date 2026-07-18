<script lang="ts">
	import { Cpu, Layers, RefreshCw, Code, ArrowRight, CheckCircle2, Check } from 'lucide-svelte';

	function handleCardMouseMove(e: MouseEvent) {
		const card = e.currentTarget as HTMLElement;
		const rect = card.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		card.style.setProperty('--mouse-x', `${x}px`);
		card.style.setProperty('--mouse-y', `${y}px`);
	}
</script>

<section id="features" class="max-w-7xl mx-auto px-6 py-24 space-y-16 relative z-10">
	<div class="text-center max-w-2xl mx-auto mb-16 space-y-4">
		<h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
			Merancang Database Menjadi Menyenangkan
		</h2>
		<p class="text-slate-400">
			Fitur-fitur andalan yang memadukan kecepatan kecerdasan AI dengan kontrol penuh rancangan
			visual Anda.
		</p>
	</div>

	<div class="grid md:grid-cols-12 gap-8">
		<!-- Feature 1: Multi-Provider -->
		<div
			onmousemove={handleCardMouseMove}
			role="presentation"
			class="md:col-span-8 group rounded-3xl bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
		>
			<div
				class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
				style="background: radial-gradient(circle 350px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 62, 0, 0.05), transparent 80%);"
			></div>

			<div class="space-y-4 relative z-10">
				<div
					class="w-12 h-12 rounded-2xl bg-orange-600/10 border border-orange-600/20 flex items-center justify-center"
				>
					<Cpu class="w-6 h-6 text-orange-500" />
				</div>
				<h3 class="text-2xl font-bold text-white group-hover:text-orange-500 transition-colors">
					Generasi ERD Otomatis via AI
				</h3>
				<p class="text-slate-400 text-sm leading-relaxed max-w-xl">
					Tulis kebutuhan aplikasi Anda secara bebas. Engine kecerdasan buatan AiKanAja secara
					cerdas mengekstrak nama entitas, relasi parent-child, constraints, dan tipe field
					database dalam sekejap.
				</p>
			</div>
			<div
				class="mt-8 border-t border-slate-800/60 pt-6 flex items-center justify-between text-xs text-slate-500 relative z-10"
			>
				<span>Mendukung Bahasa Indonesia & Inggris</span>
				<span class="flex items-center gap-1.5"
					><CheckCircle2 class="w-3.5 h-3.5 text-orange-500" /> Generasi Skema Valid</span
				>
			</div>
		</div>

		<!-- Feature 2: Visual Editor -->
		<div
			onmousemove={handleCardMouseMove}
			role="presentation"
			class="md:col-span-4 group rounded-3xl bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
		>
			<div
				class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
				style="background: radial-gradient(circle 250px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 62, 0, 0.05), transparent 80%);"
			></div>

			<div class="space-y-4 relative z-10">
				<div
					class="w-12 h-12 rounded-2xl bg-orange-600/10 border border-orange-600/20 flex items-center justify-center"
				>
					<Layers class="w-6 h-6 text-orange-500" />
				</div>
				<h3 class="text-xl font-bold text-white group-hover:text-orange-500 transition-colors">
					Kanvas Desain Drag-and-Drop
				</h3>
				<p class="text-slate-400 text-sm leading-relaxed">
					Pegang kendali penuh. AI merancang draf skema awal, dan Anda bebas menyusun, hubungkan,
					atau menghapus tabel di kanvas interaktif.
				</p>
			</div>
			<div
				class="mt-8 flex items-center gap-1.5 text-xs text-orange-500 font-bold group-hover:translate-x-1 transition-transform relative z-10"
			>
				Coba Kanvas Visual <ArrowRight class="w-3.5 h-3.5" />
			</div>
		</div>

		<!-- Feature 3: Custom API Key -->
		<div
			onmousemove={handleCardMouseMove}
			role="presentation"
			class="md:col-span-4 group rounded-3xl bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
		>
			<div
				class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
				style="background: radial-gradient(circle 250px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 62, 0, 0.05), transparent 80%);"
			></div>

			<div class="space-y-4 relative z-10">
				<div
					class="w-12 h-12 rounded-2xl bg-orange-600/10 border border-orange-600/20 flex items-center justify-center"
				>
					<RefreshCw class="w-6 h-6 text-orange-500" />
				</div>
				<h3 class="text-xl font-bold text-white group-hover:text-orange-500 transition-colors">
					Bawa API Key Anda Sendiri
				</h3>
				<p class="text-slate-400 text-sm leading-relaxed">
					Tidak ada batas kuota buatan. Gunakan kunci OpenAI atau Gemini pribadi Anda, simpan
					secara lokal, dan rancang database sesuka hati tanpa batas.
				</p>
			</div>
			<div
				class="mt-8 border-t border-slate-800/60 pt-6 text-[10px] text-slate-550 font-mono relative z-10"
			>
				Tersimpan aman di localStorage browser
			</div>
		</div>

		<!-- Feature 4: Code Export -->
		<div
			onmousemove={handleCardMouseMove}
			role="presentation"
			class="md:col-span-8 group rounded-3xl bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
		>
			<div
				class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
				style="background: radial-gradient(circle 350px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 62, 0, 0.05), transparent 80%);"
			></div>

			<div class="space-y-4 relative z-10">
				<div
					class="w-12 h-12 rounded-2xl bg-orange-600/10 border border-orange-600/20 flex items-center justify-center"
				>
					<Code class="w-6 h-6 text-orange-500" />
				</div>
				<h3 class="text-2xl font-bold text-white group-hover:text-orange-500 transition-colors">
					Ekspor Kode Sekali Klik
				</h3>
				<p class="text-slate-400 text-sm leading-relaxed max-w-xl">
					Hasil akhir siap diunduh dalam sintaks SQL DDL (PostgreSQL, MySQL, SQLite) atau file
					Prisma Schema yang bersih, teruji validitasnya, dan ter-linting rapi.
				</p>
			</div>
			<div
				class="mt-8 border-t border-slate-800/60 pt-6 flex items-center gap-6 text-[11px] text-slate-450 font-mono relative z-10"
			>
				<span class="flex items-center gap-1.5"
					><Check class="w-3.5 h-3.5 text-orange-500" /> SQL (Postgres/MySQL)</span
				>
				<span class="flex items-center gap-1.5"
					><Check class="w-3.5 h-3.5 text-orange-500" /> Prisma ORM</span
				>
				<span class="flex items-center gap-1.5"
					><Check class="w-3.5 h-3.5 text-orange-500" /> TS Interfaces</span
				>
			</div>
		</div>
	</div>
</section>
