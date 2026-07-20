<script lang="ts">
	import { onMount } from 'svelte';
	import { Lock, ArrowRight, Key, Shield } from 'lucide-svelte';

	let sectionEl = $state<HTMLElement | null>(null);

	onMount(async () => {
		const { gsap } = await import('gsap');
		if (!sectionEl) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						gsap.from(sectionEl, {
							opacity: 0,
							y: 30,
							duration: 0.7,
							ease: 'power3.out'
						});
						observer.disconnect();
					}
				});
			},
			{ threshold: 0.15 }
		);
		observer.observe(sectionEl);
	});
</script>

<section bind:this={sectionEl} id="keamanan" class="max-w-6xl mx-auto px-6 py-16 w-full">
	<div class="relative rounded-3xl bg-gradient-to-br from-orange-950/30 via-[#0a0e17] to-amber-950/20 border border-orange-500/20 p-8 sm:p-12 overflow-hidden">
		<!-- Decorative corner accents -->
		<div class="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
		<div class="absolute bottom-0 left-0 w-56 h-56 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

		<div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
			<div class="space-y-4 max-w-xl text-left">
				<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-semibold">
					<Lock class="w-3.5 h-3.5" /> 100% Client-Side LocalStorage Security
				</div>
				<h3 class="text-2xl sm:text-3xl font-black text-white">Gunakan Custom API Key Anda Sendiri</h3>
				<p class="text-slate-300 text-sm leading-relaxed">
					API Key pribadi Anda disimpan <span class="text-orange-400 font-bold">100% aman di LocalStorage</span> browser. Tidak pernah disimpan di server. Memberikan generasi PRD <span class="text-orange-400 font-bold">UNLIMITED</span> tanpa memotong kuota.
				</p>

				<!-- Key visualization -->
				<div class="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] font-mono text-xs">
					<Key class="w-4 h-4 text-orange-400 shrink-0" />
					<span class="text-slate-400 truncate">AIzaSy...xK9m2PqR7nB...</span>
					<span class="ml-auto px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">LOCAL</span>
				</div>
			</div>

			<a
				href="/try"
				class="px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-orange-500/20 transition-all shrink-0 active:scale-95 flex items-center gap-2"
			>
				<span>Mulai Coba di /try</span>
				<ArrowRight class="w-4 h-4" />
			</a>
		</div>
	</div>
</section>
