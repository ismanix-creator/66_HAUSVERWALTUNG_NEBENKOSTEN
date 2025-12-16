# Planungs-Guidelines

## Feature-Planung

### 1. Anforderung verstehen

- Was soll erreicht werden?
- Welche Entities sind betroffen?
- Welche Views/Forms brauchen Änderungen?

### 2. Config vs. Code

**Prüfe zuerst ob TOML-Änderung ausreicht:**

| Änderung | Lösung |
|----------|--------|
| Neues Feld | Entity-Config + Labels |
| Neue Validierung | Entity-Config |
| Neue Spalte in Tabelle | Table-Config |
| Neues Formularfeld | Form-Config |
| Neuer Menüpunkt | Navigation-Config |

**Code nur wenn nötig:**
- Neue Berechnungslogik
- Neue API-Endpunkte (über CRUD hinaus)
- Neue UI-Komponenten-Typen

### 3. Implementierungsplan erstellen

1. Betroffene Dateien auflisten
2. Reihenfolge festlegen (Dependencies beachten)
3. Testplan definieren

### 4. Architektur-Entscheidungen

Bei größeren Features:
- Passt es zur bestehenden Architektur?
- Bleibt es config-driven?
- Ist es erweiterbar?

## Beispiel: Neues Feature planen

**Feature:** Mahnwesen für offene Posten

**Analyse:**
1. Entity: Neue `mahnung` Entity? Oder Erweiterung von `sollstellung`?
2. View: Neuer Tab in Finanzen oder eigene Seite?
3. Logik: Automatische Generierung oder manuell?

**Entscheidung:**
- Erweiterung: Feld `mahnstufe` in `sollstellung`
- Config: Entity-Config + Labels + Form + Table
- View: Neuer Tab "Mahnungen" in Finanzen-View

**Dateien:**
1. `config/entities/sollstellung.config.toml` - Feld hinzufügen
2. `config/labels/de.labels.toml` - Labels hinzufügen
3. `config/views/finanzen.config.toml` - Tab hinzufügen
4. `config/tables/mahnungen.table.toml` - Neue Tabelle

**Kein Code nötig!**
