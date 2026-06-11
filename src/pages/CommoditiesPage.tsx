import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { SearchBar } from '../components/SearchBar'
import { EmptyState, Spinner } from '../components/Spinner'
import { StatusBadge } from '../components/StatusBadge'
import { useMasters } from '../hooks/useMasters'
import { CommodityService } from '../services/CommodityService'
import type { Commodity, Status } from '../types'

export function CommoditiesPage() {
  const { commodities, loading, reloadCommodities } = useMasters()
  const [term, setTerm] = useState('')
  const [editing, setEditing] = useState<Commodity | null>(null)
  const [creating, setCreating] = useState(false)

  const list = CommodityService.search(commodities, term)

  return (
    <div>
      <PageHeader
        title="Commodities"
        subtitle={`${commodities.length} items`}
        action={
          <button
            type="button"
            className="btn-primary"
            onClick={() => setCreating(true)}
          >
            + Add
          </button>
        }
      />

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex-1">
          <SearchBar value={term} onChange={setTerm} placeholder="Search commodities…" />
        </div>
      </div>

      <Link
        to="/grades"
        className="mb-4 flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
      >
        <span>Manage Grades</span>
        <span className="text-gray-400">›</span>
      </Link>

      {loading ? (
        <Spinner />
      ) : list.length === 0 ? (
        <EmptyState message="No commodities found." />
      ) : (
        <div className="space-y-3">
          {list.map((c) => (
            <div key={c.id} className="card flex items-center justify-between">
              <div>
                <p className="text-base font-semibold">{c.name}</p>
                <StatusBadge status={c.status} />
              </div>
              <button
                type="button"
                className="btn-secondary px-3 py-2 text-sm"
                onClick={() => setEditing(c)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      <CommodityFormModal
        open={creating}
        onClose={() => setCreating(false)}
        onSaved={reloadCommodities}
      />
      <CommodityFormModal
        open={!!editing}
        commodity={editing}
        onClose={() => setEditing(null)}
        onSaved={reloadCommodities}
      />
    </div>
  )
}

interface FormModalProps {
  open: boolean
  commodity?: Commodity | null
  onClose: () => void
  onSaved: () => Promise<void>
}

function CommodityFormModal({ open, commodity, onClose, onSaved }: FormModalProps) {
  const [name, setName] = useState('')
  const [status, setStatus] = useState<Status>('active')
  const [saving, setSaving] = useState(false)
  const [seeded, setSeeded] = useState<string | null>(null)

  // Sync local state when the modal opens for a specific record.
  const key = open ? (commodity?.id ?? 'new') : null
  if (key !== seeded) {
    setSeeded(key)
    setName(commodity?.name ?? '')
    setStatus(commodity?.status ?? 'active')
  }

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      if (commodity) {
        await CommodityService.update(commodity.id, { name: name.trim(), status })
      } else {
        const created = await CommodityService.create(name)
        if (status === 'inactive') {
          await CommodityService.update(created.id, { status })
        }
      }
      await onSaved()
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      title={commodity ? 'Edit Commodity' : 'Add Commodity'}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div>
          <label className="label">Commodity Name</label>
          <input
            autoFocus
            className="input"
            value={name}
            placeholder="e.g. Cabbage"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Status</label>
          <select
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button
          type="button"
          className="btn-primary w-full"
          disabled={saving || !name.trim()}
          onClick={handleSave}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </Modal>
  )
}
