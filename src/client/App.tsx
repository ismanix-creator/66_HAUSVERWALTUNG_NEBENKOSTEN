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
import { useMemo, type ComponentType } from 'react'
import { useNavigationConfig } from './hooks/useConfig'

type RouteConfig = {
  component: ComponentType
  detailRoutes?: Array<{ suffix: string; component: ComponentType }>
}

const ROUTE_REGISTRY: Record<string, RouteConfig> = {
  dashboard: { component: DashboardPage },
  objekte: { component: ObjektePage, detailRoutes: [{ suffix: '/:id', component: ObjektePage }] },
  einheiten: { component: EinheitenPage, detailRoutes: [{ suffix: '/:id', component: EinheitenPage }] },
  mieter: { component: MieterPage, detailRoutes: [{ suffix: '/:id', component: MieterDetailPage }] },
  vertraege: { component: VertraegePage, detailRoutes: [{ suffix: '/:id', component: VertraegePage }] },
  finanzen: { component: FinanzenPage, detailRoutes: [{ suffix: '/:tab', component: FinanzenPage }] },
  nebenkosten: { component: NebenkostenPage, detailRoutes: [{ suffix: '/:tab', component: NebenkostenPage }, 
                                                            { suffix: '/zaehler', component: ZaehlerPage }] },
  dokumente: { component: DokumentePage },
}

export default function App() {
  const { data: navigationConfig } = useNavigationConfig()
  const navItems = useMemo(() => {
    return [...(navigationConfig?.navigation?.items ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }, [navigationConfig?.navigation?.items])

  const routeSets = useMemo(() => {
    return navItems
      .map(item => {
        const registry = ROUTE_REGISTRY[item.id]

        if (!item.route || !registry) return null

        return {
          base: {
            path: item.route,
            component: registry.component,
          },
          detailRoutes: (registry.detailRoutes ?? []).map(detail => ({
            path: `${item.route}${detail.suffix}`,
            component: detail.component,
          })),
        }
      })
      .filter(
        (set): set is { base: { path: string; component: ComponentType }; detailRoutes: { path: string; component: ComponentType }[] } =>
          Boolean(set)
      )
  }, [navItems])

  const baseRoutes = routeSets.map(set => set.base)
  const detailRoutes = routeSets.flatMap(set => set.detailRoutes)
  const defaultRoute = baseRoutes[0]?.path ?? '/dashboard'
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
        <Route path="/" element={<Navigate to={defaultRoute} replace />} />
        {baseRoutes.map(route => {
          const RouteComponent = route.component
          return <Route key={`route-${route.path}`} path={route.path} element={<RouteComponent />} />
        })}
        {detailRoutes.map(route => {
          const RouteComponent = route.component
          return <Route key={`detail-${route.path}`} path={route.path} element={<RouteComponent />} />
        })}
        <Route path="*" element={<Navigate to={defaultRoute} replace />} />
      </Routes>
    </AppShell>
  )
}
