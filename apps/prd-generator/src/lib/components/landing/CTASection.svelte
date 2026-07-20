<script lang="ts">
	import { base } from '$app/paths';
	import { motion } from '@humanspeak/svelte-motion';
	import { ArrowRight } from 'lucide-svelte';
</script>

<section class="relative py-32 lg:py-44 overflow-hidden">
	<!-- Background glow -->
	<div
		class="absolute inset-0 pointer-events-none"
		style="background: radial-gradient(ellipse 60% 40% at 50% 100%, rgba(255,62,0,0.08) 0%, transparent 70%);"
	></div>

	<div class="max-w-4xl mx-auto px-5 text-center relative z-10">
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
			class="space-y-8"
		>
			<h2
				class="text-5xl sm:text-6xl lg:text-7xl font-black tracking-[-0.04em] text-white leading-[0.95]"
			>
				Siap?<br />
				<span class="text-orange-500">Mulai.</span>
			</h2>

			<p class="text-lg text-slate-400 max-w-md mx-auto">
				Berbungkus PRD yang ambiguous. Waktunya buat PRD yang benar-benar siap implementasi.
			</p>

			<div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
				<motion.a
					href="{base}/try"
					whileHover={{ scale: 1.03 }}
					whileTap={{ scale: 0.98 }}
					transition={{ type: 'spring', stiffness: 400, damping: 17 }}
					class="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-base transition-all shadow-xl shadow-orange-600/20 hover:shadow-orange-600/30"
				>
					Coba Gratis
					<ArrowRight class="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
				</motion.a>
				<motion.a
					href="{base}/auth/login"
					whileHover={{ scale: 1.03 }}
					whileTap={{ scale: 0.98 }}
					transition={{ type: 'spring', stiffness: 400, damping: 17 }}
					class="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium text-base transition-all"
				>
					Masuk dengan Akun
				</motion.a>
			</div>
		</motion.div>
	</div>
</section>
