/**
 * ObjektePage: Objekte-Verwaltung (Liste + CRUD)
 * 100% Config-Driven - rendert aus TOML-Configs
 *
 * @lastModified 2025-12-16
 */

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useEntityList, useCreateEntity, useUpdateEntity, useDeleteEntity } from '../hooks/useEntity'
import { useEntityConfig, useTableConfig, useFormConfig } from '../hooks/useConfig'
import { DataTable, TableConfig } from '../components/data/DataTable'
import { DynamicForm, FormConfig } from '../components/data/DynamicForm'
import type { Objekt } from '@shared/types/entities'

// Type assertion helper für generische Komponenten
type ObjektRecord = Objekt & Record<string, unknown>

const ENTITY_NAME = 'objekt'
const TABLE_NAME = 'objekte' // Config-Datei heißt objekte.table.toml
const PAGE_SIZE = 20

export function ObjektePage() {
  // State
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState<string>('bezeichnung')
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('ASC')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<ObjektRecord | null>(null)
  const [formError, setFormError] = useState<string>('')

  // Config Queries - aus TOML-Dateien geladen
  const { data: entityConfig, isLoading: entityLoading } = useEntityConfig(ENTITY_NAME)
  const { data: tableConfig, isLoading: tableLoading } = useTableConfig<TableConfig>(TABLE_NAME)
  const { data: formConfig, isLoading: formLoading } = useFormConfig<FormConfig>(ENTITY_NAME)

  // Entity List Query
  const { data: listData, isLoading: listLoading } = useEntityList<ObjektRecord>(ENTITY_NAME, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    orderBy: sortField,
    orderDir: sortDir,
  })

  // Mutations
  const createMutation = useCreateEntity<ObjektRecord>(ENTITY_NAME)
  const updateMutation = useUpdateEntity<ObjektRecord>(ENTITY_NAME)
  const deleteMutation = useDeleteEntity(ENTITY_NAME)

  // Handlers
  const handleSort = (field: string, dir: 'ASC' | 'DESC') => {
    setSortField(field)
    setSortDir(dir)
    setPage(1) // Reset to first page on sort
  }

  const handleEdit = (item: ObjektRecord) => {
    setEditItem(item)
    setShowForm(true)
    setFormError('')
  }

  const handleDelete = async (item: ObjektRecord) => {
    try {
      await deleteMutation.mutateAsync(item.id)
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    setFormError('')
    try {
      if (editItem) {
        await updateMutation.mutateAsync({ id: editItem.id, data })
      } else {
        await createMutation.mutateAsync(data as Partial<ObjektRecord>)
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

  // Loading State
  const isConfigLoading = entityLoading || tableLoading || formLoading

  if (isConfigLoading || !tableConfig || !entityConfig) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laden...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Objekte</h1>
          <p className="text-gray-500">Verwaltung Ihrer Immobilien</p>
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
          Neues Objekt
        </button>
      </div>

      {/* Table */}
      <DataTable<ObjektRecord>
        config={tableConfig}
        data={listData?.data || []}
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

      {/* Form Modal */}
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
