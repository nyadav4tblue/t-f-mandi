import type { NewSale, Sale } from '../../types'
import type { SaleRepository } from '../types'
import { HttpCrudRepository } from './httpClient'

export class ApiSaleRepository
  extends HttpCrudRepository<Sale, NewSale>
  implements SaleRepository
{
  constructor() {
    super('/sales')
  }
}
