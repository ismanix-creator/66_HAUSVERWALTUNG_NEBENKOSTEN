/**
 * Sidebar: Config-Driven Navigation
 * Lädt Navigation aus TOML-Config
 *
 * @lastModified 2025-12-16
 */

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
  DoorOpen,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react'
import { clsx } from 'clsx'
import { useState } from 'react'
import { useNavigationConfig } from '../../hooks/useConfig'
import type { NavigationItem } from '@shared/types/config'

// Icon-Mapping: String aus Config → Lucide Icon
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Wallet,
  Calculator,
  FolderOpen,
  Settings,
  DoorOpen,
}

// Fallback-Navigation falls Config nicht geladen
const fallbackNav: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', route: '/dashboard', order: 1 },
  { id: 'objekte', label: 'Objekte/Einheiten', icon: 'Building2', route: '/objekte', order: 2 },
]

export function Sidebar() {
  const { data: navConfig, isLoading } = useNavigationConfig()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Navigation Items sortieren und gruppieren
  const items = navConfig?.navigation?.items || fallbackNav
  const topItems = items
    .filter(item => item.position !== 'bottom')
    .sort((a, b) => a.order - b.order)
  const bottomItems = items
    .filter(item => item.position === 'bottom')
    .sort((a, b) => a.order - b.order)

  // Toggle für Items mit Kindern
  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Label aus i18n-Key extrahieren (vereinfacht)
  const getLabel = (label: string): string => {
    // Format: "labels.nav.dashboard" → "Dashboard"
    if (label.startsWith('labels.')) {
      const parts = label.split('.')
      const key = parts[parts.length - 1]
      // Erste Buchstabe groß
      return key.charAt(0).toUpperCase() + key.slice(1)
    }
    return label
  }

  // Render einzelnes Nav-Item
  const renderNavItem = (item: NavigationItem, isNested = false) => {
    const Icon = iconMap[item.icon] || Building2
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const label = getLabel(item.label)

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleExpand(item.id)}
            className={clsx(
              'flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              'text-slate-200 hover:bg-slate-800/80',
              isNested && 'pl-8'
            )}
          >
            <Icon className="h-5 w-5 mr-3" />
            <span className="flex-1 text-left">{label}</span>
            <ChevronDown
              className={clsx('h-4 w-4 transition-transform', isExpanded && 'rotate-180')}
            />
          </button>
          {isExpanded && (
            <div className="mt-1 space-y-1">
              {item.children!.map(child => renderNavItem(child, true))}
            </div>
          )}
        </div>
      )
    }

    return (
      <NavLink
        key={item.id}
        to={item.route}
        className={({ isActive }) =>
          clsx(
            'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            isActive
              ? 'bg-emerald-900/60 text-emerald-100 border border-emerald-800/70'
              : 'text-slate-200 hover:bg-slate-800/80',
            isNested && 'pl-8'
          )
        }
      >
        {!isNested && <Icon className="h-5 w-5 mr-3" />}
        {isNested && <span className="w-5 mr-3" />}
        {label}
      </NavLink>
    )
  }

  return (
    <aside className="flex w-64 flex-col bg-slate-900 border-r border-slate-800">
      {/* Header */}
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <Building2 className="h-8 w-8 text-emerald-400" />
        <span className="ml-3 text-xl font-semibold text-slate-100">Mietverwaltung</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {isLoading ? (
          <div className="px-3 py-2 text-sm text-slate-500">Laden...</div>
        ) : (
          topItems.map(item => renderNavItem(item))
        )}
      </nav>

      {/* Bottom Items */}
      {bottomItems.length > 0 && (
        <div className="px-3 py-4 border-t border-slate-800">
          {bottomItems.map(item => renderNavItem(item))}
        </div>
      )}
    </aside>
  )
}
