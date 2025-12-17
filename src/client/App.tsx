import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { ObjektePage } from './pages/ObjektePage'
import { EinheitenPage } from './pages/EinheitenPage'
import { MieterDetailPage } from './pages/MieterDetailPage'
import { MieterPage } from './pages/MieterPage'
import { VertraegePage } from './pages/VertraegePage'
import { FinanzenPage } from './pages/FinanzenPage'
import { ZaehlerPage } from './pages/ZaehlerPage'
import { NebenkostenPage } from './pages/NebenkostenPage'
import { DokumentePage } from './pages/DokumentePage'
import { MobileDashboardPage } from './pages/mobile/MobileDashboardPage'

export default function App() {
  const location = useLocation()
  const isMobileRoute = location.pathname.startsWith('/mobile')

  if (isMobileRoute) {
    return (
      <Routes>
        <Route path="/mobile" element={<Navigate to="/mobile/dashboard" replace />} />
        <Route path="/mobile/dashboard" element={<MobileDashboardPage />} />
        <Route path="/mobile/*" element={<Navigate to="/mobile/dashboard" replace />} />
      </Routes>
    )
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/objekte" element={<ObjektePage />} />
        <Route path="/einheiten" element={<EinheitenPage />} />
        <Route path="/mieter" element={<MieterPage />} />
        <Route path="/mieter/:id" element={<MieterDetailPage />} />
        <Route path="/vertraege" element={<VertraegePage />} />
        <Route path="/vertraege/:id" element={<VertraegePage />} />
        <Route path="/finanzen" element={<FinanzenPage />} />
        <Route path="/finanzen/:tab" element={<FinanzenPage />} />
        <Route path="/nebenkosten" element={<NebenkostenPage />} />
        <Route path="/nebenkosten/:tab" element={<NebenkostenPage />} />
        <Route path="/dokumente" element={<DokumentePage />} />
        <Route path="/nebenkosten/zaehler" element={<ZaehlerPage />} />
        {/* Weitere Routes werden config-gesteuert hinzugefügt */}
      </Routes>
    </AppShell>
  )
}
