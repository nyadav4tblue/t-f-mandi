import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { SearchBar } from '../components/SearchBar'
import { EmptyState, Spinner } from '../components/Spinner'
import { StockInService } from '../services/StockInService'
import type { TruckGroup } from '../types'

const today = () => new Date().toISOString().slice(0, 10)

export function StockInPage() {
  const navigate = useNavigate()
  const [groups, setGroups] = useState<TruckGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [term, setTerm] = useState('')
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    let active = true
    StockInService.getAll().then((rows) => {
      if (!active) return
      setGroups(rows)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const list = StockInService.search(groups, term).sort((a, b) =>
    b.arrivalDate.localeCompare(a.arrivalDate),
  )

  return (
    <div>
      <PageHeader
        title="Stock-In"
        subtitle={`${groups.length} trucks`}
        action={
          <button
            type="button"
            className="btn-primary"
            onClick={() => setFormOpen(true)}
          >
            + New Truck
          </button>
        }
      />

      <div className="mb-4">
        <SearchBar
          value={term}
          onChange={setTerm}
          placeholder="Search truck no, group, driver…"
        />
      </div>

      {loading ? (
        <Spinner />
      ) : list.length === 0 ? (
        <EmptyState message="No truck arrivals yet. Tap “New Truck” to start." />
      ) : (
        <div className="space-y-3">
          {list.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => navigate(`/stock-in/${g.id}`)}
              className="card flex w-full items-center justify-between text-left hover:bg-gray-50"
            >
              <div>
                <p className="font-semibold">
                  {g.groupNumber}
                  {g.truckNumber ? ` · ${g.truckNumber}` : ''}
                </p>
                <p className="text-sm text-gray-500">
                  {g.groupName} · {g.arrivalDate}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {g.totalFarmers} farmers · {g.totalStockLines} lines
                </p>
              </div>
              <span className="text-gray-300">›</span>
            </button>
          ))}
        </div>
      )}

      <NewTruckModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onCreated={(g) => navigate(`/stock-in/${g.id}`)}
      />
    </div>
  )
}

interface NewTruckModalProps {
  open: boolean
  onClose: () => void
  onCreated: (group: TruckGroup) => void
}

function NewTruckModal({ open, onClose, onCreated }: NewTruckModalProps) {
  const [arrivalDate, setArrivalDate] = useState(today())
  const [truckNumber, setTruckNumber] = useState('')
  const [driverName, setDriverName] = useState('')
  const [driverMobile, setDriverMobile] = useState('')
  const [sourceLocation, setSourceLocation] = useState('')
  const [remarks, setRemarks] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [seeded, setSeeded] = useState(false)

  if (open && !seeded) {
    setSeeded(true)
    setArrivalDate(today())
    setTruckNumber('')
    setDriverName('')
    setDriverMobile('')
    setSourceLocation('')
    setRemarks('')
    setError(null)
  }
  if (!open && seeded) setSeeded(false)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const group = await StockInService.createTruck({
        arrivalDate,
        truckNumber: truckNumber || undefined,
        driverName: driverName || undefined,
        driverMobile: driverMobile || undefined,
        sourceLocation: sourceLocation || undefined,
        remarks: remarks || undefined,
      })
      onClose()
      onCreated(group)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create truck.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} title="New Truck Arrival" onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Arrival Date</label>
            <input
              className="input"
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Truck Number</label>
            <input
              className="input"
              value={truckNumber}
              placeholder="HR55-AB-1234"
              onChange={(e) => setTruckNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Driver Name</label>
            <input
              className="input"
              value={driverName}
              placeholder="Driver"
              onChange={(e) => setDriverName(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Driver Mobile</label>
            <input
              className="input"
              type="tel"
              inputMode="numeric"
              value={driverMobile}
              placeholder="Mobile"
              onChange={(e) => setDriverMobile(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="label">Source Location</label>
          <input
            className="input"
            value={sourceLocation}
            placeholder="e.g. Sonipat"
            onChange={(e) => setSourceLocation(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Remarks</label>
          <textarea
            className="input min-h-[64px] resize-none"
            value={remarks}
            placeholder="Optional notes"
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="button"
          className="btn-primary w-full"
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? 'Creating…' : 'Create & Add Farmers'}
        </button>
      </div>
    </Modal>
  )
}
