import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { SearchBar } from '../components/SearchBar'
import { EmptyState, Spinner } from '../components/Spinner'
import { StatusBadge } from '../components/StatusBadge'
import { useMasters } from '../hooks/useMasters'
import { FarmerService } from '../services/FarmerService'

export function FarmersPage() {
  const { farmers, loading } = useMasters()
  const [term, setTerm] = useState('')
  const navigate = useNavigate()

  const list = FarmerService.search(farmers, term)

  return (
    <div>
      <PageHeader
        title="Farmers"
        subtitle={`${farmers.length} farmers`}
        action={
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/farmers/new')}
          >
            + Add
          </button>
        }
      />

      <div className="mb-4">
        <SearchBar value={term} onChange={setTerm} placeholder="Search name, mobile, address…" />
      </div>

      {loading ? (
        <Spinner />
      ) : list.length === 0 ? (
        <EmptyState message="No farmers found." />
      ) : (
        <div className="space-y-3">
          {list.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => navigate(`/farmers/${f.id}`)}
              className="card flex w-full items-center justify-between text-left hover:bg-gray-50"
            >
              <div>
                <p className="text-base font-semibold">{f.name}</p>
                <p className="text-sm text-gray-500">
                  {f.village} · {f.mobile}
                </p>
              </div>
              <StatusBadge status={f.status} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
