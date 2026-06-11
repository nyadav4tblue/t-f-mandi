import { RepositoryFactory } from '../factory/RepositoryFactory'
import type { NewSale, Sale } from '../types'
import { TraderService } from './TraderService'

export interface SaleFormInput {
  saleDate: string
  farmerId: string
  commodityId: string
  gradeId?: string
  traderName: string
  traderMobile?: string
  quantity?: number
  unit?: string
  weight?: number
  rate: number
  commissionPercent: number
  remarks?: string
}

export interface DateRange {
  from?: string
  to?: string
}

class SaleServiceImpl {
  private get repo() {
    return RepositoryFactory.getSaleRepository()
  }

  getAll(): Promise<Sale[]> {
    return this.repo.getAll()
  }

  getById(id: string): Promise<Sale | null> {
    return this.repo.getById(id)
  }

  /**
   * Creates a sale, resolving the trader by name (creating it if needed).
   * Money fields and the sale number are assigned by the repository.
   */
  async create(form: SaleFormInput): Promise<Sale> {
    const trader = await TraderService.findOrCreate(
      form.traderName,
      form.traderMobile,
    )
    const input: NewSale = {
      saleDate: form.saleDate,
      farmerId: form.farmerId,
      commodityId: form.commodityId,
      gradeId: form.gradeId || undefined,
      traderId: trader.id,
      quantity: form.quantity,
      unit: form.unit,
      weight: form.weight,
      rate: form.rate,
      commissionPercent: form.commissionPercent,
      remarks: form.remarks,
    }
    return this.repo.create(input)
  }

  delete(id: string): Promise<void> {
    return this.repo.delete(id)
  }

  filterByDate(sales: Sale[], range: DateRange): Sale[] {
    return sales.filter((s) => {
      if (range.from && s.saleDate < range.from) return false
      if (range.to && s.saleDate > range.to) return false
      return true
    })
  }

  /** Aggregates sales by a key extracted from each sale. */
  groupTotals<K extends string>(
    sales: Sale[],
    keyOf: (s: Sale) => K,
  ): Map<K, { count: number; gross: number; commission: number; net: number }> {
    const map = new Map<
      K,
      { count: number; gross: number; commission: number; net: number }
    >()
    for (const s of sales) {
      const key = keyOf(s)
      const acc = map.get(key) ?? { count: 0, gross: 0, commission: 0, net: 0 }
      acc.count += 1
      acc.gross += s.grossAmount
      acc.commission += s.commissionAmount
      acc.net += s.netAmount
      map.set(key, acc)
    }
    return map
  }

  totals(sales: Sale[]): { gross: number; commission: number; net: number } {
    return sales.reduce(
      (acc, s) => ({
        gross: acc.gross + s.grossAmount,
        commission: acc.commission + s.commissionAmount,
        net: acc.net + s.netAmount,
      }),
      { gross: 0, commission: 0, net: 0 },
    )
  }
}

export const SaleService = new SaleServiceImpl()
