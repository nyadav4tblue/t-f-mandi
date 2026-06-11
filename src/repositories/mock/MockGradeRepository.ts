import gradesSeed from '../../mocks/grades.json'
import type { Grade, NewGrade } from '../../types'
import type { GradeRepository } from '../types'
import { delay, generateId, LocalCollection } from './store'

export class MockGradeRepository implements GradeRepository {
  private readonly store = new LocalCollection<Grade>(
    'grades',
    gradesSeed as Grade[],
  )

  getAll(): Promise<Grade[]> {
    return delay(this.store.all())
  }

  getByCommodity(commodityId: string): Promise<Grade[]> {
    return delay(this.store.all().filter((g) => g.commodityId === commodityId))
  }

  getById(id: string): Promise<Grade | null> {
    return delay(this.store.find(id) ?? null)
  }

  create(input: NewGrade): Promise<Grade> {
    const grade: Grade = {
      ...input,
      id: generateId('grd'),
      createdAt: new Date().toISOString(),
    }
    return delay(this.store.insert(grade))
  }

  async update(id: string, input: Partial<NewGrade>): Promise<Grade> {
    const existing = this.store.find(id)
    if (!existing) throw new Error(`Grade ${id} not found`)
    const next: Grade = { ...existing, ...input }
    return delay(this.store.replace(id, next))
  }

  delete(id: string): Promise<void> {
    this.store.remove(id)
    return delay(undefined)
  }
}
