# CLAUDE.md - User-spezifische Einstellungen

## Sprache

- **Projektsprache:** Deutsch
- **Codesprache:** Englisch (Variablen, Funktionen)
- **UI-Texte:** Deutsch (aus TOML-Labels)
- **Kommentare:** Deutsch erlaubt

## Präferenzen

### Code-Stil

- TypeScript strict mode
- Funktionale React-Komponenten
- Tailwind CSS für Styling
- Keine `any` Typen

### Kommunikation

- Kurze, prägnante Antworten
- Technische Details wenn relevant
- Keine Emojis (außer explizit gewünscht)

### Workflow

- Config-First: Prüfe immer zuerst ob TOML-Änderung ausreicht
- Kleine Commits mit deutschen Commit-Messages
- TypeScript-Check vor jedem Commit

## Projektspezifische Einstellungen

### Ports (fest zugewiesen)

| Service | Port | Hinweis |
|---------|------|---------|
| Vite | 5174 | Nicht 5173 (belegt durch 88_HIDEANDSEEK) |
| Express | 3002 | Backend-Server (konfigurierbar via `process.env.PORT`) |

### Pfad-Beschränkungen

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

## Analyse & Review Fokus

### Bei Code-Reviews prüfen

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

### Bei Planung

1. Analysiere existierende Struktur
2. Prüfe ob TOML-Änderung ausreicht
3. Minimale Code-Änderungen bevorzugen
4. Konsistenz mit bestehendem Code wahren

## Visualisierung

- Mermaid-Diagramme für Architektur
- ASCII-Art für schnelle Übersichten
- Tabellen für strukturierte Daten

## Notizen

- Bei Entity-Änderungen: TOML zuerst, Code nur wenn nötig
- Mobile-Modus ist Read-Only (keine POST/PUT/DELETE)
- Siehe `.claude/review.md` für vollständige Checkliste
- Siehe `.claude/planning.md` für Feature-Planung
