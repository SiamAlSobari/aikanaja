export const newProjectStore = $state({ isOpen: false });

export function openNewProject() {
	newProjectStore.isOpen = true;
}

export function closeNewProject() {
	newProjectStore.isOpen = false;
}
