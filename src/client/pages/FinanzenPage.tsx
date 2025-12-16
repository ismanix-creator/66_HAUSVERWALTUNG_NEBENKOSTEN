/**
 * FinanzenPage: Übersicht für Zahlungen, Sollstellungen und Kautionen
 *
 * @lastModified 2026-01-15
 */

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { DataTable } from '../components/data/DataTable'
import { DynamicForm } from '../components/data/DynamicForm'
import type { TableConfig } from '../components/data/DataTable'
import type { FormConfig } from '../components/data/DynamicForm'
import {
  useEntityList,
  useCreateEntity,
  useUpdateEntity,
} from '../hooks/useEntity'
import { useEntityConfig, useFormConfig, useTableConfig } from '../hooks/useConfig'
import type { Zahlung, Sollstellung, Kaution } from '@shared/types/entities'

type FinanceTab = 'zahlungen' | 'sollstellung' | 'kautionen'
const TABS: FinanceTab[] = ['zahlungen', 'sollstellung', 'kautionen']
const PAGE_SIZE = 15

export function FinanzenPage() {
  const navigate = useNavigate()
  const { tab } = useParams<{ tab?: FinanceTab }>()

  const [activeTab, setActiveTab] = useState<FinanceTab>(TABS.includes(tab as FinanceTab) ? (tab as FinanceTab) : 'zahlungen')
  const [pagination, setPagination] = useState<Record<FinanceTab, number>>({
    zahlungen: 1,
    sollstellung: 1,
    kautionen: 1,
  })
  const [showZahlungForm, setShowZahlungForm] = useState(false)
  const [showSollstellungForm, setShowSollstellungForm] = useState(false)
  const [showKautionForm, setShowKautionForm] = useState(false)
  const [editingZahlung, setEditingZahlung] = useState<Zahlung | null>(null)
  const [editingSollstellung, setEditingSollstellung] = useState<Sollstellung | null>(null)
  const [editingKaution, setEditingKaution] = useState<Kaution | null>(null)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (tab && TABS.includes(tab as FinanceTab)) {
      setActiveTab(tab as FinanceTab)
    }
  }, [tab])

  const handleTabChange = (nextTab: FinanceTab) => {
    setActiveTab(nextTab)
    navigate(`/finanzen/${nextTab}`, { replace: true })
  }

  const { data: zahlungTable, isLoading: zahlungTableLoading } = useTableConfig<TableConfig>('zahlungen')
  const { data: sollstellungTable, isLoading: sollstellungTableLoading } = useTableConfig<TableConfig>(
    'sollstellungen'
  )
  const { data: kautionenTable, isLoading: kautionenTableLoading } = useTableConfig<TableConfig>('kautionen')

  const { data: zahlungForm } = useFormConfig<FormConfig>('zahlung')
  const { data: sollstellungForm } = useFormConfig<FormConfig>('sollstellung')
  const { data: kautionForm } = useFormConfig<FormConfig>('kaution')

  const { data: zahlungEntity } = useEntityConfig('zahlung')
  const { data: sollstellungEntity } = useEntityConfig('sollstellung')
  const { data: kautionEntity } = useEntityConfig('kaution')

  const zahlungList = useEntityList<Zahlung>('zahlung', {
    limit: PAGE_SIZE,
    offset: (pagination.zahlungen - 1) * PAGE_SIZE,
    orderBy: 'datum',
    orderDir: 'DESC',
  })
  const sollstellungList = useEntityList<Sollstellung>('sollstellung', {
    limit: PAGE_SIZE,
    offset: (pagination.sollstellung - 1) * PAGE_SIZE,
    orderBy: 'monat',
    orderDir: 'DESC',
  })
  const kautionList = useEntityList<Kaution>('kaution', {
    limit: PAGE_SIZE,
    offset: (pagination.kautionen - 1) * PAGE_SIZE,
    orderBy: 'eingangsdatum',
    orderDir: 'DESC',
  })

  const createZahlung = useCreateEntity<Zahlung>('zahlung')
  const updateZahlung = useUpdateEntity<Zahlung>('zahlung')
  const createSollstellung = useCreateEntity<Sollstellung>('sollstellung')
  const updateSollstellung = useUpdateEntity<Sollstellung>('sollstellung')
  const createKaution = useCreateEntity<Kaution>('kaution')
  const updateKaution = useUpdateEntity<Kaution>('kaution')

  const handlePageChange = (target: FinanceTab, nextPage: number) => {
    setPagination((prev) => ({ ...prev, [target]: nextPage }))
  }

  const handleZahlungSubmit = async (data: Record<string, unknown>) => {
    setFormError('')
    try {
      if (editingZahlung) {
        await updateZahlung.mutateAsync({ id: editingZahlung.id, data })
      } else {
        await createZahlung.mutateAsync(data as Partial<Zahlung>)
      }
      setShowZahlungForm(false)
      setEditingZahlung(null)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Fehler beim Speichern')
    }
  }

  const handleSollstellungSubmit = async (data: Record<string, unknown>) => {
    setFormError('')
    try {
      if (editingSollstellung) {
        await updateSollstellung.mutateAsync({ id: editingSollstellung.id, data })
      } else {
        await createSollstellung.mutateAsync(data as Partial<Sollstellung>)
      }
      setShowSollstellungForm(false)
      setEditingSollstellung(null)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Fehler beim Speichern')
    }
  }

  const handleKautionSubmit = async (data: Record<string, unknown>) => {
    setFormError('')
    try {
      if (editingKaution) {
        await updateKaution.mutateAsync({ id: editingKaution.id, data })
      } else {
        await createKaution.mutateAsync(data as Partial<Kaution>)
      }
      setShowKautionForm(false)
      setEditingKaution(null)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Fehler beim Speichern')
    }
  }

  const resetForms = () => {
    setShowZahlungForm(false)
    setShowSollstellungForm(false)
    setShowKautionForm(false)
    setEditingZahlung(null)
    setEditingSollstellung(null)
    setEditingKaution(null)
    setFormError('')
  }

  const renderTableHeader = () => {
    switch (activeTab) {
      case 'zahlungen':
        return {
          title: 'Zahlungen',
          description: 'Alle Zahlungseingänge mit Typ und Monat',
          onCreate: () => {
            resetForms()
            setShowZahlungForm(true)
          },
          createLabel: 'Zahlung erfassen',
        }
      case 'sollstellung':
        return {
          title: 'Sollstellungen',
          description: 'Soll/Ist-Vergleich pro Monat',
          onCreate: () => {
            resetForms()
            setShowSollstellungForm(true)
          },
          createLabel: 'Sollstellung anlegen',
        }
      case 'kautionen':
        return {
          title: 'Kautionen',
          description: 'Kautionssummen und Status',
          onCreate: () => {
            resetForms()
            setShowKautionForm(true)
          },
          createLabel: 'Kaution erfassen',
        }
    }
  }

  const headerMeta = renderTableHeader()

  const currentTableConfig =
    activeTab === 'zahlungen'
      ? zahlungTable
      : activeTab === 'sollstellung'
      ? sollstellungTable
      : kautionenTable

  const currentListData =
    activeTab === 'zahlungen'
      ? zahlungList
      : activeTab === 'sollstellung'
      ? sollstellungList
      : kautionList

  const isConfigLoading =
    zahlungTableLoading || sollstellungTableLoading || kautionenTableLoading || !currentTableConfig

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Finanzen</h1>
        <p className="text-gray-500">Zahlungen, Sollstellungen und Kautionen zentral verwalten.</p>
      </div>

      <div className="flex space-x-2">
        {TABS.map((tabName) => (
          <button
            key={tabName}
            onClick={() => handleTabChange(tabName)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === tabName
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {tabName === 'zahlungen'
              ? 'Zahlungen'
              : tabName === 'sollstellung'
              ? 'Sollstellungen'
              : 'Kautionen'}
          </button>
        ))}
      </div>

      {!currentTableConfig || isConfigLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Laden...</div>
        </div>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{headerMeta.title}</h2>
              <p className="text-sm text-gray-500">{headerMeta.description}</p>
            </div>
            <button
              onClick={headerMeta.onCreate}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              {headerMeta.createLabel}
            </button>
          </div>

          <DataTable
            config={currentTableConfig}
            data={currentListData.data || []}
            total={currentListData.meta?.total || 0}
            page={pagination[activeTab]}
            pageSize={PAGE_SIZE}
            onPageChange={(next) => handlePageChange(activeTab, next)}
            onEdit={(item) => {
              resetForms()
              if (activeTab === 'zahlungen') {
                setEditingZahlung(item as Zahlung)
                setShowZahlungForm(true)
              } else if (activeTab === 'sollstellung') {
                setEditingSollstellung(item as Sollstellung)
                setShowSollstellungForm(true)
              } else {
                setEditingKaution(item as Kaution)
                setShowKautionForm(true)
              }
            }}
            onDelete={() => undefined}
            sortField=""
            sortDir="ASC"
            isLoading={currentListData.isLoading}
          />
        </section>
      )}

      {showZahlungForm && zahlungForm && zahlungEntity && (
        <DynamicForm
          formConfig={zahlungForm}
          entityConfig={zahlungEntity}
          initialData={editingZahlung || undefined}
          isEdit={!!editingZahlung}
          onSubmit={handleZahlungSubmit}
          onCancel={resetForms}
          isLoading={createZahlung.isPending || updateZahlung.isPending}
          error={formError}
        />
      )}

      {showSollstellungForm && sollstellungForm && sollstellungEntity && (
        <DynamicForm
          formConfig={sollstellungForm}
          entityConfig={sollstellungEntity}
          initialData={editingSollstellung || undefined}
          isEdit={!!editingSollstellung}
          onSubmit={handleSollstellungSubmit}
          onCancel={resetForms}
          isLoading={createSollstellung.isPending || updateSollstellung.isPending}
          error={formError}
        />
      )}

      {showKautionForm && kautionForm && kautionEntity && (
        <DynamicForm
          formConfig={kautionForm}
          entityConfig={kautionEntity}
          initialData={editingKaution || undefined}
          isEdit={!!editingKaution}
          onSubmit={handleKautionSubmit}
          onCancel={resetForms}
          isLoading={createKaution.isPending || updateKaution.isPending}
          error={formError}
        />
      )}
    </div>
  )
}
