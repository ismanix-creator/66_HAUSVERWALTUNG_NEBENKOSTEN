# Claude Validierungs-Checklisten — Mietverwaltung

> **Version:** 0.1.0  
> **Letzte Änderung:** 2025-12-15 CET (Phase-Status-Update)  
> **Status:** Aktiv – orientiert sich am `planning/BAUPLAN_MIETVERWALTUNG.md`

## Validierung nach Phasen (BAUPLAN-Sync)
Referenziere AGENTS, CHANGELOG und BAUPLAN für jede Anpassung, damit die AI-Dokumentation vollständig bleibt.

### Phase 0: Projekt-Setup & Grundstruktur ✅
- [x] Projekt mit React/Vite + Express/TS steht (siehe `package.json`, `tsconfig*.json`).
- [x] TOML-Loader & Config-Services greifen auf `config/*` zu (Server startet mit `schema.service.ts`).
- [x] `.ai`, `.codex`, `.claude` sind strukturiert (agile Checklisten, Review-Workflows, Planning) – neue Regeln dokumentiert hier.
- [x] Statusdoku ergänzt (`planning/BAUPLAN_MIETVERWALTUNG.md` Phase-Status + AGENTS-Referenzen).

### Phase 1: Entity-System & CRUD ✅
- [x] REST-Routen `src/server/routes/api.routes.ts` liefern Entities gemäß TOML.
- [x] Schema-Generator und Services (`entity`, `database`, `schema`) erfüllen Bausteine aus Phase 1.
- [x] Commit-/PR-Regeln mit `AGENTS.md` verknüpft, damit neue Entities dokumentiert sind.

### Phase 2: Frontend-Grundgerüst & Komponenten ✅
- [x] `AppShell`, `DynamicForm`, `DataTable` rendern Views aus `config/forms` + `config/tables`.
- [x] Navigation und Pages (`App.tsx`, `DashboardPage`, ...) folgen BAUPLAN-Definitionen.
- [x] Styling (Tailwind/PostCSS) respektiert `tailwind.config.js`; neue Regeln hier vermerken.

### Phase 3: Verträge & Finanzen ✅
- [x] Contracts, Zahlungen, Sollstellungen, Kautionen in Forms/Tables vertreten.
- [x] Shared Logger + Tests für Finanzlogik dokumentieren Phase-3-Status im BAUPLAN.
- [x] Automatische Validierung anhand `config/entities/*.config.toml`.

### Phase 4: Nebenkosten & Zähler ✅
- [x] Zähler, Ablesungen, Rechnungen, Abrechnungen und Umlageschlüssel fertiggestellt (Config + Pages).
- [x] Status: alle Akzeptanzkriterien 4.1–4.7 abgearbeitet; Dokumentation in BAUPLAN + CHANGELOG (+ AGENTS).

### Phase 5: Dashboard, Dokumente & PDF ✅
- [x] Dashboard-Endpoints links zu `/dashboard/summary` + `/export/steuerberater`.
- [x] Dokumente verwalten + PDF-Export (TOML-Template) umgesetzt.
- [x] Screenshots, Tests und Changelog-Einträge erweitern die Historie.

### Phase 6: Mobile + Polish ✅
- [x] Mobile Read-Only Routes `/mobile/...` stehen (siehe `mobileRoutes`, `/mobile/dashboard` plus `mobileReadOnlyMiddleware`).
- [x] Responsive Touch-optimierte Dashboardseite (`MobileDashboardPage`) mit Invoice- und Reminder-Listen sowie config-gesteuerten Calls.
- [x] Tests (`tests/unit/mobile.service.test.ts`) und Dokumentation (AGENTS, CHANGELOG, BAUPLAN) aktualisiert; Validierungs-Protokoll bereit.

## Übergreifende Checks
- [x] `npm run lint`, `npm run format`, `npm test`, `npm run typecheck` als Standard-Checks (gemeldet in CHANGELOG/AGENTS).
- [x] Konfigurationen nur über TOML/`scripts/` ändern; jede Änderung mit Changelog + BAUPLAN-Update verknüpfen.
- [x] Dokumentationskette geschlossen: AGENTS verweist auf `.claude` und umgekehrt.

## Validierungs-Protokoll (nutzen, wenn Phase abgeschlossen)
```markdown
## Validierung: [Phase X] - [Datum]

### Geprüfte Kriterien
- ✅ Kriterium
- ✅ Kriterium
- ❌ Kriterium – [Grund | Aktion]

### Offene Punkte
- [Punkt] – [Verantwortlich]

### Nächste Schritte
1. [Schritt]

### Freigabe
- [ ] Validierung bestanden
- [ ] Bereit für nächste Phase
```
