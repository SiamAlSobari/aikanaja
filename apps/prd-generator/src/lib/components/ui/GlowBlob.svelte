<script lang="ts">
  let {
    color = 'primary',
    size = 400,
    opacity = 0.15,
    blur = 100,
    x = 0,
    y = 0,
  }: {
    color?: string;
    size?: number;
    opacity?: number;
    blur?: number;
    x?: number;
    y?: number;
  } = $props();
</script>

<div
  class="absolute rounded-full pointer-events-none"
  style="
    width: {size}px;
    height: {size}px;
    background: var(--color-{color}, oklch(var(--p)));
    opacity: {opacity};
    filter: blur({blur}px);
    left: {x}px;
    top: {y}px;
  "
></div>
