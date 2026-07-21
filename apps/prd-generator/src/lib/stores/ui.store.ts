import { writable } from 'svelte/store';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

function createUiStore() {
  const sidebarOpen = writable(false);
  const theme = writable<'light' | 'dark' | 'system'>('system');
  const toasts = writable<Toast[]>([]);

  function addToast(message: string, type: Toast['type'] = 'info', duration = 5000) {
    const id = crypto.randomUUID();
    toasts.update((t) => [...t, { id, message, type, duration }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }

  function removeToast(id: string) {
    toasts.update((t) => t.filter((toast) => toast.id !== id));
  }

  return {
    sidebarOpen,
    theme,
    toasts,
    addToast,
    removeToast,
  };
}

export const ui = createUiStore();
