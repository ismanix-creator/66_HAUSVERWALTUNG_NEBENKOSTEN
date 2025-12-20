# RULES - Entwicklungsregeln (88_HIDEANDSEEK)

> **Datei:** docs/RULES.md
> **Version:** 0.9.0
> **Erstellt:** 2025-12-10 23:48:36 CET
> **Aktualisiert:** 2025-12-14 00:17:49 CET
> **Autor:** Akki Scholze

---

0. WORKFLOW-REGELN (HÖCHSTE PRIORITÄT)

Diese Regeln müssen bei JEDER Dateiänderung befolgt werden.

### 0.1 Datei-Header Pflicht

**JEDE Datei** im Projekt MUSS einen Header haben.

#### TypeScript-Dateien (.ts)

```typescript
/**
 * @file        format.ts
 * @description Formatierungs-Utility-Funktionen
 * @version     0.1.0
 * @created     2025-12-10 23:48:36 CET
 * @updated     2025-12-10 23:48:36 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.0 - 2025-12-10 - Initial version
 */
```

#### TSX-Dateien (.tsx)

```typescript
/**
 * @file        Button.tsx
 * @description Wiederverwendbare Button-Komponente
 * @version     0.1.0
 * @created     2025-12-10 23:48:36 CET
 * @updated     2025-12-10 23:48:36 CET
 * @author      Akki Scholze
 *
 * @props
 *   variant - Button-Variante (primary, secondary, etc.)
 *   size - Button-Größe (sm, md, lg)
 *   onClick - Click-Handler
 *
 * @changelog
 *   0.1.0 - 2025-12-10 - Initial version
 */
```

#### Config-Dateien (.config.ts)

```typescript
/**
 * @file        button.config.ts
 * @description Konfiguration für Button-Komponente
 * @version     0.1.0
 * @created     2025-12-10 23:48:36 CET
 * @updated     2025-12-10 23:48:36 CET
 * @author      Akki Scholze
 *
 * @usage
 *   import { buttonConfig } from '@/config/components/button.config';
 *   const styles = buttonConfig.variants.primary;
 *
 * @changelog
 *   0.1.0 - 2025-12-10 - Initial version
 */
```

#### JSON-Dateien (.json)

JSON unterstützt keine Kommentare. Stattdessen:

```json
{
  "_meta": {
    "file": "package.json",
    "description": "Projekt-Dependencies und Scripts",
    "version": "0.1.0",
    "created": "2025-12-10 23:48:36 CET",
    "updated": "2025-12-10 23:48:36 CET",
    "author": "Akki Scholze"
  },
  "name": "material-tracker",
  "version": "0.1.0"
}
```

**Hinweis:** Bei package.json ist `_meta` optional, da die Haupt-`version` als Referenz dient.

#### Markdown-Dateien (.md)

```markdown
# Titel der Datei

> **Datei:** pfad/dateiname.md
> **Version:** 0.1.0
> **Erstellt:** 2025-12-10 23:48:36 CET
> **Aktualisiert:** 2025-12-10 23:48:36 CET
> **Autor:** Akki Scholze

---

## Changelog

| Version | Datum | Änderung |
|---------|-------|----------|
| 0.1.0 | 2025-12-10 | Initial version |
```

#### CSS/SCSS-Dateien (.css, .scss)

```css
/**
 * @file        globals.css
 * @description Globale CSS-Styles
 * @version     0.1.0
 * @created     2025-12-10 23:48:36 CET
 * @updated     2025-12-10 23:48:36 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.0 - 2025-12-10 - Initial version
 */
```

#### SQL-Dateien (.sql)

```sql
-- @file        schema.sql
-- @description Datenbank-Schema für Material-Tracker
-- @version     0.1.0
-- @created     2025-12-10 23:48:36 CET
-- @updated     2025-12-10 23:48:36 CET
-- @author      Akki Scholze
--
-- @changelog
--   0.1.0 - 2025-12-10 - Initial version
```

### 0.2 Versionierung pro Datei

Jede Datei wird EINZELN versioniert. **Start-Version: 0.1.0**

| Änderungstyp   | Version-Bump           | Beispiel                   |
| --------------- | ---------------------- | -------------------------- |
| Breaking Change | MAJOR (0.1.0 → 1.0.0) | Interface geändert        |
| Neue Funktion   | MINOR (0.1.0 → 0.2.0) | Neue Variante hinzugefügt |
| Bugfix/Cleanup  | PATCH (0.1.0 → 0.1.1) | Typo korrigiert            |

**Hinweis:** Version 1.0.0 wird erst erreicht, wenn die Datei stabil und produktionsreif ist.

### 0.3 Workflow bei Dateiänderungen

**PFLICHT-REIHENFOLGE:**

1. **Systemzeit abfragen** → `date "+%Y-%m-%d %H:%M:%S %Z"`
2. **Header aktualisieren** → `@updated` mit neuer Zeit
3. **Version erhöhen** → entsprechend Änderungstyp
4. **Changelog ergänzen** → neue Version im Header-Changelog
5. **Code ändern** → die eigentliche Änderung
6. **Validieren** → Code prüfen

### 0.4 Gesamtprozess (Session → Commit)

1. **Startzeit dokumentieren**: `date "+%Y-%m-%d %H:%M:%S %Z"` in Terminal ausgeben.
2. **Pflichtlektüre**: `.codex` → `CLAUDE.md` → `docs/RULES.md` → `docs/CONFIG_REFERENCE.md` → `PROJECT_BRIEF.md` → `.github/copilot-instructions.md` → `TODO.md`.
3. **Source-of-Truth beachten**: Anforderungslogik nur aus `PROJECT_BRIEF.md`, Configuration ausschließlich via `config.toml` (anschließend `pnpm generate:config` ausführen).
4. **Dateien anfassen**: Vor jeder Änderung Header-Version/`@updated`/Changelog setzen, neue Dateien mit Version `0.1.0` beginnen.
5. **Begleitdokumente**: Bei Feature-/Workflow-Änderungen immer die zugehörigen Markdown-Dateien (`CLAUDE.md`, `TODO.md`, `.codex`, `.github`) synchron halten.
6. **Validierung**: Tests/Builds fahren (`pnpm test`, `pnpm build`) sowie Generatoren (`pnpm generate:config`, `pnpm generate:reference`) falls Config/Imports betroffen sind.
7. **Commit-Vorbereitung**: `git status` prüfen, sicherstellen dass nur relevante Dateien enthalten sind, Source-of-Truth synchron ist, alle Header korrekt.
8. **Commit**: Einheitliche Message `type: beschreibung` nutzen (z. B. `feat: unify schulden workflow`). Keine Commits ohne erfolgreiche Validierung.
9. **TODO.md aktualisieren** → Status auf ✅, Datum eintragen
10. **Task als erledigt markieren** → erst wenn alles korrekt

**Wichtig:** Ein Task gilt NICHT als erledigt, wenn:

- Der Header fehlt
- Die Version nicht aktualisiert wurde
- Der Zeitstempel nicht aktuell ist
- Das Changelog nicht ergänzt wurde
- Die TODO.md nicht aktualisiert wurde

### 0.4 TODO.md Pflege (PFLICHT)

Nach Abschluss einer Aufgabe MUSS die `TODO.md` aktualisiert werden:

1. **Status ändern:** ⬜ → ✅
2. **Erledigt-Datum eintragen:** YYYY-MM-DD
3. **Changelog ergänzen:** Am Ende der TODO.md

**Tabellenformat:**

```markdown
| Status | Aufgabe | Priorität | Erledigt |
|--------|---------|-----------|----------|
| ✅ | package.json erstellen | Hoch | 2025-12-10 |
| 🔄 | Dependencies installieren | Hoch | |
| ⬜ | tsconfig.json konfigurieren | Hoch | |
```

**Status-Symbole:**

| Symbol | Bedeutung      |
| ------ | -------------- |
| ⬜     | Offen          |
| 🔄     | In Bearbeitung |
| ✅     | Abgeschlossen  |
| ❌     | Abgebrochen    |
| ⏸️   | Pausiert       |

### 0.5 Zeitstempel-Format

**Format:** `YYYY-MM-DD HH:MM:SS TZ`
**Beispiel:** `2025-12-10 23:48:36 CET`

### 0.6 config.toml als Single Source

1. `config.toml` ist jetzt die zentrale Quelle für `app`, `permissions`, das Theme (colors/typography/spacing/breakpoints/borderRadius) und die Button-Config.
2. Nach jeder Änderung an `config.toml` → `pnpm run generate:config`, damit `src/config/generated/config-from-toml.ts` neu geschrieben wird und die tatsächlichen Module neu exportiert werden.
3. Die betroffenen `.config.ts`-Dateien (`app`, `permissions`, `theme/*`, `components/button`) importieren aus `./generated/config-from-toml` und müssen dadurch nicht mehr doppelte Werte halten.
4. Alle anderen Configs bleiben weiterhin manuell, aber neue zentrale Werte müssen zuerst in `config.toml`.

**Zeitzone:** Immer `Europe/Berlin` (CET/CEST)

### 0.7 CONFIG_REFERENCE Autogen

1. Nach strukturellen Änderungen (neue Dateien, neue Imports/Exports, neue Routen) → `pnpm run generate:reference`.
2. Das Script schreibt `docs/CONFIG_REFERENCE_AUTOGEN.json` **und** aktualisiert automatisch den Abschnitt „Auto-generated import/export mapping“ in `docs/CONFIG_REFERENCE.md`.
3. Manuelle Teile von `docs/CONFIG_REFERENCE.md` bleiben erhalten; nur der Autogen-Block wird ersetzt.

### 0.8 Responsive Vorbereitung (ab 2025-12-14)

- Desktop-Version gilt als stabil. **Ab sofort** sind alle größeren Änderungen auf Responsive-/Smartphone-Fähigkeit auszurichten.
- **Vorbereitungsschritte:** Breakpoint-Konzept definieren, Layout-Skizzen für Material/Kunden/Schulden erstellen, Navigation für Touch planen.
- **Pflicht-Tests:** Änderungen müssen auf ≥1280 px Desktop **und** ≤480 px Mobile geprüft werden (echtes Gerät empfohlen).
- **Dokumentation:** Ergebnisse in `TODO.md` (Phase 6+7) und `PROJECT_BRIEF.md` vermerken; ggf. Screenshots in `docs/` ablegen.

---

## 1. Oberste Prinzipien

| #  | Regel                                  | Beschreibung                                                             |
| -- | -------------------------------------- | ------------------------------------------------------------------------ |
| 1  | **100% Config-Driven**           | Keine Hardcodes in Komponenten. Alles aus Config-Dateien.                |
| 2  | **Single Source of Truth**       | Jeder Wert existiert nur an EINEM Ort.                                   |
| 3  | **TypeScript Strict Mode**       | Keine `any`, keine impliziten Typen.                                   |
| 4  | **Explizite Fehlerbehandlung**   | Try-Catch mit spezifischen Error-Messages.                               |
| 5  | **Modulare Trennung**            | Eine Datei = Eine Verantwortung.                                         |
| 6  | **Versionierte Dateien**         | Jede Datei mit Header und eigener Version (Start: 0.1.0).                |
| 7  | **Deutsche UI, Englischer Code** | Labels/Texte deutsch, Variablen/Funktionen englisch.                     |
| 8  | **Mobile-First Responsive**      | Erst Handy-Layout, dann Desktop erweitern.                               |
| 9  | **Keine Magic Numbers**          | Alle Zahlen (Spacing, Sizes, etc.) aus Config.                           |
| 10 | **Konsistente Benennung**        | camelCase Variablen, PascalCase Komponenten, SCREAMING_SNAKE Konstanten. |

---

## 2. Benennung

### 2.1 Variablen und Funktionen

```typescript
// camelCase für Variablen und Funktionen
const materialList = [];
const ekGesamt = calculateTotal();
function formatCurrency(value: number): string { }

// SCREAMING_SNAKE_CASE für Konstanten
const MAX_ITEMS = 100;
const DEFAULT_PAGE_SIZE = 20;
```

### 2.2 Komponenten und Types

```typescript
// PascalCase für Komponenten
function MaterialTable() { }
function Button() { }

// PascalCase für Types/Interfaces
interface MaterialData { }
type ButtonVariant = 'primary' | 'secondary';
```

### 2.3 Dateien

```
// Komponenten: PascalCase.tsx
Button.tsx
MaterialTable.tsx
PageLayout.tsx

// Config/Utils: kebab-case.config.ts / kebab-case.ts
button.config.ts
material.types.ts
format.ts

// Pages: PascalCase + Page.tsx
MaterialPage.tsx
KundenPage.tsx
```

---

## 3. Dateistruktur

### 3.1 Korrekte Struktur

```
src/components/ui/Button.tsx        // Komponente
src/config/components/button.config.ts  // Config dazu
src/types/button.types.ts           // Types dazu
```

### 3.2 Falsche Struktur

```
src/components/Button.tsx           // Config inline - FALSCH!
src/Button.tsx                      // Außerhalb components - FALSCH!
```

---

## 4. Import-Reihenfolge

```typescript
// 1. React/External
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Types
import type { ButtonConfig } from '@/types/button.types';
import type { MaterialData } from '@/types/material.types';

// 3. Config
import { buttonConfig } from '@/config/components/button.config';
import { colorsConfig } from '@/config/theme/colors.config';

// 4. Components
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';

// 5. Utils/Hooks
import { formatCurrency } from '@/utils/format';
import { useApi } from '@/hooks/useApi';
```

---

## 5. Komponenten-Struktur (Vollständiges Beispiel)

```typescript
/**
 * @file        Button.tsx
 * @description Wiederverwendbare Button-Komponente
 * @version     0.1.0
 * @created     2025-12-10 23:48:36 CET
 * @updated     2025-12-10 23:48:36 CET
 * @author      Akki Scholze
 *
 * @props
 *   variant - Button-Variante (primary, secondary, outline, ghost, danger, success, warning)
 *   size - Button-Größe (sm, md, lg, xl)
 *   onClick - Click-Handler
 *   disabled - Deaktiviert den Button
 *   children - Button-Inhalt
 *
 * @changelog
 *   0.1.0 - 2025-12-10 - Initial version
 */

// ═══════════════════════════════════════════════════════
// IMPORTS
// ═══════════════════════════════════════════════════════
import { useState } from 'react';

import type { ButtonProps } from '@/types/ui.types';

import { buttonConfig } from '@/config/components/button.config';

// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════
interface Props {
  variant: keyof typeof buttonConfig.variants;
  size?: keyof typeof buttonConfig.sizes;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

// ═══════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════
export function Button({
  variant,
  size = 'md',
  onClick,
  disabled = false,
  children
}: Props) {
  // Config
  const variantStyles = buttonConfig.variants[variant];
  const sizeStyles = buttonConfig.sizes[size];

  // State
  const [isLoading, setIsLoading] = useState(false);

  // Handlers
  const handleClick = () => {
    if (!isLoading && !disabled) {
      onClick();
    }
  };

  // Render
  return (
    <button
      onClick={handleClick}
      disabled={isLoading || disabled}
      style={{
        backgroundColor: variantStyles.bg,
        color: variantStyles.text,
        height: sizeStyles.height,
      }}
    >
      {children}
    </button>
  );
}
```

---

## 6. Config-Regeln

### 6.1 Config-Struktur

```typescript
/**
 * @file        button.config.ts
 * @description Konfiguration für Button-Komponente
 * @version     0.1.0
 * @created     2025-12-10 23:48:36 CET
 * @updated     2025-12-10 23:48:36 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.0 - 2025-12-10 - Initial version
 */

// Immer `as const` für Type-Safety
export const buttonConfig = {
  variants: {
    primary: { bg: 'neutral.50', bgHover: 'neutral.100', text: 'text.primary' },
    secondary: { bg: 'button.gray', bgHover: 'button.active', text: 'text.primary' },
  },
  sizes: {
    sm: { height: '36px', fontSize: 'sm', paddingX: 4 },
    md: { height: '44px', fontSize: 'base', paddingX: 5 },
  },
} as const;
```

### 6.2 Config-Zugriff

```typescript
// Richtig: Über Config-Key
const styles = buttonConfig.variants[variant];

// Falsch: Hardcoded Werte
const styles = { bg: '#3b82f6', text: '#ffffff' }; // NIEMALS!
```

### 6.3 Config-Export

```typescript
// src/config/index.ts
export { appConfig } from './app.config';
export { buttonConfig } from './components/button.config';
export { colorsConfig } from './theme/colors.config';
```

---

## 7. TypeScript-Regeln

### 7.1 Strict Mode

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 7.2 Keine `any`

```typescript
// Falsch
function process(data: any) { }

// Richtig
function process(data: MaterialData) { }
function process(data: unknown) { } // wenn Typ unbekannt
```

### 7.3 Explicit Return Types

```typescript
function formatCurrency(value: number): string {
  return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}
```

---

## 8. Fehlerbehandlung

```typescript
try {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return await response.json();
} catch (error) {
  if (error instanceof Error) {
    console.error(`API-Fehler: ${error.message}`);
    throw error;
  }
  throw new Error('Unbekannter Fehler');
}
```

---

## 9. Versionierung

### 9.1 Datei-Versionierung

- Jede Datei hat eigene Version im Header
- **Start: 0.1.0**
- Version 1.0.0 = produktionsreif

### 9.2 Projekt-Versionierung

- `MAJOR.MINOR.PATCH`
- Gepflegt in package.json und CHANGELOG.md

---

## 10. Lokalisierung

| Typ      | Format        | Beispiel    |
| -------- | ------------- | ----------- |
| Datum    | dd.MM.yyyy    | 10.12.2025  |
| Zeit     | HH:mm         | 14:30       |
| Währung | EUR mit Komma | 1.234,56 € |
| Zeitzone | Europe/Berlin | CET/CEST    |

---

## 11. Responsive Design

| Breakpoint | Min-Width | Gerät          |
| ---------- | --------- | --------------- |
| sm         | 640px     | Großes Handy   |
| md         | 768px     | Tablet          |
| lg         | 1024px    | Desktop         |
| xl         | 1280px    | Großer Desktop |

---

## 12. Git-Konventionen

```
feat: Neue Funktion
fix: Bugfix
refactor: Code-Verbesserung
docs: Dokumentation
style: Formatierung
```

---

## 13. Verbotene Praktiken

| Verboten                        | Stattdessen                               |
| ------------------------------- | ----------------------------------------- |
| `any` Type                    | Konkrete Types                            |
| Hardcoded Farben                | `colorsConfig`                          |
| Inline Styles ohne Config       | Config-Werte verwenden                    |
| Magic Numbers                   | `spacingConfig`, `borderRadiusConfig` |
| Datei ohne Header               | IMMER Header                              |
| Änderung ohne Zeitstempel      | IMMER Systemzeit abfragen                 |
| Version 1.0.0 bei neuen Dateien | Start mit 0.1.0                           |

---

## 14. Pflichtdateien nach Chat-Compacting

1. `CLAUDE.md`
2. `RULES.md` (diese Datei)
3. `CONFIG_REFERENCE.md`
4. `TODO.md`

---

## Changelog

| Version | Datum                   | Änderung                                                       |
| ------- | ----------------------- | --------------------------------------------------------------- |
| 0.6.0   | 2025-12-12 02:19:02 CET | config.toml generator workflow dokumentiert (Abschnitt 0.6)     |
| 0.4.0   | 2025-12-11 11:24:56 CET | Aktualisiert für SEASIDE Dark Theme, Button-Varianten ergänzt |
| 0.3.0   | 2025-12-11 00:04:59 CET | TODO.md Pflege-Regel hinzugefügt (Sektion 0.4)                 |
| 0.2.0   | 2025-12-10 23:58:24 CET | Version-Header aktualisiert                                     |
| 0.1.0   | 2025-12-10 23:48:36 CET | Initial version mit Header-Templates für alle Dateitypen       |
