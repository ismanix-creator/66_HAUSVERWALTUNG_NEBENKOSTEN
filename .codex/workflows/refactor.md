# Refactoring-Workflow

## 1. Vor dem Refactoring

- Verstehe den existierenden Code vollständig
- Identifiziere alle betroffenen Dateien
- Prüfe ob Tests existieren

## 2. Refactoring-Typen

### Config-Refactoring (bevorzugt)

Wenn möglich, Änderungen nur in TOML:
- Feld umbenennen → Entity-Config ändern + Labels
- Validierung ändern → Entity-Config ändern
- UI-Anpassung → View/Form/Table-Config ändern

### Code-Refactoring

Nur wenn TOML nicht ausreicht:
- Generische Services erweitern
- Neue Utility-Funktionen
- Komponenten-Struktur

## 3. Schritte

1. **Backup**: Sicherstellen dass Git-Status sauber
2. **Kleine Schritte**: Eine Änderung nach der anderen
3. **Testen**: Nach jedem Schritt `npm run typecheck`
4. **Commit**: Kleine, atomare Commits

## 4. Checkliste

- [ ] Keine Breaking Changes in APIs
- [ ] Alle Imports angepasst
- [ ] TypeScript fehlerfrei
- [ ] ESLint fehlerfrei
- [ ] Keine hardcodierten Werte eingeführt
