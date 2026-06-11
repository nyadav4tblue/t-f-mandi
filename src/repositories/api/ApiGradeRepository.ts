import type { Grade, NewGrade } from '../../types'
import type { GradeRepository } from '../types'
import { http, httpAll } from './httpClient'
import { fromStatus, mapGrade, type ApiGrade } from './mappers'

export class ApiGradeRepository implements GradeRepository {
  async getAll(): Promise<Grade[]> {
    const rows = await httpAll<ApiGrade>('/grades')
    return rows.map(mapGrade)
  }

  async getByCommodity(commodityId: string): Promise<Grade[]> {
    const rows = await http<ApiGrade[]>(`/commodities/${commodityId}/grades`)
    return (rows ?? []).map(mapGrade)
  }

  async getById(id: string): Promise<Grade | null> {
    const row = await http<ApiGrade | null>(`/grades/${id}`)
    return row ? mapGrade(row) : null
  }

  async create(input: NewGrade): Promise<Grade> {
    const row = await http<ApiGrade>('/grades', {
      method: 'POST',
      body: JSON.stringify({
        commodityId: input.commodityId,
        gradeName: input.name,
        status: fromStatus(input.status),
      }),
    })
    return mapGrade(row)
  }

  async update(id: string, input: Partial<NewGrade>): Promise<Grade> {
    const body: Record<string, unknown> = {}
    if (input.name !== undefined) body.gradeName = input.name
    if (input.status !== undefined) body.status = fromStatus(input.status)
    const row = await http<ApiGrade>(`/grades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
    return mapGrade(row)
  }

  delete(id: string): Promise<void> {
    return http<void>(`/grades/${id}`, { method: 'DELETE' })
  }
}
