export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ThemeMode = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';
export type CanvasBg = 'dots' | 'lines' | 'cross';

export interface AppearancePrefs {
	theme: ThemeMode;
	fontSize: FontSize;
	canvasBg: CanvasBg;
}

export interface NotificationPrefs {
	email: boolean;
	projectShared: boolean;
	quotaWarning: boolean;
	billing: boolean;
}

interface Toast {
	id: string;
	type: ToastType;
	message: string;
	duration?: number;
}

const LS_APPEARANCE = 'schemaflow.appearance';
const LS_NOTIFICATIONS = 'schemaflow.notifications';
const LS_THEME = 'theme';

const DEFAULT_APPEARANCE: AppearancePrefs = { theme: 'system', fontSize: 'medium', canvasBg: 'dots' };
const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
	email: true,
	projectShared: true,
	quotaWarning: true,
	billing: true
};

function loadAppearance(): AppearancePrefs {
	if (typeof localStorage === 'undefined') return DEFAULT_APPEARANCE;
	try {
		const stored = localStorage.getItem(LS_APPEARANCE);
		const theme = (localStorage.getItem(LS_THEME) as ThemeMode) || DEFAULT_APPEARANCE.theme;
		const parsed = stored ? JSON.parse(stored) : {};
		return { ...DEFAULT_APPEARANCE, ...parsed, theme };
	} catch {
		return DEFAULT_APPEARANCE;
	}
}

function loadNotifications(): NotificationPrefs {
	if (typeof localStorage === 'undefined') return DEFAULT_NOTIFICATIONS;
	try {
		const stored = localStorage.getItem(LS_NOTIFICATIONS);
		return stored ? { ...DEFAULT_NOTIFICATIONS, ...JSON.parse(stored) } : DEFAULT_NOTIFICATIONS;
	} catch {
		return DEFAULT_NOTIFICATIONS;
	}
}

let sidebarOpen = $state(false);
let appearance = $state<AppearancePrefs>(loadAppearance());
let notifications = $state<NotificationPrefs>(loadNotifications());
let toasts = $state<Toast[]>([]);

function applyDom() {
	if (typeof document === 'undefined') return;
	const root = document.documentElement;
	root.setAttribute('data-theme', appearance.theme === 'system' ? '' : appearance.theme);
	root.setAttribute('data-font-size', appearance.fontSize);
	root.setAttribute('data-canvas-bg', appearance.canvasBg);
	root.classList.toggle('theme-light', appearance.theme === 'light');
	root.classList.toggle('theme-dark', appearance.theme !== 'light');
}

applyDom();

export function getUiState() {
	return {
		get sidebarOpen() {
			return sidebarOpen;
		},
		get theme() {
			return appearance.theme;
		},
		get appearance() {
			return appearance;
		},
		get notifications() {
			return notifications;
		},
		get toasts() {
			return toasts;
		}
	};
}

export function toggleSidebar() {
	sidebarOpen = !sidebarOpen;
}

export function setSidebarOpen(open: boolean) {
	sidebarOpen = open;
}

export function setTheme(t: ThemeMode) {
	appearance = { ...appearance, theme: t };
	persistAppearance();
}

export function setAppearance(prefs: Partial<AppearancePrefs>) {
	appearance = { ...appearance, ...prefs };
	persistAppearance();
}

export function setNotifications(prefs: Partial<NotificationPrefs>) {
	notifications = { ...notifications, ...prefs };
	persistNotifications();
}

function persistAppearance() {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(LS_APPEARANCE, JSON.stringify(appearance));
		localStorage.setItem(LS_THEME, appearance.theme);
	}
	applyDom();
}

function persistNotifications() {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(LS_NOTIFICATIONS, JSON.stringify(notifications));
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
