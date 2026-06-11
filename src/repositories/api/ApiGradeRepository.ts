import type { Grade, NewGrade } from '../../types'
import type { GradeRepository } from '../types'
import { http, HttpCrudRepository } from './httpClient'

export class ApiGradeRepository
  extends HttpCrudRepository<Grade, NewGrade>
  implements GradeRepository
{
  constructor() {
    super('/grades')
  }

  getByCommodity(commodityId: string): Promise<Grade[]> {
    return http<Grade[]>(`${this.resource}?commodityId=${commodityId}`)
  }
}
