[Root-Verzeichnis](../../CLAUDE.md) > [src](../) > **client**

# Client-Modul - React Frontend

## Änderungsprotokoll

| Datum | Version | Änderungen |
|-------|---------|------------|
| 2025-12-16 | 1.0.0 | Initiale Modul-Dokumentation |

## Modul-Verantwortlichkeiten

Das Client-Modul ist die React-basierte Frontend-Anwendung der Mietverwaltung. Es rendert die gesamte Benutzeroberfläche **config-gesteuert** aus TOML-Definitionen.

**Kernaufgaben:**
- Config-gesteuertes UI-Rendering (Formulare, Tabellen, Views)
- State Management mit Zustand + TanStack Query
- API-Kommunikation mit Backend (Port 3002)
- Responsive Design (PC-First, Mobile Read-Only)
- Client-seitige Validierung aus Entity-Configs

## Einstieg und Start

### Entry Point

**Datei:** `src/client/main.tsx`

```typescript
// React 18 mit StrictMode
// React Router (BrowserRouter)
// TanStack Query (QueryClientProvider)
```

Dieser Entry Point initialisiert:
- React 18 StrictMode
- React Router für Navigation
- TanStack Query für Server-State-Caching
- Globale CSS-Styles (Tailwind)

### App-Komponente

**Datei:** `src/client/App.tsx`

```typescript
<AppShell>
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    {/* Weitere Routes werden config-gesteuert generiert */}
  </Routes>
</AppShell>
```

Die App-Komponente definiert das Routing. Zukünftig werden Routes aus `config/navigation.config.toml` generiert.

## Externe Schnittstellen

### API-Kommunikation

**Basis-URL:** `http://localhost:3002/api`

**Config-Endpunkte:**
```
GET /api/config/app              - App-Konfiguration
GET /api/config/navigation       - Navigation-Menü
GET /api/config/entity/:name     - Entity-Schema
GET /api/config/view/:name       - View-Definition
GET /api/config/form/:name       - Formular-Layout
GET /api/config/table/:name      - Tabellen-Konfiguration
```

**Entity-CRUD-Endpunkte (geplant Phase 1):**
```
GET    /api/:entity              - Liste aller Einträge
GET    /api/:entity/:id          - Einzelner Eintrag
POST   /api/:entity              - Neuen Eintrag erstellen
PUT    /api/:entity/:id          - Eintrag aktualisieren
DELETE /api/:entity/:id          - Eintrag löschen
```

### State Management

**TanStack Query:**
- Server-State-Caching (5 Minuten Stale Time)
- Automatisches Refetching bei Focus
- Retry-Logic (1 Retry)

**Zustand (geplant):**
- UI-State (Sidebar offen/zu, aktuelle View)
- User-Preferences
- Filter/Such-State

## Wichtige Abhängigkeiten und Konfiguration

### Haupt-Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.28.0",
  "@tanstack/react-query": "^5.60.0",
  "zustand": "^5.0.0",
  "lucide-react": "^0.454.0",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.5.4"
}
```

### Build-Konfiguration

**Vite:** `vite.config.ts` im Root
- Port: 5174
- Proxy zu Backend: `/api` → `http://localhost:3002`
- React Plugin mit Fast Refresh
- TypeScript-Unterstützung

**Tailwind CSS:** `tailwind.config.js`
- Utility-First Styling
- Custom Design-System (geplant)
- Responsive Breakpoints

## Datenmodelle

### Client nutzt Shared Types

Alle Datenmodelle werden aus `src/shared/types/` importiert:

```typescript
import type {
  Objekt,
  Einheit,
  Mieter,
  Vertrag
} from '@shared/types/entities'

import type {
  EntityConfig,
  FormConfig,
  TableConfig,
  ViewConfig
} from '@shared/types/config'
```

### Config-Typen

**EntityConfig:** Schema für Entity-Felder, Validierung, Relationen
**FormConfig:** Formular-Sektionen, Felder, Breiten
**TableConfig:** Spalten, Sortierung, Filter, Row-Actions
**ViewConfig:** Layout-Typ, Widgets, Tabs

## Testen und Qualität

### Test-Strategie (Phase 2)

```
client/
├── components/
│   ├── common/
│   │   └── Button.test.tsx        - Component Tests
│   └── layout/
│       └── Sidebar.test.tsx       - Layout Tests
├── pages/
│   └── DashboardPage.test.tsx     - Page Integration Tests
└── hooks/
    └── useEntityCRUD.test.ts      - Hook Tests
```

**Test-Tools:**
- Vitest für Unit-Tests
- React Testing Library für Component-Tests
- MSW (Mock Service Worker) für API-Mocking

### Code-Qualität

```bash
npm run lint       # ESLint (React-Plugin aktiv)
npm run typecheck  # TypeScript Strict Mode
npm run format     # Prettier
```

## Häufig gestellte Fragen (FAQ)

**F: Wie füge ich eine neue Seite hinzu?**
A:
1. Erstelle eine neue Page-Komponente in `pages/`
2. Erstelle `config/views/{name}.config.toml` für das Layout
3. Füge Route in `App.tsx` hinzu (später config-gesteuert)

**F: Wie ändere ich ein Formular?**
A: Bearbeite `config/forms/{entity}.form.toml` - **NICHT** den Code!

**F: Wie füge ich eine neue Tabellenspalte hinzu?**
A: Bearbeite `config/tables/{entity}.table.toml` und füge ein `[[table.columns]]`-Element hinzu.

**F: Wo sind die Labels/Texte?**
A: Alle UI-Texte kommen aus `config/labels/de.labels.toml` (geplant Phase 2).

**F: Wie funktioniert Config-Driven Rendering?**
A:
1. Komponente lädt Config vom Backend
2. Generische Renderer-Komponente iteriert über Config
3. UI wird dynamisch aus Config-Definitionen generiert

## Verwandte Dateiliste

### Komponenten (components/)

**Layout:**
- `components/layout/AppShell.tsx` - Haupt-Layout mit Sidebar + Content
- `components/layout/Sidebar.tsx` - Navigation-Sidebar
- `components/layout/StatusBar.tsx` - Status-Leiste (geplant)

**Common (geplant):**
- `components/common/Button.tsx` - Button-Komponente
- `components/common/Input.tsx` - Input-Feld
- `components/common/Table.tsx` - Generische Tabelle
- `components/common/Form.tsx` - Generisches Formular

**Config-Driven (geplant Phase 1):**
- `components/config/ConfigForm.tsx` - Formular aus FormConfig
- `components/config/ConfigTable.tsx` - Tabelle aus TableConfig
- `components/config/ConfigView.tsx` - View aus ViewConfig

### Seiten (pages/)

- `pages/DashboardPage.tsx` - Dashboard-Übersicht

**Geplant:**
- `pages/ObjektePage.tsx` - Objekte-Liste
- `pages/ObjektDetailPage.tsx` - Objekt-Detail mit Tabs
- `pages/MieterPage.tsx` - Mieter-Liste
- `pages/VertraegePage.tsx` - Verträge-Liste
- `pages/FinanzenPage.tsx` - Finanzen-Übersicht
- `pages/NebenkostenPage.tsx` - Nebenkosten-Abrechnung

### Hooks (geplant)

- `hooks/useEntityCRUD.ts` - Generic CRUD-Operationen
- `hooks/useConfig.ts` - Config-Loading-Hook
- `hooks/useEntityList.ts` - Entity-Listen mit Filterung
- `hooks/useEntityDetail.ts` - Entity-Detail-Loading

### Services (geplant)

- `services/api.service.ts` - Zentraler API-Client
- `services/validation.service.ts` - Client-seitige Validierung aus Config

### Styles

- `styles/global.css` - Globale Tailwind-Imports und Custom-Styles

## Nächste Entwicklungsschritte

### Phase 1: Generic CRUD System
1. **ConfigForm-Komponente** implementieren
2. **ConfigTable-Komponente** implementieren
3. **useEntityCRUD-Hook** für CRUD-Operationen
4. **API-Service** für Backend-Kommunikation
5. **Validierung** aus EntityConfig ableiten

### Phase 2: Entity-Seiten
1. **Objekte-Seite** mit Liste + Detail
2. **Mieter-Seite** mit Liste + Detail
3. **Verträge-Seite** mit komplexen Formularen
4. **Finanzen-Seite** mit Dashboards

### Phase 3: Erweiterte UI
1. **PDF-Vorschau** für Dokumente
2. **Datei-Upload** für Dokumente
3. **Filter + Such-Komponenten**
4. **Responsive Mobile-Views** (Read-Only)

---

**Zuletzt aktualisiert:** 2025-12-16 01:14:58 CET
**Modul-Status:** Grundstruktur vorhanden, Phase 1 in Arbeit
