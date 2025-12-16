import { Database, Wifi } from 'lucide-react'

export function StatusBar() {
  return (
    <footer className="flex h-8 items-center justify-between px-4 bg-gray-100 border-t border-gray-200 text-xs text-gray-500">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <Database className="h-3 w-3" />
          SQLite verbunden
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <Wifi className="h-3 w-3 text-green-500" />
          Server aktiv
        </span>
        <span>v1.0.0</span>
      </div>
    </footer>
  )
}
