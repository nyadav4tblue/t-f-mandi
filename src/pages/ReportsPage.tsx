import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { EmptyState, Spinner } from '../components/Spinner'
import { useMasters } from '../hooks/useMasters'
import { formatMoney } from '../services/calc'
import { SaleService, type DateRange } from '../services/SaleService'
import type { Sale } from '../types'

type ReportTab = 'daily' | 'farmer' | 'commodity' | 'commission'

const TABS: { id: ReportTab; label: string }[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'farmer', label: 'Farmer' },
  { id: 'commodity', label: 'Commodity' },
  { id: 'commission', label: 'Commission' },
]

export function ReportsPage() {
  const { farmerName, commodityName, traderName } = useMasters()
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<ReportTab>('daily')
  const [range, setRange] = useState<DateRange>({})

  useEffect(() => {
    SaleService.getAll().then((s) => {
      setSales(s)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(
    () => SaleService.filterByDate(sales, range),
    [sales, range],
  )
  const totals = useMemo(() => SaleService.totals(filtered), [filtered])

  return (
    <div>
      <PageHeader title="Reports" />

      {/* Date filter */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label className="label">From</label>
          <input
            className="input"
            type="date"
            value={range.from ?? ''}
            onChange={(e) =>
              setRange((r) => ({ ...r, from: e.target.value || undefined }))
            }
          />
        </div>
        <div>
          <label className="label">To</label>
          <input
            className="input"
            type="date"
            value={range.to ?? ''}
            onChange={(e) =>
              setRange((r) => ({ ...r, to: e.target.value || undefined }))
            }
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
              tab === t.id
                ? 'bg-brand-600 text-white'
                : 'border border-gray-200 bg-white text-gray-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        <Summary label="Gross" value={formatMoney(totals.gross)} />
        <Summary label="Commission" value={formatMoney(totals.commission)} accent />
        <Summary label="Net" value={formatMoney(totals.net)} />
      </div>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState message="No sales in this period." />
      ) : tab === 'daily' ? (
        <GroupedReport
          sales={filtered}
          keyOf={(s) => s.saleDate}
          labelOf={(k) => k}
        />
      ) : tab === 'farmer' ? (
        <GroupedReport
          sales={filtered}
          keyOf={(s) => s.farmerId}
          labelOf={(k) => farmerName(k)}
        />
      ) : tab === 'commodity' ? (
        <GroupedReport
          sales={filtered}
          keyOf={(s) => s.commodityId}
          labelOf={(k) => commodityName(k)}
        />
      ) : (
        <CommissionReport
          sales={filtered}
          farmerName={farmerName}
          commodityName={commodityName}
          traderName={traderName}
        />
      )}
    </div>
  )
}

function Summary({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div
      className={`rounded-2xl p-3 text-center ${
        accent ? 'bg-brand-600 text-white' : 'border border-gray-100 bg-white'
      }`}
    >
      <p className={`text-xs ${accent ? 'text-white/80' : 'text-gray-500'}`}>
        {label}
      </p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  )
}

interface GroupedReportProps {
  sales: Sale[]
  keyOf: (s: Sale) => string
  labelOf: (key: string) => string
}

function GroupedReport({ sales, keyOf, labelOf }: GroupedReportProps) {
  const groups = SaleService.groupTotals(sales, keyOf)
  const entries = Array.from(groups.entries()).sort((a, b) =>
    labelOf(a[0]).localeCompare(labelOf(b[0])),
  )

  return (
    <div className="space-y-3">
      {entries.map(([key, t]) => (
        <div key={key} className="card">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold">{labelOf(key)}</p>
            <span className="badge bg-gray-100 text-gray-600">{t.count} sales</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
            <Mini label="Gross" value={formatMoney(t.gross)} />
            <Mini label="Commission" value={formatMoney(t.commission)} />
            <Mini label="Net" value={formatMoney(t.net)} />
          </div>
        </div>
      ))}
    </div>
  )
}

interface CommissionReportProps {
  sales: Sale[]
  farmerName: (id: string) => string
  commodityName: (id: string) => string
  traderName: (id: string) => string
}

function CommissionReport({
  sales,
  farmerName,
  commodityName,
  traderName,
}: CommissionReportProps) {
  const ordered = [...sales].sort((a, b) => b.saleDate.localeCompare(a.saleDate))
  return (
    <div className="space-y-3">
      {ordered.map((s) => (
        <div key={s.id} className="card">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{s.saleNumber}</p>
            <span className="text-sm text-gray-500">{s.saleDate}</span>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            {farmerName(s.farmerId)} · {commodityName(s.commodityId)} ·{' '}
            {traderName(s.traderId)}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Gross {formatMoney(s.grossAmount)} @ {s.commissionPercent}%
            </span>
            <span className="font-bold text-brand-700">
              {formatMoney(s.commissionAmount)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}
