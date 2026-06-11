import type { Farmer, NewFarmer } from '../../types'
import type { FarmerRepository } from '../types'
import { HttpCrudRepository } from './httpClient'

export class ApiFarmerRepository
  extends HttpCrudRepository<Farmer, NewFarmer>
  implements FarmerRepository
{
  constructor() {
    super('/farmers')
  }
}
