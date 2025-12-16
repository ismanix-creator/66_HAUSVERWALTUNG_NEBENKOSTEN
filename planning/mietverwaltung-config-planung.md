# Mietverwaltung - TOML-Config-Struktur Planung

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

## 1. App-Konfiguration

### `app.config.toml`

```toml
[app]
name = "Mietverwaltung"
version = "1.0.0"
description = "Private Mietobjekt-Verwaltung"
locale = "de-DE"
currency = "EUR"
timezone = "Europe/Berlin"

[app.owner]
# Wird in Einstellungen gepflegt, hier Defaults
name = ""
address = ""
tax_number = ""

[app.features]
dokumente_upload = true
pdf_generation = true
zaehler_management = true
mahnwesen_hinweis = true          # Hinweis bei Rückstand, keine Automatik
mieterhoehung_reminder = true

[app.storage]
dokumente_pfad = "./dokumente"
backup_pfad = "./backups"
max_upload_size_mb = 25

[app.database]
type = "postgresql"               # später, erstmal localStorage
# connection details in .env

[app.defaults]
kuendigungsfrist_monate = 3
kaution_monate = 3
nk_abrechnungsfrist_monate = 12   # 12 Monate nach Abrechnungszeitraum
mieterhoehung_sperrfrist_monate = 15
```

---

## 2. Navigation

### `navigation.config.toml`

```toml
[navigation]
default_route = "/dashboard"

[[navigation.items]]
id = "dashboard"
label = "labels.nav.dashboard"
icon = "LayoutDashboard"
route = "/dashboard"
order = 1

[[navigation.items]]
id = "objekte"
label = "labels.nav.objekte"
icon = "Building2"
route = "/objekte"
order = 2

[[navigation.items]]
id = "mieter"
label = "labels.nav.mieter"
icon = "Users"
route = "/mieter"
order = 3

[[navigation.items]]
id = "vertraege"
label = "labels.nav.vertraege"
icon = "FileText"
route = "/vertraege"
order = 4

[[navigation.items]]
id = "finanzen"
label = "labels.nav.finanzen"
icon = "Wallet"
route = "/finanzen"
order = 5

  [[navigation.items.children]]
  id = "zahlungen"
  label = "labels.nav.zahlungen"
  route = "/finanzen/zahlungen"

  [[navigation.items.children]]
  id = "kautionen"
  label = "labels.nav.kautionen"
  route = "/finanzen/kautionen"

  [[navigation.items.children]]
  id = "sollstellung"
  label = "labels.nav.sollstellung"
  route = "/finanzen/sollstellung"

[[navigation.items]]
id = "nebenkosten"
label = "labels.nav.nebenkosten"
icon = "Calculator"
route = "/nebenkosten"
order = 6

  [[navigation.items.children]]
  id = "rechnungen"
  label = "labels.nav.rechnungen"
  route = "/nebenkosten/rechnungen"

  [[navigation.items.children]]
  id = "abrechnungen"
  label = "labels.nav.abrechnungen"
  route = "/nebenkosten/abrechnungen"

  [[navigation.items.children]]
  id = "zaehler"
  label = "labels.nav.zaehler"
  route = "/nebenkosten/zaehler"

[[navigation.items]]
id = "dokumente"
label = "labels.nav.dokumente"
icon = "FolderOpen"
route = "/dokumente"
order = 7

[[navigation.items]]
id = "einstellungen"
label = "labels.nav.einstellungen"
icon = "Settings"
route = "/einstellungen"
order = 99
position = "bottom"
```

---

## 3. Entity-Definitionen

### `entities/objekt.config.toml`

```toml
[entity]
name = "objekt"
label = "labels.entity.objekt"
label_plural = "labels.entity.objekte"
icon = "Building2"
primary_key = "id"

[entity.fields.id]
type = "uuid"
auto_generate = true
visible = false

[entity.fields.bezeichnung]
type = "string"
required = true
max_length = 100
label = "labels.objekt.bezeichnung"
placeholder = "z.B. Haus Musterstraße 12"

[entity.fields.adresse]
type = "string"
required = true
max_length = 200
label = "labels.objekt.adresse"

[entity.fields.plz]
type = "string"
required = true
pattern = "^[0-9]{5}$"
label = "labels.objekt.plz"

[entity.fields.ort]
type = "string"
required = true
max_length = 100
label = "labels.objekt.ort"

[entity.fields.baujahr]
type = "integer"
min = 1800
max = 2100
label = "labels.objekt.baujahr"

[entity.fields.typ]
type = "enum"
required = true
options = ["wohnraum", "gewerbe", "gemischt"]
default = "wohnraum"
label = "labels.objekt.typ"

[entity.fields.ist_multi_einheit]
type = "boolean"
default = false
label = "labels.objekt.ist_multi_einheit"
description = "Mehrere Einheiten mit separaten Zählern"

[entity.fields.notiz]
type = "text"
label = "labels.common.notiz"

[entity.fields.erstellt_am]
type = "datetime"
auto_generate = true
visible_in_form = false
label = "labels.common.erstellt_am"

[entity.relations]
einheiten = { type = "one_to_many", target = "einheit", foreign_key = "objekt_id" }
zaehler = { type = "one_to_many", target = "zaehler", foreign_key = "objekt_id" }
rechnungen = { type = "one_to_many", target = "rechnung", foreign_key = "objekt_id" }
dokumente = { type = "one_to_many", target = "dokument", foreign_key = "objekt_id" }

[entity.computed]
anzahl_einheiten = { formula = "count(einheiten)" }
anzahl_vermietet = { formula = "count(einheiten where status = 'vermietet')" }
leerstand = { formula = "anzahl_einheiten - anzahl_vermietet" }
gesamt_flaeche = { formula = "sum(einheiten.flaeche)" }
```

---

### `entities/einheit.config.toml`

```toml
[entity]
name = "einheit"
label = "labels.entity.einheit"
label_plural = "labels.entity.einheiten"
icon = "DoorOpen"
primary_key = "id"

[entity.fields.id]
type = "uuid"
auto_generate = true
visible = false

[entity.fields.objekt_id]
type = "uuid"
required = true
reference = "objekt"
label = "labels.einheit.objekt"

[entity.fields.bezeichnung]
type = "string"
required = true
max_length = 50
label = "labels.einheit.bezeichnung"
placeholder = "z.B. EG links, Halle A"

[entity.fields.typ]
type = "enum"
required = true
options = ["wohnung", "gewerbe", "stellplatz", "keller", "sonstig"]
default = "wohnung"
label = "labels.einheit.typ"

[entity.fields.flaeche]
type = "decimal"
required = true
min = 1
precision = 2
suffix = "m²"
label = "labels.einheit.flaeche"

[entity.fields.anzahl_raeume]
type = "decimal"
min = 1
precision = 1
label = "labels.einheit.anzahl_raeume"
visible_if = { field = "typ", in = ["wohnung"] }

[entity.fields.etage]
type = "string"
max_length = 20
label = "labels.einheit.etage"
placeholder = "z.B. EG, 1. OG, DG"

[entity.fields.ausstattung]
type = "multiselect"
options = ["balkon", "terrasse", "keller", "stellplatz", "einbaukueche", "aufzug", "gaeste_wc"]
label = "labels.einheit.ausstattung"

[entity.fields.status]
type = "enum"
required = true
options = ["vermietet", "leer", "eigennutzung", "renovierung"]
default = "leer"
label = "labels.einheit.status"

[entity.fields.notiz]
type = "text"
label = "labels.common.notiz"

[entity.relations]
objekt = { type = "many_to_one", target = "objekt", foreign_key = "objekt_id" }
vertraege = { type = "one_to_many", target = "vertrag", foreign_key = "einheit_id" }
zaehler = { type = "one_to_many", target = "zaehler", foreign_key = "einheit_id" }

[entity.computed]
aktueller_vertrag = { formula = "first(vertraege where ende is null or ende > now())" }
aktueller_mieter = { formula = "aktueller_vertrag.mieter" }
```

---

### `entities/mieter.config.toml`

```toml
[entity]
name = "mieter"
label = "labels.entity.mieter"
label_plural = "labels.entity.mieter_plural"
icon = "User"
primary_key = "id"

[entity.fields.id]
type = "uuid"
auto_generate = true
visible = false

[entity.fields.anrede]
type = "enum"
options = ["herr", "frau", "firma", "divers"]
label = "labels.mieter.anrede"

[entity.fields.vorname]
type = "string"
max_length = 50
label = "labels.mieter.vorname"
required_if = { field = "anrede", not_in = ["firma"] }

[entity.fields.nachname]
type = "string"
required = true
max_length = 50
label = "labels.mieter.nachname"
description = "Bei Firma: Firmenname"

[entity.fields.firma_zusatz]
type = "string"
max_length = 100
label = "labels.mieter.firma_zusatz"
visible_if = { field = "anrede", equals = "firma" }

[entity.fields.geburtsdatum]
type = "date"
label = "labels.mieter.geburtsdatum"
visible_if = { field = "anrede", not_in = ["firma"] }

[entity.fields.telefon]
type = "string"
max_length = 30
label = "labels.mieter.telefon"

[entity.fields.email]
type = "email"
max_length = 100
label = "labels.mieter.email"

[entity.fields.adresse_vorher]
type = "text"
label = "labels.mieter.adresse_vorher"
description = "Vorherige Anschrift"

[entity.fields.iban]
type = "string"
max_length = 34
pattern = "^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$"
label = "labels.mieter.iban"

[entity.fields.bic]
type = "string"
max_length = 11
label = "labels.mieter.bic"

[entity.fields.bankname]
type = "string"
max_length = 100
label = "labels.mieter.bankname"

[entity.fields.status]
type = "enum"
required = true
options = ["aktiv", "gekuendigt", "ehemalig"]
default = "aktiv"
label = "labels.mieter.status"

[entity.fields.notiz]
type = "text"
label = "labels.common.notiz"

[entity.fields.erstellt_am]
type = "datetime"
auto_generate = true
visible_in_form = false
label = "labels.common.erstellt_am"

[entity.relations]
vertraege = { type = "one_to_many", target = "vertrag", foreign_key = "mieter_id" }
dokumente = { type = "one_to_many", target = "dokument", foreign_key = "mieter_id" }
zahlungen = { type = "one_to_many", target = "zahlung", foreign_key = "mieter_id", through = "vertrag" }

[entity.computed]
display_name = { formula = "concat(vorname, ' ', nachname)" }
aktiver_vertrag = { formula = "first(vertraege where ende is null or ende > now())" }
aktuelle_einheit = { formula = "aktiver_vertrag.einheit" }
```

---

### `entities/vertrag.config.toml`

```toml
[entity]
name = "vertrag"
label = "labels.entity.vertrag"
label_plural = "labels.entity.vertraege"
icon = "FileSignature"
primary_key = "id"

[entity.fields.id]
type = "uuid"
auto_generate = true
visible = false

[entity.fields.einheit_id]
type = "uuid"
required = true
reference = "einheit"
label = "labels.vertrag.einheit"

[entity.fields.mieter_id]
type = "uuid"
required = true
reference = "mieter"
label = "labels.vertrag.mieter"

[entity.fields.vertragsnummer]
type = "string"
max_length = 30
label = "labels.vertrag.vertragsnummer"

[entity.fields.typ]
type = "enum"
required = true
options = ["wohnraum", "gewerbe"]
label = "labels.vertrag.typ"
auto_from = "einheit.objekt.typ"

[entity.fields.beginn]
type = "date"
required = true
label = "labels.vertrag.beginn"

[entity.fields.ende]
type = "date"
label = "labels.vertrag.ende"
description = "Leer = unbefristet"

[entity.fields.kuendigungsfrist]
type = "integer"
default = 3
min = 1
max = 12
suffix = "Monate"
label = "labels.vertrag.kuendigungsfrist"

[entity.fields.kuendigung_zum]
type = "date"
label = "labels.vertrag.kuendigung_zum"

[entity.fields.gekuendigt_von]
type = "enum"
options = ["mieter", "vermieter"]
label = "labels.vertrag.gekuendigt_von"
visible_if = { field = "kuendigung_zum", is_set = true }

# === Mietkonditionen ===

[entity.fields.kaltmiete]
type = "currency"
required = true
min = 0
label = "labels.vertrag.kaltmiete"

[entity.fields.nebenkosten_vorauszahlung]
type = "currency"
required = true
min = 0
default = 0
label = "labels.vertrag.nebenkosten_vorauszahlung"

[entity.fields.heizkosten_vorauszahlung]
type = "currency"
min = 0
default = 0
label = "labels.vertrag.heizkosten_vorauszahlung"

[entity.fields.sonstige_vorauszahlung]
type = "currency"
min = 0
default = 0
label = "labels.vertrag.sonstige_vorauszahlung"
description = "z.B. Stellplatz, Garage"

# === Mieterhöhung ===

[entity.fields.mietanpassung_typ]
type = "enum"
options = ["keine", "mietspiegel", "staffel", "index"]
default = "mietspiegel"
label = "labels.vertrag.mietanpassung_typ"
visible_if = { field = "typ", equals = "wohnraum" }

[entity.fields.staffelmiete]
type = "json"
label = "labels.vertrag.staffelmiete"
description = "Array: [{ab: date, kaltmiete: number}]"
visible_if = { field = "mietanpassung_typ", equals = "staffel" }

[entity.fields.indexmiete]
type = "json"
label = "labels.vertrag.indexmiete"
description = "{basisjahr, basisindex, schwelle_prozent}"
visible_if = { field = "mietanpassung_typ", equals = "index" }

[entity.fields.letzte_mieterhoehung]
type = "date"
label = "labels.vertrag.letzte_mieterhoehung"

[entity.fields.notiz]
type = "text"
label = "labels.common.notiz"

[entity.fields.erstellt_am]
type = "datetime"
auto_generate = true
visible_in_form = false

[entity.relations]
einheit = { type = "many_to_one", target = "einheit", foreign_key = "einheit_id" }
mieter = { type = "many_to_one", target = "mieter", foreign_key = "mieter_id" }
kaution = { type = "one_to_one", target = "kaution", foreign_key = "vertrag_id" }
zahlungen = { type = "one_to_many", target = "zahlung", foreign_key = "vertrag_id" }
sollstellungen = { type = "one_to_many", target = "sollstellung", foreign_key = "vertrag_id" }

[entity.computed]
gesamtmiete = { formula = "kaltmiete + nebenkosten_vorauszahlung + heizkosten_vorauszahlung + sonstige_vorauszahlung" }
ist_aktiv = { formula = "(ende is null or ende > now()) and kuendigung_zum is null" }
ist_gekuendigt = { formula = "kuendigung_zum is not null" }
naechste_mieterhoehung_moeglich = { formula = "add_months(letzte_mieterhoehung, 15)" }

[entity.validation]
ende_nach_beginn = { rule = "ende is null or ende > beginn", message = "labels.validation.ende_nach_beginn" }
kuendigung_logik = { rule = "kuendigung_zum is null or gekuendigt_von is not null", message = "labels.validation.kuendigung_von_fehlt" }
```

---

### `entities/kaution.config.toml`

```toml
[entity]
name = "kaution"
label = "labels.entity.kaution"
label_plural = "labels.entity.kautionen"
icon = "Shield"
primary_key = "id"

[entity.fields.id]
type = "uuid"
auto_generate = true
visible = false

[entity.fields.vertrag_id]
type = "uuid"
required = true
unique = true
reference = "vertrag"
label = "labels.kaution.vertrag"

[entity.fields.betrag]
type = "currency"
required = true
min = 0
label = "labels.kaution.betrag"

[entity.fields.eingangsdatum]
type = "date"
required = true
label = "labels.kaution.eingangsdatum"

[entity.fields.anlageform]
type = "enum"
required = true
options = ["sparbuch", "konto", "buergschaft", "bar"]
default = "konto"
label = "labels.kaution.anlageform"

[entity.fields.anlage_details]
type = "text"
label = "labels.kaution.anlage_details"
placeholder = "Bank, Kontonummer, etc."

[entity.fields.zinssatz]
type = "decimal"
min = 0
max = 10
precision = 2
suffix = "%"
label = "labels.kaution.zinssatz"

[entity.fields.status]
type = "enum"
required = true
options = ["angelegt", "teilrueckzahlung", "zurueckgezahlt"]
default = "angelegt"
label = "labels.kaution.status"

[entity.fields.rueckzahlungsdatum]
type = "date"
label = "labels.kaution.rueckzahlungsdatum"
visible_if = { field = "status", in = ["teilrueckzahlung", "zurueckgezahlt"] }

[entity.fields.rueckzahlungsbetrag]
type = "currency"
min = 0
label = "labels.kaution.rueckzahlungsbetrag"
visible_if = { field = "status", in = ["teilrueckzahlung", "zurueckgezahlt"] }

[entity.fields.einbehalt_grund]
type = "text"
label = "labels.kaution.einbehalt_grund"
visible_if = { field = "status", equals = "teilrueckzahlung" }

[entity.fields.notiz]
type = "text"
label = "labels.common.notiz"

[entity.relations]
vertrag = { type = "one_to_one", target = "vertrag", foreign_key = "vertrag_id" }
```

---

### `entities/zaehler.config.toml`

```toml
[entity]
name = "zaehler"
label = "labels.entity.zaehler"
label_plural = "labels.entity.zaehler_plural"
icon = "Gauge"
primary_key = "id"

[entity.fields.id]
type = "uuid"
auto_generate = true
visible = false

[entity.fields.objekt_id]
type = "uuid"
required = true
reference = "objekt"
label = "labels.zaehler.objekt"

[entity.fields.einheit_id]
type = "uuid"
reference = "einheit"
label = "labels.zaehler.einheit"
description = "Leer = Hauptzähler"

[entity.fields.typ]
type = "enum"
required = true
options = ["strom", "gas", "wasser", "heizung", "warmwasser"]
label = "labels.zaehler.typ"

[entity.fields.zaehlernummer]
type = "string"
required = true
max_length = 50
label = "labels.zaehler.zaehlernummer"

[entity.fields.ist_hauptzaehler]
type = "boolean"
default = false
label = "labels.zaehler.ist_hauptzaehler"

[entity.fields.messeinheit]
type = "enum"
required = true
options = ["kWh", "m3"]
label = "labels.zaehler.messeinheit"
auto_from_typ = { strom = "kWh", gas = "m3", wasser = "m3", heizung = "kWh", warmwasser = "m3" }

[entity.fields.notiz]
type = "text"
label = "labels.common.notiz"

[entity.relations]
objekt = { type = "many_to_one", target = "objekt", foreign_key = "objekt_id" }
einheit = { type = "many_to_one", target = "einheit", foreign_key = "einheit_id" }
staende = { type = "one_to_many", target = "zaehlerstand", foreign_key = "zaehler_id" }

[entity.computed]
letzter_stand = { formula = "last(staende order by datum)" }
bezeichnung_display = { formula = "concat(typ, ' - ', zaehlernummer, ist_hauptzaehler ? ' (Haupt)' : '')" }
```

---

### `entities/zaehlerstand.config.toml`

```toml
[entity]
name = "zaehlerstand"
label = "labels.entity.zaehlerstand"
label_plural = "labels.entity.zaehlerstaende"
icon = "Activity"
primary_key = "id"

[entity.fields.id]
type = "uuid"
auto_generate = true
visible = false

[entity.fields.zaehler_id]
type = "uuid"
required = true
reference = "zaehler"
label = "labels.zaehlerstand.zaehler"

[entity.fields.datum]
type = "date"
required = true
label = "labels.zaehlerstand.datum"

[entity.fields.stand]
type = "decimal"
required = true
min = 0
precision = 2
label = "labels.zaehlerstand.stand"

[entity.fields.ableseart]
type = "enum"
required = true
options = ["selbst", "versorger", "schaetzung"]
default = "selbst"
label = "labels.zaehlerstand.ableseart"

[entity.fields.foto]
type = "file"
accept = ["image/jpeg", "image/png"]
label = "labels.zaehlerstand.foto"

[entity.fields.notiz]
type = "text"
label = "labels.common.notiz"

[entity.relations]
zaehler = { type = "many_to_one", target = "zaehler", foreign_key = "zaehler_id" }

[entity.computed]
verbrauch = { formula = "stand - previous(stand)" }
```

---

### `entities/kostenart.config.toml`

```toml
[entity]
name = "kostenart"
label = "labels.entity.kostenart"
label_plural = "labels.entity.kostenarten"
icon = "Tag"
primary_key = "id"

[entity.fields.id]
type = "uuid"
auto_generate = true
visible = false

[entity.fields.bezeichnung]
type = "string"
required = true
max_length = 100
label = "labels.kostenart.bezeichnung"

[entity.fields.kategorie]
type = "enum"
required = true
options = ["umlagefaehig", "nicht_umlagefaehig"]
default = "umlagefaehig"
label = "labels.kostenart.kategorie"

[entity.fields.umlageschluessel]
type = "enum"
required = true
options = ["flaeche", "personen", "einheiten", "verbrauch", "direkt"]
default = "flaeche"
label = "labels.kostenart.umlageschluessel"
description = "direkt = 1:1 Zuordnung zu Einheit"

[entity.fields.nur_gewerbe]
type = "boolean"
default = false
label = "labels.kostenart.nur_gewerbe"

[entity.fields.sortierung]
type = "integer"
default = 100
label = "labels.kostenart.sortierung"

[entity.fields.aktiv]
type = "boolean"
default = true
label = "labels.kostenart.aktiv"

[entity.relations]
rechnungen = { type = "one_to_many", target = "rechnung", foreign_key = "kostenart_id" }
```

---

### `entities/rechnung.config.toml`

```toml
[entity]
name = "rechnung"
label = "labels.entity.rechnung"
label_plural = "labels.entity.rechnungen"
icon = "Receipt"
primary_key = "id"

[entity.fields.id]
type = "uuid"
auto_generate = true
visible = false

[entity.fields.objekt_id]
type = "uuid"
required = true
reference = "objekt"
label = "labels.rechnung.objekt"

[entity.fields.kostenart_id]
type = "uuid"
required = true
reference = "kostenart"
label = "labels.rechnung.kostenart"

[entity.fields.einheit_id]
type = "uuid"
reference = "einheit"
label = "labels.rechnung.einheit"
description = "Nur bei Direktzuordnung"
visible_if = { field = "kostenart.umlageschluessel", equals = "direkt" }

[entity.fields.rechnungsnummer]
type = "string"
max_length = 50
label = "labels.rechnung.rechnungsnummer"

[entity.fields.rechnungsdatum]
type = "date"
required = true
label = "labels.rechnung.rechnungsdatum"

[entity.fields.faelligkeitsdatum]
type = "date"
label = "labels.rechnung.faelligkeitsdatum"

[entity.fields.betrag]
type = "currency"
required = true
min = 0
label = "labels.rechnung.betrag"

[entity.fields.zeitraum_von]
type = "date"
label = "labels.rechnung.zeitraum_von"

[entity.fields.zeitraum_bis]
type = "date"
label = "labels.rechnung.zeitraum_bis"

[entity.fields.bezahlt_am]
type = "date"
label = "labels.rechnung.bezahlt_am"

[entity.fields.dokument_id]
type = "uuid"
reference = "dokument"
label = "labels.rechnung.dokument"

[entity.fields.notiz]
type = "text"
label = "labels.common.notiz"

[entity.fields.erstellt_am]
type = "datetime"
auto_generate = true
visible_in_form = false

[entity.relations]
objekt = { type = "many_to_one", target = "objekt", foreign_key = "objekt_id" }
kostenart = { type = "many_to_one", target = "kostenart", foreign_key = "kostenart_id" }
einheit = { type = "many_to_one", target = "einheit", foreign_key = "einheit_id" }
dokument = { type = "many_to_one", target = "dokument", foreign_key = "dokument_id" }

[entity.computed]
ist_bezahlt = { formula = "bezahlt_am is not null" }
jahr = { formula = "year(rechnungsdatum)" }
```

---

### `entities/zahlung.config.toml`

```toml
[entity]
name = "zahlung"
label = "labels.entity.zahlung"
label_plural = "labels.entity.zahlungen"
icon = "ArrowDownCircle"
primary_key = "id"

[entity.fields.id]
type = "uuid"
auto_generate = true
visible = false

[entity.fields.vertrag_id]
type = "uuid"
required = true
reference = "vertrag"
label = "labels.zahlung.vertrag"

[entity.fields.datum]
type = "date"
required = true
label = "labels.zahlung.datum"

[entity.fields.betrag]
type = "currency"
required = true
label = "labels.zahlung.betrag"

[entity.fields.verwendungszweck]
type = "string"
max_length = 200
label = "labels.zahlung.verwendungszweck"

[entity.fields.typ]
type = "enum"
required = true
options = ["miete", "nachzahlung", "kaution", "sonstig"]
default = "miete"
label = "labels.zahlung.typ"

[entity.fields.monat_fuer]
type = "string"
pattern = "^[0-9]{4}-[0-9]{2}$"
label = "labels.zahlung.monat_fuer"
placeholder = "YYYY-MM"
visible_if = { field = "typ", equals = "miete" }

[entity.fields.notiz]
type = "text"
label = "labels.common.notiz"

[entity.fields.erstellt_am]
type = "datetime"
auto_generate = true
visible_in_form = false

[entity.relations]
vertrag = { type = "many_to_one", target = "vertrag", foreign_key = "vertrag_id" }

[entity.computed]
mieter = { formula = "vertrag.mieter" }
einheit = { formula = "vertrag.einheit" }
```

---

### `entities/sollstellung.config.toml`

```toml
[entity]
name = "sollstellung"
label = "labels.entity.sollstellung"
label_plural = "labels.entity.sollstellungen"
icon = "ListChecks"
primary_key = "id"

[entity.fields.id]
type = "uuid"
auto_generate = true
visible = false

[entity.fields.vertrag_id]
type = "uuid"
required = true
reference = "vertrag"
label = "labels.sollstellung.vertrag"

[entity.fields.monat]
type = "string"
required = true
pattern = "^[0-9]{4}-[0-9]{2}$"
label = "labels.sollstellung.monat"

[entity.fields.sollbetrag]
type = "currency"
required = true
label = "labels.sollstellung.sollbetrag"

[entity.fields.istbetrag]
type = "currency"
default = 0
label = "labels.sollstellung.istbetrag"

[entity.fields.status]
type = "enum"
options = ["offen", "teilweise", "bezahlt", "ueberzahlt"]
default = "offen"
label = "labels.sollstellung.status"

[entity.relations]
vertrag = { type = "many_to_one", target = "vertrag", foreign_key = "vertrag_id" }

[entity.computed]
differenz = { formula = "istbetrag - sollbetrag" }
mieter = { formula = "vertrag.mieter" }
```

---

### `entities/nebenkostenabrechnung.config.toml`

```toml
[entity]
name = "nebenkostenabrechnung"
label = "labels.entity.nebenkostenabrechnung"
label_plural = "labels.entity.nebenkostenabrechnungen"
icon = "FileSpreadsheet"
primary_key = "id"

[entity.fields.id]
type = "uuid"
auto_generate = true
visible = false

[entity.fields.objekt_id]
type = "uuid"
required = true
reference = "objekt"
label = "labels.nk.objekt"

[entity.fields.jahr]
type = "integer"
required = true
min = 2000
max = 2100
label = "labels.nk.jahr"

[entity.fields.zeitraum_von]
type = "date"
required = true
label = "labels.nk.zeitraum_von"

[entity.fields.zeitraum_bis]
type = "date"
required = true
label = "labels.nk.zeitraum_bis"

[entity.fields.status]
type = "enum"
required = true
options = ["entwurf", "erstellt", "versendet"]
default = "entwurf"
label = "labels.nk.status"

[entity.fields.erstellt_am]
type = "datetime"
auto_generate = true
label = "labels.common.erstellt_am"

[entity.fields.notiz]
type = "text"
label = "labels.common.notiz"

[entity.relations]
objekt = { type = "many_to_one", target = "objekt", foreign_key = "objekt_id" }
positionen = { type = "one_to_many", target = "nebenkostenabrechnung_position", foreign_key = "abrechnung_id" }

[entity.computed]
gesamtkosten = { formula = "sum(positionen.gesamtkosten)" }
```

---

### `entities/nebenkostenabrechnung_position.config.toml`

```toml
[entity]
name = "nebenkostenabrechnung_position"
label = "labels.entity.nk_position"
label_plural = "labels.entity.nk_positionen"
primary_key = "id"

[entity.fields.id]
type = "uuid"
auto_generate = true
visible = false

[entity.fields.abrechnung_id]
type = "uuid"
required = true
reference = "nebenkostenabrechnung"

[entity.fields.einheit_id]
type = "uuid"
required = true
reference = "einheit"

[entity.fields.mieter_id]
type = "uuid"
required = true
reference = "mieter"

[entity.fields.gesamtkosten]
type = "currency"
label = "labels.nk.gesamtkosten"

[entity.fields.anteil_mieter]
type = "currency"
label = "labels.nk.anteil_mieter"

[entity.fields.vorauszahlungen]
type = "currency"
label = "labels.nk.vorauszahlungen"

[entity.fields.ergebnis]
type = "currency"
label = "labels.nk.ergebnis"
description = "+ = Nachzahlung, - = Guthaben"

[entity.fields.details]
type = "json"
label = "labels.nk.details"
description = "Aufschlüsselung pro Kostenart"

[entity.relations]
abrechnung = { type = "many_to_one", target = "nebenkostenabrechnung", foreign_key = "abrechnung_id" }
einheit = { type = "many_to_one", target = "einheit", foreign_key = "einheit_id" }
mieter = { type = "many_to_one", target = "mieter", foreign_key = "mieter_id" }
```

---

### `entities/dokument.config.toml`

```toml
[entity]
name = "dokument"
label = "labels.entity.dokument"
label_plural = "labels.entity.dokumente"
icon = "File"
primary_key = "id"

[entity.fields.id]
type = "uuid"
auto_generate = true
visible = false

[entity.fields.objekt_id]
type = "uuid"
reference = "objekt"
label = "labels.dokument.objekt"

[entity.fields.einheit_id]
type = "uuid"
reference = "einheit"
label = "labels.dokument.einheit"

[entity.fields.mieter_id]
type = "uuid"
reference = "mieter"
label = "labels.dokument.mieter"

[entity.fields.vertrag_id]
type = "uuid"
reference = "vertrag"
label = "labels.dokument.vertrag"

[entity.fields.typ]
type = "enum"
required = true
options = ["rechnung", "vertrag", "ausweis", "korrespondenz", "foto", "sonstig"]
default = "sonstig"
label = "labels.dokument.typ"

[entity.fields.bezeichnung]
type = "string"
required = true
max_length = 200
label = "labels.dokument.bezeichnung"

[entity.fields.dateiname]
type = "string"
required = true
max_length = 255
label = "labels.dokument.dateiname"

[entity.fields.dateipfad]
type = "string"
required = true
label = "labels.dokument.dateipfad"

[entity.fields.dateigroesse]
type = "integer"
label = "labels.dokument.dateigroesse"

[entity.fields.mime_type]
type = "string"
max_length = 100
label = "labels.dokument.mime_type"

[entity.fields.datum]
type = "date"
label = "labels.dokument.datum"
description = "Dokumentdatum (z.B. Rechnungsdatum)"

[entity.fields.jahr]
type = "integer"
label = "labels.dokument.jahr"
description = "Für Steuerberater-Sortierung"

[entity.fields.hochgeladen_am]
type = "datetime"
auto_generate = true
label = "labels.dokument.hochgeladen_am"

[entity.relations]
objekt = { type = "many_to_one", target = "objekt", foreign_key = "objekt_id" }
einheit = { type = "many_to_one", target = "einheit", foreign_key = "einheit_id" }
mieter = { type = "many_to_one", target = "mieter", foreign_key = "mieter_id" }
vertrag = { type = "many_to_one", target = "vertrag", foreign_key = "vertrag_id" }

[entity.validation]
mindestens_eine_zuordnung = { rule = "objekt_id is not null or mieter_id is not null or vertrag_id is not null", message = "labels.validation.dokument_zuordnung" }
```

---

### `entities/erinnerung.config.toml`

```toml
[entity]
name = "erinnerung"
label = "labels.entity.erinnerung"
label_plural = "labels.entity.erinnerungen"
icon = "Bell"
primary_key = "id"

[entity.fields.id]
type = "uuid"
auto_generate = true
visible = false

[entity.fields.typ]
type = "enum"
required = true
options = ["mieterhoehung", "vertragsende", "zaehlerablesung", "rueckstand", "nk_abrechnung", "kaution_rueckzahlung", "sonstig"]
label = "labels.erinnerung.typ"

[entity.fields.bezug_typ]
type = "enum"
options = ["vertrag", "objekt", "mieter", "einheit"]
label = "labels.erinnerung.bezug_typ"

[entity.fields.bezug_id]
type = "uuid"
label = "labels.erinnerung.bezug_id"

[entity.fields.faellig_am]
type = "date"
required = true
label = "labels.erinnerung.faellig_am"

[entity.fields.titel]
type = "string"
required = true
max_length = 200
label = "labels.erinnerung.titel"

[entity.fields.beschreibung]
type = "text"
label = "labels.erinnerung.beschreibung"

[entity.fields.status]
type = "enum"
required = true
options = ["offen", "erledigt", "zurueckgestellt"]
default = "offen"
label = "labels.erinnerung.status"

[entity.fields.erstellt_am]
type = "datetime"
auto_generate = true
label = "labels.common.erstellt_am"
```

---

## 4. View-Definitionen

### `views/dashboard.config.toml`

```toml
[view]
id = "dashboard"
title = "labels.views.dashboard"
route = "/dashboard"
layout = "dashboard"

[[view.widgets]]
id = "monatsuebersicht"
type = "stats_card"
title = "labels.dashboard.monatsübersicht"
position = { row = 1, col = 1, width = 2 }

  [[view.widgets.stats]]
  label = "labels.dashboard.soll_gesamt"
  value = { query = "sum(sollstellung where monat = current_month).sollbetrag" }
  format = "currency"

  [[view.widgets.stats]]
  label = "labels.dashboard.ist_gesamt"
  value = { query = "sum(sollstellung where monat = current_month).istbetrag" }
  format = "currency"

  [[view.widgets.stats]]
  label = "labels.dashboard.offen"
  value = { query = "sum(sollstellung where monat = current_month and status != 'bezahlt').differenz" }
  format = "currency"
  color_rule = { negative = "red", zero = "green" }

[[view.widgets]]
id = "offene_posten"
type = "table_widget"
title = "labels.dashboard.offene_posten"
position = { row = 1, col = 3, width = 2 }
table = "tables/sollstellungen_offen.table"
max_rows = 5
show_more_link = "/finanzen/sollstellung?filter=offen"

[[view.widgets]]
id = "erinnerungen"
type = "list_widget"
title = "labels.dashboard.erinnerungen"
position = { row = 2, col = 1, width = 2 }
query = "erinnerung where status = 'offen' order by faellig_am limit 10"
item_template = { title = "titel", subtitle = "faellig_am", icon_from = "typ" }
empty_message = "labels.dashboard.keine_erinnerungen"

[[view.widgets]]
id = "leerstand"
type = "stats_card"
title = "labels.dashboard.leerstand"
position = { row = 2, col = 3, width = 1 }

  [[view.widgets.stats]]
  label = "labels.dashboard.einheiten_leer"
  value = { query = "count(einheit where status = 'leer')" }
  total = { query = "count(einheit)" }
  format = "fraction"

[[view.widgets]]
id = "quick_actions"
type = "action_buttons"
title = "labels.dashboard.schnellzugriff"
position = { row = 2, col = 4, width = 1 }

  [[view.widgets.actions]]
  label = "labels.actions.zahlung_erfassen"
  icon = "Plus"
  dialog = "forms/zahlung.form"

  [[view.widgets.actions]]
  label = "labels.actions.rechnung_erfassen"
  icon = "Receipt"
  dialog = "forms/rechnung.form"

  [[view.widgets.actions]]
  label = "labels.actions.zaehler_ablesen"
  icon = "Gauge"
  dialog = "forms/zaehlerstand.form"
```

---

### `views/objekte.config.toml`

```toml
[view]
id = "objekte"
title = "labels.views.objekte"
route = "/objekte"
layout = "list_detail"

[view.list]
table = "tables/objekte.table"
search_fields = ["bezeichnung", "adresse", "ort"]
default_sort = { field = "bezeichnung", direction = "asc" }

  [[view.list.filters]]
  field = "typ"
  type = "select"
  label = "labels.filter.typ"

  [[view.list.filters]]
  field = "computed.leerstand"
  type = "boolean"
  label = "labels.filter.mit_leerstand"
  condition = "> 0"

[view.list.actions]
create = { label = "labels.actions.objekt_anlegen", dialog = "forms/objekt.form" }

[view.detail]
route = "/objekte/:id"
title_field = "bezeichnung"

  [[view.detail.tabs]]
  id = "stammdaten"
  label = "labels.tabs.stammdaten"
  type = "form_readonly"
  form = "forms/objekt.form"
  edit_action = { dialog = "forms/objekt.form" }

  [[view.detail.tabs]]
  id = "einheiten"
  label = "labels.tabs.einheiten"
  type = "table"
  table = "tables/einheiten.table"
  filter = { objekt_id = ":id" }
  actions = { create = { label = "labels.actions.einheit_anlegen", dialog = "forms/einheit.form", defaults = { objekt_id = ":id" } } }

  [[view.detail.tabs]]
  id = "zaehler"
  label = "labels.tabs.zaehler"
  type = "table"
  table = "tables/zaehler.table"
  filter = { objekt_id = ":id" }
  visible_if = { field = "ist_multi_einheit", equals = true }
  actions = { create = { label = "labels.actions.zaehler_anlegen", dialog = "forms/zaehler.form", defaults = { objekt_id = ":id" } } }

  [[view.detail.tabs]]
  id = "rechnungen"
  label = "labels.tabs.rechnungen"
  type = "table"
  table = "tables/rechnungen.table"
  filter = { objekt_id = ":id" }
  actions = { create = { label = "labels.actions.rechnung_erfassen", dialog = "forms/rechnung.form", defaults = { objekt_id = ":id" } } }

  [[view.detail.tabs]]
  id = "dokumente"
  label = "labels.tabs.dokumente"
  type = "table"
  table = "tables/dokumente.table"
  filter = { objekt_id = ":id" }
  actions = { upload = { label = "labels.actions.dokument_hochladen", dialog = "forms/dokument.form", defaults = { objekt_id = ":id" } } }
```

---

### `views/mieter.config.toml`

```toml
[view]
id = "mieter"
title = "labels.views.mieter"
route = "/mieter"
layout = "list_detail"

[view.list]
table = "tables/mieter.table"
search_fields = ["vorname", "nachname", "email"]
default_sort = { field = "nachname", direction = "asc" }

  [[view.list.filters]]
  field = "status"
  type = "select"
  label = "labels.filter.status"
  default = "aktiv"

[view.list.actions]
create = { label = "labels.actions.mieter_anlegen", dialog = "forms/mieter.form" }

[view.detail]
route = "/mieter/:id"
title_field = "computed.display_name"

  [[view.detail.tabs]]
  id = "stammdaten"
  label = "labels.tabs.stammdaten"
  type = "form_readonly"
  form = "forms/mieter.form"
  edit_action = { dialog = "forms/mieter.form" }

  [[view.detail.tabs]]
  id = "vertrag"
  label = "labels.tabs.vertrag"
  type = "table"
  table = "tables/vertraege.table"
  filter = { mieter_id = ":id" }

  [[view.detail.tabs]]
  id = "zahlungen"
  label = "labels.tabs.zahlungen"
  type = "table"
  table = "tables/zahlungen.table"
  filter = { "vertrag.mieter_id" = ":id" }
  actions = { create = { label = "labels.actions.zahlung_erfassen", dialog = "forms/zahlung.form" } }

  [[view.detail.tabs]]
  id = "dokumente"
  label = "labels.tabs.dokumente"
  type = "table"
  table = "tables/dokumente.table"
  filter = { mieter_id = ":id" }
  actions = { upload = { label = "labels.actions.dokument_hochladen", dialog = "forms/dokument.form", defaults = { mieter_id = ":id" } } }

  [[view.detail.tabs]]
  id = "kaution"
  label = "labels.tabs.kaution"
  type = "form_readonly"
  form = "forms/kaution.form"
  data_path = "aktiver_vertrag.kaution"
  empty_message = "labels.kaution.keine_kaution"
```

---

### `views/vertraege.config.toml`

```toml
[view]
id = "vertraege"
title = "labels.views.vertraege"
route = "/vertraege"
layout = "list_detail"

[view.list]
table = "tables/vertraege.table"
search_fields = ["mieter.nachname", "einheit.bezeichnung", "vertragsnummer"]
default_sort = { field = "beginn", direction = "desc" }

  [[view.list.filters]]
  field = "computed.ist_aktiv"
  type = "boolean_toggle"
  label = "labels.filter.nur_aktive"
  default = true

  [[view.list.filters]]
  field = "typ"
  type = "select"
  label = "labels.filter.typ"

[view.list.actions]
create = { label = "labels.actions.vertrag_anlegen", dialog = "forms/vertrag.form" }

[view.detail]
route = "/vertraege/:id"
title_field = "vertragsnummer"

  [[view.detail.header_info]]
  fields = ["mieter.computed.display_name", "einheit.bezeichnung", "computed.gesamtmiete"]

  [[view.detail.tabs]]
  id = "konditionen"
  label = "labels.tabs.konditionen"
  type = "form_readonly"
  form = "forms/vertrag.form"
  edit_action = { dialog = "forms/vertrag.form" }

  [[view.detail.tabs]]
  id = "kaution"
  label = "labels.tabs.kaution"
  type = "form_editable"
  form = "forms/kaution.form"
  data_path = "kaution"

  [[view.detail.tabs]]
  id = "zahlungen"
  label = "labels.tabs.zahlungen"
  type = "table"
  table = "tables/zahlungen.table"
  filter = { vertrag_id = ":id" }

  [[view.detail.tabs]]
  id = "sollstellung"
  label = "labels.tabs.sollstellung"
  type = "table"
  table = "tables/sollstellungen.table"
  filter = { vertrag_id = ":id" }

  [[view.detail.tabs]]
  id = "dokumente"
  label = "labels.tabs.dokumente"
  type = "table"
  table = "tables/dokumente.table"
  filter = { vertrag_id = ":id" }
```

---

### `views/finanzen.config.toml`

```toml
[view]
id = "finanzen"
title = "labels.views.finanzen"
route = "/finanzen"
layout = "tabbed"

  [[view.tabs]]
  id = "zahlungen"
  label = "labels.tabs.zahlungen"
  route = "/finanzen/zahlungen"
  table = "tables/zahlungen.table"
  default_sort = { field = "datum", direction = "desc" }

    [[view.tabs.filters]]
    field = "datum"
    type = "date_range"
    label = "labels.filter.zeitraum"

    [[view.tabs.filters]]
    field = "typ"
    type = "select"

  [view.tabs.actions]
  create = { label = "labels.actions.zahlung_erfassen", dialog = "forms/zahlung.form" }

  [[view.tabs]]
  id = "sollstellung"
  label = "labels.tabs.sollstellung"
  route = "/finanzen/sollstellung"
  table = "tables/sollstellungen.table"

    [[view.tabs.filters]]
    field = "monat"
    type = "month_picker"
    default = "current"

    [[view.tabs.filters]]
    field = "status"
    type = "select"

  [view.tabs.summary]
  show = true
  fields = ["sollbetrag", "istbetrag", "differenz"]
  aggregate = "sum"

  [[view.tabs]]
  id = "kautionen"
  label = "labels.tabs.kautionen"
  route = "/finanzen/kautionen"
  table = "tables/kautionen.table"

    [[view.tabs.filters]]
    field = "status"
    type = "select"

  [view.tabs.summary]
  show = true
  fields = ["betrag"]
  aggregate = "sum"
  group_by = "status"
```

---

### `views/nebenkosten.config.toml`

```toml
[view]
id = "nebenkosten"
title = "labels.views.nebenkosten"
route = "/nebenkosten"
layout = "tabbed"

  [[view.tabs]]
  id = "rechnungen"
  label = "labels.tabs.rechnungen"
  route = "/nebenkosten/rechnungen"
  table = "tables/rechnungen.table"
  default_sort = { field = "rechnungsdatum", direction = "desc" }

    [[view.tabs.filters]]
    field = "objekt_id"
    type = "select"
    label = "labels.filter.objekt"
    options_from = "objekt"

    [[view.tabs.filters]]
    field = "kostenart_id"
    type = "select"
    label = "labels.filter.kostenart"
    options_from = "kostenart"

    [[view.tabs.filters]]
    field = "computed.jahr"
    type = "year_picker"
    label = "labels.filter.jahr"

    [[view.tabs.filters]]
    field = "computed.ist_bezahlt"
    type = "boolean_toggle"
    label = "labels.filter.bezahlt"

  [view.tabs.actions]
  create = { label = "labels.actions.rechnung_erfassen", dialog = "forms/rechnung.form" }

  [view.tabs.summary]
  show = true
  fields = ["betrag"]
  aggregate = "sum"
  group_by = "kostenart.bezeichnung"

  [[view.tabs]]
  id = "abrechnungen"
  label = "labels.tabs.abrechnungen"
  route = "/nebenkosten/abrechnungen"
  table = "tables/abrechnungen.table"

    [[view.tabs.filters]]
    field = "objekt_id"
    type = "select"
    options_from = "objekt"

    [[view.tabs.filters]]
    field = "jahr"
    type = "year_picker"

    [[view.tabs.filters]]
    field = "status"
    type = "select"

  [view.tabs.actions]
  create = { label = "labels.actions.abrechnung_erstellen", dialog = "dialogs/nk_abrechnung_wizard" }

  [[view.tabs]]
  id = "zaehler"
  label = "labels.tabs.zaehler"
  route = "/nebenkosten/zaehler"
  table = "tables/zaehler.table"

    [[view.tabs.filters]]
    field = "objekt_id"
    type = "select"
    options_from = "objekt"

    [[view.tabs.filters]]
    field = "typ"
    type = "select"

  [view.tabs.actions]
  create = { label = "labels.actions.zaehler_anlegen", dialog = "forms/zaehler.form" }
  ablesung = { label = "labels.actions.ablesung_erfassen", dialog = "forms/zaehlerstand.form" }
```

---

### `views/dokumente.config.toml`

```toml
[view]
id = "dokumente"
title = "labels.views.dokumente"
route = "/dokumente"
layout = "single"

[view.content]
table = "tables/dokumente.table"
default_sort = { field = "hochgeladen_am", direction = "desc" }

  [[view.content.filters]]
  field = "objekt_id"
  type = "select"
  label = "labels.filter.objekt"
  options_from = "objekt"

  [[view.content.filters]]
  field = "typ"
  type = "select"
  label = "labels.filter.typ"

  [[view.content.filters]]
  field = "jahr"
  type = "year_picker"
  label = "labels.filter.jahr"

[view.content.actions]
upload = { label = "labels.actions.dokument_hochladen", dialog = "forms/dokument.form" }

[view.content.bulk_actions]
export = { label = "labels.actions.steuerberater_export", dialog = "dialogs/steuerberater_export" }
delete = { label = "labels.actions.loeschen", confirm = true }
```

---

### `views/einstellungen.config.toml`

```toml
[view]
id = "einstellungen"
title = "labels.views.einstellungen"
route = "/einstellungen"
layout = "settings"

  [[view.sections]]
  id = "eigentuemer"
  label = "labels.settings.eigentuemer"
  icon = "User"
  form = "forms/eigentuemer.form"
  description = "labels.settings.eigentuemer_desc"

  [[view.sections]]
  id = "kostenarten"
  label = "labels.settings.kostenarten"
  icon = "Tag"
  type = "table_editable"
  table = "tables/kostenarten.table"
  form = "forms/kostenart.form"
  description = "labels.settings.kostenarten_desc"

  [[view.sections]]
  id = "umlageschluessel"
  label = "labels.settings.umlageschluessel"
  icon = "Percent"
  type = "info"
  content = "catalogs/umlageschluessel.catalog"
  description = "labels.settings.umlageschluessel_desc"

  [[view.sections]]
  id = "backup"
  label = "labels.settings.backup"
  icon = "Database"
  type = "actions"
  description = "labels.settings.backup_desc"

    [[view.sections.actions]]
    id = "backup_create"
    label = "labels.actions.backup_erstellen"
    handler = "system.createBackup"

    [[view.sections.actions]]
    id = "backup_restore"
    label = "labels.actions.backup_wiederherstellen"
    handler = "system.restoreBackup"
    confirm = true
```

---

## 5. Table-Definitionen

### `tables/objekte.table.toml`

```toml
[table]
entity = "objekt"
row_click = "navigate"
row_click_route = "/objekte/:id"

[[table.columns]]
field = "bezeichnung"
label = "labels.objekt.bezeichnung"
sortable = true
width = "25%"

[[table.columns]]
field = "adresse"
label = "labels.objekt.adresse"
sortable = true
width = "30%"
template = "{adresse}, {plz} {ort}"

[[table.columns]]
field = "typ"
label = "labels.objekt.typ"
sortable = true
width = "10%"
display = "badge"
badge_colors = { wohnraum = "blue", gewerbe = "orange", gemischt = "purple" }

[[table.columns]]
field = "computed.anzahl_einheiten"
label = "labels.objekt.einheiten"
sortable = true
width = "10%"
align = "center"

[[table.columns]]
field = "computed.leerstand"
label = "labels.objekt.leerstand"
sortable = true
width = "10%"
align = "center"
highlight_if = { condition = "> 0", color = "yellow" }

[[table.columns]]
field = "computed.gesamt_flaeche"
label = "labels.objekt.flaeche"
sortable = true
width = "15%"
format = "number"
suffix = " m²"

[table.row_actions]
edit = { icon = "Pencil", dialog = "forms/objekt.form" }
delete = { icon = "Trash2", confirm = true, confirm_message = "labels.confirm.objekt_loeschen" }
```

---

### `tables/einheiten.table.toml`

```toml
[table]
entity = "einheit"
row_click = "expand"

[[table.columns]]
field = "bezeichnung"
label = "labels.einheit.bezeichnung"
sortable = true
width = "25%"

[[table.columns]]
field = "typ"
label = "labels.einheit.typ"
sortable = true
width = "15%"
display = "badge"

[[table.columns]]
field = "flaeche"
label = "labels.einheit.flaeche"
sortable = true
width = "10%"
format = "number"
suffix = " m²"

[[table.columns]]
field = "computed.aktueller_mieter.computed.display_name"
label = "labels.einheit.mieter"
width = "25%"
empty_text = "—"

[[table.columns]]
field = "status"
label = "labels.einheit.status"
sortable = true
width = "15%"
display = "badge"
badge_colors = { vermietet = "green", leer = "red", eigennutzung = "blue", renovierung = "yellow" }

[table.row_actions]
edit = { icon = "Pencil", dialog = "forms/einheit.form" }
vertrag = { icon = "FileSignature", dialog = "forms/vertrag.form", visible_if = { field = "status", equals = "leer" }, label = "labels.actions.vertrag_anlegen" }
```

---

### `tables/mieter.table.toml`

```toml
[table]
entity = "mieter"
row_click = "navigate"
row_click_route = "/mieter/:id"

[[table.columns]]
field = "computed.display_name"
label = "labels.mieter.name"
sortable = true
sort_field = "nachname"
width = "25%"

[[table.columns]]
field = "telefon"
label = "labels.mieter.telefon"
width = "15%"

[[table.columns]]
field = "email"
label = "labels.mieter.email"
width = "20%"

[[table.columns]]
field = "computed.aktuelle_einheit.bezeichnung"
label = "labels.mieter.einheit"
width = "20%"
empty_text = "—"

[[table.columns]]
field = "status"
label = "labels.mieter.status"
sortable = true
width = "10%"
display = "badge"
badge_colors = { aktiv = "green", gekuendigt = "yellow", ehemalig = "gray" }

[table.row_actions]
edit = { icon = "Pencil", dialog = "forms/mieter.form" }
```

---

### `tables/vertraege.table.toml`

```toml
[table]
entity = "vertrag"
row_click = "navigate"
row_click_route = "/vertraege/:id"

[[table.columns]]
field = "vertragsnummer"
label = "labels.vertrag.vertragsnummer"
sortable = true
width = "10%"

[[table.columns]]
field = "mieter.computed.display_name"
label = "labels.vertrag.mieter"
sortable = true
width = "20%"

[[table.columns]]
field = "einheit.bezeichnung"
label = "labels.vertrag.einheit"
sortable = true
width = "15%"

[[table.columns]]
field = "beginn"
label = "labels.vertrag.beginn"
sortable = true
width = "10%"
format = "date"

[[table.columns]]
field = "ende"
label = "labels.vertrag.ende"
sortable = true
width = "10%"
format = "date"
empty_text = "unbefristet"

[[table.columns]]
field = "computed.gesamtmiete"
label = "labels.vertrag.gesamtmiete"
sortable = true
width = "12%"
format = "currency"

[[table.columns]]
field = "computed.ist_aktiv"
label = "labels.vertrag.status"
width = "10%"
display = "status_indicator"
status_map = { true = { label = "aktiv", color = "green" }, false = { label = "beendet", color = "gray" } }

[table.row_actions]
edit = { icon = "Pencil", dialog = "forms/vertrag.form" }
kuendigen = { icon = "XCircle", dialog = "dialogs/kuendigung", visible_if = { field = "computed.ist_aktiv", equals = true } }
```

---

### `tables/zahlungen.table.toml`

```toml
[table]
entity = "zahlung"

[[table.columns]]
field = "datum"
label = "labels.zahlung.datum"
sortable = true
width = "12%"
format = "date"

[[table.columns]]
field = "vertrag.mieter.computed.display_name"
label = "labels.zahlung.mieter"
sortable = true
width = "20%"

[[table.columns]]
field = "vertrag.einheit.bezeichnung"
label = "labels.zahlung.einheit"
width = "15%"

[[table.columns]]
field = "betrag"
label = "labels.zahlung.betrag"
sortable = true
width = "12%"
format = "currency"

[[table.columns]]
field = "typ"
label = "labels.zahlung.typ"
sortable = true
width = "12%"
display = "badge"

[[table.columns]]
field = "monat_fuer"
label = "labels.zahlung.monat_fuer"
sortable = true
width = "10%"
format = "month"

[[table.columns]]
field = "verwendungszweck"
label = "labels.zahlung.verwendungszweck"
width = "19%"
truncate = 30

[table.row_actions]
edit = { icon = "Pencil", dialog = "forms/zahlung.form" }
delete = { icon = "Trash2", confirm = true }
```

---

### `tables/sollstellungen.table.toml`

```toml
[table]
entity = "sollstellung"

[[table.columns]]
field = "monat"
label = "labels.sollstellung.monat"
sortable = true
width = "12%"
format = "month"

[[table.columns]]
field = "vertrag.mieter.computed.display_name"
label = "labels.sollstellung.mieter"
sortable = true
width = "22%"

[[table.columns]]
field = "vertrag.einheit.bezeichnung"
label = "labels.sollstellung.einheit"
width = "18%"

[[table.columns]]
field = "sollbetrag"
label = "labels.sollstellung.soll"
sortable = true
width = "12%"
format = "currency"

[[table.columns]]
field = "istbetrag"
label = "labels.sollstellung.ist"
sortable = true
width = "12%"
format = "currency"

[[table.columns]]
field = "computed.differenz"
label = "labels.sollstellung.differenz"
sortable = true
width = "12%"
format = "currency"
color_rule = { negative = "red", positive = "green", zero = "inherit" }

[[table.columns]]
field = "status"
label = "labels.sollstellung.status"
sortable = true
width = "12%"
display = "badge"
badge_colors = { offen = "red", teilweise = "yellow", bezahlt = "green", ueberzahlt = "blue" }

[table.row_actions]
zahlung = { icon = "Plus", dialog = "forms/zahlung.form", defaults = { vertrag_id = ":vertrag_id", monat_fuer = ":monat" } }
```

---

### `tables/rechnungen.table.toml`

```toml
[table]
entity = "rechnung"

[[table.columns]]
field = "rechnungsdatum"
label = "labels.rechnung.datum"
sortable = true
width = "10%"
format = "date"

[[table.columns]]
field = "objekt.bezeichnung"
label = "labels.rechnung.objekt"
sortable = true
width = "18%"

[[table.columns]]
field = "kostenart.bezeichnung"
label = "labels.rechnung.kostenart"
sortable = true
width = "15%"

[[table.columns]]
field = "rechnungsnummer"
label = "labels.rechnung.nummer"
width = "12%"

[[table.columns]]
field = "betrag"
label = "labels.rechnung.betrag"
sortable = true
width = "12%"
format = "currency"

[[table.columns]]
field = "zeitraum_von"
label = "labels.rechnung.zeitraum"
width = "15%"
template = "{zeitraum_von|date} - {zeitraum_bis|date}"

[[table.columns]]
field = "computed.ist_bezahlt"
label = "labels.rechnung.bezahlt"
sortable = true
width = "8%"
display = "boolean_icon"
icons = { true = "Check", false = "X" }

[[table.columns]]
field = "dokument_id"
label = ""
width = "5%"
display = "icon_link"
icon = "FileText"
visible_if = { field = "dokument_id", is_set = true }
click = "preview_document"

[table.row_actions]
edit = { icon = "Pencil", dialog = "forms/rechnung.form" }
bezahlen = { icon = "CheckCircle", handler = "rechnung.markAsPaid", visible_if = { field = "computed.ist_bezahlt", equals = false } }
dokument = { icon = "Upload", dialog = "forms/dokument.form", defaults = { objekt_id = ":objekt_id" } }
```

---

### `tables/zaehler.table.toml`

```toml
[table]
entity = "zaehler"

[[table.columns]]
field = "objekt.bezeichnung"
label = "labels.zaehler.objekt"
sortable = true
width = "20%"

[[table.columns]]
field = "einheit.bezeichnung"
label = "labels.zaehler.einheit"
width = "15%"
empty_text = "Hauptzähler"

[[table.columns]]
field = "typ"
label = "labels.zaehler.typ"
sortable = true
width = "12%"
display = "badge"

[[table.columns]]
field = "zaehlernummer"
label = "labels.zaehler.nummer"
width = "15%"

[[table.columns]]
field = "ist_hauptzaehler"
label = "labels.zaehler.haupt"
width = "8%"
display = "boolean_icon"

[[table.columns]]
field = "computed.letzter_stand.stand"
label = "labels.zaehler.letzter_stand"
width = "15%"
template = "{value} {messeinheit}"

[[table.columns]]
field = "computed.letzter_stand.datum"
label = "labels.zaehler.abgelesen_am"
sortable = true
width = "15%"
format = "date"

[table.row_actions]
ablesung = { icon = "Plus", dialog = "forms/zaehlerstand.form", defaults = { zaehler_id = ":id" } }
edit = { icon = "Pencil", dialog = "forms/zaehler.form" }
historie = { icon = "History", dialog = "dialogs/zaehler_historie" }
```

---

### `tables/dokumente.table.toml`

```toml
[table]
entity = "dokument"
selectable = true

[[table.columns]]
field = "bezeichnung"
label = "labels.dokument.bezeichnung"
sortable = true
width = "25%"

[[table.columns]]
field = "typ"
label = "labels.dokument.typ"
sortable = true
width = "10%"
display = "badge"

[[table.columns]]
field = "objekt.bezeichnung"
label = "labels.dokument.objekt"
sortable = true
width = "15%"
empty_text = "—"

[[table.columns]]
field = "mieter.computed.display_name"
label = "labels.dokument.mieter"
width = "15%"
empty_text = "—"

[[table.columns]]
field = "datum"
label = "labels.dokument.datum"
sortable = true
width = "10%"
format = "date"

[[table.columns]]
field = "jahr"
label = "labels.dokument.jahr"
sortable = true
width = "8%"

[[table.columns]]
field = "hochgeladen_am"
label = "labels.dokument.hochgeladen"
sortable = true
width = "12%"
format = "datetime"

[table.row_actions]
preview = { icon = "Eye", handler = "dokument.preview" }
download = { icon = "Download", handler = "dokument.download" }
edit = { icon = "Pencil", dialog = "forms/dokument.form" }
delete = { icon = "Trash2", confirm = true }
```

---

## 6. Form-Definitionen

### `forms/objekt.form.toml`

```toml
[form]
entity = "objekt"
title_create = "labels.form.objekt_anlegen"
title_edit = "labels.form.objekt_bearbeiten"

[[form.sections]]
id = "basis"
label = "labels.form.section.basis"

  [[form.sections.fields]]
  field = "bezeichnung"
  width = "full"

  [[form.sections.fields]]
  field = "typ"
  width = "half"

  [[form.sections.fields]]
  field = "ist_multi_einheit"
  width = "half"

[[form.sections]]
id = "adresse"
label = "labels.form.section.adresse"

  [[form.sections.fields]]
  field = "adresse"
  width = "full"

  [[form.sections.fields]]
  field = "plz"
  width = "third"

  [[form.sections.fields]]
  field = "ort"
  width = "two_thirds"

[[form.sections]]
id = "details"
label = "labels.form.section.details"

  [[form.sections.fields]]
  field = "baujahr"
  width = "half"

  [[form.sections.fields]]
  field = "notiz"
  width = "full"
  rows = 3

[form.actions]
submit = { label = "labels.actions.speichern" }
cancel = { label = "labels.actions.abbrechen" }
```

---

### `forms/einheit.form.toml`

```toml
[form]
entity = "einheit"
title_create = "labels.form.einheit_anlegen"
title_edit = "labels.form.einheit_bearbeiten"

[[form.sections]]
id = "basis"

  [[form.sections.fields]]
  field = "objekt_id"
  width = "full"
  readonly_on_edit = true

  [[form.sections.fields]]
  field = "bezeichnung"
  width = "half"

  [[form.sections.fields]]
  field = "typ"
  width = "half"

  [[form.sections.fields]]
  field = "flaeche"
  width = "third"

  [[form.sections.fields]]
  field = "anzahl_raeume"
  width = "third"

  [[form.sections.fields]]
  field = "etage"
  width = "third"

[[form.sections]]
id = "ausstattung"
label = "labels.form.section.ausstattung"

  [[form.sections.fields]]
  field = "ausstattung"
  width = "full"
  display = "checkbox_group"

[[form.sections]]
id = "status"

  [[form.sections.fields]]
  field = "status"
  width = "half"

  [[form.sections.fields]]
  field = "notiz"
  width = "full"
  rows = 2
```

---

### `forms/mieter.form.toml`

```toml
[form]
entity = "mieter"
title_create = "labels.form.mieter_anlegen"
title_edit = "labels.form.mieter_bearbeiten"

[[form.sections]]
id = "person"
label = "labels.form.section.person"

  [[form.sections.fields]]
  field = "anrede"
  width = "quarter"

  [[form.sections.fields]]
  field = "vorname"
  width = "third"

  [[form.sections.fields]]
  field = "nachname"
  width = "third"

  [[form.sections.fields]]
  field = "firma_zusatz"
  width = "full"

  [[form.sections.fields]]
  field = "geburtsdatum"
  width = "half"

[[form.sections]]
id = "kontakt"
label = "labels.form.section.kontakt"

  [[form.sections.fields]]
  field = "telefon"
  width = "half"

  [[form.sections.fields]]
  field = "email"
  width = "half"

  [[form.sections.fields]]
  field = "adresse_vorher"
  width = "full"
  rows = 2

[[form.sections]]
id = "bank"
label = "labels.form.section.bank"
collapsible = true

  [[form.sections.fields]]
  field = "iban"
  width = "half"

  [[form.sections.fields]]
  field = "bic"
  width = "quarter"

  [[form.sections.fields]]
  field = "bankname"
  width = "quarter"

[[form.sections]]
id = "sonstiges"

  [[form.sections.fields]]
  field = "status"
  width = "half"

  [[form.sections.fields]]
  field = "notiz"
  width = "full"
  rows = 2
```

---

### `forms/vertrag.form.toml`

```toml
[form]
entity = "vertrag"
title_create = "labels.form.vertrag_anlegen"
title_edit = "labels.form.vertrag_bearbeiten"

[[form.sections]]
id = "zuordnung"
label = "labels.form.section.zuordnung"

  [[form.sections.fields]]
  field = "einheit_id"
  width = "half"
  filter = { status = "leer" }
  include_current = true

  [[form.sections.fields]]
  field = "mieter_id"
  width = "half"
  allow_create = true

  [[form.sections.fields]]
  field = "vertragsnummer"
  width = "half"

  [[form.sections.fields]]
  field = "typ"
  width = "half"

[[form.sections]]
id = "laufzeit"
label = "labels.form.section.laufzeit"

  [[form.sections.fields]]
  field = "beginn"
  width = "third"

  [[form.sections.fields]]
  field = "ende"
  width = "third"

  [[form.sections.fields]]
  field = "kuendigungsfrist"
  width = "third"

[[form.sections]]
id = "miete"
label = "labels.form.section.miete"

  [[form.sections.fields]]
  field = "kaltmiete"
  width = "half"

  [[form.sections.fields]]
  field = "nebenkosten_vorauszahlung"
  width = "half"

  [[form.sections.fields]]
  field = "heizkosten_vorauszahlung"
  width = "half"

  [[form.sections.fields]]
  field = "sonstige_vorauszahlung"
  width = "half"

  [form.sections.computed_display]
  field = "computed.gesamtmiete"
  label = "labels.vertrag.gesamtmiete"
  format = "currency"
  highlight = true

[[form.sections]]
id = "anpassung"
label = "labels.form.section.mietanpassung"
collapsible = true

  [[form.sections.fields]]
  field = "mietanpassung_typ"
  width = "half"

  [[form.sections.fields]]
  field = "letzte_mieterhoehung"
  width = "half"

  [[form.sections.fields]]
  field = "staffelmiete"
  width = "full"
  component = "StaffelmieteEditor"

  [[form.sections.fields]]
  field = "indexmiete"
  width = "full"
  component = "IndexmieteEditor"

[[form.sections]]
id = "sonstiges"

  [[form.sections.fields]]
  field = "notiz"
  width = "full"
  rows = 3

[form.on_save]
actions = [
  { action = "update_einheit_status", target = "einheit_id", set = { status = "vermietet" } },
  { action = "update_mieter_status", target = "mieter_id", set = { status = "aktiv" } },
  { action = "generate_sollstellungen", from = "beginn" }
]
```

---

### `forms/zahlung.form.toml`

```toml
[form]
entity = "zahlung"
title_create = "labels.form.zahlung_erfassen"
title_edit = "labels.form.zahlung_bearbeiten"

[[form.sections]]
id = "zahlung"

  [[form.sections.fields]]
  field = "vertrag_id"
  width = "full"
  display_template = "{mieter.computed.display_name} - {einheit.bezeichnung}"
  filter = { "computed.ist_aktiv" = true }

  [[form.sections.fields]]
  field = "datum"
  width = "third"
  default = "today"

  [[form.sections.fields]]
  field = "betrag"
  width = "third"

  [[form.sections.fields]]
  field = "typ"
  width = "third"

  [[form.sections.fields]]
  field = "monat_fuer"
  width = "half"
  default = "current_month"

  [[form.sections.fields]]
  field = "verwendungszweck"
  width = "full"

  [[form.sections.fields]]
  field = "notiz"
  width = "full"
  rows = 2

[form.on_save]
actions = [
  { action = "update_sollstellung", match = { vertrag_id = ":vertrag_id", monat = ":monat_fuer" } }
]
```

---

### `forms/rechnung.form.toml`

```toml
[form]
entity = "rechnung"
title_create = "labels.form.rechnung_erfassen"
title_edit = "labels.form.rechnung_bearbeiten"

[[form.sections]]
id = "zuordnung"
label = "labels.form.section.zuordnung"

  [[form.sections.fields]]
  field = "objekt_id"
  width = "half"

  [[form.sections.fields]]
  field = "kostenart_id"
  width = "half"

  [[form.sections.fields]]
  field = "einheit_id"
  width = "half"

[[form.sections]]
id = "rechnung"
label = "labels.form.section.rechnung"

  [[form.sections.fields]]
  field = "rechnungsnummer"
  width = "half"

  [[form.sections.fields]]
  field = "rechnungsdatum"
  width = "half"

  [[form.sections.fields]]
  field = "betrag"
  width = "third"

  [[form.sections.fields]]
  field = "faelligkeitsdatum"
  width = "third"

  [[form.sections.fields]]
  field = "bezahlt_am"
  width = "third"

[[form.sections]]
id = "zeitraum"
label = "labels.form.section.zeitraum"

  [[form.sections.fields]]
  field = "zeitraum_von"
  width = "half"

  [[form.sections.fields]]
  field = "zeitraum_bis"
  width = "half"

[[form.sections]]
id = "dokument"
label = "labels.form.section.dokument"

  [[form.sections.fields]]
  field = "dokument_id"
  width = "full"
  component = "DokumentUploadOrSelect"
  upload_defaults = { typ = "rechnung", objekt_id = ":objekt_id" }

  [[form.sections.fields]]
  field = "notiz"
  width = "full"
  rows = 2
```

---

### `forms/zaehlerstand.form.toml`

```toml
[form]
entity = "zaehlerstand"
title_create = "labels.form.ablesung_erfassen"

[[form.sections]]
id = "ablesung"

  [[form.sections.fields]]
  field = "zaehler_id"
  width = "full"
  display_template = "{objekt.bezeichnung} - {computed.bezeichnung_display}"

  [[form.sections.fields]]
  field = "datum"
  width = "third"
  default = "today"

  [[form.sections.fields]]
  field = "stand"
  width = "third"

  [[form.sections.fields]]
  field = "ableseart"
  width = "third"

  [[form.sections.fields]]
  field = "foto"
  width = "full"
  component = "ImageUpload"

  [[form.sections.fields]]
  field = "notiz"
  width = "full"
  rows = 2

[form.info_panel]
show = true
title = "labels.form.letzter_stand"
fields = [
  { label = "labels.zaehlerstand.datum", value = "zaehler.computed.letzter_stand.datum", format = "date" },
  { label = "labels.zaehlerstand.stand", value = "zaehler.computed.letzter_stand.stand" }
]
```

---

### `forms/dokument.form.toml`

```toml
[form]
entity = "dokument"
title_create = "labels.form.dokument_hochladen"
title_edit = "labels.form.dokument_bearbeiten"

[[form.sections]]
id = "datei"

  [[form.sections.fields]]
  field = "file_upload"
  type = "file"
  width = "full"
  accept = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"]
  max_size_mb = 25
  component = "FileDropzone"
  visible_on_create = true

[[form.sections]]
id = "details"

  [[form.sections.fields]]
  field = "bezeichnung"
  width = "full"

  [[form.sections.fields]]
  field = "typ"
  width = "half"

  [[form.sections.fields]]
  field = "datum"
  width = "half"

  [[form.sections.fields]]
  field = "jahr"
  width = "half"
  default = "current_year"

[[form.sections]]
id = "zuordnung"
label = "labels.form.section.zuordnung"

  [[form.sections.fields]]
  field = "objekt_id"
  width = "half"

  [[form.sections.fields]]
  field = "einheit_id"
  width = "half"
  filter_by = "objekt_id"

  [[form.sections.fields]]
  field = "mieter_id"
  width = "half"

  [[form.sections.fields]]
  field = "vertrag_id"
  width = "half"
  filter_by = "mieter_id"
```

---

## 7. Kataloge

### `catalogs/kostenarten.catalog.toml`

```toml
[catalog]
name = "kostenarten"
description = "Standard-Kostenarten nach BetrKV"

[[catalog.items]]
bezeichnung = "Grundsteuer"
kategorie = "umlagefaehig"
umlageschluessel = "flaeche"
sortierung = 10

[[catalog.items]]
bezeichnung = "Wasserversorgung"
kategorie = "umlagefaehig"
umlageschluessel = "verbrauch"
sortierung = 20

[[catalog.items]]
bezeichnung = "Abwasser"
kategorie = "umlagefaehig"
umlageschluessel = "verbrauch"
sortierung = 30

[[catalog.items]]
bezeichnung = "Heizung"
kategorie = "umlagefaehig"
umlageschluessel = "verbrauch"
sortierung = 40

[[catalog.items]]
bezeichnung = "Warmwasser"
kategorie = "umlagefaehig"
umlageschluessel = "verbrauch"
sortierung = 50

[[catalog.items]]
bezeichnung = "Aufzug"
kategorie = "umlagefaehig"
umlageschluessel = "personen"
sortierung = 60

[[catalog.items]]
bezeichnung = "Straßenreinigung"
kategorie = "umlagefaehig"
umlageschluessel = "flaeche"
sortierung = 70

[[catalog.items]]
bezeichnung = "Müllabfuhr"
kategorie = "umlagefaehig"
umlageschluessel = "personen"
sortierung = 80

[[catalog.items]]
bezeichnung = "Hausreinigung"
kategorie = "umlagefaehig"
umlageschluessel = "flaeche"
sortierung = 90

[[catalog.items]]
bezeichnung = "Gartenpflege"
kategorie = "umlagefaehig"
umlageschluessel = "flaeche"
sortierung = 100

[[catalog.items]]
bezeichnung = "Beleuchtung (Allgemein)"
kategorie = "umlagefaehig"
umlageschluessel = "einheiten"
sortierung = 110

[[catalog.items]]
bezeichnung = "Schornsteinreinigung"
kategorie = "umlagefaehig"
umlageschluessel = "einheiten"
sortierung = 120

[[catalog.items]]
bezeichnung = "Versicherung (Gebäude)"
kategorie = "umlagefaehig"
umlageschluessel = "flaeche"
sortierung = 130

[[catalog.items]]
bezeichnung = "Hausmeister"
kategorie = "umlagefaehig"
umlageschluessel = "flaeche"
sortierung = 140

[[catalog.items]]
bezeichnung = "Gemeinschaftsantenne/Kabel"
kategorie = "umlagefaehig"
umlageschluessel = "einheiten"
sortierung = 150

[[catalog.items]]
bezeichnung = "Sonstige Betriebskosten"
kategorie = "umlagefaehig"
umlageschluessel = "flaeche"
sortierung = 160

# Gewerbe-spezifisch
[[catalog.items]]
bezeichnung = "Strom (Allgemein)"
kategorie = "umlagefaehig"
umlageschluessel = "verbrauch"
nur_gewerbe = true
sortierung = 200

# Nicht umlagefähig
[[catalog.items]]
bezeichnung = "Instandhaltung"
kategorie = "nicht_umlagefaehig"
umlageschluessel = "flaeche"
sortierung = 300

[[catalog.items]]
bezeichnung = "Verwaltungskosten"
kategorie = "nicht_umlagefaehig"
umlageschluessel = "flaeche"
sortierung = 310
```

---

### `catalogs/umlageschluessel.catalog.toml`

```toml
[catalog]
name = "umlageschluessel"
description = "Verfügbare Umlageschlüssel für Nebenkostenabrechnung"

[[catalog.items]]
id = "flaeche"
bezeichnung = "Nach Wohnfläche (m²)"
beschreibung = "Kosten werden nach Quadratmeter der Einheit verteilt"
formel = "einheit.flaeche / sum(alle_einheiten.flaeche)"
beispiel = "50 m² von 200 m² gesamt = 25% Anteil"

[[catalog.items]]
id = "personen"
bezeichnung = "Nach Personenzahl"
beschreibung = "Kosten werden nach Anzahl der Bewohner verteilt"
formel = "einheit.personen / sum(alle_einheiten.personen)"
beispiel = "2 von 8 Personen gesamt = 25% Anteil"
hinweis = "Personenzahl muss pro Einheit gepflegt werden"

[[catalog.items]]
id = "einheiten"
bezeichnung = "Nach Anzahl Einheiten"
beschreibung = "Kosten werden gleichmäßig auf alle Einheiten verteilt"
formel = "1 / count(alle_einheiten)"
beispiel = "4 Einheiten = je 25% Anteil"

[[catalog.items]]
id = "verbrauch"
bezeichnung = "Nach Verbrauch"
beschreibung = "Kosten werden nach tatsächlichem Verbrauch (Zähler) verteilt"
formel = "einheit.verbrauch / sum(alle_einheiten.verbrauch)"
beispiel = "1000 kWh von 4000 kWh gesamt = 25% Anteil"
voraussetzung = "Unterzähler pro Einheit erforderlich"

[[catalog.items]]
id = "direkt"
bezeichnung = "Direktzuordnung"
beschreibung = "Kosten werden 1:1 einer bestimmten Einheit zugeordnet"
formel = "100% für zugeordnete Einheit"
beispiel = "Reparatur in Wohnung A = 100% Wohnung A"
```

---

## 8. Labels

### `labels/de.labels.toml`

```toml
# Navigation
[labels.nav]
dashboard = "Dashboard"
objekte = "Objekte"
mieter = "Mieter"
vertraege = "Verträge"
finanzen = "Finanzen"
zahlungen = "Zahlungen"
kautionen = "Kautionen"
sollstellung = "Sollstellung"
nebenkosten = "Nebenkosten"
rechnungen = "Rechnungen"
abrechnungen = "Abrechnungen"
zaehler = "Zähler"
dokumente = "Dokumente"
einstellungen = "Einstellungen"

# Views
[labels.views]
dashboard = "Übersicht"
objekte = "Objekte"
mieter = "Mieter"
vertraege = "Verträge"
finanzen = "Finanzen"
nebenkosten = "Nebenkosten"
dokumente = "Dokumente"
einstellungen = "Einstellungen"

# Entities
[labels.entity]
objekt = "Objekt"
objekte = "Objekte"
einheit = "Einheit"
einheiten = "Einheiten"
mieter = "Mieter"
mieter_plural = "Mieter"
vertrag = "Vertrag"
vertraege = "Verträge"
kaution = "Kaution"
kautionen = "Kautionen"
zaehler = "Zähler"
zaehler_plural = "Zähler"
zaehlerstand = "Zählerstand"
zaehlerstaende = "Zählerstände"
kostenart = "Kostenart"
kostenarten = "Kostenarten"
rechnung = "Rechnung"
rechnungen = "Rechnungen"
zahlung = "Zahlung"
zahlungen = "Zahlungen"
sollstellung = "Sollstellung"
sollstellungen = "Sollstellungen"
nebenkostenabrechnung = "Nebenkostenabrechnung"
nebenkostenabrechnungen = "Nebenkostenabrechnungen"
dokument = "Dokument"
dokumente = "Dokumente"
erinnerung = "Erinnerung"
erinnerungen = "Erinnerungen"

# Objekt Fields
[labels.objekt]
bezeichnung = "Bezeichnung"
adresse = "Adresse"
plz = "PLZ"
ort = "Ort"
baujahr = "Baujahr"
typ = "Typ"
ist_multi_einheit = "Mehrere Einheiten"
einheiten = "Einheiten"
leerstand = "Leerstand"
flaeche = "Gesamtfläche"

# Einheit Fields
[labels.einheit]
bezeichnung = "Bezeichnung"
objekt = "Objekt"
typ = "Typ"
flaeche = "Fläche"
anzahl_raeume = "Räume"
etage = "Etage"
ausstattung = "Ausstattung"
status = "Status"
mieter = "Aktueller Mieter"

# Mieter Fields
[labels.mieter]
anrede = "Anrede"
vorname = "Vorname"
nachname = "Nachname"
name = "Name"
firma_zusatz = "Firmenzusatz"
geburtsdatum = "Geburtsdatum"
telefon = "Telefon"
email = "E-Mail"
adresse_vorher = "Vorherige Anschrift"
iban = "IBAN"
bic = "BIC"
bankname = "Bank"
status = "Status"
einheit = "Aktuelle Einheit"

# Vertrag Fields
[labels.vertrag]
vertragsnummer = "Vertragsnr."
einheit = "Einheit"
mieter = "Mieter"
typ = "Vertragstyp"
beginn = "Beginn"
ende = "Ende"
kuendigungsfrist = "Kündigungsfrist"
kuendigung_zum = "Gekündigt zum"
gekuendigt_von = "Gekündigt von"
kaltmiete = "Kaltmiete"
nebenkosten_vorauszahlung = "NK-Vorauszahlung"
heizkosten_vorauszahlung = "HK-Vorauszahlung"
sonstige_vorauszahlung = "Sonstige"
gesamtmiete = "Gesamtmiete"
mietanpassung_typ = "Mietanpassung"
staffelmiete = "Staffelmiete"
indexmiete = "Indexmiete"
letzte_mieterhoehung = "Letzte Erhöhung"
status = "Status"

# Kaution Fields
[labels.kaution]
betrag = "Betrag"
eingangsdatum = "Eingang"
anlageform = "Anlageform"
anlage_details = "Details zur Anlage"
zinssatz = "Zinssatz"
status = "Status"
rueckzahlungsdatum = "Rückzahlung"
rueckzahlungsbetrag = "Rückzahlungsbetrag"
einbehalt_grund = "Einbehalt Grund"
keine_kaution = "Keine Kaution hinterlegt"

# Zähler Fields
[labels.zaehler]
objekt = "Objekt"
einheit = "Einheit"
typ = "Typ"
nummer = "Zählernummer"
zaehlernummer = "Zählernummer"
ist_hauptzaehler = "Hauptzähler"
haupt = "Haupt"
messeinheit = "Einheit"
letzter_stand = "Letzter Stand"
abgelesen_am = "Abgelesen am"

# Zählerstand Fields
[labels.zaehlerstand]
zaehler = "Zähler"
datum = "Datum"
stand = "Stand"
ableseart = "Ableseart"
foto = "Foto"

# Kostenart Fields
[labels.kostenart]
bezeichnung = "Bezeichnung"
kategorie = "Kategorie"
umlageschluessel = "Umlageschlüssel"
nur_gewerbe = "Nur Gewerbe"
sortierung = "Sortierung"
aktiv = "Aktiv"

# Rechnung Fields
[labels.rechnung]
objekt = "Objekt"
kostenart = "Kostenart"
einheit = "Einheit"
nummer = "Rechnungsnr."
rechnungsnummer = "Rechnungsnr."
datum = "Rechnungsdatum"
rechnungsdatum = "Rechnungsdatum"
faelligkeitsdatum = "Fällig am"
betrag = "Betrag"
zeitraum = "Zeitraum"
zeitraum_von = "Zeitraum von"
zeitraum_bis = "Zeitraum bis"
bezahlt_am = "Bezahlt am"
bezahlt = "Bezahlt"
dokument = "Beleg"

# Zahlung Fields
[labels.zahlung]
vertrag = "Vertrag"
datum = "Datum"
betrag = "Betrag"
verwendungszweck = "Verwendungszweck"
typ = "Typ"
monat_fuer = "Für Monat"
mieter = "Mieter"
einheit = "Einheit"

# Sollstellung Fields
[labels.sollstellung]
vertrag = "Vertrag"
monat = "Monat"
soll = "Soll"
sollbetrag = "Soll"
ist = "Ist"
istbetrag = "Ist"
differenz = "Differenz"
status = "Status"
mieter = "Mieter"
einheit = "Einheit"

# Nebenkosten Fields
[labels.nk]
objekt = "Objekt"
jahr = "Jahr"
zeitraum_von = "Von"
zeitraum_bis = "Bis"
status = "Status"
gesamtkosten = "Gesamtkosten"
anteil_mieter = "Anteil Mieter"
vorauszahlungen = "Vorauszahlungen"
ergebnis = "Ergebnis"
details = "Details"

# Dokument Fields
[labels.dokument]
bezeichnung = "Bezeichnung"
typ = "Typ"
objekt = "Objekt"
einheit = "Einheit"
mieter = "Mieter"
vertrag = "Vertrag"
datum = "Dokumentdatum"
jahr = "Jahr"
dateiname = "Dateiname"
dateipfad = "Pfad"
dateigroesse = "Größe"
mime_type = "Dateityp"
hochgeladen = "Hochgeladen"
hochgeladen_am = "Hochgeladen am"

# Erinnerung Fields
[labels.erinnerung]
typ = "Typ"
bezug_typ = "Bezug"
bezug_id = "Bezugs-ID"
faellig_am = "Fällig am"
titel = "Titel"
beschreibung = "Beschreibung"
status = "Status"

# Common
[labels.common]
notiz = "Notiz"
erstellt_am = "Erstellt am"

# Dashboard
[labels.dashboard]
monatsuebersicht = "Monatsübersicht"
soll_gesamt = "Soll (gesamt)"
ist_gesamt = "Eingegangen"
offen = "Offen"
offene_posten = "Offene Posten"
erinnerungen = "Erinnerungen"
keine_erinnerungen = "Keine offenen Erinnerungen"
leerstand = "Leerstand"
einheiten_leer = "Einheiten leer"
schnellzugriff = "Schnellzugriff"

# Tabs
[labels.tabs]
stammdaten = "Stammdaten"
einheiten = "Einheiten"
zaehler = "Zähler"
rechnungen = "Rechnungen"
dokumente = "Dokumente"
vertrag = "Vertrag"
zahlungen = "Zahlungen"
kaution = "Kaution"
konditionen = "Konditionen"
sollstellung = "Sollstellung"
abrechnungen = "Abrechnungen"

# Actions
[labels.actions]
speichern = "Speichern"
abbrechen = "Abbrechen"
bearbeiten = "Bearbeiten"
loeschen = "Löschen"
objekt_anlegen = "Objekt anlegen"
einheit_anlegen = "Einheit anlegen"
mieter_anlegen = "Mieter anlegen"
vertrag_anlegen = "Vertrag anlegen"
zahlung_erfassen = "Zahlung erfassen"
rechnung_erfassen = "Rechnung erfassen"
zaehler_anlegen = "Zähler anlegen"
ablesung_erfassen = "Ablesung erfassen"
dokument_hochladen = "Dokument hochladen"
abrechnung_erstellen = "Abrechnung erstellen"
steuerberater_export = "Steuerberater-Export"
backup_erstellen = "Backup erstellen"
backup_wiederherstellen = "Backup wiederherstellen"

# Filters
[labels.filter]
typ = "Typ"
status = "Status"
nur_aktive = "Nur aktive"
objekt = "Objekt"
kostenart = "Kostenart"
jahr = "Jahr"
zeitraum = "Zeitraum"
bezahlt = "Bezahlt"
mit_leerstand = "Mit Leerstand"

# Form Sections
[labels.form]
objekt_anlegen = "Objekt anlegen"
objekt_bearbeiten = "Objekt bearbeiten"
einheit_anlegen = "Einheit anlegen"
einheit_bearbeiten = "Einheit bearbeiten"
mieter_anlegen = "Mieter anlegen"
mieter_bearbeiten = "Mieter bearbeiten"
vertrag_anlegen = "Vertrag anlegen"
vertrag_bearbeiten = "Vertrag bearbeiten"
zahlung_erfassen = "Zahlung erfassen"
zahlung_bearbeiten = "Zahlung bearbeiten"
rechnung_erfassen = "Rechnung erfassen"
rechnung_bearbeiten = "Rechnung bearbeiten"
ablesung_erfassen = "Zählerstand erfassen"
dokument_hochladen = "Dokument hochladen"
dokument_bearbeiten = "Dokument bearbeiten"
letzter_stand = "Letzter erfasster Stand"

[labels.form.section]
basis = "Basisdaten"
adresse = "Adresse"
details = "Details"
person = "Person"
kontakt = "Kontakt"
bank = "Bankverbindung"
zuordnung = "Zuordnung"
laufzeit = "Laufzeit"
miete = "Mietkonditionen"
mietanpassung = "Mietanpassung"
ausstattung = "Ausstattung"
rechnung = "Rechnungsdaten"
zeitraum = "Abrechnungszeitraum"
dokument = "Beleg"
sonstiges = "Sonstiges"

# Settings
[labels.settings]
eigentuemer = "Eigentümer"
eigentuemer_desc = "Stammdaten des Eigentümers für Dokumente und Korrespondenz"
kostenarten = "Kostenarten"
kostenarten_desc = "Verwaltung der Kostenarten für Nebenkostenabrechnung"
umlageschluessel = "Umlageschlüssel"
umlageschluessel_desc = "Übersicht der verfügbaren Verteilungsschlüssel"
backup = "Datensicherung"
backup_desc = "Backup erstellen oder wiederherstellen"

# Validation
[labels.validation]
ende_nach_beginn = "Ende muss nach Beginn liegen"
kuendigung_von_fehlt = "Bitte angeben, wer gekündigt hat"
dokument_zuordnung = "Dokument muss mindestens einem Objekt, Mieter oder Vertrag zugeordnet sein"

# Confirm
[labels.confirm]
objekt_loeschen = "Objekt wirklich löschen? Alle zugehörigen Einheiten und Daten werden ebenfalls gelöscht."

# Enums
[labels.enum.objekt_typ]
wohnraum = "Wohnraum"
gewerbe = "Gewerbe"
gemischt = "Gemischt"

[labels.enum.einheit_typ]
wohnung = "Wohnung"
gewerbe = "Gewerbe"
stellplatz = "Stellplatz"
keller = "Keller"
sonstig = "Sonstig"

[labels.enum.einheit_status]
vermietet = "Vermietet"
leer = "Leer"
eigennutzung = "Eigennutzung"
renovierung = "Renovierung"

[labels.enum.mieter_status]
aktiv = "Aktiv"
gekuendigt = "Gekündigt"
ehemalig = "Ehemalig"

[labels.enum.mieter_anrede]
herr = "Herr"
frau = "Frau"
firma = "Firma"
divers = "Divers"

[labels.enum.kaution_anlageform]
sparbuch = "Sparbuch"
konto = "Konto"
buergschaft = "Bürgschaft"
bar = "Bar"

[labels.enum.kaution_status]
angelegt = "Angelegt"
teilrueckzahlung = "Teilrückzahlung"
zurueckgezahlt = "Zurückgezahlt"

[labels.enum.zaehler_typ]
strom = "Strom"
gas = "Gas"
wasser = "Wasser"
heizung = "Heizung"
warmwasser = "Warmwasser"

[labels.enum.ableseart]
selbst = "Selbst abgelesen"
versorger = "Versorger"
schaetzung = "Schätzung"

[labels.enum.kostenart_kategorie]
umlagefaehig = "Umlagefähig"
nicht_umlagefaehig = "Nicht umlagefähig"

[labels.enum.umlageschluessel]
flaeche = "Nach Fläche"
personen = "Nach Personen"
einheiten = "Nach Einheiten"
verbrauch = "Nach Verbrauch"
direkt = "Direkt"

[labels.enum.zahlung_typ]
miete = "Miete"
nachzahlung = "Nachzahlung"
kaution = "Kaution"
sonstig = "Sonstig"

[labels.enum.sollstellung_status]
offen = "Offen"
teilweise = "Teilweise"
bezahlt = "Bezahlt"
ueberzahlt = "Überzahlt"

[labels.enum.nk_status]
entwurf = "Entwurf"
erstellt = "Erstellt"
versendet = "Versendet"

[labels.enum.dokument_typ]
rechnung = "Rechnung"
vertrag = "Vertrag"
ausweis = "Ausweis"
korrespondenz = "Korrespondenz"
foto = "Foto"
sonstig = "Sonstig"

[labels.enum.erinnerung_typ]
mieterhoehung = "Mieterhöhung möglich"
vertragsende = "Vertragsende"
zaehlerablesung = "Zählerablesung"
rueckstand = "Zahlungsrückstand"
nk_abrechnung = "NK-Abrechnung fällig"
kaution_rueckzahlung = "Kautionsrückzahlung"
sonstig = "Sonstig"

[labels.enum.erinnerung_status]
offen = "Offen"
erledigt = "Erledigt"
zurueckgestellt = "Zurückgestellt"

[labels.enum.mietanpassung_typ]
keine = "Keine"
mietspiegel = "Mietspiegel"
staffel = "Staffelmiete"
index = "Indexmiete"

[labels.enum.einheit_ausstattung]
balkon = "Balkon"
terrasse = "Terrasse"
keller = "Keller"
stellplatz = "Stellplatz"
einbaukueche = "Einbauküche"
aufzug = "Aufzug"
gaeste_wc = "Gäste-WC"
```

---

## 9. PDF-Templates

### `pdf/nebenkostenabrechnung.template.toml`

```toml
[template]
name = "nebenkostenabrechnung"
title = "Nebenkostenabrechnung"
page_size = "A4"
margins = { top = 25, right = 20, bottom = 25, left = 20 }

[template.header]
show_logo = false
show_owner = true
owner_fields = ["name", "adresse", "telefon", "email"]

[template.content]
  [[template.content.sections]]
  type = "address_block"
  data = "mieter"
  fields = ["anrede", "vorname", "nachname", "einheit.objekt.adresse", "einheit.objekt.plz", "einheit.objekt.ort"]

  [[template.content.sections]]
  type = "title"
  text = "Betriebskostenabrechnung {jahr}"

  [[template.content.sections]]
  type = "info_block"
  items = [
    { label = "Objekt", value = "objekt.bezeichnung" },
    { label = "Einheit", value = "einheit.bezeichnung" },
    { label = "Abrechnungszeitraum", value = "{zeitraum_von|date} bis {zeitraum_bis|date}" },
    { label = "Ihre Wohnfläche", value = "{einheit.flaeche} m²" },
    { label = "Gesamtfläche", value = "{objekt.computed.gesamt_flaeche} m²" }
  ]

  [[template.content.sections]]
  type = "table"
  title = "Kostenaufstellung"
  columns = [
    { field = "kostenart", label = "Kostenart", width = "30%" },
    { field = "gesamtkosten", label = "Gesamtkosten", width = "20%", format = "currency" },
    { field = "umlageschluessel", label = "Schlüssel", width = "15%" },
    { field = "anteil", label = "Ihr Anteil", width = "15%", format = "percent" },
    { field = "betrag", label = "Betrag", width = "20%", format = "currency" }
  ]
  data = "details"
  show_sum = true
  sum_column = "betrag"
  sum_label = "Summe Betriebskosten"

  [[template.content.sections]]
  type = "calculation"
  items = [
    { label = "Summe Betriebskosten", value = "anteil_mieter", format = "currency" },
    { label = "Ihre Vorauszahlungen", value = "vorauszahlungen", format = "currency", prefix = "./." },
    { label = "Ergebnis", value = "ergebnis", format = "currency", highlight = true }
  ]

  [[template.content.sections]]
  type = "result_text"
  positive = "Es ergibt sich eine Nachzahlung von {ergebnis|currency}. Bitte überweisen Sie den Betrag bis zum {faelligkeit|date}."
  negative = "Es ergibt sich ein Guthaben von {ergebnis|currency|abs}. Der Betrag wird Ihnen in Kürze überwiesen."
  zero = "Die Abrechnung ist ausgeglichen."

[template.footer]
show_page_numbers = true
text = "Bei Rückfragen wenden Sie sich bitte an den Vermieter."
```

---

## Zusammenfassung

**Gesamtstruktur:**

| Kategorie | Anzahl |
|-----------|--------|
| Entity-Definitionen | 15 |
| View-Konfigurationen | 9 |
| Form-Definitionen | 10 |
| Table-Definitionen | 8 |
| Kataloge | 2 |
| Label-Datei (DE) | 1 |
| PDF-Templates | 1 |

**Nächste Schritte wenn bereit:**

1. Projekt-Setup auf ABC-PC-HOME
2. TOML-Parser + Config-Loader implementieren
3. Basis-Komponenten (Table, Form, Dialog) erstellen
4. Erste Views umsetzen
