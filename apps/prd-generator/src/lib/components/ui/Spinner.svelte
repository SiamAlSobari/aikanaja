<script lang="ts">
  let {
    size = 'md',
  }: {
    size?: 'xs' | 'sm' | 'md' | 'lg';
  } = $props();
</script>

<span class="loading loading-spinner loading-{size}"></span>
