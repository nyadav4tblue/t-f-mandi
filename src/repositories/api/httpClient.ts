import { API_BASE_URL } from '../../config'

interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface Envelope<T> {
  success: boolean
  data: T
  meta?: PaginationMeta
  error?: { code?: string; message?: string }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<Envelope<T>> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (res.status === 204) {
    return { success: true, data: undefined as T }
  }

  let json: Envelope<T> | undefined
  try {
    json = (await res.json()) as Envelope<T>
  } catch {
    json = undefined
  }

  if (!res.ok || json?.success === false) {
    const message =
      json?.error?.message ?? `${options.method ?? 'GET'} ${path} failed (${res.status})`
    throw new Error(message)
  }

  return (json ?? { success: true, data: undefined as T }) as Envelope<T>
}

/** Returns the unwrapped `data` payload of a single-resource response. */
export async function http<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  return (await request<T>(path, options)).data
}

/**
 * Fetches every page of a paginated list endpoint (the API caps `limit` at
 * 100) and returns the concatenated rows.
 */
export async function httpAll<T>(path: string): Promise<T[]> {
  const sep = path.includes('?') ? '&' : '?'
  const first = await request<T[]>(`${path}${sep}page=1&limit=100`)
  let rows = first.data ?? []
  const totalPages = first.meta?.totalPages ?? 1
  for (let page = 2; page <= totalPages; page += 1) {
    const next = await request<T[]>(`${path}${sep}page=${page}&limit=100`)
    rows = rows.concat(next.data ?? [])
  }
  return rows
}
