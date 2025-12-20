# npm-Skripte — Übersicht und Nutzung

Dieses Dokument beschreibt alle npm-Skripte aus der package.json und gibt Empfehlungen, welche Skripte benötigt werden, damit Backend, Frontend und das Gesamtsystem nach Änderungen korrekt laufen.

## Ziel: Entwicklungs-Workflow nach Änderungen
Wenn am Code gearbeitet oder Konfiguration/DB-Änderungen vorgenommen wurden, sind die folgenden Schritte üblich:
1. Qualitätschecks: lint, typecheck, test, format
2. Datenbank: db:migrate (bei DB-Änderungen), ggf. db:seed
3. Lokale Entwicklung: dev (oder dev:server + dev:client)
4. Produktion: build (oder build:client + build:server) und anschließend preview oder start:server

---

## Skripte (jeweils: Beschreibung — Wann ausführen / Beispiel)

- dev — Startet die Entwicklungsumgebung (Hot-Reload). Nutze dieses Skript für die tägliche lokale Entwicklung, es sollte Backend und Frontend im Entwicklungsmodus starten, falls das Projekt entsprechend konfiguriert ist.
  Beispiel: npm run dev

- dev:server — Startet nur den Backend-Entwicklungsserver. Verwenden, wenn nur Backend-Änderungen getestet werden sollen oder wenn dev nicht beide Prozesse startet.
  Beispiel: npm run dev:server

- dev:client — Startet nur den Frontend-Entwicklungsserver (z. B. Vite/webpack dev server). Verwenden, wenn nur Frontend-Änderungen getestet werden sollen.
  Beispiel: npm run dev:client

- build — Erstellt Produktions-Builds (Client und Server). Ausführen vor Deployment oder um lokal einen Produktions-Build zu prüfen.
  Beispiel: npm run build

- build:client — Baut nur das Frontend für Produktion. Nützlich, wenn nur das Frontend neu deployt werden soll.
  Beispiel: npm run build:client

- build:server — Baut nur das Server-Bundle (z. B. SSR/Backend build). Nützlich bei Backend-Only-Deployments.
  Beispiel: npm run build:server

- preview — Startet eine lokale Vorschau des Produktions-Builds. Nutze, um das Verhalten des gebauten Systems lokal zu überprüfen.
  Beispiel: npm run preview

- start:server — Startet den Server im Produktionsmodus (z. B. node ./dist/server). Verwenden beim tatsächlichen Produktionsstart oder für lokale Tests des Produktiv-Servers.
  Beispiel: npm run start:server

- copy:config — Kopiert Konfigurationsdateien oder Umgebungs-Templates in den erwarteten Pfad. Vor dem Start/Build ausführen, wenn Konfigs nicht automatisch vorhanden sind.
  Beispiel: npm run copy:config


## Qualitäts- und Hilfs-Skripte
- lint — Führt statische Code-Analyse (Linting) aus. Vor Commits oder CI/PR-Checks ausführen.
  Beispiel: npm run lint

- lint:fix — Führt Linting mit automatischen Fixes aus. Vor Commits oder wenn Lint-Fehler automatisch behoben werden sollen.
  Beispiel: npm run lint:fix

- format — Formatiert den Code (z. B. Prettier). Vor Commits oder wenn Konsistenz hergestellt werden muss.
  Beispiel: npm run format

- typecheck — Führt TypeScript-Typprüfung aus. Nach größeren Änderungen oder vor dem Build/Commit ausführen.
  Beispiel: npm run typecheck

- test — Führt automatisierte Tests aus (Unit/Integration). Vor Merges und Releases ausführen.
  Beispiel: npm run test


## Datenbank-Skripte
- db:init — Initialisiert die Datenbank (z. B. lokal, mit Schema). Nur einmal beim Setup oder beim Zurücksetzen der lokalen DB verwenden.
  Beispiel: npm run db:init

- db:migrate — Führt Datenbank-Migrationen aus. Immer ausführen, nachdem Migrationen erstellt oder gemerged wurden und bevor der Server gestartet wird.
  Beispiel: npm run db:migrate

- db:backup — Erstellt ein Backup der Datenbank. Vor riskanten Änderungen oder Deploys empfohlen.
  Beispiel: npm run db:backup

- db:seed — Befüllt die Datenbank mit Test-/Seed-Daten. Nach db:init oder wenn Testdaten benötigt werden.
  Beispiel: npm run db:seed


## Empfohlener Ablauf nach Code-Änderungen
1. Lokale Qualitätsprüfung: npm run lint && npm run typecheck && npm run test
2. Falls DB-Modell oder Migrationen geändert: npm run db:migrate
3. Lokale Entwicklung starten: npm run dev (oder in getrennten Terminals: npm run dev:server und npm run dev:client)
4. Für Produktion/Deployment: npm run build && npm run preview (lokal prüfen) oder npm run build && npm run start:server (Produktionsstart)


## Hinweise
- Manche Projekte konfigurieren "dev" so, dass es beide Prozesse startet; wenn das in diesem Repo nicht der Fall ist, bitte dev:server und dev:client jeweils in separaten Terminals starten.
- Datenbankbefehle (db:migrate, db:init, db:seed) sollten mit Vorsicht auf Produktionsdaten angewendet werden; vorher Backup (npm run db:backup) erstellen.
- CI/Deploy-Pipelines sollten die Skripte lint, typecheck, test und build automatisch ausführen.


---

Wenn Anpassungen an Beschreibungen oder Beispiele gewünscht sind, bitte kurz Bescheid geben.