import type { Farmer, NewFarmer } from '../../types'
import type { FarmerRepository } from '../types'
import { http, httpAll } from './httpClient'
import { fromStatus, mapFarmer, type ApiFarmer } from './mappers'

export class ApiFarmerRepository implements FarmerRepository {
  async getAll(): Promise<Farmer[]> {
    const rows = await httpAll<ApiFarmer>('/farmers')
    return rows.map(mapFarmer)
  }

  async getById(id: string): Promise<Farmer | null> {
    const row = await http<ApiFarmer | null>(`/farmers/${id}`)
    return row ? mapFarmer(row) : null
  }

  async create(input: NewFarmer): Promise<Farmer> {
    const row = await http<ApiFarmer>('/farmers', {
      method: 'POST',
      body: JSON.stringify(this.toRequest(input)),
    })
    return mapFarmer(row)
  }

  async update(id: string, input: Partial<NewFarmer>): Promise<Farmer> {
    const row = await http<ApiFarmer>(`/farmers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(this.toRequest(input)),
    })
    return mapFarmer(row)
  }

  delete(id: string): Promise<void> {
    return http<void>(`/farmers/${id}`, { method: 'DELETE' })
  }

  private toRequest(input: Partial<NewFarmer>): Record<string, unknown> {
    const body: Record<string, unknown> = {}
    if (input.name !== undefined) body.name = input.name
    if (input.fatherName !== undefined) body.fatherName = input.fatherName
    if (input.mobile !== undefined) body.mobile = input.mobile
    if (input.village !== undefined) body.village = input.village
    if (input.status !== undefined) body.status = fromStatus(input.status)
    if (input.commodityIds !== undefined) body.commodityIds = input.commodityIds
    return body
  }
}
