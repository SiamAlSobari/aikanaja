<script lang="ts">
	import { Database } from 'lucide-svelte';

	let activeOrbitTech = $state<string | null>(null);
	let orbitAngle = $state(0);
	let animFrame: number;

	function animate() {
		orbitAngle = (orbitAngle + 0.12) % 360;
		animFrame = requestAnimationFrame(animate);
	}

	$effect(() => {
		animFrame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animFrame);
	});

	const databaseTech = [
		{ name: 'PostgreSQL', color: '#336791', icon: 'PG' },
		{ name: 'MySQL', color: '#00758F', icon: 'MY' },
		{ name: 'SQLite', color: '#003B57', icon: 'SL' },
		{ name: 'Prisma', color: '#8B5CF6', icon: 'PR' },
		{ name: 'Supabase', color: '#3ECF8E', icon: 'SB' },
		{ name: 'Neon', color: '#00E599', icon: 'NE' },
		{ name: 'PlanetScale', color: '#E11D48', icon: 'PS' },
		{ name: 'Drizzle', color: '#C5F74F', icon: 'DZ' }
	];

	const radius = 155;
	const count = databaseTech.length;

	function getPos(angle: number, r: number) {
		const rad = (angle * Math.PI) / 180;
		return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
	}
</script>

<section id="orbit" class="relative z-10 py-28 overflow-hidden">
	<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>

	<div class="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-16 items-center">
		<!-- Orbit Visual -->
		<div class="md:col-span-6 flex justify-center items-center relative py-12 min-h-[460px]">
			<!-- Outer decorative ring (slow rotate) -->
			<div
				class="absolute w-[380px] h-[380px] rounded-full pointer-events-none"
				style="transform: rotate({orbitAngle * 0.3}deg);"
			>
				<div class="absolute inset-0 rounded-full border border-dashed border-slate-800/30"></div>
				<!-- Ring markers -->
				{#each { length: 12 } as _, i}
					{@const a = i * 30}
					{@const p = getPos(a, 190)}
					<div
						class="absolute w-1.5 h-1.5 rounded-full bg-slate-800/50"
						style="left: calc(50% + {p.x}px); top: calc(50% + {p.y}px); transform: translate(-50%, -50%);"
					></div>
				{/each}
			</div>

			<!-- Main orbit ring -->
			<div class="absolute w-[330px] h-[330px] rounded-full border border-slate-800/40"></div>

			<!-- SVG lines from center to each tech -->
			<svg class="absolute w-[400px] h-[400px] pointer-events-none" viewBox="-200 -200 400 400">
				{#each databaseTech as tech, i}
					{@const angle = orbitAngle + (i * (360 / count))}
					{@const p = getPos(angle, radius)}
					<line
						x1="0" y1="0"
						x2={p.x} y2={p.y}
						stroke={activeOrbitTech === tech.name ? tech.color : '#1e293b'}
						stroke-width={activeOrbitTech === tech.name ? 1.5 : 0.5}
					stroke-opacity={activeOrbitTech === tech.name ? 0.6 : 0.15}
				/>
				{/each}
			</svg>

			<!-- Orbit trail particles -->
			{#each databaseTech as tech, i}
				{@const baseAngle = orbitAngle + (i * (360 / count))}
				{#each { length: 4 } as _, t}
					{@const trailAngle = baseAngle - (t + 1) * 4}
					{@const p = getPos(trailAngle, radius)}
					<div
						class="absolute rounded-full pointer-events-none"
						style="
							left: calc(50% + {p.x}px);
							top: calc(50% + {p.y}px);
							width: {4 - t}px;
							height: {4 - t}px;
							background: {tech.color};
							opacity: {0.15 - t * 0.03};
							transform: translate(-50%, -50%);
						"
					></div>
				{/each}
			{/each}

			<!-- Orbiting tech items -->
			{#each databaseTech as tech, i}
				{@const angle = orbitAngle + (i * (360 / count))}
				{@const p = getPos(angle, radius)}
				{@const isActive = activeOrbitTech === tech.name}
				<button
					onmouseenter={() => (activeOrbitTech = tech.name)}
					onmouseleave={() => (activeOrbitTech = null)}
					class="absolute flex items-center justify-center cursor-pointer z-10 group"
					style="
						left: calc(50% + {p.x}px);
						top: calc(50% + {p.y}px);
						width: {isActive ? 50 : 44}px;
						height: {isActive ? 50 : 44}px;
						transform: translate(-50%, -50%) scale({isActive ? 1.15 : 1});
						margin-left: 0;
						margin-top: 0;
						transition: all 0.25s ease-out;
					"
				>
					<!-- Glow ring -->
					{#if isActive}
						<div
							class="absolute inset-[-6px] rounded-full animate-pulse"
							style="background: radial-gradient(circle, {tech.color}22 0%, transparent 70%);"
						></div>
					{/if}

					<div
						class="w-full h-full rounded-xl flex items-center justify-center relative"
						style="
							background: {isActive ? tech.color + '18' : '#0c1322'};
							border: 1.5px solid {isActive ? tech.color + '55' : '#1e293b'};
							box-shadow: {isActive
								? `0 0 30px ${tech.color}25, inset 0 0 15px ${tech.color}08`
								: '0 4px 20px rgba(0,0,0,0.4)'};
						"
					>
						<span
							class="text-[10px] font-extrabold tracking-wider transition-colors duration-200"
							style="color: {isActive ? tech.color : '#475569'}"
						>
							{tech.icon}
						</span>
					</div>
				</button>
			{/each}

			<!-- Center hub -->
			<div class="relative z-20">
				<!-- Outer glow rings -->
				<div class="absolute inset-[-20px] rounded-full bg-orange-600/5 animate-pulse"></div>
				<div class="absolute inset-[-12px] rounded-full border border-orange-600/10"></div>

				<div class="w-24 h-24 rounded-full bg-slate-900 border-2 border-orange-600/40 flex items-center justify-center shadow-[0_0_80px_rgba(249,115,22,0.2)] relative">
					<Database class="w-9 h-9 text-orange-500" />
					<div class="absolute inset-0 rounded-full border-2 border-orange-500/15 animate-ping"></div>
				</div>
			</div>

			<!-- Big ambient glow -->
			<div class="absolute w-[300px] h-[300px] rounded-full bg-orange-600/4 blur-[80px] pointer-events-none"></div>
		</div>

		<!-- Text Content -->
		<div class="md:col-span-6 space-y-6">
			<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/10 border border-orange-600/20 text-[11px] font-medium text-orange-400">
				<Database class="w-3 h-3" /> Universal Compatibility
			</div>

			<h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
				Integrasi Mulus Dengan<br />
				<span class="bg-gradient-to-r from-orange-500 to-teal-400 bg-clip-text text-transparent">Database & ORM Favorit</span>
			</h2>

			<p class="text-slate-400 leading-relaxed">
				AiKanAja secara otomatis menyesuaikan sintaks tipe data, format penulisan primary key,
				dan constraint relasi sesuai dengan target engine database yang Anda pilih.
			</p>

			<!-- Tech info card -->
			{#if activeOrbitTech}
				{@const tech = databaseTech.find(t => t.name === activeOrbitTech)}
				<div
					class="p-4 rounded-xl transition-all duration-300"
					style="
						background: {tech?.color}08;
						border: 1px solid {tech?.color}25;
					"
				>
					<div class="flex items-center gap-3 mb-2">
						<div
							class="w-9 h-9 rounded-lg flex items-center justify-center"
							style="background: {tech?.color}15; border: 1px solid {tech?.color}35;"
						>
							<span class="text-xs font-extrabold" style="color: {tech?.color}">{tech?.icon}</span>
						</div>
						<div>
							<span class="text-sm font-semibold text-white">{activeOrbitTech}</span>
							<span class="block text-[10px] text-slate-500">Fully Supported</span>
						</div>
					</div>
					<p class="text-xs text-slate-400 leading-relaxed">
						Kompilasi skema DDL teroptimasi penuh didukung untuk vendor database ini.
					</p>
				</div>
			{:else}
				<div class="p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 text-xs text-slate-500">
					Arahkan kursor ke orbit untuk melihat detail kompatibilitas database.
				</div>
			{/if}

			<!-- Supported DBs grid -->
			<div class="grid grid-cols-4 gap-2 pt-2">
				{#each databaseTech as tech}
					{@const isActive = activeOrbitTech === tech.name}
					<div
						class="flex items-center gap-2 px-3 py-2 rounded-lg cursor-default transition-all duration-200"
						style="
							background: {isActive ? tech.color + '10' : 'rgba(15,23,42,0.3)'};
							border: 1px solid {isActive ? tech.color + '35' : 'rgba(30,41,59,0.4)'};
						"
						onmouseenter={() => (activeOrbitTech = tech.name)}
						onmouseleave={() => (activeOrbitTech = null)}
						role="presentation"
					>
						<span class="text-[10px] font-bold" style="color: {tech.color}">{tech.icon}</span>
						<span class="text-[10px] {isActive ? 'text-slate-300' : 'text-slate-500'} font-medium truncate transition-colors">{tech.name}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
