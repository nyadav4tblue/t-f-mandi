import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CommoditySelect } from '../components/CommoditySelect'
import { GradeSelect } from '../components/GradeSelect'
import { PageHeader } from '../components/PageHeader'
import { useMasters } from '../hooks/useMasters'
import { calculateSaleAmounts, formatMoney } from '../services/calc'
import { SaleService, type SaleFormInput } from '../services/SaleService'

const today = () => new Date().toISOString().slice(0, 10)

const UNITS = ['KG', 'QUINTAL', 'BAG', 'CRATE', 'PIECE'] as const

export function SaleEntryPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { farmers, traders, reloadTraders } = useMasters()

  const [saleDate, setSaleDate] = useState(today())
  const [farmerId, setFarmerId] = useState(params.get('farmerId') ?? '')
  const [commodityId, setCommodityId] = useState('')
  const [gradeId, setGradeId] = useState('')
  const [traderName, setTraderName] = useState('')
  const [traderMobile, setTraderMobile] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState<string>('KG')
  const [weight, setWeight] = useState('')
  const [rate, setRate] = useState('')
  const [commissionPercent, setCommissionPercent] = useState('6')
  const [remarks, setRemarks] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)

  const amounts = useMemo(
    () =>
      calculateSaleAmounts(
        Number(weight),
        Number(rate),
        Number(commissionPercent),
      ),
    [weight, rate, commissionPercent],
  )

  const canSave =
    farmerId !== '' &&
    commodityId !== '' &&
    traderName.trim() !== '' &&
    Number(quantity) > 0 &&
    Number(weight) > 0 &&
    Number(rate) > 0 &&
    Number(commissionPercent) >= 0

  const resetForm = () => {
    setFarmerId('')
    setCommodityId('')
    setGradeId('')
    setTraderName('')
    setTraderMobile('')
    setQuantity('')
    setUnit('KG')
    setWeight('')
    setRate('')
    setCommissionPercent('6')
    setRemarks('')
  }

  const handleSave = async () => {
    if (!canSave) return
    setSaving(true)
    try {
      const input: SaleFormInput = {
        saleDate,
        farmerId,
        commodityId,
        gradeId: gradeId || undefined,
        traderName,
        traderMobile: traderMobile || undefined,
        quantity: quantity ? Number(quantity) : undefined,
        unit: unit || undefined,
        weight: weight ? Number(weight) : undefined,
        rate: Number(rate),
        commissionPercent: Number(commissionPercent),
        remarks: remarks || undefined,
      }
      const sale = await SaleService.create(input)
      await reloadTraders()
      setSaved(sale.saleNumber)
      resetForm()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="New Sale" subtitle="Sale Number auto-generated on save" />

      {saved && (
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-brand-200 bg-brand-50 p-4">
          <span className="font-medium text-brand-800">
            Saved {saved} ✓
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-secondary px-3 py-2 text-sm"
              onClick={() => navigate('/reports')}
            >
              View Reports
            </button>
            <button
              type="button"
              className="text-sm font-medium text-brand-700"
              onClick={() => setSaved(null)}
            >
              New
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Sale Date</label>
            <input
              className="input"
              type="date"
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Farmer</label>
            <select
              className="input"
              value={farmerId}
              onChange={(e) => setFarmerId(e.target.value)}
            >
              <option value="">Select farmer</option>
              {farmers
                .filter((f) => f.status === 'active')
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} · {f.village}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <CommoditySelect
          value={commodityId}
          onChange={(id) => {
            setCommodityId(id)
            setGradeId('')
          }}
        />
        <GradeSelect commodityId={commodityId} value={gradeId} onChange={setGradeId} />

        <div>
          <label className="label">Trader Name</label>
          <input
            className="input"
            list="trader-options"
            value={traderName}
            placeholder="Type or select — created automatically"
            onChange={(e) => setTraderName(e.target.value)}
          />
          <datalist id="trader-options">
            {traders.map((t) => (
              <option key={t.id} value={t.name} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="label">Trader Mobile (optional)</label>
          <input
            className="input"
            type="tel"
            inputMode="numeric"
            value={traderMobile}
            placeholder="Only needed for a new trader"
            onChange={(e) => setTraderMobile(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Quantity</label>
            <input
              className="input"
              type="number"
              inputMode="decimal"
              value={quantity}
              placeholder="e.g. 50"
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Unit</label>
            <select
              className="input"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label">Weight</label>
            <input
              className="input"
              type="number"
              inputMode="decimal"
              value={weight}
              placeholder="kg"
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Rate</label>
            <input
              className="input"
              type="number"
              inputMode="decimal"
              value={rate}
              placeholder="per kg"
              onChange={(e) => setRate(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Comm. %</label>
            <input
              className="input"
              type="number"
              inputMode="decimal"
              value={commissionPercent}
              onChange={(e) => setCommissionPercent(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label">Remarks</label>
          <textarea
            className="input min-h-[72px] resize-none"
            value={remarks}
            placeholder="Optional notes"
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        {/* Live calculation */}
        <div className="rounded-2xl bg-gray-900 p-4 text-white">
          <CalcRow label="Gross Amount" value={formatMoney(amounts.grossAmount)} />
          <CalcRow
            label={`Commission (${Number(commissionPercent) || 0}%)`}
            value={`- ${formatMoney(amounts.commissionAmount)}`}
          />
          <div className="my-2 h-px bg-white/20" />
          <CalcRow
            label="Net to Farmer"
            value={formatMoney(amounts.netAmount)}
            emphasize
          />
        </div>

        <button
          type="button"
          className="btn-primary w-full"
          disabled={saving || !canSave}
          onClick={handleSave}
        >
          {saving ? 'Saving…' : 'Save Sale'}
        </button>
      </div>
    </div>
  )
}

function CalcRow({
  label,
  value,
  emphasize,
}: {
  label: string
  value: string
  emphasize?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className={emphasize ? 'font-semibold' : 'text-white/70'}>{label}</span>
      <span className={emphasize ? 'text-xl font-bold' : 'font-medium'}>{value}</span>
    </div>
  )
}
