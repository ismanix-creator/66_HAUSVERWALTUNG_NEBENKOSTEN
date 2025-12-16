import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { ObjektePage } from './pages/ObjektePage'
import { VertraegePage } from './pages/VertraegePage'
import { FinanzenPage } from './pages/FinanzenPage'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/objekte" element={<ObjektePage />} />
        <Route path="/vertraege" element={<VertraegePage />} />
        <Route path="/vertraege/:id" element={<VertraegePage />} />
        <Route path="/finanzen" element={<FinanzenPage />} />
        <Route path="/finanzen/:tab" element={<FinanzenPage />} />
        {/* Weitere Routes werden config-gesteuert hinzugefügt */}
      </Routes>
    </AppShell>
  )
}
