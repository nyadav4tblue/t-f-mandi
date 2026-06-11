import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  back?: boolean
  action?: ReactNode
}

export function PageHeader({ title, subtitle, back, action }: PageHeaderProps) {
  const navigate = useNavigate()
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="flex items-start gap-2">
        {back && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="-ml-1 mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-xl text-gray-500 hover:bg-gray-100"
          >
            ‹
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}
