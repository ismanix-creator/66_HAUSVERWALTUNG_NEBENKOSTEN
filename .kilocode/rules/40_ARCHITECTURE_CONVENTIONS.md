# 40_ARCHITECTURE_CONVENTIONS – Architektur & Code-Konventionen

21. Konfiguration, Implementierung und Fachlichkeit sind strikt zu trennen.
22. Die Ordnerstruktur darf nicht vermischt werden.
23. Code enthält keine Fachbegriffe oder Domänenlogik.
24. UI, API und Validierung lesen dasselbe Modell.
25. Architekturentscheidungen sind zu dokumentieren, nicht implizit vorzunehmen.

## Code-Konventionen

### TypeScript
- **Strict Mode** aktiviert
- Explizite Typen für Funktionsparameter und Rückgabewerte
- `interface` für Objekte, `type` für Unions/Primitives
- Keine `any` - stattdessen `unknown` und Type Guards

### Naming
| Element | Konvention | Beispiel |
|---------|------------|----------|
| Dateien (Komponenten) | PascalCase | `DashboardPage.tsx` |
| Dateien (Services) | kebab-case | `config.service.ts` |
| Variablen | camelCase | `mieterListe` |
| Konstanten | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE` |
| Typen/Interfaces | PascalCase | `MieterConfig` |
| TOML-Keys | snake_case | `kalt_miete` |
| CSS-Klassen | kebab-case (Tailwind) | `text-gray-500` |

### React
- Funktionale Komponenten mit Hooks
- Props-Interface direkt über der Komponente
- Custom Hooks in `hooks/` mit `use`-Prefix
- Keine inline-Styles, nur Tailwind-Klassen

```tsx
interface StatsCardProps {
  title: string
  value: number
}

export function StatsCard({ title, value }: StatsCardProps) {
  return (...)
}
```

### Imports
Reihenfolge:
1. React/externe Libraries
2. Interne absolute Imports (`@/`, `@shared/`)
3. Relative Imports
4. Styles

```tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { configService } from '@/services/config.service'
import type { Mieter } from '@shared/types'

import { Button } from '../common/Button'
```

### API-Calls
- Alle Fetch-Calls über `api.service.ts`
- React Query für Caching und State
- Error Handling mit try/catch

### Kommentare
- JSDoc für exportierte Funktionen
- Inline-Kommentare nur bei komplexer Logik
- TODOs mit Ticket/Issue-Referenz

### Git
- Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`
- Keine Commits von `data/`, `node_modules/`, `.env`

Datei .kilocode/rules/40_ARCHITECTURE_CONVENTIONS.md vollständig erstellt.
