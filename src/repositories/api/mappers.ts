import type {
  Commodity,
  Farmer,
  Grade,
  Sale,
  Status,
  Trader,
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
