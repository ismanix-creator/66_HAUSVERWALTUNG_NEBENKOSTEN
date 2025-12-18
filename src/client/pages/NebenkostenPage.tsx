/**
 * NebenkostenPage: Rechnungen & Abrechnungen (Phase 4)
 *
 * @lastModified 2025-12-16
 */

import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { DataTable, TableConfig } from '../components/data/DataTable'
import { DynamicForm, FormConfig } from '../components/data/DynamicForm'
import { useCatalog, useEntityConfig, useFormConfig, useTableConfig } from '../hooks/useConfig'
import { useCreateEntity, useEntityList } from '../hooks/useEntity'
import type { Rechnung, Nebenkostenabrechnung, Einheit, Objekt } from '@shared/types/entities'

const TABS = ['rechnungen', 'abrechnungen'] as const
type NebenkostenTab = (typeof TABS)[number]
const PAGE_SIZE = 20

export function NebenkostenPage() {
  const navigate = useNavigate()
  const params = useParams<{ tab?: NebenkostenTab }>()
  const [activeTab, setActiveTab] = useState<NebenkostenTab>('rechnungen')
  const [showRechnungForm, setShowRechnungForm] = useState(false)
  const [showAbrechnungForm, setShowAbrechnungForm] = useState(false)
  const [rechnungError, setRechnungError] = useState('')
  const [abrechnungError, setAbrechnungError] = useState('')
  const [shareObjectId, setShareObjectId] = useState<string>()
  const [shareYear, setShareYear] = useState(new Date().getFullYear())
  const [shareKey, setShareKey] = useState('einheiten')

  useEffect(() => {
    if (params.tab && TABS.includes(params.tab as NebenkostenTab)) {
      setActiveTab(params.tab as NebenkostenTab)
    }
  }, [params.tab])

  const { data: rechnungTable } = useTableConfig<TableConfig>('rechnungen')
  const { data: abrechnungTable } = useTableConfig<TableConfig>('abrechnungen')
  const { data: rechnungForm } = useFormConfig<FormConfig>('rechnung')
  const { data: abrechnungForm } = useFormConfig<FormConfig>('nebenkostenabrechnung')
  const { data: rechnungEntity } = useEntityConfig('rechnung')
  const { data: abrechnungEntity } = useEntityConfig('nebenkostenabrechnung')

  const rechnungList = useEntityList<Rechnung>('rechnung', {
    limit: PAGE_SIZE,
    orderBy: 'rechnungsdatum',
    orderDir: 'DESC',
  })
  const abrechnungList = useEntityList<Nebenkostenabrechnung>('nebenkostenabrechnung', {
    limit: PAGE_SIZE,
    orderBy: 'erstellt_am',
    orderDir: 'DESC',
  })

  const createRechnung = useCreateEntity<Rechnung>('rechnung')
  const createAbrechnung = useCreateEntity<Nebenkostenabrechnung>('nebenkostenabrechnung')

  const objectList = useEntityList<Objekt>('objekt', {
    limit: 200,
    orderBy: 'bezeichnung',
    orderDir: 'ASC',
  })
  const objectRows = useMemo(
    () => objectList.data?.data || [],
    [objectList.data?.data]
  )
  const shareCatalogQuery = useCatalog<{
    catalog: { items: { id: string; bezeichnung: string; beschreibung?: string }[] }
  }>('umlageschluessel')
  const catalogItems = useMemo(
    () => shareCatalogQuery.data?.catalog?.items || [],
    [shareCatalogQuery.data]
  )

  useEffect(() => {
    if (catalogItems.length && !shareKey) {
      setShareKey(catalogItems[0].id)
    }
  }, [catalogItems, shareKey])

  useEffect(() => {
    if (!shareObjectId && objectRows.length > 0) {
      setShareObjectId(objectRows[0].id)
    }
  }, [objectRows, shareObjectId])

  const unitList = useEntityList<Einheit>('einheit', {
    limit: 200,
    orderBy: 'bezeichnung',
    orderDir: 'ASC',
    filters: shareObjectId ? { objekt_id: shareObjectId } : undefined,
  })

  const invoicesForShare = useEntityList<Rechnung>('rechnung', {
    limit: 200,
    orderBy: 'rechnungsdatum',
    orderDir: 'DESC',
    filters: shareObjectId ? { objekt_id: shareObjectId } : undefined,
  })

  const unitRows = useMemo(
    () => unitList.data?.data || [],
    [unitList.data?.data]
  )
  const invoiceRows = useMemo(
    () => invoicesForShare.data?.data || [],
    [invoicesForShare.data?.data]
  )
  const rechnungRows = rechnungList.data?.data || []
  const abrechnungRows = abrechnungList.data?.data || []

  const filteredInvoices = useMemo(
    () =>
      invoiceRows.filter(invoice => {
        if (!invoice.rechnungsdatum) return false
        return new Date(String(invoice.rechnungsdatum)).getFullYear() === shareYear
      }) ?? [],
    [invoiceRows, shareYear]
  )

  const shareTotal = filteredInvoices.reduce(
    (sum, invoice) =>
      sum + (typeof invoice.betrag === 'number' ? invoice.betrag : Number(invoice.betrag ?? 0)),
    0
  )

  const shareRows = useMemo(() => {
    const units = unitRows
    const totalArea = units.reduce((sum, unit) => sum + Number(unit.flaeche ?? 0), 0)

    return units.map(unit => {
      const percent = calculateSharePercent(unit, units.length, totalArea, shareKey)
      const amount = percent * shareTotal
      return {
        id: unit.id,
        label: unit.bezeichnung || unit.id,
        percent,
        amount,
      }
    })
  }, [unitRows, shareKey, shareTotal])

  const rechnungPage = Math.floor((rechnungList.data?.meta?.offset ?? 0) / PAGE_SIZE) + 1
  const abrechnungPage = Math.floor((abrechnungList.data?.meta?.offset ?? 0) / PAGE_SIZE) + 1

  const handleTabChange = (nextTab: NebenkostenTab) => {
    setActiveTab(nextTab)
    navigate(`/nebenkosten/${nextTab}`, { replace: true })
  }

  const handleRechnungSubmit = async (data: Record<string, unknown>) => {
    setRechnungError('')
    try {
      await createRechnung.mutateAsync(data as Partial<Rechnung>)
      setShowRechnungForm(false)
    } catch (error) {
      setRechnungError(error instanceof Error ? error.message : 'Fehler beim Speichern')
    }
  }

  const handleAbrechnungSubmit = async (data: Record<string, unknown>) => {
    setAbrechnungError('')
    try {
      await createAbrechnung.mutateAsync(data as Partial<Nebenkostenabrechnung>)
      setShowAbrechnungForm(false)
    } catch (error) {
      setAbrechnungError(error instanceof Error ? error.message : 'Fehler beim Speichern')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nebenkosten</h1>
          <p className="text-gray-500">Rechnungen erfassen und Abrechnungen vorbereiten</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === tab
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {tab === 'rechnungen' ? 'Rechnungen' : 'Abrechnungen'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'rechnungen' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Rechnungen</h2>
              <p className="text-sm text-gray-500">Kostenarten mit Objektbezug erfassen</p>
            </div>
            <button
              onClick={() => setShowRechnungForm(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              Rechnung erfassen
            </button>
          </div>
          {rechnungTable && (
            <DataTable<Rechnung>
              config={rechnungTable}
              data={rechnungRows}
              total={rechnungList.data?.meta?.total || 0}
              page={rechnungPage}
              pageSize={PAGE_SIZE}
              onPageChange={() => undefined}
              isLoading={rechnungList.isLoading}
            />
          )}
        </section>
      )}

      {activeTab === 'abrechnungen' && (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Abrechnungen</h2>
              <p className="text-sm text-gray-500">
                Umlageschlüssel anwenden und Verteilungen prüfen
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowAbrechnungForm(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" />
                Abrechnung anlegen
              </button>
            </div>
          </div>

          <div className="grid gap-3 rounded-lg border border-gray-200 bg-white p-6 lg:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Objekt</label>
              <select
                value={shareObjectId}
                onChange={event => setShareObjectId(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              >
                {objectRows.map(objekt => (
                  <option key={objekt.id} value={objekt.id}>
                    {objekt.bezeichnung}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500">Jahr</label>
                  <input
                    type="number"
                    value={shareYear}
                    onChange={event => setShareYear(Number(event.target.value))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500">Umlageschlüssel</label>
                  <select
                    value={shareKey}
                    onChange={event => setShareKey(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  >
                    {catalogItems.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.bezeichnung}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                {catalogItems.find(item => item.id === shareKey)?.beschreibung ||
                  'Wählt den gewünschten Verteilungsschlüssel aus.'}
              </p>
            </div>
            <div className="space-y-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              <p className="text-xs uppercase tracking-wide text-gray-400">Gesamtkosten</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
                  shareTotal
                )}
              </p>
              <p className="text-xs text-gray-500">
                {filteredInvoices.length} Rechnung(en) für das Jahr {shareYear}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Verteilungen</p>
              <p className="text-sm text-gray-500">
                {catalogItems.find(item => item.id === shareKey)?.bezeichnung}
              </p>
            </div>
            <div className="mt-3 grid gap-3">
              {shareRows.map(row => (
                <div
                  key={row.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{row.label}</p>
                    <p className="text-xs text-gray-500">
                      Anteil: {(row.percent * 100).toFixed(1)}%
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
                      row.amount
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {abrechnungTable && (
              <DataTable<Nebenkostenabrechnung>
                config={abrechnungTable}
                data={abrechnungRows}
                total={abrechnungList.data?.meta?.total || 0}
                page={abrechnungPage}
                pageSize={PAGE_SIZE}
                onPageChange={() => undefined}
                isLoading={abrechnungList.isLoading}
              />
          )}
        </section>
      )}

      {showRechnungForm && rechnungForm && rechnungEntity && (
        <DynamicForm
          formConfig={rechnungForm}
          entityConfig={rechnungEntity}
          onSubmit={handleRechnungSubmit}
          onCancel={() => setShowRechnungForm(false)}
          isEdit={false}
          isLoading={createRechnung.isPending}
          error={rechnungError}
        />
      )}

      {showAbrechnungForm && abrechnungForm && abrechnungEntity && (
        <DynamicForm
          formConfig={abrechnungForm}
          entityConfig={abrechnungEntity}
          onSubmit={handleAbrechnungSubmit}
          onCancel={() => setShowAbrechnungForm(false)}
          isEdit={false}
          isLoading={createAbrechnung.isPending}
          error={abrechnungError}
        />
      )}
    </div>
  )
}

function calculateSharePercent(
  unit: Einheit,
  totalUnits: number,
  totalArea: number,
  key: string
): number {
  if (totalUnits === 0) return 0
  switch (key) {
    case 'flaeche': {
      const area = Number(unit.flaeche ?? 0)
      if (totalArea > 0) {
        return area / totalArea
      }
      return 1 / totalUnits
    }
    case 'verbrauch':
      return 0
    default:
      return 1 / totalUnits
  }
}
