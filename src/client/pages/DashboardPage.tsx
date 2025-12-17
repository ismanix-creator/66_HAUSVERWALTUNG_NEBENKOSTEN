import { Building2, Users, FileText, Wallet, FileArchive, FileCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDashboardSummary } from '../hooks/useConfig'

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: summary, isLoading } = useDashboardSummary()

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-slate-500">Lade Dashboard...</div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-slate-500">Keine Dashboard-Daten verfügbar.</div>
      </div>
    )
  }

  const stats: StatsCardItem[] = [
    { title: 'Objekte', value: summary.objekte, icon: Building2, color: 'blue' },
    { title: 'Mieter', value: summary.mieter, icon: Users, color: 'green' },
    { title: 'Verträge', value: summary.vertraege, icon: FileText, color: 'purple' },
    { title: 'Offene Rechnungen', value: summary.offeneRechnungen, icon: Wallet, color: 'orange' },
    { title: 'Dokumente', value: summary.dokumente, icon: FileArchive, color: 'blue' },
    { title: 'Erinnerungen', value: summary.offeneErinnerungen, icon: FileCheck, color: 'green' },
  ]

  const openExport = () => {
    window.open('/api/export/steuerberater', '_blank')
  }

  return (
    <div className="space-y-6 text-slate-100">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-slate-400">Übersicht Ihrer Mietverwaltung</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(stat => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value.toString()}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/30">
          <h2 className="text-lg font-semibold text-slate-100 mb-2">Schnellzugriff</h2>
          <p className="text-sm text-slate-400 mb-4">
            Öffne Dokumente, Rechnungen oder Abrechnungen direkt aus dem Dashboard.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/dokumente')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-100 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700"
            >
              Dokumente
            </button>
            <button
              onClick={() => navigate('/nebenkosten/rechnungen')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-100 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700"
            >
              Rechnungen
            </button>
            <button
              onClick={() => navigate('/nebenkosten/abrechnungen')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-100 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700"
            >
              Abrechnungen
            </button>
            <button
              onClick={openExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-100 bg-emerald-900/50 border border-emerald-800 rounded-lg hover:bg-emerald-800/70"
            >
              Steuerberater-Export
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/30">
          <h2 className="text-lg font-semibold text-slate-100 mb-2">Status</h2>
          <p className="text-sm text-slate-400">
            {summary.offeneErinnerungen} Erinnerung(en) offen, {summary.offeneRechnungen} offene
            Rechnung(en).
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-slate-400">
              {summary.objekte} Objekte &middot; {summary.einheiten} Einheiten verwaltet.
            </p>
            <p className="text-sm text-slate-400">Letzte Dokumente: {summary.dokumente}</p>
            <p className="text-sm text-slate-400">
              Alle Zahlen basieren auf der aktuellen Datenbank.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

type StatsCardColor = 'blue' | 'green' | 'purple' | 'orange'

interface StatsCardItem {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: StatsCardColor
}

interface StatsCardProps {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  color: StatsCardColor
}

function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-900/40 text-blue-100 border border-blue-800',
    green: 'bg-emerald-900/40 text-emerald-100 border border-emerald-800',
    purple: 'bg-purple-900/40 text-purple-100 border border-purple-800',
    orange: 'bg-amber-900/40 text-amber-100 border border-amber-800',
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/30">
      <div className="flex items-center">
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
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
