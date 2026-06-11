import { RepositoryFactory } from '../factory/RepositoryFactory'
import type { Grade, NewGrade } from '../types'

class GradeServiceImpl {
  private get repo() {
    return RepositoryFactory.getGradeRepository()
  }

  getAll(): Promise<Grade[]> {
    return this.repo.getAll()
  }

  getByCommodity(commodityId: string): Promise<Grade[]> {
    return this.repo.getByCommodity(commodityId)
  }

  getById(id: string): Promise<Grade | null> {
    return this.repo.getById(id)
  }

  /** Used by the "Add New Grade" flow available from any screen. */
  create(commodityId: string, name: string): Promise<Grade> {
    const input: NewGrade = {
      commodityId,
      name: name.trim(),
      status: 'active',
    }
    return this.repo.create(input)
  }

  update(id: string, input: Partial<NewGrade>): Promise<Grade> {
    return this.repo.update(id, input)
  }

  delete(id: string): Promise<void> {
    return this.repo.delete(id)
  }

  search(grades: Grade[], term: string): Grade[] {
    const q = term.trim().toLowerCase()
    if (!q) return grades
    return grades.filter((g) => g.name.toLowerCase().includes(q))
  }
}

export const GradeService = new GradeServiceImpl()
