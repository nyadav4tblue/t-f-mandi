import type {
  Commodity,
  Farmer,
  Grade,
  Sale,
  Status,
  StockInFarmer,
  StockItem,
  Trader,
  TruckGroup,
} from '../../types'

/** Backend uses uppercase status strings; the app uses lowercase. */
export const toStatus = (s: string | undefined): Status =>
  String(s).toUpperCase() === 'INACTIVE' ? 'inactive' : 'active'

export const fromStatus = (s: Status): string =>
  s === 'inactive' ? 'INACTIVE' : 'ACTIVE'

export interface ApiFarmer {
  id: string
  farmerCode: string
  name: string
  fatherName: string | null
  mobile: string | null
  village: string | null
  status: string
  commodities: { id: string; name: string }[]
  createdAt: string
}

export function mapFarmer(a: ApiFarmer): Farmer {
  return {
    id: a.id,
    name: a.name,
    fatherName: a.fatherName ?? '',
    mobile: a.mobile ?? '',
    village: a.village ?? '',
    status: toStatus(a.status),
    commodityIds: (a.commodities ?? []).map((c) => c.id),
    createdAt: a.createdAt,
  }
}

export interface ApiCommodity {
  id: string
  name: string
  status: string
  gradeCount?: number
  createdAt: string
}

export function mapCommodity(a: ApiCommodity): Commodity {
  return {
    id: a.id,
    name: a.name,
    status: toStatus(a.status),
    createdAt: a.createdAt,
  }
}

export interface ApiGrade {
  id: string
  commodityId: string
  commodityName?: string
  gradeName: string
  status: string
  createdAt: string
}

export function mapGrade(a: ApiGrade): Grade {
  return {
    id: a.id,
    commodityId: a.commodityId,
    name: a.gradeName,
    status: toStatus(a.status),
    createdAt: a.createdAt,
  }
}

export interface ApiTrader {
  id: string
  traderCode: string
  name: string
  mobile: string | null
  status: string
  createdAt: string
}

export function mapTrader(a: ApiTrader): Trader {
  return {
    id: a.id,
    name: a.name,
    mobile: a.mobile ?? undefined,
    createdAt: a.createdAt,
  }
}

export interface ApiSale {
  id: string
  saleNumber: string
  saleDate: string
  farmerId: string
  traderId: string
  commodityId: string
  gradeId: string | null
  quantity: number | null
  unit: string | null
  weight: number | null
  rate: number
  grossAmount: number
  commissionPercentage: number
  commissionAmount: number
  netAmount: number
  remarks: string | null
  createdAt: string
}

export function mapSale(a: ApiSale): Sale {
  return {
    id: a.id,
    saleNumber: a.saleNumber,
    // Backend stores a full ISO datetime; the app works with calendar dates.
    saleDate: (a.saleDate ?? '').slice(0, 10),
    farmerId: a.farmerId,
    commodityId: a.commodityId,
    gradeId: a.gradeId ?? undefined,
    traderId: a.traderId,
    quantity: a.quantity ?? undefined,
    unit: a.unit ?? undefined,
    weight: a.weight ?? undefined,
    rate: a.rate,
    commissionPercent: a.commissionPercentage,
    remarks: a.remarks ?? undefined,
    grossAmount: a.grossAmount,
    commissionAmount: a.commissionAmount,
    netAmount: a.netAmount,
    createdAt: a.createdAt,
  }
}

export interface ApiStockItem {
  id: string
  commodityId: string
  commodityName?: string
  gradeId: string | null
  gradeName: string | null
  variety: string | null
  quantity: number
  unit: string
  weight: number | null
  expectedWeight: number | null
  packageCount: number | null
  remarks: string | null
}

export interface ApiStockInFarmer {
  id: string
  farmerId: string
  farmerCode?: string
  farmerName: string
  village: string | null
  mobile: string | null
  remarks: string | null
  stockLineCount: number
  items: ApiStockItem[]
}

export interface ApiTruckGroup {
  id: string
  groupNumber: string
  groupName: string
  truckNumber: string | null
  driverName: string | null
  driverMobile: string | null
  arrivalDate: string
  sourceLocation: string | null
  remarks: string | null
  status: string
  totalFarmers: number
  totalStockLines: number
  totalQuantityEntries: number
  farmers: ApiStockInFarmer[]
  createdAt: string
}

function mapStockItem(a: ApiStockItem): StockItem {
  return {
    id: a.id,
    commodityId: a.commodityId,
    commodityName: a.commodityName ?? undefined,
    gradeId: a.gradeId ?? undefined,
    gradeName: a.gradeName ?? undefined,
    variety: a.variety ?? undefined,
    quantity: a.quantity,
    unit: a.unit,
    weight: a.weight ?? undefined,
    expectedWeight: a.expectedWeight ?? undefined,
    packageCount: a.packageCount ?? undefined,
    remarks: a.remarks ?? undefined,
  }
}

function mapStockInFarmer(a: ApiStockInFarmer): StockInFarmer {
  return {
    id: a.id,
    farmerId: a.farmerId,
    farmerCode: a.farmerCode ?? undefined,
    farmerName: a.farmerName,
    village: a.village ?? undefined,
    mobile: a.mobile ?? undefined,
    remarks: a.remarks ?? undefined,
    stockLineCount: a.stockLineCount,
    items: (a.items ?? []).map(mapStockItem),
  }
}

export function mapTruckGroup(a: ApiTruckGroup): TruckGroup {
  return {
    id: a.id,
    groupNumber: a.groupNumber,
    groupName: a.groupName,
    truckNumber: a.truckNumber ?? undefined,
    driverName: a.driverName ?? undefined,
    driverMobile: a.driverMobile ?? undefined,
    arrivalDate: (a.arrivalDate ?? '').slice(0, 10),
    sourceLocation: a.sourceLocation ?? undefined,
    remarks: a.remarks ?? undefined,
    status: toStatus(a.status),
    totalFarmers: a.totalFarmers,
    totalStockLines: a.totalStockLines,
    totalQuantityEntries: a.totalQuantityEntries,
    farmers: (a.farmers ?? []).map(mapStockInFarmer),
    createdAt: a.createdAt,
  }
}
