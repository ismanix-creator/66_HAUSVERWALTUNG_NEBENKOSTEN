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
import { useEntityList, useCreateEntity, useUpdateEntity } from '../hooks/useEntity'
import { useEntityConfig, useFormConfig, useTableConfig, useViewConfig } from '../hooks/useConfig'
import type { Zahlung, Sollstellung, Kaution } from '@shared/types/entities'

const PAGE_SIZE = 15

export function FinanzenPage() {
  const navigate = useNavigate()
  const { tab } = useParams<{ tab?: string }>()

  const { data: viewConfig, isLoading: viewLoading } = useViewConfig('finanzen')

  const tabs = viewConfig?.view?.tabs || []
  const activeTabId = tab || tabs[0]?.id || 'zahlungen'

  const [pagination, setPagination] = useState<Record<string, number>>({})
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (tab && tabs.some(t => t.id === tab)) {
      // activeTabId is set
    }
  }, [tab, tabs])

  const handleTabChange = (nextTabId: string) => {
    navigate(`/finanzen/${nextTabId}`, { replace: true })
  }

  const activeTab = tabs.find(t => t.id === activeTabId)

  const { data: currentTable, isLoading: tableLoading } = useTableConfig<TableConfig>(activeTab?.table?.replace('tables/', '') || '')
  const { data: currentForm } = useFormConfig<FormConfig>(activeTab?.id || '')
  const { data: currentEntity } = useEntityConfig(activeTab?.id || '')

  const currentList = useEntityList(activeTab?.id || '', {
    limit: PAGE_SIZE,
    offset: ((pagination[activeTabId] || 1) - 1) * PAGE_SIZE,
    orderBy: activeTab?.default_sort?.field || 'datum',
    orderDir: activeTab?.default_sort?.direction || 'DESC',
  })

  const createMutation = useCreateEntity(activeTab?.id || '')
  const updateMutation = useUpdateEntity(activeTab?.id || '')

  const handlePageChange = (nextPage: number) => {
    setPagination(prev => ({ ...prev, [activeTabId]: nextPage }))
  }

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    setFormError('')
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      setShowForm(false)
      setEditingItem(null)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Fehler beim Speichern')
    }
  }

  const resetForms = () => {
    setShowForm(false)
    setEditingItem(null)
    setFormError('')
  }

  const currentData = currentList.data?.data || []
  const currentMeta = currentList.data?.meta
  const isConfigLoading = viewLoading || tableLoading || !currentTable || !activeTab

  if (isConfigLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laden...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-400">{viewConfig?.view?.title?.replace('labels.', '') || 'Finanzen'}</h1>
        <p className="text-gray-600">Zahlungen, Sollstellungen und Kautionen zentral verwalten.</p>
      </div>

      <div className="flex space-x-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTabId === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {tab.label?.replace('tabs.', '') || tab.id}
          </button>
        ))}
      </div>

      {activeTab && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{activeTab.label?.replace('tabs.', '') || activeTab.id}</h2>
              <p className="text-sm text-gray-500">Verwaltung von {activeTab.label?.replace('tabs.', '') || activeTab.id}</p>
            </div>
            {activeTab.actions?.create && (
              <button
                onClick={() => {
                  resetForms()
                  setShowForm(true)
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 rounded-lg hover:text-primary-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                {activeTab.actions.create.label?.replace('actions.', '') || 'Erstellen'}
              </button>
            )}
          </div>

          <DataTable
            config={currentTable}
            data={currentData}
            total={currentMeta?.total || 0}
            page={pagination[activeTabId] || 1}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
            onEdit={item => {
              setEditingItem(item)
              setShowForm(true)
            }}
            onDelete={() => undefined}
            sortField=""
            sortDir="ASC"
            isLoading={currentList.isLoading}
          />
        </section>
      )}

      {showForm && currentForm && currentEntity && (
        <DynamicForm
          formConfig={currentForm}
          entityConfig={currentEntity}
          initialData={editingItem || undefined}
          isEdit={!!editingItem}
          onSubmit={handleFormSubmit}
          onCancel={resetForms}
          isLoading={createMutation.isPending || updateMutation.isPending}
          error={formError}
        />
      )}
    </div>
  )
}
