import { Database, Wifi } from 'lucide-react'
import { useAppConfig } from '../../hooks/useConfig'

export function StatusBar() {
  const { data: appConfig } = useAppConfig()
  const ownerName = appConfig?.app?.owner?.name?.trim()
  const version = appConfig?.app?.version || '0.0.0'
  const brandingLabel = ownerName
    ? `entwickelt von ${ownerName}`
    : `entwickelt von ${appConfig?.app?.name || 'Mietverwaltung'}`

  return (
    <footer className="flex h-8 items-center px-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-400">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <Database className="h-3 w-3 text-emerald-400" />
          SQLite verbunden
        </span>
      </div>
      <div className="flex flex-1 justify-center">
        <span className="text-slate-400">{brandingLabel}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <Wifi className="h-3 w-3 text-emerald-400" />
          Server aktiv
        </span>
        <span>v{version}</span>
      </div>
    </footer>
  )
}
