[Root-Verzeichnis](../../CLAUDE.md) > [src](../) > **server**

# Server-Modul - Express Backend

## Änderungsprotokoll

| Datum | Version | Änderungen |
|-------|---------|------------|
| 2025-12-16 | 1.0.0 | Initiale Modul-Dokumentation |

## Modul-Verantwortlichkeiten

Das Server-Modul ist die Express-basierte Backend-Anwendung der Mietverwaltung. Es stellt REST-APIs bereit, lädt TOML-Konfigurationen und verwaltet die SQLite-Datenbank.

**Kernaufgaben:**
- REST-API für CRUD-Operationen
- TOML-Config-Loading und Caching
- SQLite-Datenbank-Zugriff (WAL-Modus)
- Config-basierte Validierung
- Error Handling und Logging

## Einstieg und Start

### Entry Point

**Datei:** `src/server/index.ts`

```typescript
// Express App initialisieren
// Middleware (JSON, URL-encoded)
// API Routes unter /api
// Error Handling Middleware
// Server starten auf Port 3001
```

**Wichtige Middleware:**
- `express.json()` - JSON Body Parsing
- `express.urlencoded({ extended: true })` - Form Data
- `errorMiddleware` - Zentrales Error Handling

**Health Check:** `GET /health` → `{ status: 'ok', timestamp: '...' }`

### Server-Start

```bash
npm run dev:server  # Mit tsx watch (Hot Reload)
# oder
node dist/server/index.js  # Production Build
```

## Externe Schnittstellen

### REST API Endpoints

**Config-Endpunkte:**
```
GET /api/config/app                - App-Konfiguration
GET /api/config/navigation         - Navigation-Menü
GET /api/config/entity/:name       - Entity-Schema
```

**Entity-CRUD (geplant Phase 1):**
```
GET    /api/:entity                - Liste (mit Query-Params für Filter/Sortierung)
GET    /api/:entity/:id            - Einzelner Eintrag
POST   /api/:entity                - Neuen Eintrag erstellen
PUT    /api/:entity/:id            - Eintrag aktualisieren
DELETE /api/:entity/:id            - Eintrag löschen
```

**Response-Format:**
```json
{
  "data": { ... },           // Erfolg
  "error": {                 // Fehler
    "message": "...",
    "code": "...",
    "details": { ... }
  }
}
```

### SQLite-Datenbank

**Datei:** `data/database.sqlite` (nicht in Git)

**Konfiguration:**
- WAL-Modus (Write-Ahead Logging) für bessere Concurrency
- Foreign Keys aktiviert
- Prepared Statements (SQL-Injection-Schutz)

**Schema-Management:**
- Initiales Schema: `scripts/init-db.ts` (geplant)
- Migrationen: `scripts/migrate.ts` (geplant)
- Backup: `scripts/backup.ts` (geplant)

## Wichtige Abhängigkeiten und Konfiguration

### Haupt-Dependencies

```json
{
  "express": "^4.21.0",
  "better-sqlite3": "^11.5.0",
  "@iarna/toml": "^2.2.5",
  "zod": "^3.23.8",
  "uuid": "^10.0.0",
  "date-fns": "^4.1.0"
}
```

### Konfiguration

**Port:** 3001 (default, überschreibbar via `process.env.PORT`)

**Config-Verzeichnis:** `config/` (relativ zum Projektroot)
- Wird vom ConfigService geladen
- Caching für Performance
- Hot-Reload in Development (geplant)

**Daten-Verzeichnis:** `data/`
- SQLite-Datenbank
- Hochgeladene Dokumente (später)
- Backups

## Datenmodelle

### Entity-Typen

**Importiert aus Shared:**
```typescript
import type {
  Objekt,
  Einheit,
  Mieter,
  Vertrag,
  // ... alle 17 Entities
} from '@shared/types/entities'
```

### Config-Schema

**Config-Typen aus Shared:**
```typescript
import type {
  AppConfig,
  EntityConfig,
  FormConfig,
  TableConfig,
  ViewConfig
} from '@shared/types/config'
```

### Validierung

**Zod-Schemas (geplant Phase 1):**
- Zod-Schemas werden **aus EntityConfig generiert**
- Validierung auf Server-Seite gegen Config
- Fehler-Messages aus Config

```typescript
// Beispiel (geplant):
const objektSchema = generateZodSchema(entityConfig)
const validatedData = objektSchema.parse(req.body)
```

## Services

### ConfigService

**Datei:** `src/server/services/config.service.ts`

**Verantwortlichkeiten:**
- TOML-Dateien aus `config/` laden
- In-Memory-Caching für Performance
- Typsichere Config-Rückgabe

**Methoden:**
```typescript
configService.getAppConfig()           // app.config.toml
configService.getNavigationConfig()    // navigation.config.toml
configService.getEntityConfig(name)    // entities/{name}.config.toml
configService.getViewConfig(name)      // views/{name}.config.toml
configService.getFormConfig(name)      // forms/{name}.form.toml
configService.getTableConfig(name)     // tables/{name}.table.toml
configService.clearCache()             // Cache löschen
```

**Cache-Strategie:**
- Config-Dateien werden beim ersten Laden gecacht
- In Development: Cache bei Bedarf löschen
- In Production: Cache persistent bis Server-Neustart

### DatabaseService

**Datei:** `src/server/services/database.service.ts`

**Verantwortlichkeiten:**
- SQLite-Verbindung initialisieren
- Prepared Statements ausführen
- Transaktionen verwalten

**Methoden:**
```typescript
databaseService.initialize()          // DB initialisieren
databaseService.getDb()               // DB-Instanz abrufen
databaseService.run(sql, params)      // Single Statement
databaseService.get<T>(sql, params)   // Single Row
databaseService.all<T>(sql, params)   // All Rows
databaseService.transaction(fn)       // Transaktion
databaseService.close()               // Verbindung schließen
```

**Sicherheit:**
- Immer Prepared Statements (SQL-Injection-Schutz)
- Foreign Keys aktiviert
- WAL-Modus für Concurrency

### GenericEntityService (geplant Phase 1)

**Datei:** `src/server/services/entity.service.ts` (geplant)

**Verantwortlichkeiten:**
- CRUD-Operationen für beliebige Entities
- SQL-Generierung aus EntityConfig
- Validierung gegen EntityConfig
- Relationen auflösen

**Methoden (geplant):**
```typescript
entityService.list(entityName, filters, sort)
entityService.get(entityName, id)
entityService.create(entityName, data)
entityService.update(entityName, id, data)
entityService.delete(entityName, id)
```

## Routen und Middleware

### API Routes

**Datei:** `src/server/routes/api.routes.ts`

**Aktuell implementiert:**
- Config-Endpunkte (app, navigation, entity)

**Geplant Phase 1:**
- Generic Entity CRUD Routes
- Query-Parameter für Filterung/Sortierung
- Pagination-Support

### Error Middleware

**Datei:** `src/server/middleware/error.middleware.ts`

**Verantwortlichkeiten:**
- Zentrale Error Handling
- Fehler-Logging
- Einheitliches Error-Format

**Error-Format:**
```json
{
  "error": {
    "message": "Fehlerbeschreibung",
    "code": "ERROR_CODE",
    "details": { /* optional */ }
  }
}
```

**HTTP-Status-Codes:**
- 400: Bad Request (Validierungsfehler)
- 404: Not Found (Entity nicht gefunden)
- 409: Conflict (z.B. Unique Constraint)
- 500: Internal Server Error

### Weitere Middleware (geplant)

- **Auth Middleware** (später): JWT-Validierung
- **Rate Limiting** (später): DDoS-Schutz
- **Request Logging** (später): Access-Logs
- **Mobile Read-Only** (Phase 3): POST/PUT/DELETE für Mobile blockieren

## Testen und Qualität

### Test-Strategie (Phase 2)

```
server/
├── routes/
│   └── api.routes.test.ts          - API Integration Tests
├── services/
│   ├── config.service.test.ts      - Unit Tests
│   ├── database.service.test.ts    - Unit Tests
│   └── entity.service.test.ts      - Unit Tests (geplant)
└── middleware/
    └── error.middleware.test.ts    - Unit Tests
```

**Test-Tools:**
- Vitest für Unit-Tests
- Supertest für API-Integration-Tests
- In-Memory SQLite für Test-DB

### Code-Qualität

```bash
npm run lint       # ESLint (TypeScript)
npm run typecheck  # TypeScript Strict Mode
npm run format     # Prettier
```

## Häufig gestellte Fragen (FAQ)

**F: Wie füge ich einen neuen API-Endpunkt hinzu?**
A:
1. Für neue Entity: Kein Code nötig! EntityConfig erstellen.
2. Für Custom-Endpunkt: Route in `routes/api.routes.ts` hinzufügen.

**F: Wie ändere ich das Datenbankschema?**
A:
1. EntityConfig in `config/entities/` anpassen
2. Migration-Script erstellen (geplant)
3. `npm run db:migrate` ausführen

**F: Wie funktioniert Config-Caching?**
A: TOML-Dateien werden beim ersten Laden gecacht. In Development kann Cache mit `configService.clearCache()` gelöscht werden.

**F: Wie validiere ich Daten gegen die Config?**
A: Zod-Schema wird aus EntityConfig generiert (geplant Phase 1). Dann: `schema.parse(data)`.

**F: Wie führe ich Transaktionen aus?**
A:
```typescript
databaseService.transaction(() => {
  // Mehrere DB-Operationen hier
  databaseService.run(sql1, params1)
  databaseService.run(sql2, params2)
})
```

## Verwandte Dateiliste

### Core

- `index.ts` - Server Entry Point, Express Setup
- `routes/api.routes.ts` - API-Routen-Definitionen
- `middleware/error.middleware.ts` - Error Handling

### Services

- `services/config.service.ts` - TOML-Config-Loading
- `services/database.service.ts` - SQLite-Datenbankzugriff

**Geplant:**
- `services/entity.service.ts` - Generic CRUD Service
- `services/validation.service.ts` - Zod-Schema-Generierung
- `services/relation.service.ts` - Entity-Relationen auflösen

### Middleware (geplant)

- `middleware/auth.middleware.ts` - JWT-Authentifizierung
- `middleware/mobile.middleware.ts` - Mobile Read-Only-Schutz
- `middleware/logging.middleware.ts` - Request-Logging

### Utilities (geplant)

- `utils/sql-generator.ts` - SQL aus EntityConfig generieren
- `utils/schema-generator.ts` - Zod-Schema aus EntityConfig
- `utils/query-builder.ts` - Query-Parameter zu SQL

## Nächste Entwicklungsschritte

### Phase 1: Generic CRUD System

1. **EntityService** implementieren
   - SQL-Generierung aus EntityConfig
   - CRUD-Operationen für beliebige Entities
   - Validierung gegen Config

2. **Generic CRUD Routes** hinzufügen
   - `GET /api/:entity` mit Filterung/Sortierung
   - `POST /api/:entity` mit Validierung
   - `PUT /api/:entity/:id`
   - `DELETE /api/:entity/:id`

3. **Zod-Schema-Generierung** aus EntityConfig
   - FieldType → Zod-Type Mapping
   - Validierungsregeln aus Config
   - Custom Error Messages

### Phase 2: Erweiterte Features

1. **Relationen auflösen**
   - `include` Query-Parameter
   - Nested Entity Loading
   - Computed Fields berechnen

2. **Datenbankschema-Management**
   - `init-db.ts` Script
   - Migration-System
   - Backup/Restore

3. **Testing**
   - API Integration Tests
   - Service Unit Tests
   - Mock-Datenbank

### Phase 3: Produktionsreife

1. **Authentifizierung**
   - JWT-basiertes Auth (optional für privat)
   - Mobile Read-Only Enforcement

2. **Performance**
   - Query-Optimierung
   - Connection Pooling (falls nötig)
   - Response-Caching

3. **Monitoring & Logging**
   - Access-Logs
   - Error-Tracking
   - Performance-Metriken

---

**Zuletzt aktualisiert:** 2025-12-16 01:14:58 CET
**Modul-Status:** Grundstruktur vorhanden, Phase 1 in Arbeit
