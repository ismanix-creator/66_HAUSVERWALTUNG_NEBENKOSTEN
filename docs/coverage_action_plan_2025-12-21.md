<!-- Coverage Action Plan generated 2025-12-21 -->
# Coverage Action Plan — Ziel: 100% Testabdeckung

Datum: 2025-12-21

Kurzbeschreibung
- Dieses Dokument priorisiert die fehlenden Tests, listet betroffene Dateien und Funktionen auf und schlägt konkrete Tests, Mocks und Refactorings vor, um die Codebasis auf 100% Coverage zu bringen.

TOC
- Zusammenfassung
- Priorisierte Liste (High / Medium / Low)
- Detaillierte Maßnahmen pro Datei
- Vorschläge für Testfälle (Beispiele + Assertions)
- Befehle zum Ausführen von Tests und Coverage
- Nächste Schritte und Zeitabschätzung

**Zusammenfassung**
- Aktueller Stand: Vitest mit V8-Provider erzeugte Coverage-Artefakte in coverage/coverage-final.json.
- Fokus: Server-seitige Services zeigen die größten Coverage-Lücken (insb. config-loader.service.ts, config.service.ts, dashboard.service.ts).

**Priorisierung**

High (größter Coverage-Gewinn pro Testaufwand)
- src/server/services/config-loader.service.ts — viele ungetestete Pfade (Parser, Catalog-/Form-Generierung, Fehlerpfade).
- src/server/services/config.service.ts — nahezu ungetestet; wichtige API für Konfig-Lookups.
- src/server/services/dashboard.service.ts — Business-Logik für Dashboard-Widgets (Branches ungetestet).

Medium
- src/server/services/schema.service.ts — Migrations/Schema-Berechnungen; teilweise logikreich.
- src/server/services/database.service.ts — DB-Initialisierung, Migration-Pfade, Fehlerpfade.
- src/server/middleware/rate-limit.middleware.ts — Branches für Request-Raten und Timeouts.

Low
- src/server/utils/logger.ts — einfache Pfade, geringe Priorität (Coverage-Nutzen gering).
- src/server/services/mobile.service.ts — bereits gut abgedeckt; nur Randfälle fehlen.

---

**Detaillierte Maßnahmen (pro Datei)**

- src/server/services/config-loader.service.ts (HIGH)
  - Was fehlt: Fehlerpfade beim Parsen von TOML/JSON; Branches, die verschiedene Catalog-/Form-Definitionen behandeln; Fälle, in denen optionale Felder fehlen.
  - Konkrete Tests:
    1. Erfolgreiches Laden einer minimalen config.toml (Happy path).
    2. Laden einer fehlerhaften TOML → assertiere, dass ein sinnvolles Error-Objekt/Exception geworfen oder ein Fallback genutzt wird.
    3. Catalog-Parsing: stelle sicher, dass catalogs/*.catalog.toml korrekt zu catalogs[name].items gemappt wird (Mock FS oder inject loader).
    4. Erzeuge eine View-Konfiguration mit komplexen detail.tabs und assertiere, dass viewConfig.detail.tabs die erwartete Struktur liefert.
  - Test-Implementierungstipps:
    - Mock fs.readFileSync / fs.promises.readFile oder extrahiere die Dateilese-Logik in eine testable Funktion.
    - Benutze kleine fixture-TOML-Dateien unter tests/fixtures/config/.
    - Assertions: shape checks (z.B. expect(viewConfig.detail.tabs).toBeDefined()), content checks (tab-titles, data_path).

- src/server/services/config.service.ts (HIGH)
  - Was fehlt: viele Funktionen ungetestet (Lookup-Funktionen, Caching-Fallbacks, Feature-Flags).
  - Konkrete Tests:
    1. getConfig() / getViewConfig('mieter') → Rückgabe erwartete Struktur.
    2. Edge-Case: Fehlende Entity-Definition → assertiere kontrolliertes Verhalten (Fehler oder default).
    3. Caching-Invalidation: falls vorhanden, sicherstellen, dass Änderungen neu geladen werden.
  - Test-Impl.-Tipps: Testen gegen Fixtures; wenn die Service-Funktionen Abhängigkeiten haben (z. B. config-loader), diese mocken.

- src/server/services/dashboard.service.ts (HIGH)
  - Was fehlt: Branches und konditionale Pfade (z.B. unterschiedliche Quellen für Daten, default args).
  - Konkrete Tests:
    1. Dashboard-Generator mit leerer DB → erwarte leere Widgets / Default-Werte.
    2. Dashboard-Generator mit Beispiel-Daten → verifiziere aggregierte Metriken.
    3. Test der Default-Argumente und conditional expressions (z.B. wenn optionale Parameter gesetzt/leer sind).
  - Test-Implementierungstipps: Mock Database-Service / Entities, rufe buildDashboard() auf und vergleiche das Ergebnis.

- src/server/services/schema.service.ts (MEDIUM)
  - Was fehlt: Branches für unterschiedliche Schema-Versionen und Migrationspfade.
  - Konkrete Tests: Migrationslauf mit verschiedenen Versionen, assertions zu erzeugten SQL oder zur resultierenden Schema-Struktur.

- src/server/services/database.service.ts (MEDIUM)
  - Was fehlt: Fehlerpfade bei DB-Verbindungen, Verhalten bei bereits initialisierter DB, WAL/SHM Edge-Cases.
  - Konkrete Tests: Mock better-sqlite3 oder abstrahiere DB-Init in eine hookable Factory; teste Init/Close und Schema-Checks.

- src/server/middleware/rate-limit.middleware.ts (MEDIUM)
  - Was fehlt: branches für aktivierte/ deaktivierte Rate-Limits und Timeout-Behaviours.
  - Konkrete Tests: Simuliere Express-Requests mit verschiedenen Headers/IPs und assertiere next() vs res.status(429).

---

**Konkrete Testvorschläge (Beispiele)**

- Beispiel: Test für config-loader.service.ts (pseudo-code)

import { loadViewConfig } from '../../server/services/config-loader.service';

test('loadViewConfig returns expected detail tabs', async () => {
  const cfg = await loadViewConfig('mieter', { fixturesPath: 'tests/fixtures/config' });
  expect(cfg.detail).toBeDefined();
  expect(Array.isArray(cfg.detail.tabs)).toBe(true);
  expect(cfg.detail.tabs.map(t => t.id)).toContain('stammdaten');
});

- Beispiel: Test für dashboard.service.ts (pseudo-code)

import { buildDashboard } from '../../server/services/dashboard.service';
import { createInMemoryDb } from '../helpers/in-memory-db';

test('buildDashboard aggregates data from contracts', async () => {
  const db = createInMemoryDb({ vertrag: [ /* fixtures */ ] });
  const result = await buildDashboard({ db });
  expect(result.widgets).toBeDefined();
  expect(result.widgets.some(w => w.type === 'sum' && w.value > 0)).toBe(true);
});

Test-Utilities
- Lege tests/fixtures/ an mit minimalen TOML/JSON-Files.
- Hilfsfunktionen unter tests/helpers/: mockFsRead, createInMemoryDb, spyOnLogger.

Running tests & coverage
- Lokale Commands:
  - npm test oder npx vitest
  - npx vitest run --coverage
  - Coverage-Report: open coverage/index.html

Zeit- und Aufwandsschätzung (grob)
- High priority group: ~2–4 Tage
- Medium: ~1–2 Tage
- Low: ~0.5–1 Tag

Nächste Schritte
1. Implementiere Top‑3 Tests (config-loader, config.service, dashboard.service).
2. Fixtures & helper utilities anlegen (tests/fixtures, tests/helpers).
3. Optional: CI-Integration für Coverage.

---

Wenn du möchtest, implementiere ich sofort die Tests für die Top-2 Dateien. Sag kurz, ob ich Tests oder vorher Refactorings (DI für FS/DB) machen soll.
