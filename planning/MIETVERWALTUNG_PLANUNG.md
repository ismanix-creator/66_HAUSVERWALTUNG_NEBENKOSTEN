# Mietverwaltung App - Planungsdokumentation

## Projektübersicht

**Projektname:** Mietverwaltung
**Zielplattform:** Linux, Windows PC, Surface 7 (Windows 10/11)
**Entwicklungsrechner:** ABC-PC-HOME
**Technologie:** TypeScript, 100% Config-Driven (TOML)
**Architektur:** Desktop-Anwendung (keine Smartphone-Unterstützung)

---

## App-Struktur (Navigation)

```
📱 Mietverwaltung
│
├── 🏠 Dashboard
│   ├── Monatsübersicht (erwartete vs. eingegangene Mieten)
│   ├── Offene Posten (Rückstände)
│   ├── Anstehend (Zählerablesung, Vertragsende, NK-Abrechnung fällig)
│   └── Leerstand-Übersicht
│
├── 🏢 Objekte
│   ├── ListView
│   │   └── Kacheln oder Liste mit: Adresse, Einheiten, Leerstand
│   ├── DetailView (einzelnes Objekt)
│   │   ├── Tab: Stammdaten (Adresse, Baujahr, Notizen)
│   │   ├── Tab: Einheiten (Liste der Wohnungen/Gewerbe)
│   │   ├── Tab: Dokumente (diesem Objekt zugeordnet)
│   │   ├── Tab: Kosten (Rechnungen für NK-Abrechnung)
│   │   └── Tab: Zähler (Hauptzähler Strom/Gas/Wasser)
│   ├── [Dialog] Objekt anlegen/bearbeiten
│   └── [Dialog] Einheit anlegen/bearbeiten
│
├── 🚪 Einheiten (optional als eigene View)
│   └── Schnellzugriff auf alle Einheiten über Objekte hinweg
│
├── 👥 Mieter
│   ├── ListView (alle Mieter, aktiv/ehemalig filterbar)
│   ├── DetailView
│   │   ├── Tab: Stammdaten
│   │   ├── Tab: Vertrag (aktuell + Historie)
│   │   ├── Tab: Zahlungen (Soll/Ist/Differenz)
│   │   ├── Tab: Dokumente (Ausweis, Vertrag, Korrespondenz)
│   │   └── Tab: Kaution
│   └── [Dialog] Mieter anlegen/bearbeiten
│
├── 📄 Verträge
│   ├── ListView (aktiv/beendet/auslaufend)
│   ├── DetailView
│   │   ├── Mietkonditionen (Kalt, NK-Vorauszahlung, Gesamt)
│   │   ├── Vertragszeitraum
│   │   ├── Staffel-/Indexmiete (falls vorhanden)
│   │   └── Verknüpfte Dokumente
│   └── [Dialog] Vertrag anlegen (Mieter + Einheit verknüpfen)
│
├── 💰 Finanzen
│   ├── Zahlungsübersicht
│   │   ├── Monatliche Soll-Stellung (alle Mieter)
│   │   ├── Eingänge erfassen
│   │   └── Offene Posten / Mahnliste
│   ├── Kautionen
│   │   └── Übersicht aller Kautionen (angelegt, Zinsen, Status)
│   └── [Dialog] Zahlung erfassen
│
├── 📊 Nebenkostenabrechnung
│   ├── Kostenerfassung pro Objekt/Jahr
│   │   └── Rechnungen den Kostenarten zuordnen
│   ├── Abrechnungserstellung
│   │   ├── Umlageschlüssel anwenden
│   │   ├── Vorauszahlungen gegenrechnen
│   │   └── Ergebnis pro Mieter (Nachzahlung/Guthaben)
│   ├── Abrechnungs-Historie
│   └── [Dialog] Rechnung/Kosten erfassen
│
├── 📁 Dokumente
│   ├── Alle Dokumente (filterbar nach Objekt/Mieter/Jahr)
│   ├── Upload-Bereich
│   └── Steuerberater-Export
│       └── Auswahl: Objekt + Jahr → ZIP/PDF-Sammlung
│
└── ⚙️ Einstellungen
    ├── Kostenarten (Heizung, Wasser, Müll, Grundsteuer...)
    ├── Umlageschlüssel (m², Personen, Einheiten, Verbrauch)
    ├── Eigentümer-Stammdaten (für Briefkopf etc.)
    └── Vorlagen (optional: Mahnungen, Abrechnungsschreiben)
```

---

## Funktionsübersicht

### Dashboard
- **Monatsübersicht:** Vergleich Soll vs. Ist Mieteingänge
- **Offene Posten:** Liste aller Rückstände mit Mahnhinweis
- **Erinnerungen:** Anstehende Aufgaben (Zählerablesung, Vertragsende, NK-Abrechnung)
- **Leerstand:** Übersicht nicht vermieteter Einheiten
- **Schnellzugriff:** Buttons für häufige Aktionen

### Objektverwaltung
- CRUD für Objekte (Häuser, Gebäude)
- Verwaltung von Einheiten pro Objekt
- Zählerverwaltung (Haupt- und Unterzähler)
- Dokumentenzuordnung
- Kostenerfassung für NK-Abrechnung

### Mieterverwaltung
- CRUD für Mieter (Privat und Firma)
- Kontaktdaten und Bankverbindung
- Status-Tracking (aktiv, gekündigt, ehemalig)
- Dokumentenverwaltung (Ausweis, Korrespondenz)

### Vertragsverwaltung
- Vertragsanlage mit Mieter-Einheit-Verknüpfung
- Mietkonditionen (Kalt, NK, HK, Sonstige)
- Staffel- und Indexmiete
- Kündigungsmanagement
- Automatische Sollstellung

### Finanzverwaltung
- Zahlungserfassung und -zuordnung
- Soll/Ist-Vergleich pro Monat
- Offene-Posten-Liste
- Kautionsverwaltung mit Zinsen

### Nebenkostenabrechnung
- Rechnungserfassung mit Kostenart-Zuordnung
- Umlageschlüssel-Berechnung
- Automatische Abrechnung pro Mieter
- PDF-Generierung

### Dokumentenmanagement
- Upload mit automatischer Zuordnung
- Filterung nach Objekt/Mieter/Jahr
- Steuerberater-Export (ZIP/PDF)

---

## Entities (Datenmodell)

| Entity | Beschreibung |
|--------|--------------|
| Eigentümer | Stammdaten des Vermieters |
| Objekt | Immobilien (Häuser, Gebäude) |
| Einheit | Wohnungen, Gewerbe, Stellplätze |
| Mieter | Personen oder Firmen |
| Vertrag | Mietverträge |
| Kaution | Kautionsdaten pro Vertrag |
| Zähler | Strom, Gas, Wasser, Heizung |
| Zählerstand | Ablesungen |
| Kostenart | Betriebskostenarten (BetrKV) |
| Rechnung | NK-relevante Rechnungen |
| Zahlung | Mieteingänge |
| Sollstellung | Monatliche Soll-Beträge |
| Nebenkostenabrechnung | Jährliche Abrechnungen |
| Dokument | Alle Dateien |
| Erinnerung | System-Benachrichtigungen |

---

## Views

| View | Route | Layout |
|------|-------|--------|
| Dashboard | /dashboard | Dashboard mit Widgets |
| Objekte | /objekte | List-Detail |
| Mieter | /mieter | List-Detail |
| Verträge | /vertraege | List-Detail |
| Finanzen | /finanzen | Tabbed |
| Nebenkosten | /nebenkosten | Tabbed |
| Dokumente | /dokumente | Single |
| Einstellungen | /einstellungen | Settings |

---

## Dialoge/Formulare

| Dialog | Verwendung |
|--------|------------|
| objekt.form | Objekt anlegen/bearbeiten |
| einheit.form | Einheit anlegen/bearbeiten |
| mieter.form | Mieter anlegen/bearbeiten |
| vertrag.form | Vertrag anlegen/bearbeiten |
| kaution.form | Kaution verwalten |
| zaehler.form | Zähler anlegen/bearbeiten |
| zaehlerstand.form | Ablesung erfassen |
| rechnung.form | Rechnung erfassen |
| zahlung.form | Zahlung erfassen |
| dokument.form | Dokument hochladen |

---

## Nächste Schritte

1. **Projekt-Setup** auf ABC-PC-HOME
2. **TOML-Parser** + Config-Loader implementieren
3. **Basis-Komponenten** (Table, Form, Dialog) erstellen
4. **Erste Views** umsetzen (Dashboard, Objekte)
5. **Datenbankanbindung** (zunächst localStorage, später PostgreSQL)
6. **PDF-Generierung** für Nebenkostenabrechnungen
