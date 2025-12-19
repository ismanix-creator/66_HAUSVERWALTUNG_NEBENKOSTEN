# CODEX.md - User-spezifische Einstellungen

## Zugriffsbeschränkungen

```
ERLAUBT:
├── ./                    # Dieses Projekt
└── ../setup/             # Setup-Verzeichnis

VERBOTEN:
├── ../77_*               # Andere Projekte
├── ../88_*               # Andere Projekte
├── ../99_*               # Andere Projekte
└── ../databases/         # Zentrale Datenbanken
```

**Codex muss jede Aktion außerhalb der erlaubten Pfade ablehnen.**

## Ports (fest zugewiesen)

| Service | Port | Hinweis |
|---------|------|---------|
| Vite | 5174 | Nicht 5173 (belegt durch 88_HIDEANDSEEK) |
| Express | 3002 | Backend-Server (konfigurierbar via `process.env.PORT`) |

## Präferenzen

### Code-Stil

- TypeScript strict mode
- Funktionale React-Komponenten
- Tailwind CSS für Styling
- Keine `any` Typen

### Workflow

- Config-First: Prüfe immer zuerst ob TOML-Änderung ausreicht
- Kleine Commits mit deutschen Commit-Messages
- TypeScript-Check vor jedem Commit

### Kommunikation

- Kurze, prägnante Antworten
- Technische Details wenn relevant
- Keine Emojis (außer explizit gewünscht)

## Implementierungs-Fokus

### Bei Code-Änderungen prüfen

1. **Gegen `.ai/rules.md`:**
   - Keine hardcodierten Strings für Labels
   - Keine hardcodierten Feldnamen
   - Validierung aus TOML
   - Keine Magic Numbers

2. **Gegen `.ai/conventions.md`:**
   - TypeScript strict mode
   - Keine `any` verwendet
   - Naming-Konventionen befolgt

3. **Gegen `.ai/architecture.md`:**
   - Kein Schreibzugriff in Mobile-Routes
   - SQLite-Transaktionen korrekt
   - Config-Service für TOML-Zugriff

## Notizen

- Bei Entity-Änderungen: TOML zuerst, Code nur wenn nötig
- Mobile-Modus ist Read-Only (keine POST/PUT/DELETE)
- Siehe `.codex/workflows/implement.md` für Implementierung
- Siehe `.codex/workflows/refactor.md` für Refactoring
