# Architekturprinzipien - Mietverwaltung

## Stack

| Schicht | Technologie |
|---------|-------------|
| Frontend | React 18 + TypeScript + Vite |
| UI | Tailwind CSS + Custom Components |
| State | Zustand + TanStack Query |
| Backend | Node.js + Express + TypeScript |
| Datenbank | SQLite (lokal, portabel) |
| Config | TOML-Datei | /config/config.toml |

## PC-First, Mobile Read-Only

```
PC (Linux/Windows/Surface)
├── Voller Zugriff (CRUD)
├── Lokaler Server (Port 3002)
└── SQLite-Datenbank lokal

Smartphone (Optional, via VPN)
├── Nur Lesen (GET)
├── Vereinfachte UI
└── Keine Schreiboperationen
```

## Verzeichnisstruktur

```
66_HAUSVERWALTUNG_NEBENKOSTEN/
├── .ai/                    # Shared Truth (tool-agnostisch) wird nach abschluss in docs/ verschoben
├── .codex/                 # Codex-spezifisch (Implementierung) wird nach abschluss in docs/ verschoben
├── .claude/                # Claude-spezifisch (Analyse/Review) wird nach abschluss in docs/ verschoben
├── config/config.toml      # TOML-Konfigurationen alle CONFIG in einer config.toml (Produktiv) 
│   └── catalogs/           # Kataloge (z.B. Abrechnungspositionen, Mietobjekte)
├── src/
│   ├── server/             # Express Backend
│   ├── client/             # React Frontend
│   └── shared/             # Geteilte Typen/Utils
├── data/                   # SQLite + Dokumente (nicht in Git)
├── docs/                   # Dokumentation (nach projekt abschlluss sämtliche dokumentationen hier)
├── planning/               # Planungsdokumente
└── scripts/                # DB-Init, Migration, Backup
```

## Datenfluss

```
TOML-Config → Config-Service → Generischer Service → SQLite
                    ↓
              React-Komponenten (config-driven rendering)
```

## Sicherheit

- SQLite mit WAL-Modus
- Prepared Statements (SQL-Injection-Schutz)
- Input-Validierung gegen TOML-Schema
- Mobile: Nur GET-Requests erlaubt
- Regelmäßige Backups

## Ports

- Frontend (Vite): 5174
- Backend (Express): 3002
