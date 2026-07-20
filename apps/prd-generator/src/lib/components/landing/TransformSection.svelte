<script lang="ts">
	import { motion } from '@humanspeak/svelte-motion';
	import { AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-svelte';
</script>

<section class="relative py-28 lg:py-36">
	<div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

	<div class="max-w-6xl mx-auto px-5">
		<!-- Header -->
		<div class="mb-16 max-w-xl">
			<span
				class="text-xs font-semibold text-orange-500 uppercase tracking-[0.2em] mb-4 block"
				>Transformasi</span
			>
			<h2 class="text-4xl lg:text-5xl font-black tracking-[-0.03em] text-white leading-tight">
				Dari Kekacauan<br />Menjadi Struktur.
			</h2>
		</div>

		<!-- Two contrasting panels -->
		<div class="grid lg:grid-cols-2 gap-6">
			<!-- Before: chaos -->
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
				class="relative rounded-3xl border border-red-500/10 bg-slate-950 overflow-hidden"
			>
				<div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.04),transparent_60%)]"></div>
				<div class="relative z-10 p-8">
					<div class="flex items-center gap-3 mb-6">
						<div
							class="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center"
						>
							<AlertTriangle class="w-4.5 h-4.5 text-red-400" />
						</div>
						<span class="text-sm font-bold text-red-400">Cara Manual</span>
					</div>

					<!-- Scattered notes mockup -->
					<div class="space-y-3 font-mono text-[11px]">
						<div
							class="rounded-xl bg-white/[0.02] border border-white/5 p-4 -rotate-1 hover:rotate-0 transition-transform"
						>
							<div class="text-slate-500 mb-1">note.txt — 3:42 AM</div>
							<div class="text-slate-400">
								"harus ada fitur login... dan dashboard... entahlah nanti aja"
							</div>
						</div>
						<div
							class="rounded-xl bg-white/[0.02] border border-white/5 p-4 rotate-[0.5deg] hover:rotate-0 transition-transform ml-6"
						>
							<div class="text-slate-500 mb-1">whatsapp-group.txt</div>
							<div class="text-slate-400">
								"PM: tambahin fitur billing ya · Dev: oke · QA: nanti Saya test"
							</div>
						</div>
						<div
							class="rounded-xl bg-white/[0.02] border border-white/5 p-4 -rotate-[0.3deg] hover:rotate-0 transition-transform"
						>
							<div class="text-slate-500 mb-1">draft-prd-v7-FINAL.docx</div>
							<div class="text-slate-400">
								"Fitur harus cepat dan mudah digunakan oleh semua user."
							</div>
						</div>
					</div>

					<div
						class="mt-6 pt-5 border-t border-white/5 text-xs text-slate-600 flex items-center gap-2"
					>
						<span class="w-1.5 h-1.5 rounded-full bg-red-500/60"></span>
						Ambiguous · Unstructured · No acceptance criteria
					</div>
				</div>
			</motion.div>

			<!-- Center arrow -->
			<div class="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
				<div
					class="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center shadow-xl shadow-orange-600/30"
				>
					<ArrowRight class="w-5 h-5 text-white" />
				</div>
			</div>

			<!-- After: structured -->
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
				class="relative rounded-3xl border border-orange-500/15 bg-slate-900/50 overflow-hidden"
			>
				<div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,62,0,0.04),transparent_60%)]"></div>
				<div class="relative z-10 p-8">
					<div class="flex items-center gap-3 mb-6">
						<div
							class="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center"
						>
							<CheckCircle2 class="w-4.5 h-4.5 text-orange-400" />
						</div>
						<span class="text-sm font-bold text-orange-400">Dengan AiKanAja</span>
					</div>

					<!-- Structured PRD -->
					<div class="space-y-3 font-mono text-[11px]">
						<div
							class="rounded-xl bg-orange-500/5 border border-orange-500/15 p-4"
						>
							<div class="text-orange-400 font-bold mb-1">US-01 · Authentication</div>
							<div class="text-slate-400">
								<span class="text-slate-500">Given</span> pengguna belum login,
								<span class="text-slate-500">When</span> membuka /dashboard,
								<span class="text-slate-500">Then</span> redirect ke /login
							</div>
							<div class="mt-2 text-[10px] text-orange-500/60">
								Story Points: 5 · Sprint 1 · Priority: High
							</div>
						</div>
						<div
							class="rounded-xl bg-orange-500/5 border border-orange-500/15 p-4"
						>
							<div class="text-orange-400 font-bold mb-1">US-02 · Dashboard</div>
							<div class="text-slate-400">
								<span class="text-slate-500">Given</span> pengguna terautentikasi,
								<span class="text-slate-500">When</span> membuka /dashboard,
								<span class="text-slate-500">Then</span> tampilkan task board
							</div>
							<div class="mt-2 text-[10px] text-orange-500/60">
								Story Points: 8 · Sprint 1 · Priority: High
							</div>
						</div>
						<div
							class="rounded-xl bg-white/[0.02] border border-white/5 p-4 flex items-center gap-3"
						>
							<div
								class="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden"
							>
								<div
									class="h-full w-[82%] rounded-full bg-gradient-to-r from-orange-500 to-emerald-500"
								></div>
							</div>
							<span class="text-emerald-400 font-bold text-[10px]">82/100</span>
						</div>
					</div>

					<div
						class="mt-6 pt-5 border-t border-white/5 text-xs text-slate-600 flex items-center gap-2"
					>
						<span class="w-1.5 h-1.5 rounded-full bg-orange-500/60"></span>
						Structured · Audited · Sprint-ready
					</div>
				</div>
			</motion.div>
		</div>
	</div>
</section>
