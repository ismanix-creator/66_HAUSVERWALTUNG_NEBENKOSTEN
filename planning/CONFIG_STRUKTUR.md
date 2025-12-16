# TOML-Config-Struktur

## Dateistruktur

```
src/config/
├── app.config.toml           # App-Metadaten, globale Einstellungen
├── navigation.config.toml    # Menü, Routing
├── entities/
│   ├── eigentuemer.config.toml
│   ├── objekt.config.toml
│   ├── einheit.config.toml
│   ├── mieter.config.toml
│   ├── vertrag.config.toml
│   ├── kaution.config.toml
│   ├── zaehler.config.toml
│   ├── zaehlerstand.config.toml
│   ├── kostenart.config.toml
│   ├── rechnung.config.toml
│   ├── zahlung.config.toml
│   ├── sollstellung.config.toml
│   ├── nebenkostenabrechnung.config.toml
│   ├── dokument.config.toml
│   └── erinnerung.config.toml
├── views/
│   ├── dashboard.config.toml
│   ├── objekte.config.toml
│   ├── einheiten.config.toml
│   ├── mieter.config.toml
│   ├── vertraege.config.toml
│   ├── finanzen.config.toml
│   ├── nebenkosten.config.toml
│   ├── dokumente.config.toml
│   └── einstellungen.config.toml
├── forms/
│   ├── objekt.form.toml
│   ├── einheit.form.toml
│   ├── mieter.form.toml
│   ├── vertrag.form.toml
│   ├── kaution.form.toml
│   ├── zaehler.form.toml
│   ├── zaehlerstand.form.toml
│   ├── rechnung.form.toml
│   ├── zahlung.form.toml
│   └── dokument.form.toml
├── tables/
│   ├── objekte.table.toml
│   ├── einheiten.table.toml
│   ├── mieter.table.toml
│   ├── vertraege.table.toml
│   ├── zahlungen.table.toml
│   ├── rechnungen.table.toml
│   ├── zaehlerstaende.table.toml
│   └── dokumente.table.toml
├── catalogs/
│   ├── kostenarten.catalog.toml
│   ├── umlageschluessel.catalog.toml
│   └── einheit-typen.catalog.toml
├── validation/
│   └── rules.config.toml
├── labels/
│   └── de.labels.toml
└── pdf/
    ├── nebenkostenabrechnung.template.toml
    └── mahnung.template.toml
```

---

## Statistik

| Kategorie | Anzahl |
|-----------|--------|
| Entity-Definitionen | 15 |
| View-Konfigurationen | 9 |
| Form-Definitionen | 10 |
| Table-Definitionen | 8 |
| Kataloge | 2 |
| Label-Datei (DE) | 1 |
| PDF-Templates | 1 |

---

## Detaillierte Konfigurationen

Die vollständigen TOML-Konfigurationen befinden sich in den folgenden Dateien:
- [Entity Definitions](./configs/entities/)
- [View Definitions](./configs/views/)
- [Form Definitions](./configs/forms/)
- [Table Definitions](./configs/tables/)
- [Catalogs](./configs/catalogs/)
- [Labels](./configs/labels/)
