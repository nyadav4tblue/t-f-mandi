import { createContext } from 'react'
import type { Commodity, Farmer, Grade, Trader } from '../types'

export interface MasterData {
  farmers: Farmer[]
  commodities: Commodity[]
  grades: Grade[]
  traders: Trader[]
  loading: boolean

  reloadFarmers: () => Promise<void>
  reloadCommodities: () => Promise<void>
  reloadGrades: () => Promise<void>
  reloadTraders: () => Promise<void>

  /** Dynamic creation helpers usable from any screen. */
  addCommodity: (name: string) => Promise<Commodity>
  addGrade: (commodityId: string, name: string) => Promise<Grade>

  commodityName: (id: string | undefined) => string
  gradeName: (id: string | undefined) => string
  farmerName: (id: string | undefined) => string
  traderName: (id: string | undefined) => string
  gradesForCommodity: (commodityId: string | undefined) => Grade[]
}

export const MasterDataContext = createContext<MasterData | null>(null)
