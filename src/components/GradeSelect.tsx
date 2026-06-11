import { useState } from 'react'
import { useMasters } from '../hooks/useMasters'
import { Modal } from './Modal'

const ADD_NEW = '__add_new__'

interface GradeSelectProps {
  commodityId: string
  value: string
  onChange: (gradeId: string) => void
  label?: string
}

/**
 * Grade dropdown scoped to the selected commodity, with inline grade creation
 * available from any screen.
 */
export function GradeSelect({
  commodityId,
  value,
  onChange,
  label = 'Grade',
}: GradeSelectProps) {
  const { gradesForCommodity, addGrade } = useMasters()
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  const grades = gradesForCommodity(commodityId)
  const disabled = !commodityId

  const handleSelect = (val: string) => {
    if (val === ADD_NEW) {
      setModalOpen(true)
      return
    }
    onChange(val)
  }

  const handleCreate = async () => {
    if (!name.trim() || !commodityId) return
    setSaving(true)
    try {
      const created = await addGrade(commodityId, name)
      onChange(created.id)
      setName('')
      setModalOpen(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <label className="label">{label}</label>
      <select
        className="input disabled:bg-gray-100"
        value={value}
        disabled={disabled}
        onChange={(e) => handleSelect(e.target.value)}
      >
        <option value="">
          {disabled ? 'Select commodity first' : 'Select grade (optional)'}
        </option>
        {grades.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
        {!disabled && <option value={ADD_NEW}>+ Add New Grade</option>}
      </select>

      <Modal
        open={modalOpen}
        title="Add New Grade"
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="label">Grade Name</label>
            <input
              autoFocus
              className="input"
              value={name}
              placeholder="e.g. A Grade"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <button
            type="button"
            className="btn-primary w-full"
            disabled={saving || !name.trim()}
            onClick={handleCreate}
          >
            {saving ? 'Saving…' : 'Save Grade'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
