<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    open = $bindable(false),
    title,
    size = 'md',
    children,
    actions,
    onclose,
  }: {
    open?: boolean;
    title?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    children?: Snippet;
    actions?: Snippet;
    onclose?: () => void;
  } = $props();

  function handleClose() {
    open = false;
    onclose?.();
  }
</script>

<dialog class="modal" class:modal-open={open}>
  <div class="modal-box {size !== 'md' ? `modal-${size}` : ''}">
    {#if title}
      <h3 class="text-lg font-bold">{title}</h3>
    {/if}
    <div class="py-4">
      {#if children}
        {@render children()}
      {/if}
    </div>
    {#if actions}
      <div class="modal-action">
        {@render actions()}
      </div>
    {/if}
  </div>
  <form method="dialog" class="modal-backdrop">
    <button onclick={handleClose}>close</button>
  </form>
</dialog>
