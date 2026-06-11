import type { NewSale, Sale } from '../../types'
import type { SaleRepository } from '../types'
import { http, httpAll } from './httpClient'
import { mapSale, type ApiSale } from './mappers'

/** The form provides a calendar date; the backend stores a full timestamp. */
function toIsoDateTime(date: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? new Date(`${date}T00:00:00.000Z`).toISOString()
    : date
}

export class ApiSaleRepository implements SaleRepository {
  async getAll(): Promise<Sale[]> {
    const rows = await httpAll<ApiSale>('/sales')
    return rows.map(mapSale)
  }

  async getById(id: string): Promise<Sale | null> {
    const row = await http<ApiSale | null>(`/sales/${id}`)
    return row ? mapSale(row) : null
  }

  async create(input: NewSale): Promise<Sale> {
    const row = await http<ApiSale>('/sales', {
      method: 'POST',
      body: JSON.stringify(this.toRequest(input)),
    })
    return mapSale(row)
  }

  async update(id: string, input: Partial<NewSale>): Promise<Sale> {
    const row = await http<ApiSale>(`/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(this.toRequest(input)),
    })
    return mapSale(row)
  }

  delete(id: string): Promise<void> {
    return http<void>(`/sales/${id}`, { method: 'DELETE' })
  }

  private toRequest(input: Partial<NewSale>): Record<string, unknown> {
    const body: Record<string, unknown> = {}
    if (input.saleDate !== undefined) body.saleDate = toIsoDateTime(input.saleDate)
    if (input.farmerId !== undefined) body.farmerId = input.farmerId
    if (input.traderId !== undefined) body.traderId = input.traderId
    if (input.commodityId !== undefined) body.commodityId = input.commodityId
    if (input.gradeId !== undefined) body.gradeId = input.gradeId
    if (input.quantity !== undefined) body.quantity = input.quantity
    if (input.unit !== undefined) body.unit = input.unit
    if (input.weight !== undefined) body.weight = input.weight
    if (input.rate !== undefined) body.rate = input.rate
    if (input.commissionPercent !== undefined)
      body.commissionPercentage = input.commissionPercent
    if (input.remarks !== undefined) body.remarks = input.remarks
    return body
  }
}
