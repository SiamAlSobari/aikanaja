import { writable, derived } from 'svelte/store';
import type { User } from '$lib/types/user';
import { authApi } from '$lib/api/auth';

function createAuthStore() {
  const { subscribe, set } = writable<User | null>(null);

  const isLoading = writable(true);

  async function fetchSession() {
    try {
      isLoading.set(true);
      const user = await authApi.getSession();
      set(user);
    } catch {
      set(null);
    } finally {
      isLoading.set(false);
    }
  }

  function login() {
    authApi.loginGoogle();
  }

  async function logout() {
    await authApi.logout();
    set(null);
  }

  function setUser(user: User | null) {
    set(user);
  }

  return {
    subscribe,
    isAuthenticated: derived({ subscribe }, ($user) => !!$user),
    isLoading,
    fetchSession,
    login,
    logout,
    setUser,
  };
}

export const auth = createAuthStore();
