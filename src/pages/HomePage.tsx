import { useNavigate } from 'react-router-dom'

interface Action {
  to: string
  title: string
  icon: string
  primary?: boolean
}

const ACTIONS: Action[] = [
  { to: '/sales/new', title: 'New Sale', icon: '➕', primary: true },
  { to: '/farmers/new', title: 'New Farmer', icon: '👨‍🌾', primary: true },
  { to: '/stock-in', title: 'Stock-In', icon: '📥', primary: true },
  { to: '/farmers', title: 'Farmers', icon: '📇' },
  { to: '/commodities', title: 'Commodities', icon: '🥔' },
  { to: '/grades', title: 'Grades', icon: '🏷️' },
  { to: '/reports', title: 'Reports', icon: '📄' },
]

export function HomePage() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Mandi Saathi</h1>
        <p className="text-gray-500">Quick entry for your commission work</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {ACTIONS.map((a) => (
          <button
            key={a.to}
            type="button"
            onClick={() => navigate(a.to)}
            className={`flex aspect-square flex-col items-center justify-center gap-3 rounded-3xl p-4 text-center shadow-sm transition active:scale-[0.98] ${
              a.primary
                ? 'bg-brand-600 text-white hover:bg-brand-700'
                : 'border border-gray-100 bg-white text-gray-800 hover:bg-gray-50'
            } ${a.to === '/reports' ? 'col-span-2 aspect-auto py-6' : ''}`}
          >
            <span className="text-4xl leading-none">{a.icon}</span>
            <span className="text-lg font-semibold">{a.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
