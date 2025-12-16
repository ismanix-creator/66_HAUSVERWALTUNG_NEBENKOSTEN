/**
 * ZaehlerPage: Zähler-Verwaltung (Liste + CRUD)
 * Phase 4 - Nebenkosten: Zähler können angelegt werden
 *
 * @lastModified 2025-12-16
 */

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { DataTable, TableConfig } from '../components/data/DataTable'
import { DynamicForm, FormConfig } from '../components/data/DynamicForm'
import { useEntityConfig, useTableConfig, useFormConfig } from '../hooks/useConfig'
import {
  useEntityList,
  useCreateEntity,
  useUpdateEntity,
  useDeleteEntity,
} from '../hooks/useEntity'
import type { Zaehler } from '@shared/types/entities'

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

  if (entityLoading || tableLoading || formLoading || !tableConfig || !entityConfig) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laden...</div>
      </div>
    )
  }

  const rows = listData?.data || []

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
