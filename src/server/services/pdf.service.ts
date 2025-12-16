import PDFDocument from 'pdfkit'
import type { DashboardSummary } from '@shared/types/dashboard'

class PdfService {
  createSteuerberaterExport(summary: DashboardSummary): PDFDocument {
    const doc = new PDFDocument({ size: 'A4', margin: 48 })

    doc.fontSize(20).text('Steuerberater-Export', { align: 'center' })
    doc.moveDown(0.5)
    doc.fontSize(12).text(`Erstellt am: ${new Date().toLocaleString('de-DE')}`, { align: 'center' })
    doc.moveDown(2)

    doc.fontSize(14).text('Zusammenfassung', { underline: true })
    doc.moveDown(0.5)

    const stats = [
      { label: 'Objekte', value: summary.objekte },
      { label: 'Einheiten', value: summary.einheiten },
      { label: 'Mieter', value: summary.mieter },
      { label: 'Verträge', value: summary.vertraege },
      { label: 'Offene Rechnungen', value: summary.offeneRechnungen },
      { label: 'Dokumente', value: summary.dokumente },
      { label: 'Offene Erinnerungen', value: summary.offeneErinnerungen },
    ]

    stats.forEach(stat => {
      doc.fontSize(12).text(`${stat.label}: ${stat.value}`)
    })

    doc.moveDown(1.5)
    doc
      .fontSize(12)
      .text(
        'Diese Datei enthält eine kompakte Übersicht über den aktuellen Betriebszustand. Lass dir den Export von deinem Steuerberater bestätigen.'
      )

    return doc
  }
}

export const pdfService = new PdfService()
