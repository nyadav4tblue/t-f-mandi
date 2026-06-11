import tradersSeed from '../../mocks/traders.json'
import type { NewTrader, Trader } from '../../types'
import type { TraderRepository } from '../types'
import { delay, generateId, LocalCollection } from './store'

export class MockTraderRepository implements TraderRepository {
  private readonly store = new LocalCollection<Trader>(
    'traders',
    tradersSeed as Trader[],
  )

  getAll(): Promise<Trader[]> {
    return delay(this.store.all())
  }

  getById(id: string): Promise<Trader | null> {
    return delay(this.store.find(id) ?? null)
  }

  findByName(name: string): Promise<Trader | null> {
    const match = this.store
      .all()
      .find((t) => t.name.trim().toLowerCase() === name.trim().toLowerCase())
    return delay(match ?? null)
  }

  create(input: NewTrader): Promise<Trader> {
    const trader: Trader = {
      ...input,
      id: generateId('trd'),
      createdAt: new Date().toISOString(),
    }
    return delay(this.store.insert(trader))
  }

  async update(id: string, input: Partial<NewTrader>): Promise<Trader> {
    const existing = this.store.find(id)
    if (!existing) throw new Error(`Trader ${id} not found`)
    const next: Trader = { ...existing, ...input }
    return delay(this.store.replace(id, next))
  }

  delete(id: string): Promise<void> {
    this.store.remove(id)
    return delay(undefined)
  }
}
