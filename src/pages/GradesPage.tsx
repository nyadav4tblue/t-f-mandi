import { useState } from 'react'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { SearchBar } from '../components/SearchBar'
import { EmptyState, Spinner } from '../components/Spinner'
import { StatusBadge } from '../components/StatusBadge'
import { useMasters } from '../hooks/useMasters'
import { GradeService } from '../services/GradeService'
import type { Grade, Status } from '../types'

export function GradesPage() {
  const { grades, commodities, loading, reloadGrades } = useMasters()
  const [term, setTerm] = useState('')
  const [editing, setEditing] = useState<Grade | null>(null)
  const [creating, setCreating] = useState(false)

  const filtered = GradeService.search(grades, term)
  const byCommodity = commodities
    .map((c) => ({
      commodity: c,
      grades: filtered.filter((g) => g.commodityId === c.id),
    }))
    .filter((group) => group.grades.length > 0)

  return (
    <div>
      <PageHeader
        title="Grades"
        back
        subtitle={`${grades.length} grades`}
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

      <div className="mb-4">
        <SearchBar value={term} onChange={setTerm} placeholder="Search grades…" />
      </div>

      {loading ? (
        <Spinner />
      ) : byCommodity.length === 0 ? (
        <EmptyState message="No grades found." />
      ) : (
        <div className="space-y-5">
          {byCommodity.map(({ commodity, grades: gs }) => (
            <div key={commodity.id}>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
                {commodity.name}
              </h3>
              <div className="space-y-3">
                {gs.map((g) => (
                  <div key={g.id} className="card flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold">{g.name}</p>
                      <StatusBadge status={g.status} />
                    </div>
                    <button
                      type="button"
                      className="btn-secondary px-3 py-2 text-sm"
                      onClick={() => setEditing(g)}
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <GradeFormModal
        open={creating}
        onClose={() => setCreating(false)}
        onSaved={reloadGrades}
      />
      <GradeFormModal
        open={!!editing}
        grade={editing}
        onClose={() => setEditing(null)}
        onSaved={reloadGrades}
      />

      {!loading && commodities.length === 0 && (
        <p className="mt-4 text-center text-sm text-gray-500">
          Add a commodity first, then create its grades.
        </p>
      )}
    </div>
  )
}

interface FormModalProps {
  open: boolean
  grade?: Grade | null
  onClose: () => void
  onSaved: () => Promise<void>
}

function GradeFormModal({ open, grade, onClose, onSaved }: FormModalProps) {
  const { commodities } = useMasters()
  const [commodityId, setCommodityId] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<Status>('active')
  const [saving, setSaving] = useState(false)
  const [seeded, setSeeded] = useState<string | null>(null)

  const key = open ? (grade?.id ?? 'new') : null
  if (key !== seeded) {
    setSeeded(key)
    setCommodityId(grade?.commodityId ?? '')
    setName(grade?.name ?? '')
    setStatus(grade?.status ?? 'active')
  }

  const handleSave = async () => {
    if (!name.trim() || !commodityId) return
    setSaving(true)
    try {
      if (grade) {
        await GradeService.update(grade.id, { commodityId, name: name.trim(), status })
      } else {
        const created = await GradeService.create(commodityId, name)
        if (status === 'inactive') {
          await GradeService.update(created.id, { status })
        }
      }
      await onSaved()
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} title={grade ? 'Edit Grade' : 'Add Grade'} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="label">Commodity</label>
          <select
            className="input"
            value={commodityId}
            onChange={(e) => setCommodityId(e.target.value)}
          >
            <option value="">Select commodity</option>
            {commodities
              .filter((c) => c.status === 'active')
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="label">Grade Name</label>
          <input
            className="input"
            value={name}
            placeholder="e.g. A Grade"
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
          disabled={saving || !name.trim() || !commodityId}
          onClick={handleSave}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </Modal>
  )
}
