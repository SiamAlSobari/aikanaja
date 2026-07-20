<script lang="ts">
	import { Info, CheckCircle2 } from 'lucide-svelte';
	import Reveal from '$lib/components/ui/Reveal.svelte';

	let comparisonTab = $state<'relasi' | 'indeks' | 'constraint'>('relasi');
</script>

<section id="comparison" class="relative z-10 py-24">
	<!-- Top border gradient -->
	<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
	<div class="max-w-7xl mx-auto px-6">
		<Reveal class="text-center max-w-2xl mx-auto mb-16 space-y-4">
			<h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
				Bandingkan Sendiri Kemudahannya
			</h2>
			<p class="text-slate-400">
				Merancang relasi database dengan baris sintaks manual rawan kesalahan ketik. AiKanAja
				memvisualisasikannya secara otomatis.
			</p>
		</Reveal>

		<div class="flex justify-center gap-3 mb-10">
			{#each (['relasi', 'indeks', 'constraint'] as const) as key}
				<button
					onclick={() => (comparisonTab = key)}
					class="px-5 py-2.5 rounded-full text-sm font-bold transition-all border {comparisonTab ===
					key
						? 'bg-orange-600/10 border-orange-600/35 text-orange-500 shadow-[0_0_15px_rgba(16,185,129,0.08)]'
						: 'bg-slate-900/40 border-slate-900 text-slate-400 hover:text-slate-200'}"
				>
					{key === 'relasi' ? 'Relasi Foreign Key' : key === 'indeks' ? 'Indeks Optimasi' : 'Cascade Deletes'}
				</button>
			{/each}
		</div>

		<div class="grid md:grid-cols-2 gap-8 items-stretch">
			<!-- Before -->
			<Reveal delay={0}>
				<div
					class="bg-slate-950 border border-red-500/10 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl"
				>
					<div class="absolute inset-0 bg-red-950/2.5 pointer-events-none"></div>
					<div>
						<div class="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
							<span
								class="text-xs font-semibold text-rose-400 uppercase tracking-widest flex items-center gap-1.5"
							>
								<span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Cara Lama: Sintaks Manual
							</span>
							<span class="text-[10px] text-slate-500 font-mono">schema-fatigue.sql</span>
						</div>

						<div class="font-mono text-xs text-slate-500 space-y-4 select-none leading-relaxed">
							{#if comparisonTab === 'relasi'}
								<div>
									<p class="text-red-400/90">// Harus mengingat syntax references yang tepat</p>
									<p>ALTER TABLE "orders" ADD CONSTRAINT "fk_user_orders"</p>
									<p
										class="bg-rose-950/20 text-rose-300/80 px-2 py-1 rounded border-l border-red-500"
									>
										FOREIGN KEY ("user_id") REFERENCES "user"("id");
									</p>
									<p class="text-red-550/80 text-[10px] mt-1">
										⚠️ Error: Table 'user' does not exist (should be 'users')
									</p>
								</div>
							{:else}
								<div>
									<p class="text-red-405/90">// Indeks terlewat, query melambat di production</p>
									<p>CREATE INDEX "idx_order_user" ON "orders"("user_id");</p>
									<p class="text-slate-600">
										// Butuh waktu menulis index satu per satu untuk 20+ tabel
									</p>
								</div>
							{/if}
						</div>
					</div>
					<div
						class="mt-8 text-xs text-slate-500 italic bg-red-950/10 border border-red-950/30 p-3 rounded-xl flex items-start gap-2.5"
					>
						<Info class="w-4.5 h-4.5 text-rose-500 shrink-0" />
						<span
							>Satu typo dalam pengetikan nama relasi membuat migrasi database error dan membuang
							waktu.</span
						>
					</div>
				</div>
			</Reveal>

		<!-- After -->
			<Reveal delay={0.15}>
				<div
					class="bg-slate-950 border border-orange-600/10 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl"
				>
					<div class="absolute inset-0 bg-orange-950/2.5 pointer-events-none"></div>
					<div>
						<div class="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
							<span
								class="text-xs font-semibold text-orange-500 uppercase tracking-widest flex items-center gap-1.5"
							>
								<span class="w-1.5 h-1.5 rounded-full bg-orange-600 animate-ping"></span>
								AiKanAja Generator
							</span>
							<span class="text-[10px] text-orange-500/60 font-mono"
								>100% Valid & Auto-Formatted</span
							>
						</div>

						<div class="font-mono text-xs text-slate-350 space-y-4 leading-relaxed">
							{#if comparisonTab === 'relasi'}
								<div>
									<p class="text-orange-500/90">// Relasi visual digambar otomatis</p>
									<p class="text-white">
										"user_id" UUID REFERENCES "users"("id") ON DELETE CASCADE
									</p>
									<p class="text-orange-600/80 text-[10px] mt-1 flex items-center gap-1">
										<CheckCircle2 class="w-3.5 h-3.5 text-orange-500" /> Relasi antar-tabel dihubungkan
										secara akurat
									</p>
								</div>
							{:else}
								<div>
									<p class="text-orange-500/90">// Indeks ditambahkan otomatis pada foreign key</p>
									<p class="text-white">CREATE INDEX "idx_orders_user" ON "orders"("user_id");</p>
									<p class="text-orange-600/80 text-[10px] mt-1 flex items-center gap-1">
										<CheckCircle2 class="w-3.5 h-3.5 text-orange-500" /> Performa query optimal otomatis
									</p>
								</div>
							{/if}
						</div>
					</div>
					<div
						class="mt-8 text-xs text-orange-500/90 bg-orange-950/10 border border-orange-950/30 p-3 rounded-xl flex items-start gap-2.5"
					>
						<CheckCircle2 class="w-4.5 h-4.5 text-orange-500 shrink-0" />
						<span
							>AI memproses input teks Anda, menyusun seluruh relasi & indeks yang valid tanpa Anda
							perlu mengetik manual baris kode.</span
						>
					</div>
				</div>
			</Reveal>
		</div>
	</div>
</section>
