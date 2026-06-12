import { NavLink, Outlet } from 'react-router-dom'

interface NavItem {
  to: string
  label: string
  icon: string
}

const NAV: NavItem[] = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/sales/new', label: 'Sale', icon: '➕' },
  { to: '/stock-in', label: 'Stock', icon: '📥' },
  { to: '/farmers', label: 'Farmers', icon: '👨‍🌾' },
  { to: '/commodities', label: 'Items', icon: '🥔' },
  { to: '/reports', label: 'Reports', icon: '📄' },
]

export function Layout() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-2xl">🧺</span>
            <span className="text-lg font-bold text-brand-700">Mandi Saathi</span>
          </NavLink>
          {/* Desktop / wide top navigation */}
          <nav className="hidden gap-1 sm:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-brand-100 text-brand-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 px-4 pb-28 pt-5 sm:pb-10">
        <Outlet />
      </main>

      {/* Bottom mobile navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-100 bg-white sm:hidden">
        <div className="mx-auto flex max-w-3xl">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
                  isActive ? 'text-brand-700' : 'text-gray-500'
                }`
              }
            >
              <span className="text-xl leading-none">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
