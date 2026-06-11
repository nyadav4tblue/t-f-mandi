import farmersSeed from '../../mocks/farmers.json'
import type { Farmer, NewFarmer } from '../../types'
import type { FarmerRepository } from '../types'
import { delay, generateId, LocalCollection } from './store'

export class MockFarmerRepository implements FarmerRepository {
  private readonly store = new LocalCollection<Farmer>(
    'farmers',
    farmersSeed as Farmer[],
  )

  getAll(): Promise<Farmer[]> {
    return delay(this.store.all())
  }

  getById(id: string): Promise<Farmer | null> {
    return delay(this.store.find(id) ?? null)
  }

  create(input: NewFarmer): Promise<Farmer> {
    const farmer: Farmer = {
      ...input,
      id: generateId('frm'),
      createdAt: new Date().toISOString(),
    }
    return delay(this.store.insert(farmer))
  }

  async update(id: string, input: Partial<NewFarmer>): Promise<Farmer> {
    const existing = this.store.find(id)
    if (!existing) throw new Error(`Farmer ${id} not found`)
    const next: Farmer = { ...existing, ...input }
    return delay(this.store.replace(id, next))
  }

  delete(id: string): Promise<void> {
    this.store.remove(id)
    return delay(undefined)
  }
}
