import { writable, derived, get } from 'svelte/store';
import type { PrdProject, VirtualReviewResult, SprintRoadmap } from '$lib/types/prd';

function createPrdStore() {
  const projects = writable<PrdProject[]>([]);
  const currentProject = writable<PrdProject | null>(null);
  const rawMarkdown = writable<string>('');
  const qualityScore = writable<number | null>(null);
  const virtualReview = writable<VirtualReviewResult | null>(null);
  const sprintRoadmap = writable<SprintRoadmap | null>(null);
  const isGenerating = writable(false);
  const isStreaming = writable(false);

  const totalStoryPoints = derived(sprintRoadmap, ($roadmap) => {
    if (!$roadmap) return 0;
    return (
      $roadmap.sprint1.reduce((sum, item) => sum + item.storyPoints, 0) +
      $roadmap.sprint2.reduce((sum, item) => sum + item.storyPoints, 0) +
      $roadmap.sprint3.reduce((sum, item) => sum + item.storyPoints, 0)
    );
  });

  // Combined store for $ prefix usage
  const combined = derived(
    [projects, currentProject, rawMarkdown, qualityScore, virtualReview, sprintRoadmap, isGenerating, isStreaming, totalStoryPoints],
    ([$projects, $currentProject, $rawMarkdown, $qualityScore, $virtualReview, $sprintRoadmap, $isGenerating, $isStreaming, $totalStoryPoints]) => ({
      projects: $projects,
      currentProject: $currentProject,
      rawMarkdown: $rawMarkdown,
      qualityScore: $qualityScore,
      virtualReview: $virtualReview,
      sprintRoadmap: $sprintRoadmap,
      isGenerating: $isGenerating,
      isStreaming: $isStreaming,
      totalStoryPoints: $totalStoryPoints,
    })
  );

  return {
    projects,
    currentProject,
    rawMarkdown,
    qualityScore,
    virtualReview,
    sprintRoadmap,
    isGenerating,
    isStreaming,
    totalStoryPoints,
    subscribe: combined.subscribe,

    setCurrentProject(project: PrdProject | null) {
      currentProject.set(project);
      rawMarkdown.set(project?.content ?? '');
      qualityScore.set(project?.qualityScore ?? null);
    },

    updateContent(content: string) {
      rawMarkdown.set(content);
    },

    reset() {
      currentProject.set(null);
      rawMarkdown.set('');
      qualityScore.set(null);
      virtualReview.set(null);
      sprintRoadmap.set(null);
      isGenerating.set(false);
      isStreaming.set(false);
    },
  };
}

export const prd = createPrdStore();
