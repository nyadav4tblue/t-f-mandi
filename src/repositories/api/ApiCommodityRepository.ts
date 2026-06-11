import type { Commodity, NewCommodity } from '../../types'
import type { CommodityRepository } from '../types'
import { http, httpAll } from './httpClient'
import { fromStatus, mapCommodity, type ApiCommodity } from './mappers'

export class ApiCommodityRepository implements CommodityRepository {
  async getAll(): Promise<Commodity[]> {
    const rows = await httpAll<ApiCommodity>('/commodities')
    return rows.map(mapCommodity)
  }

  async getById(id: string): Promise<Commodity | null> {
    const row = await http<ApiCommodity | null>(`/commodities/${id}`)
    return row ? mapCommodity(row) : null
  }

  async create(input: NewCommodity): Promise<Commodity> {
    const row = await http<ApiCommodity>('/commodities', {
      method: 'POST',
      body: JSON.stringify({ name: input.name, status: fromStatus(input.status) }),
    })
    return mapCommodity(row)
  }

  async update(id: string, input: Partial<NewCommodity>): Promise<Commodity> {
    const body: Record<string, unknown> = {}
    if (input.name !== undefined) body.name = input.name
    if (input.status !== undefined) body.status = fromStatus(input.status)
    const row = await http<ApiCommodity>(`/commodities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
    return mapCommodity(row)
  }

  delete(id: string): Promise<void> {
    return http<void>(`/commodities/${id}`, { method: 'DELETE' })
  }
}
