<script lang="ts">
  let {
    data = [],
    width = 120,
    height = 30,
    color = 'oklch(var(--p))',
  }: {
    data?: number[];
    width?: number;
    height?: number;
    color?: string;
  } = $props();

  function buildPath(values: number[]): string {
    if (values.length < 2) return '';
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const stepX = width / (values.length - 1);

    return values
      .map((v, i) => {
        const x = i * stepX;
        const y = height - ((v - min) / range) * height;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }
</script>

<svg {width} {height} class="overflow-visible">
  <path
    d={buildPath(data)}
    fill="none"
    stroke={color}
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
