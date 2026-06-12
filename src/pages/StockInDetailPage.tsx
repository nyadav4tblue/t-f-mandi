import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CommoditySelect } from '../components/CommoditySelect'
import { GradeSelect } from '../components/GradeSelect'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { Spinner } from '../components/Spinner'
import { useMasters } from '../hooks/useMasters'
import { StockInService } from '../services/StockInService'
import type { StockInFarmer, TruckGroup } from '../types'

const UNITS = ['KG', 'QUINTAL', 'BAG', 'CRATE', 'PIECE'] as const

export function StockInDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { farmers } = useMasters()
  const [group, setGroup] = useState<TruckGroup | null>(null)
  const [loading, setLoading] = useState(true)
  const [addFarmerOpen, setAddFarmerOpen] = useState(false)
  const [addItemFor, setAddItemFor] = useState<StockInFarmer | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const reload = async () => {
    if (!id) return
    const g = await StockInService.getById(id)
    setGroup(g)
  }

  useEffect(() => {
    let active = true
    if (!id) return
    StockInService.getById(id).then((g) => {
      if (!active) return
      setGroup(g)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [id])

  const handleRemoveFarmer = async (farmerEntryId: string) => {
    await StockInService.removeFarmer(farmerEntryId)
    await reload()
  }

  const handleRemoveItem = async (itemId: string) => {
    await StockInService.removeItem(itemId)
    await reload()
  }

  const handleDeleteTruck = async () => {
    if (!group) return
    setDeleting(true)
    try {
      await StockInService.deleteTruck(group.id)
      navigate('/stock-in')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Spinner />
  if (!group)
    return (
      <div>
        <PageHeader title="Stock-In" back />
        <p className="text-gray-500">Truck group not found.</p>
      </div>
    )

  return (
    <div>
      <PageHeader title={group.groupNumber} subtitle={group.groupName} back />

      <div className="card space-y-2">
        <Row label="Arrival" value={group.arrivalDate} />
        <Row label="Truck No." value={group.truckNumber || '—'} />
        <Row
          label="Driver"
          value={
            group.driverName
              ? `${group.driverName}${group.driverMobile ? ` · ${group.driverMobile}` : ''}`
              : '—'
          }
        />
        <Row label="Source" value={group.sourceLocation || '—'} />
        <Row
          label="Totals"
          value={`${group.totalFarmers} farmers · ${group.totalStockLines} lines`}
        />
      </div>

      <div className="mt-6 mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">Farmers</h2>
        <button
          type="button"
          className="btn-primary px-3 py-2 text-sm"
          onClick={() => setAddFarmerOpen(true)}
        >
          + Add Farmer
        </button>
      </div>

      {group.farmers.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-300 bg-white py-8 text-center text-gray-500">
          No farmers added yet.
        </p>
      ) : (
        <div className="space-y-4">
          {group.farmers.map((f) => (
            <div key={f.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{f.farmerName}</p>
                  <p className="text-sm text-gray-500">
                    {[f.village, f.mobile].filter(Boolean).join(' · ') || '—'}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-red-600"
                  onClick={() => handleRemoveFarmer(f.id)}
                >
                  Remove
                </button>
              </div>

              {f.items.length > 0 && (
                <div className="mt-3 space-y-2">
                  {f.items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2"
                    >
                      <div className="text-sm">
                        <p className="font-medium">
                          {it.commodityName ?? 'Commodity'}
                          {it.gradeName ? ` · ${it.gradeName}` : ''}
                          {it.variety ? ` · ${it.variety}` : ''}
                        </p>
                        <p className="text-gray-500">
                          {it.quantity} {it.unit}
                          {it.weight ? ` · ${it.weight} kg` : ''}
                          {it.packageCount ? ` · ${it.packageCount} pkg` : ''}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-medium text-red-600"
                        onClick={() => handleRemoveItem(it.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="btn-secondary mt-3 w-full py-2 text-sm"
                onClick={() => setAddItemFor(f)}
              >
                + Add Item
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        className="btn-danger mt-8 w-full"
        disabled={deleting}
        onClick={() => setConfirmDelete(true)}
      >
        Delete Truck Group
      </button>

      <AddFarmerModal
        open={addFarmerOpen}
        farmers={farmers}
        existingFarmerIds={group.farmers.map((f) => f.farmerId)}
        onClose={() => setAddFarmerOpen(false)}
        onAdd={async (input) => {
          const updated = await StockInService.addFarmer(group.id, input)
          setGroup(updated)
        }}
      />

      <AddItemModal
        farmer={addItemFor}
        onClose={() => setAddItemFor(null)}
        onAdd={async (farmerEntryId, input) => {
          const updated = await StockInService.addItem(farmerEntryId, input)
          setGroup(updated)
        }}
      />

      <Modal
        open={confirmDelete}
        title="Delete Truck Group"
        onClose={() => (deleting ? undefined : setConfirmDelete(false))}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Delete <span className="font-semibold">{group.groupNumber}</span> and
            all its farmers and items? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              className="btn-secondary flex-1"
              disabled={deleting}
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-danger flex-1"
              disabled={deleting}
              onClick={handleDeleteTruck}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

interface AddFarmerModalProps {
  open: boolean
  farmers: { id: string; name: string; village: string; mobile: string; status: string }[]
  existingFarmerIds: string[]
  onClose: () => void
  onAdd: (input: {
    farmerId: string
    farmerName: string
    village?: string
    mobile?: string
    remarks?: string
  }) => Promise<void>
}

function AddFarmerModal({
  open,
  farmers,
  existingFarmerIds,
  onClose,
  onAdd,
}: AddFarmerModalProps) {
  const [farmerId, setFarmerId] = useState('')
  const [remarks, setRemarks] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [seeded, setSeeded] = useState(false)

  if (open && !seeded) {
    setSeeded(true)
    setFarmerId('')
    setRemarks('')
    setError(null)
  }
  if (!open && seeded) setSeeded(false)

  const handleSave = async () => {
    const farmer = farmers.find((f) => f.id === farmerId)
    if (!farmer) return
    setSaving(true)
    setError(null)
    try {
      await onAdd({
        farmerId: farmer.id,
        farmerName: farmer.name,
        village: farmer.village || undefined,
        mobile: farmer.mobile || undefined,
        remarks: remarks || undefined,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add farmer.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} title="Add Farmer" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="label">Farmer</label>
          <select
            className="input"
            value={farmerId}
            onChange={(e) => setFarmerId(e.target.value)}
          >
            <option value="">Select farmer</option>
            {farmers
              .filter((f) => f.status === 'active' && !existingFarmerIds.includes(f.id))
              .map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} · {f.village}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="label">Remarks</label>
          <input
            className="input"
            value={remarks}
            placeholder="Optional"
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
          disabled={saving || !farmerId}
          onClick={handleSave}
        >
          {saving ? 'Adding…' : 'Add Farmer'}
        </button>
      </div>
    </Modal>
  )
}

interface AddItemModalProps {
  farmer: StockInFarmer | null
  onClose: () => void
  onAdd: (
    farmerEntryId: string,
    input: {
      commodityId: string
      gradeId?: string
      variety?: string
      quantity: number
      unit: string
      weight?: number
      expectedWeight?: number
      packageCount?: number
      remarks?: string
    },
  ) => Promise<void>
}

function AddItemModal({ farmer, onClose, onAdd }: AddItemModalProps) {
  const open = farmer !== null
  const [commodityId, setCommodityId] = useState('')
  const [gradeId, setGradeId] = useState('')
  const [variety, setVariety] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState<string>('BAG')
  const [weight, setWeight] = useState('')
  const [packageCount, setPackageCount] = useState('')
  const [remarks, setRemarks] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [seeded, setSeeded] = useState(false)

  if (open && !seeded) {
    setSeeded(true)
    setCommodityId('')
    setGradeId('')
    setVariety('')
    setQuantity('')
    setUnit('BAG')
    setWeight('')
    setPackageCount('')
    setRemarks('')
    setError(null)
  }
  if (!open && seeded) setSeeded(false)

  const canSave = commodityId !== '' && Number(quantity) > 0 && unit !== ''

  const handleSave = async () => {
    if (!farmer || !canSave) return
    setSaving(true)
    setError(null)
    try {
      await onAdd(farmer.id, {
        commodityId,
        gradeId: gradeId || undefined,
        variety: variety || undefined,
        quantity: Number(quantity),
        unit,
        weight: weight ? Number(weight) : undefined,
        packageCount: packageCount ? Number(packageCount) : undefined,
        remarks: remarks || undefined,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add item.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      title={farmer ? `Add Item · ${farmer.farmerName}` : 'Add Item'}
      onClose={onClose}
    >
      <div className="space-y-4">
        <CommoditySelect
          value={commodityId}
          onChange={(cid) => {
            setCommodityId(cid)
            setGradeId('')
          }}
        />
        <GradeSelect commodityId={commodityId} value={gradeId} onChange={setGradeId} />
        <div>
          <label className="label">Variety (optional)</label>
          <input
            className="input"
            value={variety}
            placeholder="e.g. Local"
            onChange={(e) => setVariety(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
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
        </div>
        <div>
          <label className="label">Package Count (optional)</label>
          <input
            className="input"
            type="number"
            inputMode="numeric"
            value={packageCount}
            placeholder="e.g. 50"
            onChange={(e) => setPackageCount(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Remarks</label>
          <input
            className="input"
            value={remarks}
            placeholder="Optional"
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
          disabled={saving || !canSave}
          onClick={handleSave}
        >
          {saving ? 'Adding…' : 'Add Item'}
        </button>
      </div>
    </Modal>
  )
}
