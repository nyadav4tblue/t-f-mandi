import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { Spinner } from '../components/Spinner'
import { StatusBadge } from '../components/StatusBadge'
import { useMasters } from '../hooks/useMasters'
import { FarmerService } from '../services/FarmerService'
import type { Farmer } from '../types'

export function FarmerViewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { commodityName, reloadFarmers } = useMasters()
  const [farmer, setFarmer] = useState<Farmer | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    FarmerService.getById(id).then((f) => {
      setFarmer(f)
      setLoading(false)
    })
  }, [id])

  const handleDelete = async () => {
    if (!farmer) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await FarmerService.delete(farmer.id)
      await reloadFarmers()
      navigate('/farmers')
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : 'Could not delete this farmer. They may have existing sales.',
      )
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Spinner />
  if (!farmer)
    return (
      <div>
        <PageHeader title="Farmer" back />
        <p className="text-gray-500">Farmer not found.</p>
      </div>
    )

  return (
    <div>
      <PageHeader
        title={farmer.name}
        back
        action={
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(`/farmers/${farmer.id}/edit`)}
          >
            Edit
          </button>
        }
      />

      <div className="card space-y-3">
        <Row label="Status" value={<StatusBadge status={farmer.status} />} />
        <Row label="Father Name" value={farmer.fatherName || '—'} />
        <Row label="Mobile" value={farmer.mobile || '—'} />
        <Row label="Address" value={farmer.village || '—'} />
        <div>
          <p className="text-sm text-gray-500">Commodities Dealt In</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {farmer.commodityIds.length === 0 ? (
              <span className="text-gray-400">—</span>
            ) : (
              farmer.commodityIds.map((cid) => (
                <span key={cid} className="badge bg-brand-100 text-brand-700">
                  {commodityName(cid)}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="btn-primary mt-5 w-full"
        onClick={() => navigate(`/sales/new?farmerId=${farmer.id}`)}
      >
        + New Sale for {farmer.name}
      </button>

      <button
        type="button"
        className="btn-danger mt-3 w-full"
        onClick={() => {
          setDeleteError(null)
          setConfirmOpen(true)
        }}
      >
        Delete Farmer
      </button>

      <Modal
        open={confirmOpen}
        title="Delete Farmer"
        onClose={() => (deleting ? undefined : setConfirmOpen(false))}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Delete <span className="font-semibold">{farmer.name}</span>? This
            cannot be undone.
          </p>
          {deleteError && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              {deleteError}
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              className="btn-secondary flex-1"
              disabled={deleting}
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-danger flex-1"
              disabled={deleting}
              onClick={handleDelete}
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
