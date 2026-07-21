<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    children,
    onclick,
    type = 'button',
    ...rest
  }: {
    variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'link' | 'error' | 'success' | 'warning';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    icon?: Snippet;
    children?: Snippet;
    onclick?: (e: MouseEvent) => void;
    type?: 'button' | 'submit' | 'reset';
  } = $props();
</script>

<button
  class="btn btn-{variant} btn-{size}"
  class:loading
  {disabled}
  {type}
  {onclick}
  {...rest}
>
  {#if loading}
    <span class="loading loading-spinner loading-sm"></span>
  {/if}
  {#if icon && !loading}
    {@render icon()}
  {/if}
  {#if children}
    {@render children()}
  {/if}
</button>
