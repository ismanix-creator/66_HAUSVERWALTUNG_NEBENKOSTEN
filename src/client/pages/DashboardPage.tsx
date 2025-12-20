import { Building2, Users, FileText, Wallet, FileArchive, FileCheck, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useDashboardSummary, useViewConfig } from '../hooks/useConfig'

type DashboardAction = {
  id: string
  label: string
  route?: string
  api_endpoint?: string
  style?: string
}

type DashboardCard = {
  id: string
  title?: string
  subtitle?: string
  description?: string
  type?: string
  actions?: DashboardAction[]
  grid_span?: { col?: number }
}

type DashboardView = {
  title?: string
  styling?: {
    card_padding?: string
    card_bg?: string
    card_border?: string
    card_shadow?: string
  }
  stats_cards?: Array<{
    id: string
    title?: string
    field: string
    icon?: string
    color?: string
  }>
  cards?: DashboardCard[]
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: viewConfig, isLoading: viewLoading } = useViewConfig('dashboard')
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary()

  if (viewLoading || summaryLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-slate-500">Lade Dashboard...</div>
      </div>
    )
  }

  if (!viewConfig || !summary) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-slate-500">Keine Dashboard-Daten verfügbar.</div>
      </div>
    )
  }

  // Support: some endpoints return the view direkt, andere als { view: { ... } }
  // viewConfig ist laut config.toml immer DashboardView oder { view: DashboardView }
  const view: DashboardView = (viewConfig as { view?: DashboardView }).view ?? (viewConfig as DashboardView)

  return (
    <div className={`space-y-6 text-slate-100 ${view.styling?.card_padding || 'p-6'}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-400">{view.title?.replace('labels.', '') || 'Dashboard'}</h1>
          <p className="text-gray-600">Übersicht Ihrer Mietverwaltung</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 rounded-lg hover:text-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Aktualisieren
        </button>
      </div>

      {/* Stats Cards: immer 3 Spalten auf kleinen/größeren Ansichten, damit 6 Karten in 2 Reihen passen */}
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6`}>
        {view.stats_cards?.map((stat) => (
          <StatsCard
            key={stat.id}
            title={stat.title?.replace('dashboard.', '') || stat.id}
            value={summary[stat.field as keyof typeof summary]?.toString() || '0'}
            icon={getIcon(stat.icon)}
            color={stat.color}
          />
        ))}
      </div>

      {/* Cards */}
      <section className={`grid gap-4 ${view.cards?.some((c) => c.grid_span?.col === 2) ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {view.cards?.map((card) => (
          <div key={card.id} className={`${view.styling?.card_bg || 'bg-slate-900'} ${view.styling?.card_border || 'border border-slate-800'} rounded-lg ${view.styling?.card_shadow || 'shadow-lg shadow-black/30'} ${view.styling?.card_padding || 'p-6'}`}>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">{card.title?.replace('dashboard.', '') || card.id}</h2>
            <p className="text-sm text-slate-400 mb-4">{card.subtitle?.replace('dashboard.', '') || card.description?.replace('dashboard.', '')}</p>
            {card.type === 'action_buttons' && card.actions && (
              <div className="flex flex-wrap gap-2">
                {card.actions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.api_endpoint ? () => window.open(action.api_endpoint, '_blank') : () => navigate(action.route || '/')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-100 ${action.style === 'success' ? 'bg-emerald-900/50 border border-emerald-800 hover:bg-emerald-800/70' : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'}`}
                  >
                    {action.label?.replace('dashboard.btn_', '')}
                  </button>
                ))}
              </div>
            )}
            {card.type === 'status_summary' && (
              <div className="space-y-2">
                <p className="text-sm text-slate-400">
                  {summary.offeneErinnerungen} Erinnerung(en) offen, {summary.offeneRechnungen} offene Rechnung(en).
                </p>
                <p className="text-sm text-slate-400">
                  {summary.objekte} Objekte &middot; {summary.einheiten} Einheiten verwaltet.
                </p>
                <p className="text-sm text-slate-400">Letzte Dokumente: {summary.dokumente}</p>
                <p className="text-sm text-slate-400">Alle Zahlen basieren auf der aktuellen Datenbank.</p>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  )
}

function getIcon(iconName?: string) {
  switch (iconName) {
    case 'Building2': return Building2
    case 'Users': return Users
    case 'FileText': return FileText
    case 'Wallet': return Wallet
    case 'FileArchive': return FileArchive
    case 'FileCheck': return FileCheck
    default: return Building2
  }
}

type StatsCardColor = 'blue' | 'green' | 'purple' | 'orange'

// Removed unused interface `StatsCardItem` to satisfy TypeScript (unused declaration)

// accept a string | undefined for incoming color values (e.g. from config)
// and map/validate it internally to a StatsCardColor with a safe fallback
interface StatsCardProps {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  color?: string
}

function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  const colorClasses: Record<StatsCardColor, string> = {
    blue: 'bg-blue-900/40 text-blue-100 border border-blue-800',
    green: 'bg-emerald-900/40 text-emerald-100 border border-emerald-800',
    purple: 'bg-purple-900/40 text-purple-100 border border-purple-800',
    orange: 'bg-amber-900/40 text-amber-100 border border-amber-800',
  }

  const safeColor: StatsCardColor =
    color === 'green' || color === 'purple' || color === 'orange' || color === 'blue'
      ? (color as StatsCardColor)
      : 'blue'

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/30">
      <div className="flex items-center">
        <div className={`rounded-lg p-3 ${colorClasses[safeColor]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className="text-2xl font-semibold text-slate-100">{value}</p>
      </div>
    </div>
  )
}
