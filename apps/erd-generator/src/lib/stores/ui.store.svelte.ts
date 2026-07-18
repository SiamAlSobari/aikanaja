export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
	id: string;
	type: ToastType;
	message: string;
	duration?: number;
}

let sidebarOpen = $state(false);
let theme = $state<'light' | 'dark' | 'system'>('system');
let toasts = $state<Toast[]>([]);

export function getUiState() {
	return {
		get sidebarOpen() { return sidebarOpen; },
		get theme() { return theme; },
		get toasts() { return toasts; },
	};
}

export function toggleSidebar() {
	sidebarOpen = !sidebarOpen;
}

export function setSidebarOpen(open: boolean) {
	sidebarOpen = open;
}

export function setTheme(t: 'light' | 'dark' | 'system') {
	theme = t;
	if (typeof document !== 'undefined') {
		document.documentElement.setAttribute('data-theme', t === 'system' ? '' : t);
		localStorage.setItem('theme', t);
	}
}

export function addToast(type: ToastType, message: string, duration = 3000) {
	const id = crypto.randomUUID();
	toasts = [...toasts, { id, type, message, duration }];
	if (duration > 0) {
		setTimeout(() => removeToast(id), duration);
	}
}

export function removeToast(id: string) {
	toasts = toasts.filter((t) => t.id !== id);
}
