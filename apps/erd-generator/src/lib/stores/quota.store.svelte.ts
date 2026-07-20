let isOpen = $state(false);
let message = $state(
	'Kuota generate bulan ini sudah habis. Upgrade ke Pro untuk generate unlimited, atau gunakan API key Anda sendiri.'
);

export function getQuotaModalState() {
	return {
		get isOpen() {
			return isOpen;
		},
		get message() {
			return message;
		}
	};
}

export function openQuotaModal(msg?: string) {
	if (msg) message = msg;
	isOpen = true;
}

export function closeQuotaModal() {
	isOpen = false;
}

/** Deteksi error quota (429) dari api client. */
export function isQuotaError(err: unknown): boolean {
	if (!err || typeof err !== 'object') return false;
	const e = err as { status?: number; message?: string };
	if (e.status === 429) return true;
	return /quota exceeded/i.test(e.message || '');
}
