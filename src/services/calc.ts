/** Pure sale math, shared by the live form preview and the repositories. */
export interface SaleAmounts {
  grossAmount: number
  commissionAmount: number
  netAmount: number
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

export function calculateSaleAmounts(
  weight: number | undefined,
  rate: number | undefined,
  commissionPercent: number | undefined,
): SaleAmounts {
  const w = Number(weight) || 0
  const r = Number(rate) || 0
  const c = Number(commissionPercent) || 0
  const grossAmount = round2(w * r)
  const commissionAmount = round2((grossAmount * c) / 100)
  const netAmount = round2(grossAmount - commissionAmount)
  return { grossAmount, commissionAmount, netAmount }
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value || 0)
}
