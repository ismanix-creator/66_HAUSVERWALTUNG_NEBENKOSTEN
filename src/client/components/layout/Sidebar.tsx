import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Wallet,
  Calculator,
  FolderOpen,
  Settings,
} from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
  { id: 'objekte', label: 'Objekte', icon: Building2, route: '/objekte' },
  { id: 'mieter', label: 'Mieter', icon: Users, route: '/mieter' },
  { id: 'vertraege', label: 'Verträge', icon: FileText, route: '/vertraege' },
  { id: 'finanzen', label: 'Finanzen', icon: Wallet, route: '/finanzen' },
  { id: 'nebenkosten', label: 'Nebenkosten', icon: Calculator, route: '/nebenkosten' },
  { id: 'dokumente', label: 'Dokumente', icon: FolderOpen, route: '/dokumente' },
]

const bottomItems = [
  { id: 'einstellungen', label: 'Einstellungen', icon: Settings, route: '/einstellungen' },
]

export function Sidebar() {
  return (
    <aside className="flex w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <Building2 className="h-8 w-8 text-primary-600" />
        <span className="ml-3 text-xl font-semibold text-gray-900">Mietverwaltung</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.id}
            to={item.route}
            className={({ isActive }) =>
              clsx(
                'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200">
        {bottomItems.map(item => (
          <NavLink
            key={item.id}
            to={item.route}
            className={({ isActive }) =>
              clsx(
                'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </aside>
  )
}
