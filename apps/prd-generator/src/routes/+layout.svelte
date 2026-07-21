<script lang="ts">
  import './layout.css';
  import Toast from '$lib/components/ui/Toast.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href="/favicon.svg" />
  <title>AiKanAja PRD Generator</title>
</svelte:head>

{@render children()}
<Toast />
