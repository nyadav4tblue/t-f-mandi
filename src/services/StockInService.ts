import { RepositoryFactory } from '../factory/RepositoryFactory'
import type {
  NewStockInFarmer,
  NewStockItem,
  NewTruckGroup,
  TruckGroup,
} from '../types'

export interface DateRange {
  from?: string
  to?: string
}

class StockInServiceImpl {
  private get repo() {
    return RepositoryFactory.getStockInRepository()
  }

  getAll(): Promise<TruckGroup[]> {
    return this.repo.getAll()
  }

  getById(id: string): Promise<TruckGroup | null> {
    return this.repo.getById(id)
  }

  createTruck(input: NewTruckGroup): Promise<TruckGroup> {
    return this.repo.create(input)
  }

  updateTruck(id: string, input: Partial<NewTruckGroup>): Promise<TruckGroup> {
    return this.repo.update(id, input)
  }

  deleteTruck(id: string): Promise<void> {
    return this.repo.delete(id)
  }

  addFarmer(groupId: string, input: NewStockInFarmer): Promise<TruckGroup> {
    return this.repo.addFarmer(groupId, input)
  }

  removeFarmer(farmerEntryId: string): Promise<void> {
    return this.repo.removeFarmer(farmerEntryId)
  }

  addItem(farmerEntryId: string, input: NewStockItem): Promise<TruckGroup> {
    return this.repo.addItem(farmerEntryId, input)
  }

  removeItem(itemId: string): Promise<void> {
    return this.repo.removeItem(itemId)
  }

  filterByDate(groups: TruckGroup[], range: DateRange): TruckGroup[] {
    return groups.filter((g) => {
      if (range.from && g.arrivalDate < range.from) return false
      if (range.to && g.arrivalDate > range.to) return false
      return true
    })
  }

  search(groups: TruckGroup[], term: string): TruckGroup[] {
    const q = term.trim().toLowerCase()
    if (!q) return groups
    return groups.filter((g) =>
      [g.groupNumber, g.groupName, g.truckNumber, g.driverName, g.sourceLocation]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }
}

export const StockInService = new StockInServiceImpl()
