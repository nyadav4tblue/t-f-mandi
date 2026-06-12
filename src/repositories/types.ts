import type {
  Commodity,
  Farmer,
  Grade,
  NewCommodity,
  NewFarmer,
  NewGrade,
  NewSale,
  NewStockInFarmer,
  NewStockItem,
  NewTrader,
  NewTruckGroup,
  Sale,
  Trader,
  TruckGroup,
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

/**
 * Stock-In is modelled as truck groups. Each group holds farmer entries, and
 * each farmer entry holds stock items. Mutations to the nested resources return
 * the full, updated truck group.
 */
export interface StockInRepository {
  getAll(): Promise<TruckGroup[]>
  getById(id: string): Promise<TruckGroup | null>
  create(input: NewTruckGroup): Promise<TruckGroup>
  update(id: string, input: Partial<NewTruckGroup>): Promise<TruckGroup>
  delete(id: string): Promise<void>
  addFarmer(groupId: string, input: NewStockInFarmer): Promise<TruckGroup>
  removeFarmer(farmerEntryId: string): Promise<void>
  addItem(farmerEntryId: string, input: NewStockItem): Promise<TruckGroup>
  removeItem(itemId: string): Promise<void>
}
