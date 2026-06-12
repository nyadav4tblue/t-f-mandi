import stockInSeed from '../../mocks/stockin.json'
import type {
  NewStockInFarmer,
  NewStockItem,
  NewTruckGroup,
  StockInFarmer,
  TruckGroup,
} from '../../types'
import type { StockInRepository } from '../types'
import { delay, generateId, LocalCollection } from './store'

function recompute(group: TruckGroup): TruckGroup {
  const farmers = group.farmers.map((f) => ({
    ...f,
    stockLineCount: f.items.length,
  }))
  return {
    ...group,
    farmers,
    totalFarmers: farmers.length,
    totalStockLines: farmers.reduce((n, f) => n + f.items.length, 0),
    totalQuantityEntries: farmers.reduce((n, f) => n + f.items.length, 0),
  }
}

export class MockStockInRepository implements StockInRepository {
  private readonly store = new LocalCollection<TruckGroup>(
    'stockin_groups',
    stockInSeed as TruckGroup[],
  )

  getAll(): Promise<TruckGroup[]> {
    return delay(this.store.all())
  }

  getById(id: string): Promise<TruckGroup | null> {
    return delay(this.store.find(id) ?? null)
  }

  create(input: NewTruckGroup): Promise<TruckGroup> {
    const group: TruckGroup = {
      id: generateId('grp'),
      groupNumber: this.nextNumber(),
      groupName: input.groupName?.trim() || 'Stock Inward',
      truckNumber: input.truckNumber,
      driverName: input.driverName,
      driverMobile: input.driverMobile,
      arrivalDate: input.arrivalDate ?? new Date().toISOString().slice(0, 10),
      sourceLocation: input.sourceLocation,
      remarks: input.remarks,
      status: input.status ?? 'active',
      totalFarmers: 0,
      totalStockLines: 0,
      totalQuantityEntries: 0,
      farmers: [],
      createdAt: new Date().toISOString(),
    }
    return delay(this.store.insert(group))
  }

  async update(id: string, input: Partial<NewTruckGroup>): Promise<TruckGroup> {
    const existing = this.store.find(id)
    if (!existing) throw new Error(`Truck group ${id} not found`)
    const next = recompute({ ...existing, ...input })
    return delay(this.store.replace(id, next))
  }

  delete(id: string): Promise<void> {
    this.store.remove(id)
    return delay(undefined)
  }

  async addFarmer(groupId: string, input: NewStockInFarmer): Promise<TruckGroup> {
    const group = this.store.find(groupId)
    if (!group) throw new Error(`Truck group ${groupId} not found`)
    const farmer: StockInFarmer = {
      id: generateId('sif'),
      farmerId: input.farmerId,
      farmerName: input.farmerName ?? 'Farmer',
      village: input.village,
      mobile: input.mobile,
      remarks: input.remarks,
      stockLineCount: 0,
      items: [],
    }
    const next = recompute({ ...group, farmers: [...group.farmers, farmer] })
    return delay(this.store.replace(groupId, next))
  }

  removeFarmer(farmerEntryId: string): Promise<void> {
    const group = this.store.all().find((g) =>
      g.farmers.some((f) => f.id === farmerEntryId),
    )
    if (group) {
      const next = recompute({
        ...group,
        farmers: group.farmers.filter((f) => f.id !== farmerEntryId),
      })
      this.store.replace(group.id, next)
    }
    return delay(undefined)
  }

  async addItem(farmerEntryId: string, input: NewStockItem): Promise<TruckGroup> {
    const group = this.store.all().find((g) =>
      g.farmers.some((f) => f.id === farmerEntryId),
    )
    if (!group) throw new Error(`Farmer entry ${farmerEntryId} not found`)
    const farmers = group.farmers.map((f) =>
      f.id === farmerEntryId
        ? { ...f, items: [...f.items, { ...input, id: generateId('sit') }] }
        : f,
    )
    const next = recompute({ ...group, farmers })
    return delay(this.store.replace(group.id, next))
  }

  removeItem(itemId: string): Promise<void> {
    const group = this.store.all().find((g) =>
      g.farmers.some((f) => f.items.some((i) => i.id === itemId)),
    )
    if (group) {
      const farmers = group.farmers.map((f) => ({
        ...f,
        items: f.items.filter((i) => i.id !== itemId),
      }))
      this.store.replace(group.id, recompute({ ...group, farmers }))
    }
    return delay(undefined)
  }

  private nextNumber(): string {
    const all = this.store.all()
    const max = all.reduce((acc, g) => {
      const n = Number(g.groupNumber.replace(/\D/g, ''))
      return Number.isFinite(n) && n > acc ? n : acc
    }, 0)
    return `STK-${String(max + 1).padStart(6, '0')}`
  }
}
