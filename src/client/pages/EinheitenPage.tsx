/**
 * EinheitenPage: Verwaltung von Einheiten (Wohnungen/Gewerbe etc.)
 *
 * @lastModified 2026-01-16
 */

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { DataTable, TableConfig } from '../components/data/DataTable'
import { DynamicForm, FormConfig } from '../components/data/DynamicForm'
import {
  useEntityList,
  useCreateEntity,
  useUpdateEntity,
  useDeleteEntity,
} from '../hooks/useEntity'
import { useEntityConfig, useTableConfig, useFormConfig } from '../hooks/useConfig'
import { useNavigate } from 'react-router-dom'
import type { Einheit } from '@shared/types/entities'

type EinheitRecord = Einheit & Record<string, unknown>

const ENTITY_NAME = 'einheit'
const TABLE_NAME = 'einheiten'
const FORM_NAME = 'einheit'
const PAGE_SIZE = 25

export function EinheitenPage() {
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState<string>('bezeichnung')
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('ASC')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<EinheitRecord | null>(null)
  const [formError, setFormError] = useState('')

  const { data: entityConfig, isLoading: entityLoading } = useEntityConfig(ENTITY_NAME)
  const { data: tableConfig, isLoading: tableLoading } = useTableConfig<TableConfig>(TABLE_NAME)
  const { data: formConfig, isLoading: formLoading } = useFormConfig<FormConfig>(FORM_NAME)

  const { data: listData, isLoading: listLoading } = useEntityList<EinheitRecord>(ENTITY_NAME, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    orderBy: sortField,
    orderDir: sortDir,
  })

  const createMutation = useCreateEntity<EinheitRecord>(ENTITY_NAME)
  const updateMutation = useUpdateEntity<EinheitRecord>(ENTITY_NAME)
  const deleteMutation = useDeleteEntity(ENTITY_NAME)

  const handleEdit = (item: EinheitRecord) => {
    setEditItem(item)
    setShowForm(true)
    setFormError('')
  }

  const handleDelete = async (item: EinheitRecord) => {
    try {
      await deleteMutation.mutateAsync(item.id)
    } catch (error) {
      console.error('Löschen fehlgeschlagen:', error)
    }
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

  const navigate = useNavigate()

  const handleRowAction = (item: EinheitRecord, actionId: string) => {
    const itemRecord = item as Record<string, unknown>

    if (actionId === 'mieter') {
      const mieterId =
        itemRecord['mieter_id'] || (itemRecord['computed'] as Record<string, unknown> | undefined)?.['mieter_id']
      if (!mieterId) {
        window.alert('Kein verknüpfter Mieter vorhanden.')
        return
      }
      navigate(`/mieter/${String(mieterId)}`)
      return
    }

    if (actionId === 'vertrag') {
      const vertragId = itemRecord['vertrag_id'] || (itemRecord['computed'] as Record<string, unknown> | undefined)?.['vertrag_id']
      if (!vertragId) {
        window.alert('Kein verknüpfter Vertrag vorhanden.')
        return
      }
      navigate(`/vertraege/${String(vertragId)}`)
      return
    }
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
          <h1 className="text-2xl font-bold text-gray-400">Einheiten</h1>
          <p className="text-gray-600">Alle Wohnungen, Gewerbeeinheiten und Stellplätze.</p>
        </div>
        <button
          onClick={() => {
            setEditItem(null)
            setShowForm(true)
            setFormError('')
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 rounded-lg hover:text-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Neue Einheit
        </button>
      </div>

      <DataTable<EinheitRecord>
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
