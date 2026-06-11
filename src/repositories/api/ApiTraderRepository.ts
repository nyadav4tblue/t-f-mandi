import type { NewTrader, Trader } from '../../types'
import type { TraderRepository } from '../types'
import { http, HttpCrudRepository } from './httpClient'

export class ApiTraderRepository
  extends HttpCrudRepository<Trader, NewTrader>
  implements TraderRepository
{
  constructor() {
    super('/traders')
  }

  findByName(name: string): Promise<Trader | null> {
    return http<Trader | null>(
      `${this.resource}/search?name=${encodeURIComponent(name)}`,
    )
  }
}
