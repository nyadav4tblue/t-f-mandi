import type { Commodity, NewCommodity } from '../../types'
import type { CommodityRepository } from '../types'
import { HttpCrudRepository } from './httpClient'

export class ApiCommodityRepository
  extends HttpCrudRepository<Commodity, NewCommodity>
  implements CommodityRepository
{
  constructor() {
    super('/commodities')
  }
}
