# Implementierungs-Workflow

## 1. Kontext verstehen

- Lies `.ai/rules.md` für Projektregeln
- Lies `.ai/architecture.md` für Architektur
- Prüfe relevante existierende Configs

## 2. Bei neuer Entity

```bash
# 1. Entity-Config erstellen
config/entities/{name}.config.toml

# 2. Form-Config erstellen
config/forms/{name}.form.toml

# 3. Table-Config erstellen
config/tables/{name}.table.toml

# 4. Labels hinzufügen
config/labels/de.labels.toml

# 5. TypeScript-Interface
src/shared/types/entities.ts
```

## 3. Bei neuem Feature

1. Prüfe ob TOML-Config-Änderung ausreicht
2. Wenn Code nötig: Generisch implementieren
3. Labels nicht vergessen

## 4. Validierung vor Commit

- [ ] Keine hardcodierten Strings für Labels
- [ ] Keine hardcodierten Feldnamen
- [ ] Alle Validierung aus TOML
- [ ] TypeScript kompiliert fehlerfrei (`npm run typecheck`)
- [ ] ESLint ohne Fehler (`npm run lint`)

## 5. Beispiel: Neues Feld hinzufügen

**Aufgabe:** Feld `kaution_status` zu Vertrag hinzufügen

```toml
# config/entities/vertrag.config.toml
[entity.fields.kaution_status]
type = "enum"
options = ["offen", "eingegangen", "ausgezahlt"]
default = "offen"
label = "labels.vertrag.kaution_status"
```

```toml
# config/labels/de.labels.toml
[labels.vertrag]
kaution_status = "Kautionsstatus"
```

**Kein Code ändern!** Der generische Service liest die neue Config automatisch.
