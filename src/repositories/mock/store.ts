import { STORAGE_PREFIX } from '../../config'

/**
 * Small persistence helper for the mock repositories.
 *
 * Seeds an in-memory collection from a bundled JSON file the first time it is
 * used, then mirrors all writes to localStorage so the munim's data survives a
 * page reload. This keeps the JSON imports contained inside the mock layer.
 */
export class LocalCollection<T extends { id: string }> {
  private readonly key: string
  private items: T[]

  constructor(name: string, seed: T[]) {
    this.key = `${STORAGE_PREFIX}${name}`
    const stored = this.read()
    if (stored) {
      this.items = stored
    } else {
      // Clone the seed so we never mutate the imported JSON module.
      this.items = JSON.parse(JSON.stringify(seed)) as T[]
      this.write()
    }
  }

  private read(): T[] | null {
    try {
      const raw = localStorage.getItem(this.key)
      return raw ? (JSON.parse(raw) as T[]) : null
    } catch {
      return null
    }
  }

  private write(): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(this.items))
    } catch {
      // Ignore storage failures (e.g. private mode) — keep working in-memory.
    }
  }

  all(): T[] {
    return this.items.map((item) => ({ ...item }))
  }

  find(id: string): T | undefined {
    const item = this.items.find((i) => i.id === id)
    return item ? { ...item } : undefined
  }

  insert(item: T): T {
    this.items = [...this.items, item]
    this.write()
    return { ...item }
  }

  replace(id: string, next: T): T {
    this.items = this.items.map((i) => (i.id === id ? next : i))
    this.write()
    return { ...next }
  }

  remove(id: string): void {
    this.items = this.items.filter((i) => i.id !== id)
    this.write()
  }
}

let counter = 0
/** Generates a reasonably unique id for newly created mock records. */
export function generateId(prefix: string): string {
  counter += 1
  return `${prefix}-${Date.now().toString(36)}-${counter}`
}

/** Simulates a little network latency so loading states are exercised. */
export function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}
