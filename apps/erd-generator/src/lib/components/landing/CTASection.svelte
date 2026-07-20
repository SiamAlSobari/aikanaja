<script lang="ts">
	import { base } from '$app/paths';
	import { motion } from '@humanspeak/svelte-motion';
	import Reveal from '$lib/components/ui/Reveal.svelte';
</script>

<section class="border-t border-slate-900/60 bg-slate-950 relative overflow-hidden py-28 z-10">
	<div class="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>
	<div
		class="absolute top-[25%] left-[50%] -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-orange-950/15 glow-blur pointer-events-none"
	></div>

	<Reveal class="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
		<h2 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
			Siap Mendesain Skema Database <br />Dengan Cepat & Visual?
		</h2>
		<p class="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
			Rancang ERD secara generatif berbasis AI. Gratis untuk dicoba, mudah disesuaikan, dan siap
			diekspor dalam sekali klik.
		</p>

		<div class="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
			<motion.a
				href="{base}/try"
				whileHover={{ scale: 1.03 }}
				whileTap={{ scale: 0.98 }}
				transition={{ type: 'spring', stiffness: 400, damping: 17 }}
				class="w-full sm:w-auto px-8 py-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-slate-950 font-bold transition-all shadow-lg shadow-orange-600/25"
			>
				Coba Gratis Sekarang
			</motion.a>
			<motion.a
				href="{base}/auth/login"
				whileHover={{ scale: 1.03 }}
				whileTap={{ scale: 0.98 }}
				transition={{ type: 'spring', stiffness: 400, damping: 17 }}
				class="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 text-slate-200 font-bold transition-colors"
			>
				Masuk Dengan Akun
			</motion.a>
		</div>
	</Reveal>
</section>
