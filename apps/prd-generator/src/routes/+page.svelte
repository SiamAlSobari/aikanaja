<script lang="ts">
	import PixelBlast from '$lib/components/ui/PixelBlast.svelte';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import HeroSection from '$lib/components/landing/HeroSection.svelte';
	import BentoFeatures from '$lib/components/landing/BentoFeatures.svelte';
	import LiveDemoSection from '$lib/components/landing/LiveDemoSection.svelte';
	import TransformSection from '$lib/components/landing/TransformSection.svelte';
	import FAQSection from '$lib/components/landing/FAQSection.svelte';
	import CTASection from '$lib/components/landing/CTASection.svelte';
</script>

<svelte:head>
	<title>AiKanAja — PRD Generator</title>
	<meta
		name="description"
		content="Buat PRD komprehensif dalam hitungan menit dengan AI. User stories, sprint plan, diagram, dan export ke AGENTS.md."
	/>
</svelte:head>

<div class="bg-slate-950 text-slate-100 font-sans selection:bg-orange-600/30 selection:text-orange-300 overflow-x-hidden">
	<!-- Hero with concentrated orange PixelBlast -->
	<div class="relative">
		<!-- PixelBlast: only covers hero area, fades out -->
		<div class="absolute inset-0 z-0">
			<PixelBlast
				variant="square"
				color="#ff3e00"
				pixelSize={4}
				patternScale={1.8}
				patternDensity={0.5}
				edgeFade={0.7}
				speed={0.35}
				enableRipples={true}
				rippleIntensityScale={0.6}
			/>
		</div>
		<!-- Gradient fade-out at bottom of hero -->
		<div
			class="absolute bottom-0 left-0 right-0 h-40 z-[1] pointer-events-none"
			style="background: linear-gradient(to bottom, transparent, #020617);"
		></div>

		<Navbar />
		<HeroSection />
	</div>

	<!-- Rest of page: clean dark background -->
	<BentoFeatures />
	<LiveDemoSection />
	<TransformSection />
	<FAQSection />
	<CTASection />
	<Footer />
</div>
