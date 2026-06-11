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

/** Input shapes used when creating records (server/repository assigns id + timestamps) */
export type NewFarmer = Omit<Farmer, 'id' | 'createdAt'>
export type NewCommodity = Omit<Commodity, 'id' | 'createdAt'>
export type NewGrade = Omit<Grade, 'id' | 'createdAt'>
export type NewTrader = Omit<Trader, 'id' | 'createdAt'>
export type NewSale = Omit<
  Sale,
  'id' | 'createdAt' | 'saleNumber' | 'grossAmount' | 'commissionAmount' | 'netAmount'
>
