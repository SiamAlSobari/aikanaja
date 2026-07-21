export interface PrdProject {
  id: string;
  title: string;
  description?: string;
  author: string;
  userId: string;
  content?: string;
  templateType?: string;
  targetUser?: string;
  techStack?: string;
  erdLinkId?: string;
  shareToken?: string;
  visibility: 'private' | 'public' | 'team';
  status: 'active' | 'archived' | 'deleted';
  qualityScore?: number;
  storyPointsTotal?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PrdVersion {
  id: string;
  projectId: string;
  versionNum: number;
  title?: string;
  changelog?: string;
  content: string;
  qualityScore?: number;
  storyPointsTotal?: number;
  createdBy?: string;
  createdAt: string;
}

export interface PrdShareLink {
  id: string;
  projectId: string;
  token: string;
  allowComments: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface PrdWizardForm {
  title: string;
  description: string;
  templateType: 'saas' | 'ecommerce' | 'mobile' | 'api' | 'custom';
  targetUser: string;
  techStack: string;
  erdLinkId?: string;
}

export interface VirtualReviewResult {
  overallScore: number;
  techLeadScore: number;
  techLeadFeedback: string;
  qaScore: number;
  qaFeedback: string;
  productSponsorScore: number;
  productSponsorFeedback: string;
  recommendations?: string[];
  createdAt?: string;
}

export interface QualityAuditResult {
  score: number;
  ambiguityWarnings: Array<{
    original: string;
    suggestion: string;
    section?: string;
  }>;
  completenessCheck: {
    executiveSummary: boolean;
    problemStatement: boolean;
    userPersonas: boolean;
    functionalRequirements: boolean;
    userStories: boolean;
    sprintRoadmap: boolean;
    nonFunctionalRequirements: boolean;
    diagrams: boolean;
    riskAnalysis: boolean;
    outOfScope: boolean;
  };
}

export interface SprintRoadmap {
  sprint1: SprintItem[];
  sprint2: SprintItem[];
  sprint3: SprintItem[];
}

export interface SprintItem {
  id: string;
  title: string;
  storyPoints: number;
  priority: 'high' | 'medium' | 'low';
}

export interface PrdChatMessage {
  id: string;
  projectId: string;
  userId: string;
  role: 'user' | 'assistant' | 'system';
  actionType: 'chat' | 'inline_edit' | 'selection_highlight' | 'section_expand';
  content: string;
  revisedSnippet?: string;
  modelUsed?: string;
  promptTokenCount?: number;
  responseTokenCount?: number;
  createdAt: string;
}

export interface PrdTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'saas' | 'ecommerce' | 'mobile' | 'api' | 'ai';
  templateContent: string;
  icon?: string;
  thumbnail?: string;
  isOfficial: boolean;
  createdAt: string;
}

export interface PrdAuditLog {
  id: string;
  projectId: string;
  userId: string;
  action: string;
  sectionName?: string;
  details?: string;
  createdAt: string;
}

export interface DiffResult {
  added: DiffChunk[];
  removed: DiffChunk[];
  unchanged: DiffChunk[];
  stats: {
    addedLines: number;
    removedLines: number;
    unchangedLines: number;
  };
}

export interface DiffChunk {
  value: string;
  lines: string[];
}
