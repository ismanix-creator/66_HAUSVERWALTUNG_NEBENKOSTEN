/**
 * VertraegePage: Konfigurationsgesteuerte Ansicht für Mietverträge
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
  useEntityById,
  useCreateEntity,
  useUpdateEntity,
  useDeleteEntity,
} from '../hooks/useEntity'
import { useEntityConfig, useTableConfig, useFormConfig } from '../hooks/useConfig'
import type { Vertrag } from '@shared/types/entities'

const ENTITY_NAME = 'vertrag'
const TABLE_NAME = 'vertraege'
const FORM_NAME = 'vertrag'
const PAGE_SIZE = 20

export function VertraegePage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()

  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState('beginn')
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('DESC')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Vertrag | null>(null)
  const [formError, setFormError] = useState('')
  const [selectedId, setSelectedId] = useState<string | undefined>(id)

  useEffect(() => {
    setSelectedId(id)
  }, [id])

  // Config
  const { data: entityConfig, isLoading: entityLoading } = useEntityConfig(ENTITY_NAME)
  const { data: tableConfig, isLoading: tableLoading } = useTableConfig<TableConfig>(TABLE_NAME)
  const { data: formConfig, isLoading: formLoading } = useFormConfig<FormConfig>(FORM_NAME)

  // List
  const { data: listData, isLoading: listLoading } = useEntityList<Vertrag>(ENTITY_NAME, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    orderBy: sortField,
    orderDir: sortDir,
  })

  const { data: detailResponse } = useEntityById<Vertrag>(ENTITY_NAME, selectedId)
  const selectedVertrag = detailResponse?.data

  // Mutations
  const createMutation = useCreateEntity<Vertrag>(ENTITY_NAME)
  const updateMutation = useUpdateEntity<Vertrag>(ENTITY_NAME)
  const deleteMutation = useDeleteEntity(ENTITY_NAME)

  // Handlers
  const handleFormSubmit = async (data: Record<string, unknown>) => {
    setFormError('')
    try {
      if (editItem) {
        await updateMutation.mutateAsync({ id: editItem.id, data })
      } else {
        await createMutation.mutateAsync(data as Partial<Vertrag>)
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

  const handleEdit = (item: Vertrag) => {
    setEditItem(item)
    setShowForm(true)
    setFormError('')
  }

  const handleDelete = async (item: Vertrag) => {
    try {
      await deleteMutation.mutateAsync(item.id)
      if (selectedId === item.id) {
        navigate('/vertraege')
      }
    } catch (error) {
      console.error('Löschen fehlgeschlagen', error)
    }
  }

  const handleSort = (field: string, dir: 'ASC' | 'DESC') => {
    setSortField(field)
    setSortDir(dir)
    setPage(1)
  }

  if (entityLoading || tableLoading || formLoading || !tableConfig || !entityConfig) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laden...</div>
      </div>
    )
  }

  const list = listData?.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verträge</h1>
          <p className="text-gray-500">Übersicht und Pflege aller Mietverträge.</p>
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
          Vertrag anlegen
        </button>
      </div>

      <DataTable<Vertrag>
        config={tableConfig}
        data={list}
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

      {selectedVertrag && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Vertragsdetails</h2>
            <button
              onClick={() => navigate('/vertraege')}
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              Auswahl zurücksetzen
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Kaltmiete</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
                  selectedVertrag.kaltmiete
                )}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Nebenkosten-Vorauszahlung</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
                  selectedVertrag.nebenkosten_vorauszahlung
                )}
              </p>
            </div>
          </div>
        </section>
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
