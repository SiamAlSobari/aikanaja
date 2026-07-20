<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowRight, Sparkles } from 'lucide-svelte';

	let sectionEl = $state<HTMLElement | null>(null);

	onMount(async () => {
		const { gsap } = await import('gsap');
		if (!sectionEl) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
						if (entry.isIntersecting && sectionEl) {
						gsap.from(sectionEl.querySelectorAll('.cta-item'), {
							opacity: 0,
							y: 25,
							duration: 0.6,
							stagger: 0.1,
							ease: 'power3.out'
						});
						observer.disconnect();
					}
				});
			},
			{ threshold: 0.2 }
		);
		observer.observe(sectionEl);
	});
</script>

<section bind:this={sectionEl} class="max-w-4xl mx-auto px-6 py-24 w-full text-center">
	<div class="space-y-8">
		<div class="cta-item space-y-4">
			<h2 class="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
				Siap Merancang
				<br />
				<span class="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
					PRD Enterprise?
				</span>
			</h2>
			<p class="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
				Ubah gagasan produk Anda menjadi dokumen PRD komprehensif dalam hitungan menit, bukan jam.
			</p>
		</div>

		<div class="cta-item flex flex-col sm:flex-row items-center justify-center gap-4">
			<a
				href="/try"
				class="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-orange-500/25 transition-all active:scale-95 flex items-center gap-2"
			>
				<Sparkles class="w-4 h-4" />
				Mulai Gratis di /try
				<ArrowRight class="w-4 h-4" />
			</a>
			<a
				href="/dashboard"
				class="px-8 py-4 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-orange-500/30 text-white font-bold text-sm transition-all flex items-center gap-2"
			>
				Buka Dashboard
			</a>
		</div>

		<div class="cta-item pt-4">
			<p class="text-xs text-slate-500 font-mono">Tanpa kartu kredit. Tanpa login. Langsung coba.</p>
		</div>
	</div>
</section>
