import { useState } from 'react'
import { useMasters } from '../hooks/useMasters'
import { Modal } from './Modal'

const ADD_NEW = '__add_new__'

interface CommoditySelectProps {
  value: string
  onChange: (commodityId: string) => void
  label?: string
}

/**
 * Commodity dropdown that lets the user create a new commodity inline,
 * without leaving the current screen.
 */
export function CommoditySelect({
  value,
  onChange,
  label = 'Commodity',
}: CommoditySelectProps) {
  const { commodities, addCommodity } = useMasters()
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  const active = commodities.filter((c) => c.status === 'active')

  const handleSelect = (val: string) => {
    if (val === ADD_NEW) {
      setModalOpen(true)
      return
    }
    onChange(val)
  }

  const handleCreate = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      const created = await addCommodity(name)
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
        className="input"
        value={value}
        onChange={(e) => handleSelect(e.target.value)}
      >
        <option value="">Select commodity</option>
        {active.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
        <option value={ADD_NEW}>+ Add New Commodity</option>
      </select>

      <Modal
        open={modalOpen}
        title="Add New Commodity"
        onClose={() => setModalOpen(false)}
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
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <button
            type="button"
            className="btn-primary w-full"
            disabled={saving || !name.trim()}
            onClick={handleCreate}
          >
            {saving ? 'Saving…' : 'Save Commodity'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
