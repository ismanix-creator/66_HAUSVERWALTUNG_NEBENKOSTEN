# Changelog - Mietverwaltung

Alle wichtigen Änderungen werden hier dokumentiert.

Format: `[YYYY-MM-DD HH:MM] - Kategorie - Beschreibung`

---

## 2025-12-19

### [2025-12-19 23:10] - Fix/KRITISCH - MieterPage Detail-Tabs TOML-Struktur repariert
- **Problem:** MieterPage Detail-View zeigte keine Tabs bei Auswahl einer Zeile (stammdaten, vertrag, zahlungen, dokumente, kaution)
- **Root Cause:** TOML Array-Tabellen falsch eingehängt: `[[view.detail.tabs]]` statt `[[views.mieter.detail.tabs]]`
  - Tabs wurden unter nicht-existierendem `[view]` Objekt erstellt, nicht unter `[views.mieter.detail]`
  - MieterDetailPage konnte keine Tabs laden → Seite zeigte nur "Laden..."
  - Betraf auch: ObjekteDetailPage, VertraegeDetailPage
- **Lösung:** Automatischer Python-Fix - alle `[[view.detail.tabs]]` → `[[views.{entity}.detail.tabs]]`
- **Resultat:**
  - TOML.parse verifiziert: 5 Tabs für mieter.detail ✅
  - Mieter-Auswahl navigiert zu /mieter/:id und zeigt Details mit allen Tabs
  - Auch Objekte und Verträge Detail-Views funktionieren jetzt
- **Status:** ✅ KRITISCH REPARIERT, ✅ Verifiziert

### [2025-12-19 22:17] - Fix/Frontend - Mieter Aktionen: nur Icons ohne Text
- **Problem:** Row-Actions zeigten immer Text (Label) auch wenn `label = ""` in Config definiert war
- **Root Cause:** `const label = actionConfig.label || actionId` - leerer String wurde ignoriert, Fallback zu actionId
- **Lösung:** `label !== undefined ? actionConfig.label : actionId` - respektiert explizit definierten leeren String
- **Resultat:** Mieter-Tabelle zeigt jetzt nur Icon-Buttons ohne Text
- **Status:** ✅ TypeScript, 1 neuer Commit

### [2025-12-19 21:55] - Fix/Frontend + Backend - IBAN-Validierung komplette Behebung
- **Problem 1 (Frontend):** `formData` wurde direkt mutiert statt kopiert, Validierungsschleife sah angepasste Werte nicht
  - **Lösung:** `processedFormData` Kopie erstellen, IBAN auf "" setzen wenn "DE" oder leer, gegen Kopie validieren
- **Problem 2 (Backend):** Leere Strings (value === '') wurden nicht skipped, Backend validierte IBAN-Pattern trotzdem
  - **Lösung:** Expliziter Check für leere Werte (undefined, null, '') mit `continue` - Pattern-Validierung nur für non-empty Werte
- **Resultat:** Mieter kann jetzt vollständig ohne IBAN erstellt werden (Frontend + Backend stimmen überein)
- **Status:** ✅ TypeScript, ✅ Frontend + Backend, 2 neue Commits

### [2025-12-18 XX:XX] - Refactor/Config - Width-Referenzsystem, Label-Cleanup & Version-Update
- **Width-Referenzsystem:** 79 hardcodierte px-Breiten durch Referenzen ersetzt (w40-w300 in 20px-Schritten + actions=120px).
  - Mapping intelligente durchgeführt: w50→w60, w150→w160, w250→w260, w400→w300
  - `useWidthsConfig()` Hook + `/api/config/widths` Endpunkt hinzugefügt
  - DataTable nutzt `resolveWidth()` für zentrale Breiten-Verwaltung
- **Standalone Labels/Actions entfernt:** `getLabels()`, `/api/config/labels` Endpunkt, `useLabelsConfig` Hook gelöscht.
  - Labels/Actions existieren nur noch als Teil von Table-Definitionen (`[tables.xxx.table.actions]`)
  - Vereinfacht Architektur und erzwingt Kontext-Konsistenz
- **Version korrigiert:** 1.0.0 → 0.2.0 (reflektiert Phase 2, nicht Produktionsreife)
- **Duplicate config-Entry:** `version` aus `[app]` entfernt (gehört nur in `[meta]`)
- **Konsistente Block-Header:** Entities, Forms, Tables, Views haben jetzt explizite Block-Header für bessere Lesbarkeit
- **Status:** ✅ TypeScript, ✅ Build, ✅ 3 neue Commits

## 2025-12-18

### [2025-12-18 XX:XX] - Fix/Config + Frontend - MieterPage Rendering & TOML Table Columns
- **KRITISCHER CONFIG-FIX:** 70 falsch verschachtelte TOML Array-Tabellen korrigiert.
  - War: `[[table.columns]]` (top-level, unbezogene Struktur)
  - Ist: `[[tables.{name}.table.columns]]` (korrekt verschachtelt)
  - Betroffen: Alle 11 Table-Konfigurationen (mieter, einheiten, objekte, etc.)
- **MieterPage Loading-Condition:** Nicht mehr auf entityConfig/formConfig warten → Seite rendert auch wenn Formulare fehlschlagen.
- **Resultat:** DataTable zeigt jetzt "Keine Einträge" statt blauem Bildschirm, wenn DB leer ist.

### [2025-12-18 XX:XX] - Fix/Frontend - TypeScript & ESLint Fehler behoben
- **React Hook Error:** useEntityList in DetailTableTab vor conditional check verschoben (Zeile 251).
- **Type Errors:** mieter/contractIds/primaryUnitId korrekt als Record<string, unknown> getypet.
- **useMemo:** tabs Dependency für useEffect in MieterDetailPage optimiert.
- **ConfigLoader:** Console.log-Statements unter DEBUG_CONFIG Flag mit eslint-disable-next-line.
- **Sidebar:** Sichere Navigation für item.children mit Type Guard und Conditional Render.
- **Status:** npm run typecheck ✅ (0 Fehler), npm run lint ⚠️ (3 Minor Warnings in NebenkostenPage).

### [2025-12-18 XX:XX] - Test/Backend - ConfigLoaderService Tests erweitert für konsolidierte Struktur
- Tests aktualisiert: 5 neue Test-Cases prüfen die Laden von [entities.*], [forms.*], [tables.*], [views.*] aus konsolidierter `config.toml`.
- Integrations-Test durchgeführt: ConfigLoader lädt perfekt (14 Entities, 12 Forms, 11 Tables, 8 Views in 26ms).
- API-Endpunkte validiert: `/api/config/entity/*`, `/api/config/form/*`, `/api/config/table/*`, `/api/entities` antworten korrekt.
- Blockers: Keine. ConfigLoader-Service funktioniert bereits mit neuer Struktur.

### [2025-12-18 XX:XX] - Docs/Tooling - Read/Commit-Gates erweitert
- Read-Gate und Session-Start verweisen jetzt auf Pflichtdokumente (.claude/.codex/.ai, Root-Docs, `config/config.toml`, wireframe, todo.md) sowie die detaillierten Agentenprompts unter `.github/agents/*.agent.md`.
- Commit-Gate blockt, wenn kein neuer JSON-Statusblock in `PM_STATUS.md` vorhanden ist; Pflichtlektüre und READY_FOR_CHANGES werden explizit vor Tool-Nutzung eingefordert.
- AGENTS/CLAUDE/CODEX dokumentieren den zentralen PM_STATUS-Log, config-first-Fluss und die Nutzung der .github/agents-Prompts; neues `todo.md` stellt die Aufgabenliste als Pflichtdoku bereit.

### [2025-12-18 XX:XX] - Docs - Agenten-Beschreibungen ungekürzt zusammengeführt
- Agentenabschnitte wurden ungekürzt aus den Einzeldateien übernommen; `AGENTS.md` startet mit vollständigen Rollenbeschreibungen und enthält im Anschluss die bestehenden Repository-Guidelines.
- Bauplan-Hinweis präzisiert die zentrale, vollständige `AGENTS.md`-Quelle.

### [2025-12-18 XX:XX] - Docs - Agenten-Katalog konsolidiert
- `AGENTS.md` enthält jetzt den vollständigen, zentralen Agenten-Katalog (alle Rollen inkl. Projektmanager/Workflow/Release/Tester), vereinheitlichte Guardrails und Rückmeldelogik über `PM_STATUS.md`.
- Bauplan ergänzt einen Hinweis auf die zentrale `AGENTS.md`, damit alle Agenten dieselbe Quelle nutzen.
