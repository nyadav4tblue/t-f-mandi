import type {
  NewStockInFarmer,
  NewStockItem,
  NewTruckGroup,
  TruckGroup,
} from '../../types'
import type { StockInRepository } from '../types'
import { http, httpAll } from './httpClient'
import { fromStatus, mapTruckGroup, type ApiTruckGroup } from './mappers'

/** The form provides a calendar date; the backend stores a full timestamp. */
function toIsoDateTime(date: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? new Date(`${date}T00:00:00.000Z`).toISOString()
    : date
}

export class ApiStockInRepository implements StockInRepository {
  async getAll(): Promise<TruckGroup[]> {
    const rows = await httpAll<ApiTruckGroup>('/stock-in')
    return rows.map(mapTruckGroup)
  }

  async getById(id: string): Promise<TruckGroup | null> {
    const row = await http<ApiTruckGroup | null>(`/stock-in/${id}`)
    return row ? mapTruckGroup(row) : null
  }

  async create(input: NewTruckGroup): Promise<TruckGroup> {
    const row = await http<ApiTruckGroup>('/stock-in', {
      method: 'POST',
      body: JSON.stringify(this.groupBody(input)),
    })
    return mapTruckGroup(row)
  }

  async update(id: string, input: Partial<NewTruckGroup>): Promise<TruckGroup> {
    const row = await http<ApiTruckGroup>(`/stock-in/${id}`, {
      method: 'PUT',
      body: JSON.stringify(this.groupBody(input)),
    })
    return mapTruckGroup(row)
  }

  delete(id: string): Promise<void> {
    return http<void>(`/stock-in/${id}`, { method: 'DELETE' })
  }

  async addFarmer(groupId: string, input: NewStockInFarmer): Promise<TruckGroup> {
    const row = await http<ApiTruckGroup>(`/stock-in/${groupId}/farmers`, {
      method: 'POST',
      body: JSON.stringify({
        farmerId: input.farmerId,
        farmerName: input.farmerName,
        village: input.village,
        mobile: input.mobile,
        remarks: input.remarks,
      }),
    })
    return mapTruckGroup(row)
  }

  removeFarmer(farmerEntryId: string): Promise<void> {
    return http<void>(`/stock-in/farmers/${farmerEntryId}`, { method: 'DELETE' })
  }

  async addItem(farmerEntryId: string, input: NewStockItem): Promise<TruckGroup> {
    const body: Record<string, unknown> = {
      commodityId: input.commodityId,
      quantity: input.quantity,
      unit: input.unit,
    }
    if (input.gradeId) body.gradeId = input.gradeId
    if (input.variety) body.variety = input.variety
    if (input.weight !== undefined) body.weight = input.weight
    if (input.expectedWeight !== undefined) body.expectedWeight = input.expectedWeight
    if (input.packageCount !== undefined) body.packageCount = input.packageCount
    if (input.remarks) body.remarks = input.remarks
    const row = await http<ApiTruckGroup>(
      `/stock-in/farmers/${farmerEntryId}/items`,
      { method: 'POST', body: JSON.stringify(body) },
    )
    return mapTruckGroup(row)
  }

  removeItem(itemId: string): Promise<void> {
    return http<void>(`/stock-in/items/${itemId}`, { method: 'DELETE' })
  }

  private groupBody(input: Partial<NewTruckGroup>): Record<string, unknown> {
    const body: Record<string, unknown> = {}
    if (input.groupName !== undefined) body.groupName = input.groupName
    if (input.truckNumber !== undefined) body.truckNumber = input.truckNumber
    if (input.driverName !== undefined) body.driverName = input.driverName
    if (input.driverMobile !== undefined) body.driverMobile = input.driverMobile
    if (input.arrivalDate !== undefined)
      body.arrivalDate = toIsoDateTime(input.arrivalDate)
    if (input.sourceLocation !== undefined)
      body.sourceLocation = input.sourceLocation
    if (input.remarks !== undefined) body.remarks = input.remarks
    if (input.status !== undefined) body.status = fromStatus(input.status)
    return body
  }
}
