<script lang="ts">
	import { Database } from 'lucide-svelte';
	import DotFieldCanvas from '$lib/components/ui/DotFieldCanvas.svelte';

	let { children } = $props();
</script>

<div class="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center relative overflow-hidden selection:bg-orange-600/30 selection:text-orange-300">
	<DotFieldCanvas />

	<!-- Glow blobs (animated) -->
	<div class="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full bg-orange-950/20 glow-blur pointer-events-none animate-pulse-slow"></div>
	<div class="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-slate-900/50 glow-blur pointer-events-none animate-pulse-slow-reverse"></div>
	<div class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-orange-600/8 glow-blur pointer-events-none animate-breathe"></div>

	<!-- Floating particles -->
	<div class="absolute inset-0 pointer-events-none overflow-hidden">
		{#each Array(6) as _, i}
			<div
				class="absolute w-1 h-1 rounded-full bg-orange-500/30 animate-float-particle"
				style="left: {15 + i * 15}%; top: {20 + (i % 3) * 25}%; animation-delay: {i * 1.5}s; animation-duration: {8 + i * 2}s;"
			></div>
		{/each}
	</div>

	<div class="relative z-10 w-full max-w-5xl mx-4 grid lg:grid-cols-2 gap-12 items-center">
		<!-- Left: Branding + Features -->
		<div class="hidden lg:flex flex-col gap-8">
			<!-- Logo -->
			<div class="flex items-center gap-3">
				<div class="relative flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 border border-orange-600/30 shadow-[0_0_25px_rgba(255,62,0,0.15)]">
					<Database class="w-6 h-6 text-orange-500" />
					<div class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></div>
				</div>
				<span class="text-2xl font-bold tracking-tight text-white">
					Schema<span class="text-orange-500">Flow</span>
				</span>
			</div>

			<div class="space-y-3">
				<h1 class="text-3xl font-extrabold text-white leading-tight">
					Rancang Database<br />
					<span class="bg-gradient-to-r from-orange-500 via-orange-300 to-teal-400 bg-clip-text text-transparent animate-gradient-shift">Dengan AI.</span>
				</h1>
				<p class="text-slate-400 text-base leading-relaxed max-w-sm">
					Ketik konsep tabel, AI menyusun relasi, Anda edit di kanvas visual. Tanpa SQL manual.
				</p>
			</div>

			<!-- Feature pills (animated stagger) -->
			<div class="flex flex-wrap gap-2.5">
				{#each ['AI-Powered', 'Visual Canvas', 'Export SQL', 'Prisma Schema'] as feature, i}
					<span
						class="px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-900/60 border border-slate-800 text-slate-400 animate-fade-in-up"
						style="animation-delay: {i * 0.1}s;"
					>
						{feature}
					</span>
				{/each}
			</div>

			<!-- Terminal mockup (animated) -->
			<div class="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden group">
				<div class="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
				<div class="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-800/60">
					<span class="w-2.5 h-2.5 rounded-full bg-rose-500/40"></span>
					<span class="w-2.5 h-2.5 rounded-full bg-amber-500/40"></span>
					<span class="w-2.5 h-2.5 rounded-full bg-orange-600/40"></span>
					<span class="text-[10px] text-slate-600 font-mono ml-1.5">schemaflow</span>
					<span class="ml-auto flex items-center gap-1.5">
						<span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
						<span class="text-[10px] text-orange-500/60 font-mono">ready</span>
					</span>
				</div>
				<div class="font-mono text-xs space-y-1.5 relative">
					<p class="text-slate-500 animate-typing"><span class="text-orange-500">$</span> schemaflow generate</p>
					<p class="text-slate-500 animate-typing-delay-1"><span class="text-orange-500">→</span> Analyzing prompt...</p>
					<p class="text-slate-500 animate-typing-delay-2"><span class="text-orange-500">→</span> Detecting entities...</p>
					<p class="text-emerald-400 animate-typing-delay-3"><span class="text-orange-500">✓</span> Generated 5 tables, 7 relations</p>
				</div>
			</div>

			<!-- Stats (count up) -->
			<div class="grid grid-cols-3 gap-4">
				{#each [{ label: 'Tables', value: '5' }, { label: 'Relations', value: '7' }, { label: 'Export', value: 'SQL' }] as stat, i}
					<div class="text-center animate-fade-in-up" style="animation-delay: {0.5 + i * 0.15}s;">
						<p class="text-xl font-bold text-orange-500">{stat.value}</p>
						<p class="text-[10px] text-slate-600 uppercase tracking-wider">{stat.label}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Right: Auth Card -->
		<div class="w-full max-w-md mx-auto lg:mx-0">
			<!-- Mobile Logo -->
			<div class="flex items-center justify-center gap-3 mb-8 lg:hidden">
				<div class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 border border-orange-600/30 shadow-[0_0_15px_rgba(255,62,0,0.12)]">
					<Database class="w-5 h-5 text-orange-500" />
				</div>
				<span class="text-xl font-bold tracking-tight text-white">
					Schema<span class="text-orange-500">Flow</span>
				</span>
			</div>

			<!-- Card with animated border -->
			<div class="relative group">
				<!-- Animated gradient border -->
				<div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-orange-600/20 via-slate-800 to-orange-600/20 animate-border-flow opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
				<!-- Inner glow -->
				<div class="absolute -inset-4 bg-gradient-to-b from-orange-600/8 to-transparent rounded-3xl blur-2xl pointer-events-none animate-pulse-slow"></div>

				<div class="relative bg-slate-900/80 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-xl shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
					{@render children()}
				</div>
			</div>

			<!-- Footer -->
			<p class="text-center text-xs text-slate-600/60 mt-6 animate-fade-in-up" style="animation-delay: 0.8s;">
				© 2026 SchemaFlow. All rights reserved.
			</p>
		</div>
	</div>
</div>

<style>
	@keyframes pulse-slow {
		0%, 100% { opacity: 0.6; }
		50% { opacity: 1; }
	}
	.animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }

	@keyframes pulse-slow-reverse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}
	.animate-pulse-slow-reverse { animation: pulse-slow-reverse 8s ease-in-out infinite; }

	@keyframes breathe {
		0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
		50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.8; }
	}
	.animate-breathe { animation: breathe 5s ease-in-out infinite; }

	@keyframes float-particle {
		0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
		25% { transform: translateY(-30px) translateX(10px); opacity: 0.6; }
		50% { transform: translateY(-15px) translateX(-8px); opacity: 0.4; }
		75% { transform: translateY(-40px) translateX(5px); opacity: 0.5; }
	}
	.animate-float-particle { animation: float-particle 10s ease-in-out infinite; }

	@keyframes gradient-shift {
		0%, 100% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
	}
	.animate-gradient-shift {
		background-size: 200% 200%;
		animation: gradient-shift 4s ease-in-out infinite;
	}

	@keyframes fade-in-up {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.animate-fade-in-up {
		opacity: 0;
		animation: fade-in-up 0.6s ease-out forwards;
	}

	@keyframes typing {
		from { opacity: 0; transform: translateX(-5px); }
		to { opacity: 1; transform: translateX(0); }
	}
	.animate-typing { animation: typing 0.5s ease-out 0.2s both; }
	.animate-typing-delay-1 { animation: typing 0.5s ease-out 0.6s both; }
	.animate-typing-delay-2 { animation: typing 0.5s ease-out 1.0s both; }
	.animate-typing-delay-3 { animation: typing 0.5s ease-out 1.4s both; }

	@keyframes border-flow {
		0% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
		100% { background-position: 0% 50%; }
	}
	.animate-border-flow {
		background-size: 200% 200%;
		animation: border-flow 6s linear infinite;
	}
</style>
