/**
 * ZaehlerPage: Zähler-Verwaltung (Liste + CRUD)
 * Phase 4 - Nebenkosten: Zähler können angelegt werden
 *
 * @lastModified 2025-12-16
 */

import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { DataTable, TableConfig } from '../components/data/DataTable'
import { DynamicForm, FormConfig } from '../components/data/DynamicForm'
import { useEntityConfig, useTableConfig, useFormConfig } from '../hooks/useConfig'
import { useEntityList, useCreateEntity, useUpdateEntity, useDeleteEntity } from '../hooks/useEntity'
import type { Zaehler, Zaehlerstand } from '@shared/types/entities'

const ENTITY_NAME = 'zaehler'
const TABLE_NAME = 'zaehler'
const FORM_NAME = 'zaehler'
const PAGE_SIZE = 20

export function ZaehlerPage() {
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState('zaehlernummer')
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('ASC')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Zaehler | null>(null)
  const [formError, setFormError] = useState('')
  const [showReadingForm, setShowReadingForm] = useState(false)
  const [selectedReadingZaehlerId, setSelectedReadingZaehlerId] = useState<string | undefined>()
  const [readingError, setReadingError] = useState('')

  const { data: entityConfig, isLoading: entityLoading } = useEntityConfig(ENTITY_NAME)
  const { data: tableConfig, isLoading: tableLoading } = useTableConfig<TableConfig>(TABLE_NAME)
  const { data: formConfig, isLoading: formLoading } = useFormConfig<FormConfig>(FORM_NAME)

  const { data: listData, isLoading: listLoading } = useEntityList<Zaehler>(ENTITY_NAME, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    orderBy: sortField,
    orderDir: sortDir,
  })

  const createMutation = useCreateEntity<Zaehler>(ENTITY_NAME)
  const updateMutation = useUpdateEntity<Zaehler>(ENTITY_NAME)
  const deleteMutation = useDeleteEntity(ENTITY_NAME)
  const createReading = useCreateEntity<Zaehlerstand>('zaehlerstand')

  const { data: readingFormConfig } = useFormConfig<FormConfig>('zaehlerstand')
  const { data: readingEntityConfig } = useEntityConfig('zaehlerstand')

  const rows = useMemo(() => listData?.data || [], [listData?.data])
  useEffect(() => {
    if (!selectedReadingZaehlerId && rows.length > 0) {
      setSelectedReadingZaehlerId(rows[0].id)
    }
  }, [rows, selectedReadingZaehlerId])

  const readingOptions = rows.map((row) => ({ id: row.id, label: row.zaehlernummer || row.id }))
  const readings = useEntityList<Zaehlerstand>('zaehlerstand', {
    limit: 5,
    orderBy: 'datum',
    orderDir: 'DESC',
    filters: selectedReadingZaehlerId ? { zaehler_id: selectedReadingZaehlerId } : undefined,
  })

  const handleSort = (field: string, dir: 'ASC' | 'DESC') => {
    setSortField(field)
    setSortDir(dir)
    setPage(1)
  }

  const handleEdit = (item: Zaehler) => {
    setEditItem(item)
    setShowForm(true)
    setFormError('')
  }

  const handleDelete = async (item: Zaehler) => {
    try {
      await deleteMutation.mutateAsync(item.id)
    } catch (error) {
      console.error('Zähler löschen fehlgeschlagen', error)
    }
  }

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    setFormError('')
    try {
      if (editItem) {
        await updateMutation.mutateAsync({ id: editItem.id, data })
      } else {
        await createMutation.mutateAsync(data as Partial<Zaehler>)
      }
      setShowForm(false)
      setEditItem(null)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Fehler beim Speichern')
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditItem(null)
    setFormError('')
  }

  const handleReadingSubmit = async (data: Record<string, unknown>) => {
    setReadingError('')
    try {
      await createReading.mutateAsync(data as Partial<Zaehlerstand>)
      setShowReadingForm(false)
    } catch (error) {
      setReadingError(error instanceof Error ? error.message : 'Fehler beim Speichern')
    }
  }

  const handleReadingCancel = () => {
    setShowReadingForm(false)
    setReadingError('')
  }

  if (entityLoading || tableLoading || formLoading || !tableConfig || !entityConfig) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laden...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zähler</h1>
          <p className="text-gray-500">Alle Zähler Ihrer Objekte zentral erfassen.</p>
        </div>
        <button
          onClick={() => {
            setEditItem(null)
            setShowForm(true)
            setFormError('')
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Zähler anlegen
        </button>
      </div>

      <DataTable<Zaehler>
        config={tableConfig}
        data={rows}
        total={listData?.meta?.total || 0}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        onSort={handleSort}
        onEdit={handleEdit}
        onDelete={handleDelete}
        sortField={sortField}
        sortDir={sortDir}
        isLoading={listLoading}
      />

      <section className="space-y-3 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Ablesungen</p>
            <p className="text-lg font-semibold text-gray-900">Verbrauch pro Zähler</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select
              disabled={readingOptions.length === 0}
              value={selectedReadingZaehlerId}
              onChange={(event) => setSelectedReadingZaehlerId(event.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            >
              {readingOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              disabled={!selectedReadingZaehlerId}
              onClick={() => {
                setShowReadingForm(true)
                setReadingError('')
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              Ablesung erfassen
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {readings.isLoading ? (
            <p className="text-sm text-gray-500">Lade letzte Ablesungen...</p>
          ) : readings.data?.length ? (
            readings.data.map((reading, index) => (
              <div
                key={reading.id}
                className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600"
              >
                <p>
                  <span className="font-semibold text-gray-900">
                    {reading.datum
                      ? new Date(reading.datum as string).toLocaleDateString('de-DE')
                      : '—'}
                  </span>{' '}
                  — {reading.stand ?? '—'} {reading.ableseart}
                </p>
                {index < (readings.data.length - 1) && (
                  <p className="text-xs text-gray-500">
                    Verbrauch seit letzter Ablesung:{' '}
                    {formatConsumption(reading.stand, readings.data[index + 1]?.stand)} kWh
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Noch keine Ablesungen vorhanden.</p>
          )}
        </div>
      </section>

      {showForm && formConfig && entityConfig && (
        <DynamicForm
          formConfig={formConfig}
          entityConfig={entityConfig}
          initialData={editItem || undefined}
          isEdit={!!editItem}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={createMutation.isPending || updateMutation.isPending}
          error={formError}
        />
      )}

      {showReadingForm && readingFormConfig && readingEntityConfig && (
        <DynamicForm
          formConfig={readingFormConfig}
          entityConfig={readingEntityConfig}
          initialData={
            selectedReadingZaehlerId ? { zaehler_id: selectedReadingZaehlerId } : undefined
          }
          isEdit={false}
          onSubmit={handleReadingSubmit}
          onCancel={handleReadingCancel}
          isLoading={createReading.isPending}
          error={readingError}
        />
      )}
    </div>
  )
}

function formatConsumption(current?: unknown, previous?: unknown): string {
  if (typeof current !== 'number' && typeof current !== 'string') return '—'
  if (typeof previous !== 'number' && typeof previous !== 'string') return '—'
  const cur = Number(current)
  const prev = Number(previous)
  if (Number.isNaN(cur) || Number.isNaN(prev)) return '—'
  if (cur < prev) return '0'
  return (cur - prev).toFixed(2)
}
