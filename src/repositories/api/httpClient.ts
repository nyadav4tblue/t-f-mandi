import { API_BASE_URL } from '../../config'

/** Thin fetch wrapper used by the API repositories. */
export async function http<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`API ${options.method ?? 'GET'} ${path} failed: ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

/**
 * Generic REST CRUD repository. Each concrete API repository simply points this
 * at its resource path (e.g. "/farmers"). When the backend is ready these are
 * wired in by flipping DATA_PROVIDER to "api" — no page code changes.
 */
export class HttpCrudRepository<T, TNew> {
  protected readonly resource: string

  constructor(resource: string) {
    this.resource = resource
  }

  getAll(): Promise<T[]> {
    return http<T[]>(this.resource)
  }

  getById(id: string): Promise<T | null> {
    return http<T | null>(`${this.resource}/${id}`)
  }

  create(input: TNew): Promise<T> {
    return http<T>(this.resource, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }

  update(id: string, input: Partial<TNew>): Promise<T> {
    return http<T>(`${this.resource}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    })
  }

  delete(id: string): Promise<void> {
    return http<void>(`${this.resource}/${id}`, { method: 'DELETE' })
  }
}
