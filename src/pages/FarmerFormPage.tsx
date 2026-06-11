import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { Spinner } from '../components/Spinner'
import { useMasters } from '../hooks/useMasters'
import { FarmerService } from '../services/FarmerService'
import type { NewFarmer, Status } from '../types'

const EMPTY: NewFarmer = {
  name: '',
  fatherName: '',
  mobile: '',
  village: '',
  status: 'active',
  commodityIds: [],
}

export function FarmerFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { commodities, reloadFarmers, addCommodity } = useMasters()

  const [form, setForm] = useState<NewFarmer>(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [newCommodity, setNewCommodity] = useState('')
  const [addingCommodity, setAddingCommodity] = useState(false)

  useEffect(() => {
    if (!id) return
    FarmerService.getById(id).then((f) => {
      if (f) {
        const { id: _id, createdAt: _createdAt, ...rest } = f
        void _id
        void _createdAt
        setForm(rest)
      }
      setLoading(false)
    })
  }, [id])

  const set = <K extends keyof NewFarmer>(key: K, value: NewFarmer[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const toggleCommodity = (commodityId: string) =>
    setForm((prev) => ({
      ...prev,
      commodityIds: prev.commodityIds.includes(commodityId)
        ? prev.commodityIds.filter((c) => c !== commodityId)
        : [...prev.commodityIds, commodityId],
    }))

  const handleAddCommodity = async () => {
    if (!newCommodity.trim()) return
    setAddingCommodity(true)
    try {
      const created = await addCommodity(newCommodity)
      setForm((prev) => ({
        ...prev,
        commodityIds: [...prev.commodityIds, created.id],
      }))
      setNewCommodity('')
      setAddOpen(false)
    } finally {
      setAddingCommodity(false)
    }
  }

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (id) {
        await FarmerService.update(id, form)
      } else {
        await FarmerService.create(form)
      }
      await reloadFarmers()
      navigate('/farmers')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <PageHeader title={isEdit ? 'Edit Farmer' : 'New Farmer'} back />

      <div className="space-y-4">
        <div>
          <label className="label">Name</label>
          <input
            className="input"
            value={form.name}
            placeholder="Farmer name"
            onChange={(e) => set('name', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Father Name</label>
          <input
            className="input"
            value={form.fatherName}
            placeholder="Father's name"
            onChange={(e) => set('fatherName', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Mobile</label>
          <input
            className="input"
            type="tel"
            inputMode="numeric"
            value={form.mobile}
            placeholder="10-digit mobile"
            onChange={(e) => set('mobile', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Address</label>
          <input
            className="input"
            value={form.village}
            placeholder="Address"
            onChange={(e) => set('village', e.target.value)}
          />
        </div>

        <div>
          <label className="label">Commodities Dealt In</label>
          <div className="flex flex-wrap gap-2">
            {commodities
              .filter((c) => c.status === 'active')
              .map((c) => {
                const selected = form.commodityIds.includes(c.id)
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCommodity(c.id)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      selected
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-gray-300 bg-white text-gray-700'
                    }`}
                  >
                    {selected ? '✓ ' : ''}
                    {c.name}
                  </button>
                )
              })}
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="rounded-full border border-dashed border-brand-500 px-4 py-2 text-sm font-medium text-brand-700"
            >
              + Add New
            </button>
          </div>
        </div>

        <div>
          <label className="label">Status</label>
          <select
            className="input"
            value={form.status}
            onChange={(e) => set('status', e.target.value as Status)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button
          type="button"
          className="btn-primary w-full"
          disabled={saving || !form.name.trim()}
          onClick={handleSave}
        >
          {saving ? 'Saving…' : 'Save Farmer'}
        </button>
      </div>

      <Modal
        open={addOpen}
        title="Add New Commodity"
        onClose={() => setAddOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="label">Commodity Name</label>
            <input
              autoFocus
              className="input"
              value={newCommodity}
              placeholder="e.g. Cabbage"
              onChange={(e) => setNewCommodity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCommodity()}
            />
          </div>
          <button
            type="button"
            className="btn-primary w-full"
            disabled={addingCommodity || !newCommodity.trim()}
            onClick={handleAddCommodity}
          >
            {addingCommodity ? 'Saving…' : 'Save & Select'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
