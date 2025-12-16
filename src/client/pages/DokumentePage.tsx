/**
 * DokumentePage: Dokumente verwalten, uploaden und exportieren
 *
 * @lastModified 2025-12-21
 */

import { useState } from 'react'
import { Plus, Download, FileText } from 'lucide-react'
import { DataTable, TableConfig } from '../components/data/DataTable'
import { DynamicForm, FormConfig } from '../components/data/DynamicForm'
import { useEntityConfig, useFormConfig, useTableConfig } from '../hooks/useConfig'
import {
  useCreateEntity,
  useDeleteEntity,
  useEntityList,
  useUpdateEntity,
} from '../hooks/useEntity'
import type { Dokument } from '@shared/types/entities'

const ENTITY_NAME = 'dokument'
const TABLE_NAME = 'dokumente'
const FORM_NAME = 'dokument'
const PAGE_SIZE = 20

export function DokumentePage() {
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Dokument | null>(null)
  const [formError, setFormError] = useState('')

  const { data: entityConfig, isLoading: entityLoading } = useEntityConfig(ENTITY_NAME)
  const { data: tableConfig, isLoading: tableLoading } = useTableConfig<TableConfig>(TABLE_NAME)
  const { data: formConfig, isLoading: formLoading } = useFormConfig<FormConfig>(FORM_NAME)

  const { data: listData, isLoading: listLoading } = useEntityList<Dokument>(ENTITY_NAME, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    orderBy: 'hochgeladen_am',
    orderDir: 'DESC',
  })

  const createMutation = useCreateEntity<Dokument>(ENTITY_NAME)
  const updateMutation = useUpdateEntity<Dokument>(ENTITY_NAME)
  const deleteMutation = useDeleteEntity(ENTITY_NAME)

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    setFormError('')
    try {
      if (editItem) {
        await updateMutation.mutateAsync({ id: editItem.id, data })
      } else {
        await createMutation.mutateAsync(data as Partial<Dokument>)
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

  const handleSort = (_field: string, _dir: 'ASC' | 'DESC') => {}

  const handleEdit = (item: Dokument) => {
    setEditItem(item)
    setShowForm(true)
    setFormError('')
  }

  const handleDelete = async (item: Dokument) => {
    try {
      await deleteMutation.mutateAsync(item.id)
    } catch (error) {
      console.error('Dokument löschen fehlgeschlagen', error)
    }
  }

  const handlePreview = (item: Dokument) => {
    if (item.dateipfad) {
      window.open(item.dateipfad, '_blank')
    }
  }

  if (entityLoading || tableLoading || formLoading || !tableConfig || !entityConfig) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laden...</div>
      </div>
    )
  }

  const totalDocuments = listData?.meta?.total || 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dokumente</h1>
            <p className="text-sm text-gray-500">
              {totalDocuments} Dokumente, zuletzt aktualisiert am{' '}
              {listData?.data?.[0]?.hochgeladen_am
                ? new Date(listData.data[0].hochgeladen_am as string).toLocaleDateString('de-DE')
                : '–'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.open('/api/export/steuerberater', '_blank')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white uppercase bg-gray-800 rounded-lg hover:bg-black"
            >
              <Download className="h-4 w-4" />
              Steuerberater-Export
            </button>
            <button
              onClick={() => {
                setEditItem(null)
                setShowForm(true)
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              Dokument hochladen
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Dokumente lassen sich Objekten, Einheiten, Verträgen oder Mietern zuordnen.
        </p>
      </div>

      <DataTable<Dokument>
        config={tableConfig}
        data={listData?.data || []}
        total={totalDocuments}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSort={handleSort}
        sortField="hochgeladen_am"
        sortDir="DESC"
        isLoading={listLoading}
      />

      {listData?.data?.[0] && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Neueste Datei</p>
              <p className="text-lg font-semibold text-gray-900">{listData.data[0].bezeichnung}</p>
            </div>
            <button
              onClick={() => handlePreview(listData.data[0])}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              <FileText className="h-4 w-4" />
              Vorschau
            </button>
          </div>
        </div>
      )}

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
