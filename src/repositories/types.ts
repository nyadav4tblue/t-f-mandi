import type {
  Commodity,
  Farmer,
  Grade,
  NewCommodity,
  NewFarmer,
  NewGrade,
  NewSale,
  NewTrader,
  Sale,
  Trader,
} from '../types'

/** Generic CRUD contract shared by every repository. */
export interface CrudRepository<T, TNew> {
  getAll(): Promise<T[]>
  getById(id: string): Promise<T | null>
  create(input: TNew): Promise<T>
  update(id: string, input: Partial<TNew>): Promise<T>
  delete(id: string): Promise<void>
}

export type FarmerRepository = CrudRepository<Farmer, NewFarmer>

export type CommodityRepository = CrudRepository<Commodity, NewCommodity>

export interface GradeRepository extends CrudRepository<Grade, NewGrade> {
  getByCommodity(commodityId: string): Promise<Grade[]>
}

export interface TraderRepository extends CrudRepository<Trader, NewTrader> {
  /** Case-insensitive lookup used for "create trader if not exists". */
  findByName(name: string): Promise<Trader | null>
}

export type SaleRepository = CrudRepository<Sale, NewSale>
