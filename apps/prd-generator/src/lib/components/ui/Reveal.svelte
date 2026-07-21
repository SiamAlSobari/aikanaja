<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    children,
    delay = 0,
    duration = 600,
    y = 20,
  }: {
    children?: Snippet;
    delay?: number;
    duration?: number;
    y?: number;
  } = $props();

  let visible = $state(false);
  let element: HTMLElement | undefined = $state();

  $effect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            visible = true;
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  });
</script>

<div
  bind:this={element}
  class="transition-all ease-out"
  style="
    opacity: {visible ? 1 : 0};
    transform: translateY({visible ? 0 : y}px);
    transition-duration: {duration}ms;
  "
>
  {#if children}
    {@render children()}
  {/if}
</div>
