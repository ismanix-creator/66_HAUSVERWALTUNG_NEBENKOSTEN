# Code-Review Checkliste

## Gegen .ai/rules.md prüfen

- [ ] Keine hardcodierten Strings für Labels
- [ ] Keine hardcodierten Feldnamen
- [ ] Alle Validierung aus TOML
- [ ] Keine Magic Numbers (Konstanten in app.config.toml)
- [ ] Labels über `labels.{bereich}.{key}` referenziert

## Gegen .ai/conventions.md prüfen

- [ ] TypeScript strict mode eingehalten
- [ ] Keine `any` verwendet
- [ ] Naming-Konventionen befolgt (camelCase, PascalCase, etc.)
- [ ] Import-Reihenfolge korrekt
- [ ] Funktionale React-Komponenten

## Gegen .ai/architecture.md prüfen

- [ ] Kein Schreibzugriff in Mobile-Routes
- [ ] SQLite-Transaktionen korrekt verwendet
- [ ] Config-Service für TOML-Zugriff verwendet
- [ ] Fehlerbehandlung einheitlich

## Code-Qualität

- [ ] Keine ungenutzten Imports/Variablen
- [ ] Keine auskommentierten Code-Blöcke
- [ ] Sinnvolle Funktions-/Variablennamen
- [ ] Komplexe Logik kommentiert

## Sicherheit

- [ ] Prepared Statements für SQL
- [ ] Input-Validierung vorhanden
- [ ] Keine sensiblen Daten im Code/Logs
- [ ] File-Upload mit MIME-Type-Prüfung

## Performance

- [ ] Keine N+1 Queries
- [ ] Lazy Loading wo sinnvoll
- [ ] Keine unnötigen Re-Renders (React)
