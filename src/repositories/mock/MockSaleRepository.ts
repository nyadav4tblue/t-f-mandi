import salesSeed from '../../mocks/sales.json'
import type { NewSale, Sale } from '../../types'
import type { SaleRepository } from '../types'
import { calculateSaleAmounts } from '../../services/calc'
import { delay, generateId, LocalCollection } from './store'

export class MockSaleRepository implements SaleRepository {
  private readonly store = new LocalCollection<Sale>(
    'sales',
    salesSeed as Sale[],
  )

  getAll(): Promise<Sale[]> {
    return delay(this.store.all())
  }

  getById(id: string): Promise<Sale | null> {
    return delay(this.store.find(id) ?? null)
  }

  create(input: NewSale): Promise<Sale> {
    const amounts = calculateSaleAmounts(
      input.weight,
      input.rate,
      input.commissionPercent,
    )
    const sale: Sale = {
      ...input,
      ...amounts,
      id: generateId('sal'),
      saleNumber: this.nextSaleNumber(),
      createdAt: new Date().toISOString(),
    }
    return delay(this.store.insert(sale))
  }

  async update(id: string, input: Partial<NewSale>): Promise<Sale> {
    const existing = this.store.find(id)
    if (!existing) throw new Error(`Sale ${id} not found`)
    const merged = { ...existing, ...input }
    const amounts = calculateSaleAmounts(
      merged.weight,
      merged.rate,
      merged.commissionPercent,
    )
    const next: Sale = { ...merged, ...amounts }
    return delay(this.store.replace(id, next))
  }

  delete(id: string): Promise<void> {
    this.store.remove(id)
    return delay(undefined)
  }

  private nextSaleNumber(): string {
    const sales = this.store.all()
    const max = sales.reduce((acc, s) => {
      const n = Number(s.saleNumber.replace(/\D/g, ''))
      return Number.isFinite(n) && n > acc ? n : acc
    }, 0)
    return `SAL-${String(max + 1).padStart(4, '0')}`
  }
}
