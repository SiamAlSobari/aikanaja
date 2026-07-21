<script lang="ts">
  let {
    variant = 'neutral',
    size = 'md',
    children,
  }: {
    variant?: 'neutral' | 'primary' | 'secondary' | 'accent' | 'ghost' | 'info' | 'success' | 'warning' | 'error';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    children?: string;
  } = $props();
</script>

<span class="badge badge-{variant} badge-{size}">
  {children}
</span>
