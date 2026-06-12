export type Status = 'active' | 'inactive'

export interface Farmer {
  id: string
  name: string
  fatherName: string
  mobile: string
  village: string
  status: Status
  /** Commodity IDs this farmer deals in */
  commodityIds: string[]
  createdAt: string
}

export interface Commodity {
  id: string
  name: string
  status: Status
  createdAt: string
}

export interface Grade {
  id: string
  commodityId: string
  name: string
  status: Status
  createdAt: string
}

export interface Trader {
  id: string
  name: string
  mobile?: string
  createdAt: string
}

export interface Sale {
  id: string
  /** Human-friendly auto-generated sale number, e.g. SAL-0001 */
  saleNumber: string
  saleDate: string
  farmerId: string
  commodityId: string
  gradeId?: string
  traderId: string
  quantity?: number
  unit?: string
  weight?: number
  rate: number
  commissionPercent: number
  remarks?: string
  /** Derived/snapshotted money values stored for reporting stability */
  grossAmount: number
  commissionAmount: number
  netAmount: number
  createdAt: string
}

/** A single line of produce brought by a farmer within a truck group. */
export interface StockItem {
  id: string
  commodityId: string
  commodityName?: string
  gradeId?: string
  gradeName?: string
  variety?: string
  quantity: number
  unit: string
  weight?: number
  expectedWeight?: number
  packageCount?: number
  remarks?: string
}

/** A farmer's entry within a truck group, holding their stock items. */
export interface StockInFarmer {
  id: string
  farmerId: string
  farmerCode?: string
  farmerName: string
  village?: string
  mobile?: string
  remarks?: string
  stockLineCount: number
  items: StockItem[]
}

/** A truck arriving at the mandi, grouping multiple farmers' stock-in. */
export interface TruckGroup {
  id: string
  groupNumber: string
  groupName: string
  truckNumber?: string
  driverName?: string
  driverMobile?: string
  arrivalDate: string
  sourceLocation?: string
  remarks?: string
  status: Status
  totalFarmers: number
  totalStockLines: number
  totalQuantityEntries: number
  farmers: StockInFarmer[]
  createdAt: string
}

/** Input shapes used when creating records (server/repository assigns id + timestamps) */
export type NewFarmer = Omit<Farmer, 'id' | 'createdAt'>
export type NewCommodity = Omit<Commodity, 'id' | 'createdAt'>
export type NewGrade = Omit<Grade, 'id' | 'createdAt'>
export type NewTrader = Omit<Trader, 'id' | 'createdAt'>
export type NewSale = Omit<
  Sale,
  'id' | 'createdAt' | 'saleNumber' | 'grossAmount' | 'commissionAmount' | 'netAmount'
>
export interface NewTruckGroup {
  groupName?: string
  truckNumber?: string
  driverName?: string
  driverMobile?: string
  arrivalDate?: string
  sourceLocation?: string
  remarks?: string
  status?: Status
}

export interface NewStockInFarmer {
  farmerId: string
  farmerName?: string
  village?: string
  mobile?: string
  remarks?: string
}

export interface NewStockItem {
  commodityId: string
  gradeId?: string
  variety?: string
  quantity: number
  unit: string
  weight?: number
  expectedWeight?: number
  packageCount?: number
  remarks?: string
}
