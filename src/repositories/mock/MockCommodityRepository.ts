import commoditiesSeed from '../../mocks/commodities.json'
import type { Commodity, NewCommodity } from '../../types'
import type { CommodityRepository } from '../types'
import { delay, generateId, LocalCollection } from './store'

export class MockCommodityRepository implements CommodityRepository {
  private readonly store = new LocalCollection<Commodity>(
    'commodities',
    commoditiesSeed as Commodity[],
  )

  getAll(): Promise<Commodity[]> {
    return delay(this.store.all())
  }

  getById(id: string): Promise<Commodity | null> {
    return delay(this.store.find(id) ?? null)
  }

  create(input: NewCommodity): Promise<Commodity> {
    const commodity: Commodity = {
      ...input,
      id: generateId('com'),
      createdAt: new Date().toISOString(),
    }
    return delay(this.store.insert(commodity))
  }

  async update(id: string, input: Partial<NewCommodity>): Promise<Commodity> {
    const existing = this.store.find(id)
    if (!existing) throw new Error(`Commodity ${id} not found`)
    const next: Commodity = { ...existing, ...input }
    return delay(this.store.replace(id, next))
  }

  delete(id: string): Promise<void> {
    this.store.remove(id)
    return delay(undefined)
  }
}
