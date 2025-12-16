# Glossar - Mietverwaltung

## Entities

| Begriff | Beschreibung |
|---------|--------------|
| **Objekt** | Immobilie/Gebäude (z.B. Mehrfamilienhaus) |
| **Einheit** | Einzelne vermietbare Einheit (Wohnung, Gewerbe, Stellplatz) |
| **Mieter** | Person oder Firma, die eine Einheit mietet |
| **Vertrag** | Mietvertrag zwischen Mieter und Vermieter für eine Einheit |
| **Kaution** | Sicherheitsleistung des Mieters |
| **Zähler** | Messgerät für Strom, Gas, Wasser, Heizung |
| **Zählerstand** | Einzelne Ablesung eines Zählers |
| **Kostenart** | Kategorie von Betriebskosten (z.B. Heizung, Müll) |
| **Rechnung** | NK-relevante Eingangsrechnung (Versorger, Dienstleister) |
| **Zahlung** | Eingehende Zahlung des Mieters |
| **Sollstellung** | Monatlicher Soll-Betrag aus Vertrag |
| **NK-Abrechnung** | Jährliche Nebenkostenabrechnung |
| **Dokument** | Hochgeladene Datei (Vertrag, Rechnung, Korrespondenz) |
| **Erinnerung** | System-Benachrichtigung für anstehende Aufgaben |

## Finanzbegriffe

| Begriff | Beschreibung |
|---------|--------------|
| **Kaltmiete** | Grundmiete ohne Nebenkosten |
| **Warmmiete** | Kaltmiete + NK-Vorauszahlung + HK-Vorauszahlung |
| **NK-Vorauszahlung** | Monatliche Vorauszahlung für Nebenkosten |
| **HK-Vorauszahlung** | Monatliche Vorauszahlung für Heizkosten |
| **Umlageschlüssel** | Verteilschlüssel für NK (m², Personen, Einheiten, Verbrauch) |
| **Nachzahlung** | Differenz wenn NK-Vorauszahlung < tatsächliche Kosten |
| **Guthaben** | Differenz wenn NK-Vorauszahlung > tatsächliche Kosten |
| **Offener Posten** | Ausstehende Zahlung (Soll > Ist) |

## Rechtliche Begriffe

| Begriff | Beschreibung |
|---------|--------------|
| **BetrKV** | Betriebskostenverordnung (definiert umlegbare Kosten) |
| **Staffelmiete** | Festgelegte Mieterhöhungen zu bestimmten Terminen |
| **Indexmiete** | Mietanpassung basierend auf Verbraucherpreisindex |
| **Mietpreisbremse** | Gesetzliche Begrenzung der Miethöhe (ortsabhängig) |
| **Sperrfrist** | Mindestabstand zwischen Mieterhöhungen (15 Monate) |

## Technische Begriffe

| Begriff | Beschreibung |
|---------|--------------|
| **Config-Driven** | UI/Logik wird durch TOML-Dateien gesteuert, nicht hardcoded |
| **Entity** | Datenmodell/Tabelle (z.B. Mieter, Vertrag) |
| **View** | Seite/Ansicht in der App (z.B. Dashboard, Objekte-Liste) |
| **Form** | Eingabeformular für eine Entity |
| **Table** | Tabellenansicht mit Spalten, Sortierung, Filter |
| **CRUD** | Create, Read, Update, Delete - Grundoperationen |
| **TOML** | Tom's Obvious Minimal Language - Config-Format |
