export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type PlanTier = 'free' | 'pro' | 'team';

export interface UsageInfo {
  count: number;
  limit: number | null;
  remaining: number | null;
}
