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
    <footer className="flex h-8 items-center px-4 bg-gray-100 border-t border-gray-200 text-xs text-gray-500">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <Database className="h-3 w-3" />
          SQLite verbunden
        </span>
      </div>
      <div className="flex flex-1 justify-center">
        <span className="text-gray-500">{brandingLabel}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <Wifi className="h-3 w-3 text-green-500" />
          Server aktiv
        </span>
        <span>v{version}</span>
      </div>
    </footer>
  )
}
