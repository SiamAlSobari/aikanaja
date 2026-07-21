import { apiGet, apiPost } from './client';
import type { ApiResponse } from '$lib/types/api';
import type { User } from '$lib/types/user';

export const authApi = {
  loginGoogle(): void {
    window.location.href = `${window.location.origin}/auth/google`;
  },

  async getSession(): Promise<User> {
    const res = await apiGet<ApiResponse<User>>('/session');
    if (!res.data) throw new Error('No session');
    return res.data;
  },

  async logout(): Promise<void> {
    await apiPost('/auth/logout');
  },
};
