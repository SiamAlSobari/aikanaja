<script lang="ts">
	import { Cpu, Sparkles, ChevronRight, Database } from 'lucide-svelte';
	import { base } from '$app/paths';

	let promptText = $state('');
	let isTyping = $state(false);
	let activeDemo = $state<'ecommerce' | 'blog' | 'saas'>('ecommerce');

	const templates = {
		ecommerce:
			'Create an e-commerce database with users, products, orders, order items, and payment status.',
		blog: 'Design a blog system with authors, posts, tags, category hierarchy, comments, and post view metrics.',
		saas: 'Create a subscription SaaS system with tenants, users, subscriptions, billing invoices, and audit logs.'
	};

	async function typePrompt(key: 'ecommerce' | 'blog' | 'saas') {
		if (isTyping) return;
		isTyping = true;
		activeDemo = key;
		promptText = '';
		const text = templates[key];
		for (let i = 0; i < text.length; i++) {
			promptText += text[i];
			await new Promise((resolve) => setTimeout(resolve, 15));
		}
		isTyping = false;
	}

	let rotateX = $state(0);
	let rotateY = $state(0);
	let containerEl = $state<HTMLElement | null>(null);

	function handleMouseMove(e: MouseEvent) {
		if (!containerEl) return;
		const rect = containerEl.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;
		rotateX = -((y - centerY) / centerY) * 12;
		rotateY = ((x - centerX) / centerX) * 12;
	}

	function handleMouseLeave() {
		rotateX = 0;
		rotateY = 0;
	}

	let activeStep = $state(0);

	$effect(() => {
		typePrompt('ecommerce');
	});
</script>

<section
	class="max-w-7xl mx-auto px-6 pt-28 pb-24 md:pt-36 md:pb-32 grid md:grid-cols-12 gap-12 items-center relative z-10"
>
	<!-- Hero Left: Prompt Input Simulator -->
	<div class="md:col-span-6 space-y-8">
		<div
			class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-600/10 border border-orange-600/20 text-xs font-semibold text-orange-500"
		>
			<Sparkles class="w-3.5 h-3.5 animate-spin" /> AI-Driven Visual Database Modeler
		</div>

		<h1
			class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
		>
			Rancang Database Anda <br />
			<span
				class="bg-gradient-to-r from-orange-500 via-orange-300 to-teal-400 bg-clip-text text-transparent"
				>Tanpa Tulis SQL Manual.</span
			>
		</h1>

		<p class="text-slate-400 text-lg leading-relaxed max-w-xl">
			Ketik konsep tabel dalam bahasa Indonesia atau Inggris, AI kami menyusun relasi database,
			lalu Anda dapat mengedit struktur secara bebas di kanvas visual yang intuitif.
		</p>

		<!-- Terminal Simulator Prompt Box -->
		<div
			class="bg-slate-900/40 border border-slate-900 rounded-2xl p-5 shadow-2xl space-y-4 backdrop-blur-md"
		>
			<div class="flex items-center justify-between border-b border-slate-800/80 pb-3">
				<div class="flex items-center gap-2">
					<span class="w-3 h-3 rounded-full bg-rose-500/40"></span>
					<span class="w-3 h-3 rounded-full bg-amber-500/40"></span>
					<span class="w-3 h-3 rounded-full bg-orange-600/40"></span>
					<span class="text-xs text-slate-500 font-mono ml-2">aikanaja-generator.sh</span>
				</div>
				<span class="text-[10px] text-orange-500/60 font-mono flex items-center gap-1.5">
					<span class="w-1.5 h-1.5 rounded-full bg-orange-600 animate-ping"></span> AI Engine Ready
				</span>
			</div>

			<!-- Presets Buttons -->
			<div class="flex flex-wrap gap-2">
				{#each (['ecommerce', 'blog', 'saas'] as const) as key}
					<button
						onclick={() => typePrompt(key)}
						class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border {activeDemo ===
						key
							? 'bg-orange-600/10 border-orange-600/35 text-orange-500 shadow-[0_0_15px_rgba(16,185,129,0.08)]'
							: 'bg-slate-950/45 border-slate-855 text-slate-400 hover:text-slate-200'}"
					>
						{key === 'ecommerce' ? 'E-Commerce' : key === 'blog' ? 'Sistem Blog' : 'SaaS Billing'}
					</button>
				{/each}
			</div>

			<!-- Typing Interface -->
			<div class="relative">
				<div
					class="w-full bg-slate-950/90 border border-slate-900 rounded-xl p-4 text-sm font-mono text-slate-350 min-h-28 pr-28 select-none"
				>
					<span class="text-orange-600 mr-1.5">$</span>{promptText}<span
						class="animate-pulse font-bold text-orange-500">|</span
					>
				</div>
				<div class="absolute right-3.5 bottom-3.5">
					<a
						href="{base}/try"
						class="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-slate-950 text-xs font-bold shadow-lg shadow-orange-600/20 transition-all hover:scale-[1.03]"
					>
						Generate <ChevronRight class="w-4 h-4" />
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Hero Right: Tilted 3D Parallax ERD Canvas Mockup -->
	<div class="md:col-span-6 flex justify-center items-center">
		<div
			bind:this={containerEl}
			onmousemove={handleMouseMove}
			onmouseleave={handleMouseLeave}
			role="presentation"
			class="w-full max-w-[500px] h-[400px] rounded-3xl bg-slate-900/30 border border-slate-900/90 bg-grid-pattern relative flex items-center justify-center overflow-hidden cursor-crosshair shadow-[0_40px_120px_rgba(0,0,0,0.85)]"
			style="perspective: 1000px;"
		>
			<div
				class="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/85 pointer-events-none"
			></div>

			<div
				class="w-full h-full relative transition-transform duration-300 ease-out flex items-center justify-center will-change-transform"
				style="transform: rotateX({rotateX}deg) rotateY({rotateY}deg);"
			>
				<!-- Mockup Tables -->
				<div
					class="absolute top-10 left-8 w-44 rounded-xl border transition-all duration-500 bg-slate-950/90 shadow-2xl p-3 animate-float pointer-events-none {activeStep ===
					0
						? 'border-orange-600 shadow-orange-600/10 scale-105 z-20'
						: 'border-slate-800/80 opacity-80'}"
				>
					<div class="flex items-center justify-between border-b border-slate-800/85 pb-2 mb-2">
						<span class="text-xs font-bold text-white flex items-center gap-1.5">
							<Database class="w-3.5 h-3.5 text-orange-500" /> users
						</span>
						<span class="text-[8px] text-slate-500 font-mono">1:N Relation</span>
					</div>
					<div class="space-y-1.5 font-mono text-[9px] text-slate-400">
						<div class="flex justify-between">
							<span class="text-orange-500 font-semibold">🔑 id</span><span>UUID</span>
						</div>
						<div class="flex justify-between"><span>email</span><span>VARCHAR</span></div>
						<div class="flex justify-between"><span>name</span><span>VARCHAR</span></div>
						<div class="flex justify-between"><span>created_at</span><span>TIMESTAMP</span></div>
					</div>
				</div>

				<div
					class="absolute top-[28%] right-8 w-44 rounded-xl border transition-all duration-500 bg-slate-950/90 shadow-2xl p-3 pointer-events-none {activeStep ===
					1
						? 'border-orange-600 shadow-orange-600/10 scale-105 z-20'
						: 'border-slate-800/80 opacity-80'}"
				>
					<div class="flex items-center justify-between border-b border-slate-800/85 pb-2 mb-2">
						<span class="text-xs font-bold text-white flex items-center gap-1.5">
							<Database class="w-3.5 h-3.5 text-orange-500" /> orders
						</span>
						<span class="text-[8px] text-orange-500 font-mono flex items-center gap-1">
							<span class="w-1.5 h-1.5 bg-orange-600 rounded-full animate-ping"></span> Selected
						</span>
					</div>
					<div class="space-y-1.5 font-mono text-[9px] text-slate-400">
						<div class="flex justify-between">
							<span class="text-orange-500 font-semibold">🔑 id</span><span>UUID</span>
						</div>
						<div class="flex justify-between">
							<span class="text-orange-400 font-semibold">🔗 user_id</span><span>UUID</span>
						</div>
						<div class="flex justify-between"><span>total_amount</span><span>DECIMAL</span></div>
						<div class="flex justify-between"><span>status</span><span>VARCHAR</span></div>
					</div>
				</div>

				<div
					class="absolute bottom-10 left-12 w-44 rounded-xl border transition-all duration-500 bg-slate-950/90 shadow-2xl p-3 pointer-events-none {activeStep ===
					2
						? 'border-orange-600 shadow-orange-600/10 scale-105 z-20'
						: 'border-slate-800/80 opacity-80'}"
				>
					<div class="flex items-center justify-between border-b border-slate-800/85 pb-2 mb-2">
						<span class="text-xs font-bold text-white flex items-center gap-1.5">
							<Database class="w-3.5 h-3.5 text-orange-500" /> products
						</span>
						<span class="text-[8px] text-slate-500 font-mono">1:N Relation</span>
					</div>
					<div class="space-y-1.5 font-mono text-[9px] text-slate-400">
						<div class="flex justify-between">
							<span class="text-orange-500 font-semibold">🔑 id</span><span>UUID</span>
						</div>
						<div class="flex justify-between"><span>title</span><span>VARCHAR</span></div>
						<div class="flex justify-between"><span>price</span><span>DECIMAL</span></div>
						<div class="flex justify-between"><span>inventory</span><span>INT</span></div>
					</div>
				</div>

				<!-- Connecting Lines SVG -->
				<svg
					class="absolute inset-0 w-full h-full pointer-events-none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<defs>
						<linearGradient id="glow-orange" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stop-color="#ff3e00" stop-opacity="0.1" />
							<stop offset="50%" stop-color="#f97316" stop-opacity="0.9" />
							<stop offset="100%" stop-color="#ff3e00" stop-opacity="0.1" />
						</linearGradient>
					</defs>

					<path
						d="M 224 110 C 275 110, 260 160, 310 160"
						fill="none"
						stroke="rgba(255, 62, 0, 0.2)"
						stroke-width="1.5"
					/>
					<path
						d="M 224 110 C 275 110, 260 160, 310 160"
						fill="none"
						stroke="url(#glow-orange)"
						stroke-width="2"
						class="animate-flow-line"
						style="animation-duration: {activeStep === 2 ? '0.4s' : '1.2s'}"
					/>

					<path
						d="M 240 310 C 280 310, 260 210, 310 210"
						fill="none"
						stroke="rgba(255, 62, 0, 0.2)"
						stroke-width="1.5"
					/>
					<path
						d="M 240 310 C 280 310, 260 210, 310 210"
						fill="none"
						stroke="url(#glow-orange)"
						stroke-width="2"
						class="animate-flow-line"
						style="animation-duration: {activeStep === 2 ? '0.4s' : '1.2s'}"
					/>
				</svg>

				<div
					class="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950/95 border border-slate-800/80 text-[10px] text-slate-500 font-mono"
				>
					<span>Parallax Active — X: {rotateX.toFixed(0)}° Y: {rotateY.toFixed(0)}°</span>
				</div>
			</div>
		</div>
	</div>
</section>
