# Plan zur Konsolidierung der TOML-Konfiguration in `config/config.toml`

## 1. Ziel des Refactorings

- **Einzige Quelle der Wahrheit** – Alle Konfigurationsinformationen (Navigation, Entities, Views, Formulare, Tabellen, Kataloge, Labels, Design, Validierungsregeln) sollen in einer Datei `config/config.toml` liegen. Das Import-System entfällt, externe `.config.toml`-Dateien werden nicht mehr benötigt.
- **Vereinfachung für kleine bis mittlere Projekte** – Das bisherige Modell mit hunderten TOML-Dateien ist für ein Einzelprojekt überdimensioniert. Die Umstellung folgt dem Prinzip aus Abschnitt „A) Ein config.toml als Root“, sodass eine Datei die zentrale Wahrheit darstellt.
- **Weniger Parsing, weniger Drift** – Nur eine Datei wird geladen; Ladezeit und Fehlerrisiken sinken.

## 2. Aktueller Zustand

### 2.1 Struktureller Überblick

- `config/config.toml` ist Master-Datei mit Metadaten, Server-/Datenbank-Settings, Navigation, Routen etc. und `imports`-Sektion (Labels, Catalogs, Entities, Views, Forms, Tables, Validation, Design, Feature-Flags).
- `ConfigLoaderService` lädt Master, liest `imports`, parst jede Datei, setzt Defaults, validiert via Zod, stellt Getter bereit.
- Zod-Schemas definieren Struktur (Meta, App, Server, Database, Navigation, Entities, Views, Forms, Tables, Catalogs, Labels, Validation, Design).
- Frontend-Hooks (`useConfig`, `useTableConfig`, `useFormConfig`) greifen per Strings (z. B. `mieter.table`) auf importierte Dateien zu.

### 2.2 Importierte Dateien

1. **Entities** – `config/entities/*.config.toml`
2. **Forms** – `config/forms/*.form.toml`
3. **Tables** – `config/tables/*.table.toml`
4. **Views** – `config/views/*.config.toml`
5. **Kataloge** – `config/catalogs/*.catalog.toml`
6. **Labels** – `labels/de.labels.toml`
7. **Validierungen** – `validation/rules.config.toml`
8. **Design** – `themes/design-system.config.toml`

### 2.3 Herausforderungen

- Hohe Komplexität, viele Dateien.
- Duplikate (Navigation in `config/config.toml` und `config/navigation.config.toml`).
- Parse-Aufwand beim Start hoch.

## 3. Gesamtstrategie zur Konsolidierung

1. `imports` entfernen; Inhalte direkt in `config/config.toml`.
2. Neue Sektionen definieren: `[labels]`, `[catalogs.<name>]`, `[entities.<entity>]`, `[forms.<id>]`, `[tables.<id>]`, `[views.<id>]`, `[validation]`, `[design]`.
3. Schlüssel nach Dateinamen wählen (z. B. `[forms.mieter]`).
4. Schemas/Loader anpassen: MasterConfig enthält neue Keys, Loader liest nur noch Master, Getter liefern Sektionen.
5. Hooks/Services refactoren: Zugriff auf Objektstrukturen statt Dateipfade.
6. Schrittweise Migration mit Tests.

## 4. Migrationsschritte

### 4.1 Vorbereitung

1. Backup von `config/`.
2. Grundstruktur am Ende von `config/config.toml` ergänzen:
   ```
   [labels]
   [catalogs]
   [entities]
   [forms]
   [tables]
   [views]
   [validation]
   [design]
   ```
3. `imports`-Sektion entfernen.

### 4.2 Labels

1. Inhalt von `labels/de.labels.toml` unter `[labels]` einfügen.
2. Struktur bleibt gleich; Datei kann gelöscht/als deprecated markiert werden.

### 4.3 Kataloge

1. Jede Datei in `config/catalogs/` -> `[catalogs.<name>]`.
2. Keys entsprechen Dateinamen ohne Endung (z. B. `[catalogs.umlageschluessel]`).

### 4.4 Entities

1. Jede Entity nach `[entities.<entity>]` verschieben (ohne äußere `[entity]`-Klammer).
2. Validierungssektionen mitnehmen.
3. Alte Dateien entfernen oder kennzeichnen.

### 4.5 Forms

1. `[forms.<id>]` anlegen, äußere `[form]` entfernen.
2. Sections, Actions, `on_save` bleiben.

### 4.6 Tables

1. `[tables.<id>]` definieren, äußere `[table]` entfernen.
2. Row-Actions als `[tables.<id>.row_actions]`.

### 4.7 Views

1. `[views.<id>]` – Inhalte ohne `[view]`.
2. Tabs/Widgets/Aktionen bleiben.

### 4.8 Validation

1. Kompletten Inhalt von `validation/rules.config.toml` unter `[validation]`.
2. Konflikte zwischen globalen und Entity-Regeln prüfen.

### 4.9 Design

1. `[design]` mit Inhalt aus `themes/design-system.config.toml`.
2. Struktur nach Bedarf in `colors`, `typography`, `components`.

### 4.10 Aufräumen

1. Alte Dateien löschen oder mit Hinweis versehen.
2. Loader anpassen.
3. CI/CD-Skripte aktualisieren.

## 5. Änderungen am Config-Loader und Schemas

### 5.1 Loader

1. Importlogik entfernen; nur `config/config.toml` laden.
2. Neue Getter (`getLabels`, `getCatalogs`, …).
3. Cache behalten; ENV-Overrides weiterhin anwenden.

### 5.2 Zod-Schemas

1. `ImportsSchema` entfernen.
2. Neue Schemas für `labels`, `catalogs`, `entities`, `forms`, `tables`, `views`, `validation`, `design`.
3. MasterConfigSchema anpassen.

## 6. Code-Anpassungen

### 6.1 Backend

1. Services (Config, Validation, Entity) auf neue Getter umstellen.
2. Router liefert Daten aus `config.views`.
3. Schema-Generator liest `config.entities`.
4. Validierungsdienst kombiniert `config.validation` und `config.entities.<entity>.validation`.

### 6.2 Frontend

1. Hooks (`useConfig`, etc.) greifen auf Objekte (`config.tables.mieter`) zu.
2. Generische Renderer (DataTable, DynamicForm) nutzen neue Struktur.
3. Navigation bleibt, da bereits in Master definiert.
4. Optional alle Configs beim App-Start laden.

## 7. Beispielstruktur

```toml
[app]
name = "Mietverwaltung"
version = "1.0.0"

[navigation]
default_route = "/dashboard"
[[navigation.items]]
id = "dashboard"
...

[labels.common]
save = "Speichern"

[catalogs.status]
aktiv = { label = "Aktiv" }

[entities.mieter]
table_name = "mieter"
[entities.mieter.fields]
id = { type = "uuid", auto_generate = true }

[forms.mieter]
entity = "mieter"
[[forms.mieter.sections]]
...

[tables.mieter]
entity = "mieter"

[views.mieter]
layout = "list_detail"

[validation.patterns.email]
pattern = "..."

[design.colors]
primary = "#1f2937"
```

## 8. Risiken und Empfehlungen

| Risiko | Beschreibung | Empfehlung |
| --- | --- | --- |
| Große Datei | Mehrere tausend Zeilen | Kommentare, Code-Folding |
| Merge-Konflikte | Viele Änderungen am selben File | Häufige Commits, klare Abschnitte |
| Weniger Modularität | Teams verlieren Eigenständigkeit | Für Einzelprojekt ok; ggf. später Modularität zurückbringen |
| Kopierfehler | Keys/Klammern falsch | Schrittweise Migration mit Tests, Skripte |
| String-Verweise | `mieter.table` im Code | Refactoring auf Objektzugriffe |
| Validierungslogik | Konflikte global vs. Entity | Eindeutige Namespaces, Tests |

## 9. Nächste Schritte

1. Branch `config-single-source` erstellen.
2. Konsolidierung gemäß Abschnitt 4 durchführen (Labels, Kataloge, Entities, …).
3. Loader/Schemas refactoren und testen.
4. Frontend/Backend refactoren (String-Referenzen entfernen).
5. Alte Dateien entfernen/kennzeichnen; Doku aktualisieren.
6. Review, Tests, Merge.

## Zusammenfassung

Das Refactoring beschreibt, wie alle TOML-Dateien in `config/config.toml` zusammengeführt werden. Jede ehemalige Datei entspricht einem Unterabschnitt. Loader und Hooks greifen künftig direkt auf das zentrale Objekt zu. Ziel ist weniger Drift, schnelleres Laden und bessere Übersicht für kleine Projekte.

## Quellen (Referenzen)

1. `src/shared/config/schemas.ts`  
2. `config/config.toml`  
3. `src/server/services/config-loader.service.ts`  
4. `config/entities/mieter.config.toml`  
5. `config/entities/vertrag.config.toml`  
6. `config/entities/zahlung.config.toml`  
7. `config/forms/mieter.form.toml`  
8. `config/forms/vertrag.form.toml`  
9. `config/tables/mieter.table.toml`  
10. `config/tables/vertraege.table.toml`  
11. `config/views/mieter.config.toml`  
12. `config/views/nebenkosten.config.toml`  
13. `config/catalogs/status.catalog.toml`  
14. `config/labels/de.labels.toml`  
15. `config/validation/rules.config.toml`
