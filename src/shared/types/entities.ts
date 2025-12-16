// Base Entity Interface
export interface BaseEntity {
  id: string
  erstellt_am: string
  aktualisiert_am?: string
}

// Objekt (Immobilie)
export interface Objekt extends BaseEntity {
  bezeichnung: string
  adresse: string
  plz: string
  ort: string
  baujahr?: number
  typ: 'wohnraum' | 'gewerbe' | 'gemischt'
  ist_multi_einheit: boolean
  notiz?: string
}

// Einheit (Wohnung, Gewerbe, Stellplatz)
export interface Einheit extends BaseEntity {
  objekt_id: string
  bezeichnung: string
  typ: 'wohnung' | 'gewerbe' | 'stellplatz' | 'sonstige'
  flaeche?: number
  etage?: string
  zimmer?: number
  status: 'vermietet' | 'leer' | 'eigennutzung' | 'renovierung'
  notiz?: string
}

// Mieter
export interface Mieter extends BaseEntity {
  anrede: 'herr' | 'frau' | 'firma' | 'divers'
  vorname?: string
  nachname: string
  firma?: string
  email?: string
  telefon?: string
  mobil?: string
  iban?: string
  bic?: string
  status: 'aktiv' | 'gekuendigt' | 'ehemalig'
  notiz?: string
}

// Vertrag
export interface Vertrag extends BaseEntity {
  einheit_id: string
  mieter_id: string
  vertragsnummer?: string
  typ: 'wohnraum' | 'gewerbe'
  beginn: string
  ende?: string
  kuendigungsfrist: number
  kuendigung_zum?: string
  gekuendigt_von?: 'mieter' | 'vermieter'
  kaltmiete: number
  nebenkosten_vorauszahlung: number
  heizkosten_vorauszahlung: number
  sonstige_vorauszahlung: number
  mietanpassung_typ: 'keine' | 'mietspiegel' | 'staffel' | 'index'
  staffelmiete?: StaffelmieteEintrag[]
  indexmiete?: IndexmieteConfig
  letzte_mieterhoehung?: string
  notiz?: string
}

export interface StaffelmieteEintrag {
  ab: string
  kaltmiete: number
}

export interface IndexmieteConfig {
  basisjahr: number
  basisindex: number
  schwelle_prozent: number
}

// Kaution
export interface Kaution extends BaseEntity {
  vertrag_id: string
  betrag: number
  eingangsdatum?: string
  anlageform: 'konto' | 'buergschaft' | 'bar'
  kontonummer?: string
  zinssatz?: number
  status: 'offen' | 'eingegangen' | 'teilweise' | 'ausgezahlt'
  notiz?: string
}

// Zahlung
export interface Zahlung extends BaseEntity {
  vertrag_id: string
  datum: string
  betrag: number
  typ: 'miete' | 'kaution' | 'nachzahlung' | 'sonstige'
  monat_fuer?: string
  buchungstext?: string
  notiz?: string
}

// Sollstellung
export interface Sollstellung extends BaseEntity {
  vertrag_id: string
  monat: string
  sollbetrag: number
  istbetrag: number
  differenz: number
  status: 'offen' | 'teilweise' | 'bezahlt' | 'ueberzahlt'
}

// Zähler
export interface Zaehler extends BaseEntity {
  objekt_id?: string
  einheit_id?: string
  typ: 'strom' | 'gas' | 'wasser' | 'heizung' | 'sonstige'
  zaehlernummer: string
  messeinheit: string
  ist_hauptzaehler: boolean
  notiz?: string
}

// Zählerstand
export interface Zaehlerstand extends BaseEntity {
  zaehler_id: string
  datum: string
  stand: number
  ableseart: 'selbst' | 'versorger' | 'schaetzung'
  notiz?: string
}

// Rechnung (NK-relevant)
export interface Rechnung extends BaseEntity {
  objekt_id: string
  kostenart_id: string
  rechnungsdatum: string
  betrag: number
  zeitraum_von: string
  zeitraum_bis: string
  rechnungsnummer?: string
  lieferant?: string
  notiz?: string
}

// Dokument
export interface Dokument extends BaseEntity {
  objekt_id?: string
  mieter_id?: string
  vertrag_id?: string
  bezeichnung: string
  typ: 'vertrag' | 'rechnung' | 'korrespondenz' | 'ausweis' | 'sonstige'
  dateipfad: string
  datum?: string
  notiz?: string
}

// Erinnerung
export interface Erinnerung extends BaseEntity {
  typ: 'zaehlerablesung' | 'vertragsende' | 'nk_abrechnung' | 'mieterhoehung' | 'sonstige'
  faellig_am: string
  titel: string
  beschreibung?: string
  entity_typ?: string
  entity_id?: string
  status: 'offen' | 'erledigt' | 'verschoben'
}
