import { Building2, Users, FileText, Wallet, FileArchive, FileCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDashboardSummary } from '../hooks/useConfig'

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: summary, isLoading } = useDashboardSummary()

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Lade Dashboard...</div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Keine Dashboard-Daten verfügbar.</div>
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Übersicht Ihrer Mietverwaltung</p>
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
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Schnellzugriff</h2>
          <p className="text-sm text-gray-500 mb-4">
            Öffne Dokumente, Rechnungen oder Abrechnungen direkt aus dem Dashboard.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/dokumente')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              Dokumente
            </button>
            <button
              onClick={() => navigate('/nebenkosten/rechnungen')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              Rechnungen
            </button>
            <button
              onClick={() => navigate('/nebenkosten/abrechnungen')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              Abrechnungen
            </button>
            <button
              onClick={openExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900"
            >
              Steuerberater-Export
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Status</h2>
          <p className="text-sm text-gray-500">
            {summary.offeneErinnerungen} Erinnerung(en) offen, {summary.offeneRechnungen} offene
            Rechnung(en).
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-500">
              {summary.objekte} Objekte &middot; {summary.einheiten} Einheiten verwaltet.
            </p>
            <p className="text-sm text-gray-500">Letzte Dokumente: {summary.dokumente}</p>
            <p className="text-sm text-gray-500">
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
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center">
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  )
}
