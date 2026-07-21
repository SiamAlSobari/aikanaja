<script lang="ts">
	import DarkVeil from '$lib/components/DarkVeil.svelte';
	import Navbar from '$lib/components/landing/Navbar.svelte';
	import HeroSection from '$lib/components/landing/HeroSection.svelte';
	import StudioPreview from '$lib/components/landing/StudioPreview.svelte';
	import FeaturesGrid from '$lib/components/landing/FeaturesGrid.svelte';
	import WorkflowStepper from '$lib/components/landing/WorkflowStepper.svelte';
	import SprintStoryPoints from '$lib/components/landing/SprintStoryPoints.svelte';
	import ComparisonSection from '$lib/components/landing/ComparisonSection.svelte';
	import SecurityBanner from '$lib/components/landing/SecurityBanner.svelte';
	import CTASection from '$lib/components/landing/CTASection.svelte';
	import FAQAccordion from '$lib/components/landing/FAQAccordion.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
</script>

<svelte:head>
	<title>AiKanAja PRD — Enterprise AI Product Requirement Document Generator</title>
	<meta name="description" content="Platform AI pembuat Product Requirement Document (PRD) 11 seksi enterprise otomatis dengan Gemini 2.0 Flash." />
</svelte:head>

<div class="relative min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden">

	<!-- DarkVeil WebGL Shader Background -->
	<div class="fixed inset-0 pointer-events-none z-0 opacity-30 mix-blend-screen">
		<DarkVeil hueShift={25} speed={0.25} warpAmount={0.06} noiseIntensity={0.01} />
	</div>

	<!-- Ambient glow orbs -->
	<div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
		<div class="absolute top-[-8%] left-[5%] w-[800px] h-[500px] bg-gradient-to-b from-orange-600/12 via-amber-600/6 to-transparent blur-[150px] rounded-full"></div>
		<div class="absolute bottom-[5%] right-[-8%] w-[600px] h-[400px] bg-gradient-to-t from-amber-500/8 via-orange-500/4 to-transparent blur-[130px] rounded-full"></div>
		<div class="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-gradient-to-b from-orange-500/5 to-transparent blur-[100px] rounded-full"></div>
		<!-- Subtle grid -->
		<div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:5rem_5rem]"></div>
	</div>

	<!-- Main Content -->
	<div class="relative z-10 flex flex-col min-h-screen">
		<Navbar />
		<main class="flex-1">
			<HeroSection />
			<StudioPreview />
			<FeaturesGrid />
			<WorkflowStepper />
			<SprintStoryPoints />
			<ComparisonSection />
			<SecurityBanner />
			<CTASection />
			<FAQAccordion />
		</main>
		<Footer />
	</div>
</div>
