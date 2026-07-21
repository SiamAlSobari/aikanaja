<script lang="ts">
  import { ui, type Toast } from '$lib/stores/ui.store';

  const toasts = ui.toasts;

  function getAlertClass(type: Toast['type']): string {
    switch (type) {
      case 'success': return 'alert-success';
      case 'error': return 'alert-error';
      case 'warning': return 'alert-warning';
      case 'info': return 'alert-info';
      default: return '';
    }
  }
</script>

<div class="toast toast-end toast-bottom z-50">
  {#each $toasts as toast (toast.id)}
    <div class="alert {getAlertClass(toast.type)} shadow-lg">
      <span>{toast.message}</span>
      <button class="btn btn-ghost btn-xs" onclick={() => ui.removeToast(toast.id)}>
        &times;
      </button>
    </div>
  {/each}
</div>
