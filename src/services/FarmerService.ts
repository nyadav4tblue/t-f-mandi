import { RepositoryFactory } from '../factory/RepositoryFactory'
import type { Farmer, NewFarmer } from '../types'

/**
 * Business logic for farmers. Pages talk only to this service, never to a
 * repository or JSON file directly.
 */
class FarmerServiceImpl {
  private get repo() {
    return RepositoryFactory.getFarmerRepository()
  }

  getAll(): Promise<Farmer[]> {
    return this.repo.getAll()
  }

  getById(id: string): Promise<Farmer | null> {
    return this.repo.getById(id)
  }

  create(input: NewFarmer): Promise<Farmer> {
    return this.repo.create(input)
  }

  update(id: string, input: Partial<NewFarmer>): Promise<Farmer> {
    return this.repo.update(id, input)
  }

  delete(id: string): Promise<void> {
    return this.repo.delete(id)
  }

  /** Simple client-side search across name, mobile and village. */
  search(farmers: Farmer[], term: string): Farmer[] {
    const q = term.trim().toLowerCase()
    if (!q) return farmers
    return farmers.filter((f) =>
      [f.name, f.fatherName, f.mobile, f.village]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }
}

export const FarmerService = new FarmerServiceImpl()
