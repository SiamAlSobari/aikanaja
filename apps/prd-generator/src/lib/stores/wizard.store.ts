import { writable, derived } from 'svelte/store';
import type { PrdWizardForm } from '$lib/types/prd';

const initialForm: PrdWizardForm = {
  title: '',
  description: '',
  templateType: 'saas',
  targetUser: '',
  techStack: '',
  erdLinkId: undefined,
};

function createWizardStore() {
  const step = writable(1);
  const formData = writable<PrdWizardForm>({ ...initialForm });
  const isSubmitting = writable(false);

  const maxStep = 3;

  const canGoNext = derived(formData, ($data) => {
    const currentStepVal = getStepValue(step);
    if (currentStepVal === 1) return $data.title.trim().length > 0;
    if (currentStepVal === 2) return $data.description.trim().length > 0 && $data.targetUser.trim().length > 0;
    return true;
  });

  function getStepValue(s: typeof step): number {
    let val = 1;
    s.subscribe((v) => (val = v))();
    return val;
  }

  return {
    step,
    formData,
    isSubmitting,
    canGoNext,

    nextStep() {
      step.update((s) => Math.min(s + 1, maxStep));
    },

    prevStep() {
      step.update((s) => Math.max(s - 1, 1));
    },

    setStep(s: number) {
      step.set(Math.max(1, Math.min(s, maxStep)));
    },

    updateField<K extends keyof PrdWizardForm>(key: K, value: PrdWizardForm[K]) {
      formData.update((d) => ({ ...d, [key]: value }));
    },

    reset() {
      step.set(1);
      formData.set({ ...initialForm });
      isSubmitting.set(false);
    },
  };
}

export const wizard = createWizardStore();
