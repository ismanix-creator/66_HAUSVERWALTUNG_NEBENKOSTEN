import type { DashboardSummary } from './dashboard'

export interface ReminderOverview {
  id: string
  titel: string
  faellig_am: string | null
  bezug_typ: string | null
}

export interface InvoiceOverview {
  id: string
  rechnungsnummer: string | null
  rechnungsdatum: string | null
  faelligkeitsdatum: string | null
  betrag: number
}

export interface MobileSnapshot {
  summary: DashboardSummary
  reminders: ReminderOverview[]
  outstandingInvoices: InvoiceOverview[]
}
