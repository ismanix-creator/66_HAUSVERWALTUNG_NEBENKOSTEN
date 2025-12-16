import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { ObjektePage } from './pages/ObjektePage'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/objekte" element={<ObjektePage />} />
        {/* Weitere Routes werden config-gesteuert hinzugefügt */}
      </Routes>
    </AppShell>
  )
}
