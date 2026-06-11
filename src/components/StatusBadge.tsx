import type { Status } from '../types'

export function StatusBadge({ status }: { status: Status }) {
  const active = status === 'active'
  return (
    <span
      className={
        active
          ? 'badge bg-brand-100 text-brand-700'
          : 'badge bg-gray-100 text-gray-500'
      }
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}
