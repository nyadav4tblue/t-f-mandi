import { useContext } from 'react'
import { MasterDataContext, type MasterData } from './masterDataContext'

export function useMasters(): MasterData {
  const ctx = useContext(MasterDataContext)
  if (!ctx) {
    throw new Error('useMasters must be used within a MasterDataProvider')
  }
  return ctx
}
