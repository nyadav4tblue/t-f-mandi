import { RepositoryFactory } from '../factory/RepositoryFactory'
import type { Trader } from '../types'

class TraderServiceImpl {
  private get repo() {
    return RepositoryFactory.getTraderRepository()
  }

  getAll(): Promise<Trader[]> {
    return this.repo.getAll()
  }

  /**
   * Core of the dynamic trader handling: select the existing trader by name
   * (case-insensitive) or create one on the fly. No Trader Master page needed.
   */
  async findOrCreate(name: string, mobile?: string): Promise<Trader> {
    const trimmed = name.trim()
    const existing = await this.repo.findByName(trimmed)
    if (existing) return existing
    return this.repo.create({ name: trimmed, mobile: mobile?.trim() || undefined })
  }
}

export const TraderService = new TraderServiceImpl()
