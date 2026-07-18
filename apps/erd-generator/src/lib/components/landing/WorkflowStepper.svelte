<script lang="ts">
	import { onMount } from 'svelte';

	const steps = [
		{
			title: '1. Deskripsikan Struktur',
			desc: 'Tulis konsep tabel Anda dalam kalimat bahasa Indonesia atau Inggris biasa.'
		},
		{
			title: '2. Sesuaikan Visual',
			desc: 'Tambah field, buat relasi, dan sesuaikan tipe data pada kanvas visual secara langsung.'
		},
		{
			title: '3. Ekspor & Pasang',
			desc: 'Salin output SQL DDL siap pakai atau Prisma schema untuk langsung dimasukkan ke proyek Anda.'
		}
	];

	let activeStep = $state(0);
	let intervalId: ReturnType<typeof setInterval> | undefined;

	onMount(() => {
		intervalId = setInterval(() => {
			activeStep = (activeStep + 1) % steps.length;
		}, 5000);
		return () => clearInterval(intervalId);
	});

	function selectStep(index: number) {
		activeStep = index;
		if (intervalId) clearInterval(intervalId);
	}
</script>

<section id="showcase" class="border-t border-slate-900 bg-slate-950/30 py-28 relative z-10">
	<div class="max-w-7xl mx-auto px-6">
		<div class="text-center max-w-2xl mx-auto mb-20 space-y-4">
			<h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
				Workflow Cepat & Bebas Hambatan
			</h2>
			<p class="text-slate-400">
				Tidak ada setup yang melelahkan. Visualisasikan, edit skema, lalu pasang di backend Anda.
			</p>
		</div>

		<div class="grid md:grid-cols-3 gap-8">
			{#each steps as step, i (step.title)}
				<button
					onclick={() => selectStep(i)}
					class="text-left w-full relative group rounded-2xl p-6 border transition-all duration-500 focus:outline-none {activeStep ===
					i
						? 'bg-slate-900 border-orange-600/35 shadow-[0_20px_40px_rgba(16,185,129,0.04)]'
						: 'bg-slate-900/30 border-transparent hover:border-slate-900'}"
				>
					<div class="flex items-center gap-4 mb-4">
						<div
							class="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 {activeStep ===
							i
								? 'bg-orange-600 text-slate-950 shadow-lg shadow-orange-600/20'
								: 'bg-slate-950 text-slate-400 border border-slate-850'}"
						>
							0{i + 1}
						</div>
						<h3
							class="text-lg font-bold text-white group-hover:text-orange-500 transition-colors"
						>
							{step.title}
						</h3>
					</div>
					<p class="text-sm text-slate-400 leading-relaxed pl-2">{step.desc}</p>

					{#if activeStep === i}
						<div
							class="absolute bottom-0 left-6 right-6 h-[2px] bg-orange-600 transition-all"
						></div>
					{/if}
				</button>
			{/each}
		</div>
	</div>
</section>
