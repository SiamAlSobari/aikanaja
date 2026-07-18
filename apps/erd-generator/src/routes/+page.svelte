<script lang="ts">
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import DotFieldCanvas from '$lib/components/ui/DotFieldCanvas.svelte';
	import GlowBlob from '$lib/components/ui/GlowBlob.svelte';
	import HeroSection from '$lib/components/landing/HeroSection.svelte';
	import WorkflowStepper from '$lib/components/landing/WorkflowStepper.svelte';
	import ComparisonSection from '$lib/components/landing/ComparisonSection.svelte';
	import FeaturesGrid from '$lib/components/landing/FeaturesGrid.svelte';
	import OrbitIntegrator from '$lib/components/landing/OrbitIntegrator.svelte';
	import ExportPlayground from '$lib/components/landing/ExportPlayground.svelte';
	import FAQAccordion from '$lib/components/landing/FAQAccordion.svelte';
	import CTASection from '$lib/components/landing/CTASection.svelte';

	let scrollY = $state(0);
	let isScrolled = $derived(scrollY > 5);
</script>

<svelte:window bind:scrollY />

<div
	class="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-600/30 selection:text-orange-300 relative overflow-x-hidden"
>
	<DotFieldCanvas />

	<GlowBlob position="top-[-10%] left-[-15%]" size="w-[800px] h-[800px]" color="bg-orange-950/15" />
	<GlowBlob position="top-[40%] right-[-10%]" size="w-[600px] h-[600px]" color="bg-slate-900/40" />
	<GlowBlob position="bottom-[-10%] left-[20%]" size="w-[700px] h-[700px]" color="bg-orange-950/10" />

	<Navbar {isScrolled} />

	<HeroSection />
	<WorkflowStepper />
	<ComparisonSection />
	<FeaturesGrid />
	<OrbitIntegrator />
	<ExportPlayground />
	<FAQAccordion />
	<CTASection />

	<Footer />
</div>
