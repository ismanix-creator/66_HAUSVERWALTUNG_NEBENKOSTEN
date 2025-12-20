# 20_CONFIG_DRIVEN – Config-Driven Regeln

7. Das Projekt ist zu 100 % config-driven zu betreiben.
8. Die zentrale fachliche Quelle ist `config/config.toml`.
9. Business-Logik darf niemals im Code implementiert werden.
10. Code liest, interpretiert und rendert; er trifft keine fachlichen Entscheidungen.
11. Fachliche Änderungen erfolgen ausschließlich über die Konfiguration.
12. Codeänderungen ohne passende Config-Anpassung sind Ausnahmefälle.
13. Hardcodierte Feldnamen, Defaults, Fristen oder Labels sind verboten.
14. Abgeleitete Dateien sind nicht die Source of Truth.
15. Manuelle Änderungen an generierten Artefakten sind untersagt.

## Zusätzliche Config-Driven Regeln

16. **Keine Magic Numbers**: Alle Konstanten in `config/app.config.toml`.
   - Beispiele: `kuendigungsfrist_monate = 3`, `kaution_monate = 3`, `nk_abrechnungsfrist_monate = 12`.

17. **Entity-Änderungen**: Bei Änderungen an Entities:
   1. `config/entities/{name}.config.toml` ändern
   2. `config/forms/{name}.form.toml` bei Bedarf anpassen
   3. `config/tables/{name}.table.toml` bei Bedarf anpassen
   4. **Code bleibt unverändert** - der generische Service liest die Config

18. **Labels und Texte**: **ALLE** UI-Texte kommen aus `config/labels/de.labels.toml`.
   - Keine hardcodierten deutschen Strings im Code
   - Format: `labels.{bereich}.{schluessel}`
   - Beispiel: `labels.entity.mieter`, `labels.actions.speichern`

19. **Validierung**: Validierungsregeln werden in Entity-Configs definiert.
   - Server und Client nutzen dieselben Regeln
   - Zod-Schemas werden aus TOML generiert

20. **Dateibenennungen**:
   | Typ | Schema | Beispiel |
   |-----|--------|----------|
   | Entity-Config | `{name}.config.toml` | `mieter.config.toml` |
   | View-Config | `{name}.config.toml` | `dashboard.config.toml` |
   | Form-Config | `{name}.form.toml` | `vertrag.form.toml` |
   | Table-Config | `{name}.table.toml` | `objekte.table.toml` |
   | Katalog | `{name}.catalog.toml` | `kostenarten.catalog.toml` |

21. **API-Design**:
   - REST-Endpunkte: `/api/{entity}` (Plural)
   - CRUD: GET (Liste), GET/:id, POST, PUT/:id, DELETE/:id
   - Config-Endpunkte: `/api/config/{typ}/{name}`
   - Alle Responses als JSON

22. **Fehlerbehandlung**:
   - Einheitliches Error-Format: `{ error: { message, code, details? } }`
   - HTTP-Statuscodes konsequent nutzen
   - Validierungsfehler: 400, Nicht gefunden: 404, Server: 500

23. **Mobile Read-Only**:
   - Mobile-Routen unter `/mobile/...`
   - Server blockiert POST/PUT/DELETE für Mobile
   - UI zeigt keine Schreib-Aktionen auf Mobile

Datei .kilocode/rules/20_CONFIG_DRIVEN.md vollständig erstellt.
