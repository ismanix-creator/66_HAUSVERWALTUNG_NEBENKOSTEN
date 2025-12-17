# Wireframe – Mietverwaltung (Struktur)

Basis: Navigation und Views aus `config/config.toml` (Navigation, Views, Forms, Tables). PC-First mit CRUD, Mobile nur Read-Only. Keine visuellen Details, nur Aufbau und Interaktionspunkte.

## Desktop-Grundlayout
```
┌───────────────────────────────────────────────────────────────┐
│ Sidebar (Navigation)     │ Header: StatusBar (Owner, Version) │
│ ─ Dashboard              │────────────────────────────────────│
│ ─ Objekte                │ Content-Area                       │
│ ─ Mieter                 │ - Breadcrumb/Title                 │
│ ─ Verträge               │ - Filter/Actions (config-driven)   │
│ ─ Finanzen               │ - Tab/Section je View              │
│   • Zahlungen            │ - Tabelle/Form aus TOML            │
│   • Kautionen            │                                    │
│   • Sollstellung         │ Footer: Pagination/Aktionsleiste   │
│ ─ Nebenkosten            │                                    │
│   • Rechnungen           │                                    │
│   • Abrechnungen         │                                    │
│   • Zähler               │                                    │
│ ─ Dokumente              │                                    │
│ ─ Einstellungen          │                                    │
│ ─ Mobile (Info/Link)     │                                    │
└───────────────────────────────────────────────────────────────┘
```

## Dashboard (Widget-Grid)
```
┌───────────────────────────────────────────────────────────────┐
│ Kartenreihe:                                                ▲ │
│ [Objekte] [Mieter] [Verträge] [Offene Posten] [Dokumente]   │ │
│                                                             │ │
│ Zeile 2: Einnahmen/Soll-Ist | Leerstand | Erinnerungen      │ │
│ ─────────────────────────────────────────────────────────── │ │
│ Quick Actions: [Zahlung] [Rechnung] [Ablesung]              │ │
└─────────────────────────────────────────────────────────────┘
```

## Objekte & Mieter (List-Detail)
```
┌───────────────────────────────────────────────────────────────┐
│ Liste links (filterbar)            │ Detail rechts             │
│ [ + Neu ]                          │ Tabs: Stammdaten | Einheiten│
│ ─ Objekt A ▶                       │       | Zähler | Dokumente │
│ ─ Objekt B                         │ Header: Name + Adresse     │
│ ─ Objekt C                         │ Detailfelder aus Table/Form│
└───────────────────────────────────────────────────────────────┘
```

## Verträge (List-Detail ähnlich Mieter)
```
┌───────────────────────────────────────────────────────────────┐
│ Liste Verträge (Suchleiste, Filter) │ Detail mit Tabs:        │
│ - Vertrag #123                      │ Stammdaten | Zahlungen   │
│ - Vertrag #124                      │ | Sollstellungen | Anhänge│
└───────────────────────────────────────────────────────────────┘
```

## Finanzen (Tabbed)
```
┌───────────────────────────────────────────────────────────────┐
│ Tabs: [Zahlungen] [Sollstellung] [Kautionen]                  │
│ ──────────────────────────────────────────────────────────── │
│ Tabelle (config-driven): Datum | Mieter | Betrag | Typ | Tag  │
│ Aktionsleiste: [Neu] [Export] [Filter]                        │
└───────────────────────────────────────────────────────────────┘
```

## Nebenkosten (Tabbed)
```
┌───────────────────────────────────────────────────────────────┐
│ Tabs: [Rechnungen] [Abrechnungen] [Zähler]                    │
│                                                               │
│ Rechnungen: Tabelle + [Upload/Neu]                            │
│ Abrechnungen: Wizard/Schritte (Zeitraum → Umlageschlüssel →   │
│                 Vorschau → Export PDF)                        │
│ Zähler: Tabelle + Ablesungs-Form                              │
└───────────────────────────────────────────────────────────────┘
```

## Dokumente (Single-View)
```
┌───────────────────────────────────────────────────────────────┐
│ Toolbar: [Upload] [Filter nach Typ/Objekt]                    │
│ Tabelle: Dateiname | Typ | Zugehörigkeit | Hochgeladen am     │
│ Preview/Details rechts (Readonly-Metadaten)                   │
└───────────────────────────────────────────────────────────────┘
```

## Einstellungen
```
┌───────────────────────────────────────────────────────────────┐
│ Sektionen als Karten/Listen:                                  │
│ - Stammdaten (Owner)                                          │
│ - Defaults/Fristen                                            │
│ - Backups/Pfade                                               │
│ - Design/Labels (Verweise auf TOML)                           │
└───────────────────────────────────────────────────────────────┘
```

## Mobile Read-Only Snapshot (/mobile/dashboard)
```
┌───────────────────────────────────────────────────────────────┐
│ Header: App-Name + Zeitstempel                                │
│ Karten: Objekte | Mieter | Offene Posten | Erinnerungen       │
│ Listen: Letzte Zahlungen, Fällige Ablesungen                  │
│ Aktionen: Keine (nur Links/Details lesen)                     │
└───────────────────────────────────────────────────────────────┘
```
