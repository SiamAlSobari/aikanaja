<script lang="ts">
	import { slide } from 'svelte/transition';
	import { motion } from '@humanspeak/svelte-motion';
	import { Plus } from 'lucide-svelte';

	let openIndex = $state<number | null>(null);

	const items = [
		{
			q: 'Berapa lama waktu yang dibutuhkan untuk generate PRD?',
			a: 'Tergantung kompleksitas produk. Untuk SaaS sederhana, AI Wizard selesai dalam 30-60 detik. PRD lengkap dengan user stories, sprint plan, dan diagram biasanya selesai dalam 1-2 menit.'
		},
		{
			q: 'Apakah saya bisa menggunakan API Key sendiri?',
			a: 'Ya. Masukkan API Key Google Gemini atau Groq di Settings → API Keys. Key disimpan 100% di localStorage browser Anda, tidak pernah dikirim ke server kami. Zero-persistence.'
		},
		{
			q: 'Bagaimana Virtual Stakeholder Review bekerja?',
			a: 'AI mensimulasikan respons dari 3 persona: Tech Lead (kelayakan teknis & bottleneck), QA Engineer (edge cases & boundary conditions), dan Product Sponsor (nilai bisnis & ROI). Setiap review disertai saran perbaikan.'
		},
		{
			q: 'Format apa saja yang bisa diekspor?',
			a: 'Markdown (.md), PDF dengan layout profesional, JSON spec, dan AI Coding Agent Prompt (AGENTS.md / PROMPT.md) yang siap dibaca Cursor, Claude Code, atau Antigravity.'
		},
		{
			q: 'Apakah data saya aman?',
			a: 'Sangat aman. PRD hanya disimpan di database pribadi Anda (jika login). Custom API Key hanya ada di browser. Tidak ada tracking, tidak ada data selling.'
		}
	];
</script>

<section id="faq" class="relative py-28 lg:py-36">
	<div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

	<div class="max-w-6xl mx-auto px-5">
		<div class="grid lg:grid-cols-12 gap-16">
			<!-- Left: sticky heading -->
			<div class="lg:col-span-4">
				<div class="lg:sticky lg:top-32">
					<span
						class="text-xs font-semibold text-orange-500 uppercase tracking-[0.2em] mb-4 block"
						>FAQ</span
					>
					<h2
						class="text-3xl lg:text-4xl font-black tracking-[-0.03em] text-white leading-tight mb-4"
					>
						Pertanyaan<br />Umum.
					</h2>
					<p class="text-sm text-slate-500 leading-relaxed">
						Jawaban atas keraguan Anda soal privasi, AI engine, dan workflow.
					</p>
				</div>
			</div>

			<!-- Right: accordion items -->
			<div class="lg:col-span-8 space-y-3">
				{#each items as item, i}
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{
							duration: 0.5,
							delay: i * 0.06,
							ease: [0.16, 1, 0.3, 1]
						}}
						class="rounded-2xl border transition-all duration-300 {openIndex === i
							? 'bg-white/[0.03] border-white/10'
							: 'bg-transparent border-white/5 hover:border-white/10'}"
					>
						<button
							onclick={() => (openIndex = openIndex === i ? null : i)}
							class="w-full text-left px-6 py-5 flex items-start gap-4 group"
						>
							<div
								class="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center transition-all mt-0.5 {openIndex === i
									? 'bg-orange-500/15 rotate-45'
									: 'bg-white/5 rotate-0'}"
							>
								<Plus
									class="w-4 h-4 transition-colors {openIndex === i
										? 'text-orange-400'
										: 'text-slate-500 group-hover:text-slate-300'}"
								/>
							</div>
							<span
								class="text-sm font-semibold transition-colors {openIndex === i
									? 'text-white'
									: 'text-slate-300 group-hover:text-white'}"
							>
								{item.q}
							</span>
						</button>

						{#if openIndex === i}
							<div
								transition:slide={{ duration: 250 }}
								class="px-6 pb-5 pl-[60px] text-sm text-slate-400 leading-relaxed"
							>
								{item.a}
							</div>
						{/if}
					</motion.div>
				{/each}
			</div>
		</div>
	</div>
</section>
