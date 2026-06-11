import { RepositoryFactory } from '../factory/RepositoryFactory'
import type { Commodity, NewCommodity } from '../types'

class CommodityServiceImpl {
  private get repo() {
    return RepositoryFactory.getCommodityRepository()
  }

  getAll(): Promise<Commodity[]> {
    return this.repo.getAll()
  }

  getById(id: string): Promise<Commodity | null> {
    return this.repo.getById(id)
  }

  /** Used by the "Add New Commodity" flow available from any screen. */
  create(name: string): Promise<Commodity> {
    const input: NewCommodity = { name: name.trim(), status: 'active' }
    return this.repo.create(input)
  }

  update(id: string, input: Partial<NewCommodity>): Promise<Commodity> {
    return this.repo.update(id, input)
  }

  delete(id: string): Promise<void> {
    return this.repo.delete(id)
  }

  search(commodities: Commodity[], term: string): Commodity[] {
    const q = term.trim().toLowerCase()
    if (!q) return commodities
    return commodities.filter((c) => c.name.toLowerCase().includes(q))
  }
}

export const CommodityService = new CommodityServiceImpl()
