# Projektregeln - Mietverwaltung

## 1. 100% Config-Driven

- **ALLE** Business-Logik wird in TOML-Dateien definiert
- **KEINE** hardcodierten Feldnamen, Labels oder Validierungsregeln im Code
- Code ist generisch und liest alles aus `config/`
- Änderungen an der Business-Logik = TOML editieren, nicht Code ändern

## 2. Keine Magic Numbers

- Alle Konstanten in `config/app.config.toml`
- Beispiele:
  - `kuendigungsfrist_monate = 3`
  - `kaution_monate = 3`
  - `nk_abrechnungsfrist_monate = 12`

## 3. Entity-Änderungen

Bei Änderungen an Entities:
1. `config/entities/{name}.config.toml` ändern
2. `config/forms/{name}.form.toml` bei Bedarf anpassen
3. `config/tables/{name}.table.toml` bei Bedarf anpassen
4. **Code bleibt unverändert** - der generische Service liest die Config

## 4. Labels und Texte

- **ALLE** UI-Texte kommen aus `config/labels/de.labels.toml`
- Keine hardcodierten deutschen Strings im Code
- Format: `labels.{bereich}.{schluessel}`
- Beispiel: `labels.entity.mieter`, `labels.actions.speichern`

## 5. Validierung

- Validierungsregeln werden in Entity-Configs definiert
- Server und Client nutzen dieselben Regeln
- Zod-Schemas werden aus TOML generiert

## 6. Dateibenennungen

| Typ | Schema | Beispiel |
|-----|--------|----------|
| Entity-Config | `{name}.config.toml` | `mieter.config.toml` |
| View-Config | `{name}.config.toml` | `dashboard.config.toml` |
| Form-Config | `{name}.form.toml` | `vertrag.form.toml` |
| Table-Config | `{name}.table.toml` | `objekte.table.toml` |
| Katalog | `{name}.catalog.toml` | `kostenarten.catalog.toml` |

## 7. API-Design

- REST-Endpunkte: `/api/{entity}` (Plural)
- CRUD: GET (Liste), GET/:id, POST, PUT/:id, DELETE/:id
- Config-Endpunkte: `/api/config/{typ}/{name}`
- Alle Responses als JSON

## 8. Fehlerbehandlung

- Einheitliches Error-Format: `{ error: { message, code, details? } }`
- HTTP-Statuscodes konsequent nutzen
- Validierungsfehler: 400, Nicht gefunden: 404, Server: 500

## 9. Mobile Read-Only

- Mobile-Routen unter `/mobile/...`
- Server blockiert POST/PUT/DELETE für Mobile
- UI zeigt keine Schreib-Aktionen auf Mobile
