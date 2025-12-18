/**
 * MieterPage: Verwaltung von Mietern
 *
 * @lastModified 2026-01-16
 */

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DataTable, TableConfig } from '../components/data/DataTable'
import { DynamicForm, FormConfig } from '../components/data/DynamicForm'
import {
  useEntityList,
  useCreateEntity,
  useUpdateEntity,
  useDeleteEntity,
} from '../hooks/useEntity'
import { useEntityConfig, useTableConfig, useFormConfig } from '../hooks/useConfig'
import type { Mieter } from '@shared/types/entities'

type MieterRecord = Mieter & Record<string, unknown>

const ENTITY_NAME = 'mieter'
const TABLE_NAME = 'mieter'
const FORM_NAME = 'mieter'
const PAGE_SIZE = 25

export function MieterPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState<string>('nachname')
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('ASC')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<MieterRecord | null>(null)
  const [formError, setFormError] = useState('')

  const { data: entityConfig, isLoading: entityLoading } = useEntityConfig(ENTITY_NAME)
  const { data: tableConfig, isLoading: tableLoading } = useTableConfig<TableConfig>(TABLE_NAME)
  const { data: formConfig, isLoading: formLoading } = useFormConfig<FormConfig>(FORM_NAME)

  const { data: listData, isLoading: listLoading } = useEntityList<MieterRecord>(ENTITY_NAME, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    orderBy: sortField,
    orderDir: sortDir,
  })

  const createMutation = useCreateEntity<MieterRecord>(ENTITY_NAME)
  const updateMutation = useUpdateEntity<MieterRecord>(ENTITY_NAME)
  const deleteMutation = useDeleteEntity(ENTITY_NAME)

  const handleEdit = (item: MieterRecord) => {
    setEditItem(item)
    setShowForm(true)
    setFormError('')
  }

  const handleDelete = async (item: MieterRecord) => {
    try {
      await deleteMutation.mutateAsync(item.id)
    } catch (error) {
      console.error('Löschen fehlgeschlagen:', error)
    }
  }

  const handleRowAction = (item: MieterRecord, actionId: string) => {
    const itemRecord = item as Record<string, unknown>

    if (actionId === 'vertrag') {
      const vertragId =
        itemRecord['vertrag_id'] ||
        itemRecord['aktiver_vertrag_id'] ||
        (itemRecord['computed'] as Record<string, unknown> | undefined)?.['aktiver_vertrag_id']

      if (!vertragId) {
        window.alert('Kein verknüpfter Vertrag für diesen Mieter hinterlegt.')
        return
      }

      navigate(`/vertraege/${String(vertragId)}`)
      return
    }

    if (actionId === 'einheit') {
      const einheitData = (itemRecord['computed'] as Record<string, unknown> | undefined)?.['aktuelle_einheit'] as Record<string, unknown> | undefined
      const einheitId =
        itemRecord['einheit_id'] ||
        einheitData?.['id']

      if (!einheitId) {
        window.alert('Keine verknüpfte Einheit für diesen Mieter hinterlegt.')
        return
      }

      navigate(`/einheiten/${String(einheitId)}`)
      return
    }

    // Fallback: bestehende Edit/Delete Actions laufen wie bisher
  }

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    setFormError('')
    try {
      if (editItem) {
        await updateMutation.mutateAsync({ id: editItem.id, data })
      } else {
        await createMutation.mutateAsync(data)
        setPage(1)
      }
      setShowForm(false)
      setEditItem(null)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten')
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditItem(null)
    setFormError('')
  }

  const handleSort = (field: string, dir: 'ASC' | 'DESC') => {
    setSortField(field)
    setSortDir(dir)
    setPage(1)
  }

  const isLoading =
    entityLoading || tableLoading || formLoading || !tableConfig || !entityConfig || !formConfig

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laden...</div>
      </div>
    )
  }

  const data = listData?.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mieter</h1>
          <p className="text-gray-500">Verzeichnis Ihrer aktuellen und ehemaligen Mieter.</p>
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
          Neuer Mieter
        </button>
      </div>

      <DataTable<MieterRecord>
        config={tableConfig}
        data={data}
        total={listData?.meta?.total || 0}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        onSort={handleSort}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowAction={handleRowAction}
        sortField={sortField}
        sortDir={sortDir}
        isLoading={listLoading}
      />

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
    </div>
  )
}
