import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mobileService } from '../../src/server/services/mobile.service'
import { dashboardService } from '../../src/server/services/dashboard.service'
import { databaseService } from '../../src/server/services/database.service'
import { schemaService } from '../../src/server/services/schema.service'

const summaryMock = {
  objekte: 2,
  einheiten: 5,
  mieter: 3,
  vertraege: 2,
  offeneRechnungen: 1,
  dokumente: 4,
  offeneErinnerungen: 2,
}

const reminderRows = [
  { id: 'r-1', titel: 'Zählerablesung', faellig_am: '2025-12-20', bezug_typ: 'zaehler' },
]

const invoiceRows = [
  {
    id: 'inv-1',
    rechnungsnummer: '2025-001',
    rechnungsdatum: '2025-11-01',
    faelligkeitsdatum: '2025-11-30',
    betrag: 150.5,
  },
]

describe('MobileService', () => {
  beforeEach(() => {
    vi.spyOn(dashboardService, 'getSummary').mockResolvedValue(summaryMock)
    vi.spyOn(schemaService, 'getTableName').mockImplementation((name: string) => {
      if (name === 'erinnerung') return 'erinnerungen'
      if (name === 'rechnung') return 'rechnungen'
      return `${name}s`
    })
    const rowsSpy = vi.spyOn(databaseService, 'all')
    rowsSpy
      .mockImplementationOnce(() => reminderRows as any)
      .mockImplementationOnce(() => invoiceRows as any)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('liefert eine Summary mit Remindern und offenen Rechnungen', async () => {
    const snapshot = await mobileService.getSnapshot()
    expect(snapshot.summary).toEqual(summaryMock)
    expect(snapshot.reminders).toEqual(reminderRows)
    expect(snapshot.outstandingInvoices).toEqual(invoiceRows)
  })
})
