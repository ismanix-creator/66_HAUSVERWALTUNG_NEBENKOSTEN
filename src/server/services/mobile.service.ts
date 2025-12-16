import { dashboardService } from './dashboard.service'
import { databaseService } from './database.service'
import { schemaService } from './schema.service'
import type { MobileSnapshot, ReminderOverview, InvoiceOverview } from '@shared/types/mobile'

class MobileService {
  private readonly reminderLimit = 5
  private readonly invoiceLimit = 5

  async getSnapshot(): Promise<MobileSnapshot> {
    const [summary, reminders, outstandingInvoices] = await Promise.all([
      dashboardService.getSummary(),
      this.getOpenReminders(),
      this.getOutstandingInvoices(),
    ])

    return {
      summary,
      reminders,
      outstandingInvoices,
    }
  }

  private getOpenReminders(): ReminderOverview[] {
    const tableName = schemaService.getTableName('erinnerung')
    const rows = databaseService.all<ReminderOverview>(
      `SELECT id, titel, faellig_am, bezug_typ FROM ${tableName}
       WHERE status != 'erledigt'
       ORDER BY faellig_am IS NULL, faellig_am ASC
       LIMIT ?`,
      [this.reminderLimit]
    )

    return rows.map((row) => ({
      ...row,
      faellig_am: row.faellig_am ?? null,
      bezug_typ: row.bezug_typ ?? null,
    }))
  }

  private getOutstandingInvoices(): InvoiceOverview[] {
    const tableName = schemaService.getTableName('rechnung')
    const rows = databaseService.all<InvoiceOverview>(
      `SELECT id, rechnungsnummer, rechnungsdatum, faelligkeitsdatum, betrag FROM ${tableName}
       WHERE bezahlt_am IS NULL
       ORDER BY faelligkeitsdatum IS NULL, faelligkeitsdatum ASC
       LIMIT ?`,
      [this.invoiceLimit]
    )

    return rows.map((row) => ({
      ...row,
      rechnungsnummer: row.rechnungsnummer ?? null,
      rechnungsdatum: row.rechnungsdatum ?? null,
      faelligkeitsdatum: row.faelligkeitsdatum ?? null,
      betrag: Number(row.betrag ?? 0),
    }))
  }
}

export const mobileService = new MobileService()
