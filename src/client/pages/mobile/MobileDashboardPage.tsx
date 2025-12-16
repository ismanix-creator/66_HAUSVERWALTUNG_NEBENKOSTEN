import { useMemo } from 'react'
import { useMobileSnapshot } from '../../hooks/useMobile'

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
})

const formatDate = (value: string | null) => {
  if (!value) {
    return '–'
  }
  return new Date(value).toLocaleDateString('de-DE')
}

export function MobileDashboardPage() {
  const { data, isLoading, isError } = useMobileSnapshot()

  const summaryCards = useMemo(() => {
    if (!data) return []
    return [
      { label: 'Objekte', value: data.summary.objekte },
      { label: 'Einheiten', value: data.summary.einheiten },
      { label: 'Mieter', value: data.summary.mieter },
      { label: 'Verträge', value: data.summary.vertraege },
      { label: 'Offene Rechnungen', value: data.summary.offeneRechnungen },
      { label: 'Erinnerungen', value: data.summary.offeneErinnerungen },
    ]
  }, [data])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-5 py-6">
        <header>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Read-Only Mobil-Ansicht
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Mobile Übersicht</h1>
          <p className="text-sm text-slate-500">
            Alle Daten stammen vom Server, Schreibzugriffe sind deaktiviert.
          </p>
        </header>

        {isLoading && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-center text-sm text-slate-600">
            Lade mobile Daten…
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Die Übersicht konnte nicht geladen werden. Bitte Seite neu laden.
          </div>
        )}

        {data && (
          <>
            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Schnellübersicht
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {summaryCards.map(card => (
                  <article
                    key={card.label}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 shadow-sm transition hover:border-slate-200"
                  >
                    <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                      {card.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Offene Rechnungen
                </h2>
                <span className="text-xs text-slate-400">
                  Top {data.outstandingInvoices.length}
                </span>
              </div>
              <div className="mt-3 space-y-3">
                {data.outstandingInvoices.length === 0 && (
                  <p className="text-sm text-slate-500">Keine offenen Rechnungen.</p>
                )}
                {data.outstandingInvoices.map(invoice => (
                  <article
                    key={invoice.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
                  >
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>{invoice.rechnungsnummer ?? 'Rechnung'}</span>
                      <span>{formatDate(invoice.faelligkeitsdatum)}</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {currencyFormatter.format(invoice.betrag)}
                    </p>
                    <p className="text-xs text-slate-400">
                      Ausgestellt: {formatDate(invoice.rechnungsdatum)}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Erinnerungen
                </h2>
                <span className="text-xs text-slate-400">{data.reminders.length} aktiv</span>
              </div>
              <div className="mt-3 space-y-3">
                {data.reminders.length === 0 && (
                  <p className="text-sm text-slate-500">Keine offenen Erinnerungen.</p>
                )}
                {data.reminders.map(reminder => (
                  <article
                    key={reminder.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
                  >
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
                      <span>{reminder.bezug_typ ?? 'Allgemein'}</span>
                      <span>{formatDate(reminder.faellig_am)}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-900">{reminder.titel}</p>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
