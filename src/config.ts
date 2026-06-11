/**
 * Central application configuration.
 *
 * Switch the data source for the entire app from one place.
 * Today everything is served from local JSON mocks. When the
 * Node.js + PostgreSQL backend is ready, set DATA_PROVIDER to "api"
 * (or the VITE_DATA_PROVIDER env var) and no page code needs to change.
 */
export type DataProvider = 'mock' | 'api'

export const DATA_PROVIDER: DataProvider =
  (import.meta.env.VITE_DATA_PROVIDER as DataProvider) || 'mock'

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:4000/api'

/** localStorage key prefix used by the mock repositories for persistence. */
export const STORAGE_PREFIX = 'mandi:'
