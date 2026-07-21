import { config } from '$lib/config';

export function getApiUrl(): string {
  return config.apiUrl;
}
