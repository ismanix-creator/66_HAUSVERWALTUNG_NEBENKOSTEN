# 40_STATUS – PM_STATUS & Status-Interpretation

**Quellen:** `PM_STATUS.md`, `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `.github/agents/project-manager.agent.md`, `.github/agents/workflow.agent.md`

## 1. Zweck des Logs

- `PM_STATUS.md` ist das zentrale Steuerlog; jede Agentenaktion endet mit einem JSON-Block, der `agent`, `ziel`, `geändert`, `ergebnis`, `blocker`, `next_suggestion`, `notes` enthält (`AGENTS.md`, `CLAUDE.md`).  
- Der Projektmanager liest **nur den letzten** JSON-Block. Alle vorigen Einträge sind zur Historie, aber nicht mehr steuernd.

## 2. Lesen & Interpretieren

1. **Letzter Block** – {agent/ziel/geändert/ergebnis/blocker/next_suggestion/notes}. Sollte `ergebnis` „OK“ sein, kann der nächste Schritt gestartet werden.  
2. **Blocker** – Falls nicht leer, stoppen und klären (Workflow-Guardrails).  
3. **Next Suggestion** – Vorschlag für den nächsten Agenten oder die nächste Aufgabe; bildet häufig die Inputwünsche (z. B. „Frontend – UI testen“, „Dokumentation – ChangeLog synchronisieren“).  
4. **Geänderte Dateien** – Beschreibt den Umfang des letzten Schrittes, hilft bei der Auswahl relevanter Quellen.  
5. **Notes** – Zusätzliche Hinweise (z. B. Testergebnisse, Systemzeit-Check, Konflikte).

## 3. Status-Gates aus Workflow & Agenten

- Workflow-Phasen (Analyse → Abgleich → ... → Übergabe) verlangen, dass `PM_STATUS.md` nach jedem Schritt aktualisiert wird; ohne neuen Eintrag darf kein weiterer Agent starten (`workflow.agent.md`).  
- Die nächsten Agenten in `.github/agents/` (Frontend, Backend, Designer, etc.) lesen den letzten Block, entnehmen `next_suggestion` und setzen die Änderung um (`project-manager.agent.md`).  
- Jeder Block steht in direktem Zusammenhang mit der Konfigurations-/Dokumentationsstruktur: z. B. `next_suggestion` verweist oft auf config, wireframe oder docs.

## 4. Konflikt-Hinweise

- Sollte ein neuer Block widersprüchliche Anforderungen zu `AGENTS.md` oder `PM_STATUS`-Regeln enthalten (z. B. mehrere gleichzeitige `next_suggestion`), ist dies ein **Konflikt zur Klärung**; nicht eigenmächtig lösen.  
- Wenn `blocker` gesetzt ist, ruht das Projekt bis zur Klärung; der Workflow-Agent stoppt laut `.github/agents/workflow.agent.md`.

## 5. Wie weiter?

1. Lies zuerst den neuesten JSON-Block.  
2. Prüfe `next_suggestion` und `geänderte Dateien`, damit du genau weißt, worauf du aufbauen darfst.  
3. Folge den Workflows (Portal 20) und den Rollenhinweisen (Portal 10) – es gibt keine eigenständigen Entscheidungen.  
4. Nach Abschluss des aktuellen Schritts: Neues JSON anhängen, inkl. `next_suggestion` für die folgenden Arbeiten.

Datei `portal/40_STATUS.md` vollständig erstellt.
