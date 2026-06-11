import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CommodityService } from '../services/CommodityService'
import { FarmerService } from '../services/FarmerService'
import { GradeService } from '../services/GradeService'
import { TraderService } from '../services/TraderService'
import type { Commodity, Farmer, Grade, Trader } from '../types'
import { MasterDataContext, type MasterData } from './masterDataContext'

/**
 * Loads and caches the master records (farmers, commodities, grades, traders)
 * so dynamic creation from any screen is instantly reflected everywhere.
 */
export function MasterDataProvider({ children }: { children: ReactNode }) {
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [commodities, setCommodities] = useState<Commodity[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [traders, setTraders] = useState<Trader[]>([])
  const [loading, setLoading] = useState(true)

  const reloadFarmers = useCallback(async () => {
    setFarmers(await FarmerService.getAll())
  }, [])
  const reloadCommodities = useCallback(async () => {
    setCommodities(await CommodityService.getAll())
  }, [])
  const reloadGrades = useCallback(async () => {
    setGrades(await GradeService.getAll())
  }, [])
  const reloadTraders = useCallback(async () => {
    setTraders(await TraderService.getAll())
  }, [])

  useEffect(() => {
    let active = true
    async function load() {
      const [f, c, g, t] = await Promise.all([
        FarmerService.getAll(),
        CommodityService.getAll(),
        GradeService.getAll(),
        TraderService.getAll(),
      ])
      if (!active) return
      setFarmers(f)
      setCommodities(c)
      setGrades(g)
      setTraders(t)
      setLoading(false)
    }
    void load()
    return () => {
      active = false
    }
  }, [])

  const addCommodity = useCallback(async (name: string) => {
    const created = await CommodityService.create(name)
    setCommodities((prev) => [...prev, created])
    return created
  }, [])

  const addGrade = useCallback(async (commodityId: string, name: string) => {
    const created = await GradeService.create(commodityId, name)
    setGrades((prev) => [...prev, created])
    return created
  }, [])

  const value = useMemo<MasterData>(() => {
    const commodityName = (id: string | undefined) =>
      commodities.find((c) => c.id === id)?.name ?? '—'
    const gradeName = (id: string | undefined) =>
      grades.find((g) => g.id === id)?.name ?? '—'
    const farmerName = (id: string | undefined) =>
      farmers.find((f) => f.id === id)?.name ?? '—'
    const traderName = (id: string | undefined) =>
      traders.find((t) => t.id === id)?.name ?? '—'
    const gradesForCommodity = (commodityId: string | undefined) =>
      grades.filter((g) => g.commodityId === commodityId && g.status === 'active')

    return {
      farmers,
      commodities,
      grades,
      traders,
      loading,
      reloadFarmers,
      reloadCommodities,
      reloadGrades,
      reloadTraders,
      addCommodity,
      addGrade,
      commodityName,
      gradeName,
      farmerName,
      traderName,
      gradesForCommodity,
    }
  }, [
    farmers,
    commodities,
    grades,
    traders,
    loading,
    reloadFarmers,
    reloadCommodities,
    reloadGrades,
    reloadTraders,
    addCommodity,
    addGrade,
  ])

  return (
    <MasterDataContext.Provider value={value}>
      {children}
    </MasterDataContext.Provider>
  )
}
