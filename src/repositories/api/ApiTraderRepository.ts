import type { NewTrader, Trader } from '../../types'
import type { TraderRepository } from '../types'
import { http, httpAll } from './httpClient'
import { mapTrader, type ApiTrader } from './mappers'

export class ApiTraderRepository implements TraderRepository {
  async getAll(): Promise<Trader[]> {
    const rows = await httpAll<ApiTrader>('/traders')
    return rows.map(mapTrader)
  }

  async getById(id: string): Promise<Trader | null> {
    const row = await http<ApiTrader | null>(`/traders/${id}`)
    return row ? mapTrader(row) : null
  }

  /**
   * The backend has no name-search endpoint, so we match client-side across
   * the trader list. This keeps the "create trader if not exists" flow working
   * identically to the mock provider.
   */
  async findByName(name: string): Promise<Trader | null> {
    const target = name.trim().toLowerCase()
    const all = await this.getAll()
    return all.find((t) => t.name.trim().toLowerCase() === target) ?? null
  }

  async create(input: NewTrader): Promise<Trader> {
    const row = await http<ApiTrader>('/traders', {
      method: 'POST',
      body: JSON.stringify({
        name: input.name,
        mobile: input.mobile,
        status: 'ACTIVE',
      }),
    })
    return mapTrader(row)
  }

  async update(id: string, input: Partial<NewTrader>): Promise<Trader> {
    const body: Record<string, unknown> = {}
    if (input.name !== undefined) body.name = input.name
    if (input.mobile !== undefined) body.mobile = input.mobile
    const row = await http<ApiTrader>(`/traders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
    return mapTrader(row)
  }

  delete(id: string): Promise<void> {
    return http<void>(`/traders/${id}`, { method: 'DELETE' })
  }
}
