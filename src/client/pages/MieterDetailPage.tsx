import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DataTable, TableConfig } from '../components/data/DataTable'
import { DynamicForm, FormConfig } from '../components/data/DynamicForm'
import {
  useEntityById,
  useEntityList,
  useUpdateEntity,
} from '../hooks/useEntity'
import {
  useEntityConfig,
  useFormConfig,
  useTableConfig,
  useViewConfig,
} from '../hooks/useConfig'
import type { TabConfig, FieldConfig } from '@shared/types/config'

const TABLE_PAGE_SIZE = 6

interface FilterContext {
  mieterId?: string
  contractIds?: string[]
}

export function MieterDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: viewConfig, isLoading: viewLoading } = useViewConfig('mieter')
  const { data: detailResponse, isLoading: detailLoading } = useEntityById('mieter', id)
  const { data: entityConfig } = useEntityConfig('mieter')
  const { data: formConfig } = useFormConfig<FormConfig>('mieter')
  const contractList = useEntityList('vertrag', {
    filters: id ? { mieter_id: id } : undefined,
    limit: 20,
  })
  const updateMutation = useUpdateEntity<Record<string, unknown>>('mieter')

  const tabs = useMemo(() => viewConfig?.view?.detail?.tabs ?? [], [viewConfig?.view?.detail?.tabs])
  const [activeTabId, setActiveTabId] = useState<string | undefined>(tabs[0]?.id)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!tabs.length) return
    if (!activeTabId || !tabs.some(tab => tab.id === activeTabId)) {
      setActiveTabId(tabs[0].id)
    }
  }, [tabs, activeTabId])

  const mieter = detailResponse?.data as Record<string, unknown> | undefined
  // Only wait for essential configs - form/entity configs can be missing without blocking display
  const isLoading = viewLoading || detailLoading

  const contractIds = (contractList.data?.data?.map(contract => (contract as Record<string, unknown>).id) ?? []) as string[]

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      navigate(-1)
    }
  }

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    if (!mieter) return
    try {
      await updateMutation.mutateAsync({ id: mieter.id as string, data })
      setShowForm(false)
    } catch (error) {
      // Fehler wird vom DynamicForm-Handling angezeigt
    }
  }

  const activeTab = tabs.find(tab => tab.id === activeTabId)

  if (isLoading || !mieter) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laden...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 min-h-screen" onClick={handleBackgroundClick}>
      <section>
        <nav className="flex flex-wrap gap-2 border-b border-slate-800 pb-2 text-sm text-slate-300">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`px-3 py-2 font-medium transition ${
                activeTabId === tab.id
                  ? 'border-b-2 border-primary-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label.replace('labels.', '')}
            </button>
          ))}
        </nav>
        {activeTab && (
          <div className="mt-6">
            {renderTabContent(activeTab, {
              mieter,
              entityConfig: entityConfig!,
              formConfig,
              contractIds,
              onEdit: () => setShowForm(true),
            })}
          </div>
        )}
      </section>

      {showForm && formConfig && entityConfig && (
        <DynamicForm
          formConfig={formConfig}
          entityConfig={entityConfig}
          initialData={mieter}
          isEdit
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          isLoading={updateMutation.isPending}
        />
      )}
    </div>
  )
}

interface TabRenderProps {
  mieter: Record<string, unknown>
  entityConfig: unknown
  formConfig?: FormConfig
  contractIds: string[]
  onEdit: () => void
}

function renderTabContent(tab: TabConfig, props: TabRenderProps) {
  if (tab.type === 'form_readonly') {
    return (
      <ReadonlyFormTab
        formConfig={props.formConfig}
        entityConfig={props.entityConfig as { entity: { fields: Record<string, FieldConfig> } }}
        mieter={props.mieter}
        onEdit={props.onEdit}
      />
    )
  }

  if (tab.type === 'table' && tab.table) {
    return (
      <DetailTableTab
        tab={tab}
        mieterId={String(props.mieter.id)}
        contractIds={props.contractIds}
      />
    )
  }

  return <p className="text-slate-400">Tab-Inhalt wird noch erstellt.</p>
}

interface ReadonlyFormTabProps {
  formConfig?: FormConfig
  entityConfig: { entity: { fields: Record<string, FieldConfig> } }
  mieter: Record<string, unknown>
  onEdit: () => void
}

function ReadonlyFormTab({ formConfig, entityConfig, mieter, onEdit }: ReadonlyFormTabProps) {
  if (!formConfig) {
    return <p className="text-slate-400">Formular-Konfiguration fehlt.</p>
  }

  return (
    <div className="space-y-6 rounded-lg border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Stammdaten</h2>
        <button
          onClick={onEdit}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-400 hover:text-white"
        >
          Bearbeiten
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {formConfig.form.sections.map(section => (
          <div
            key={section.id}
            className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/80 p-4 text-slate-100"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              {section.label.replace('labels.', '')}
            </p>
            <div className="space-y-3">
              {section.fields.map(field => {
                const config = entityConfig.entity.fields[field.field]
                return (
                  <DetailField
                    key={field.field}
                    fieldName={field.field}
                    label={config?.label}
                    value={getValue(mieter, field.field)}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DetailField({ fieldName, label, value }: { fieldName: string; label?: string; value: unknown }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
        {(label || fieldName).replace('labels.', '')}
      </p>
      <p className="text-sm text-slate-100">{formatValue(value)}</p>
    </div>
  )
}

interface DetailTableTabProps {
  tab: TabConfig
  mieterId: string
  contractIds: string[]
}

function DetailTableTab({ tab, mieterId, contractIds }: DetailTableTabProps) {
  const tableKey = extractConfigName(tab.table)
  const { data: tableConfig, isLoading: tableLoading } = useTableConfig<TableConfig>(tableKey)
  const entityName = tableConfig?.table.entity
  const [page, setPage] = useState(1)

  const filters = useMemo(
    () => resolveTabFilters(tab.filter, { mieterId, contractIds }),
    [tab.filter, mieterId, contractIds]
  )

  // Move hook before conditional - must be called on every render
  // If entityName is missing, query won't execute due to empty string check
  const { data: listData, isLoading: dataLoading } = useEntityList<Record<string, unknown>>(
    entityName ?? '',
    {
      limit: TABLE_PAGE_SIZE,
      offset: (page - 1) * TABLE_PAGE_SIZE,
      filters: Object.keys(filters).length ? filters : undefined,
    }
  )

  if (!entityName || !tableConfig) {
    return <p className="text-sm text-slate-400">Tab-Konfiguration fehlt.</p>
  }

  return (
    <DataTable
      config={tableConfig}
      data={listData?.data || []}
      total={listData?.meta?.total || 0}
      page={page}
      pageSize={TABLE_PAGE_SIZE}
      onPageChange={setPage}
      isLoading={tableLoading || dataLoading}
      sortField={tableConfig.table.columns[0]?.field}
      sortDir="ASC"
    />
  )
}

function extractConfigName(path?: string) {
  if (!path) return ''
  const parts = path.split('/')
  const last = parts[parts.length - 1]
  return last.replace(/\.table$/, '').replace(/\.form$/, '')
}

function resolveTabFilters(filter?: Record<string, string>, context?: FilterContext) {
  if (!filter) return {}
  const result: Record<string, string> = {}
  for (const [key, rawValue] of Object.entries(filter)) {
    if (!rawValue) continue
    if (key === 'vertrag.mieter_id') {
      if (context?.contractIds?.length) {
        result['vertrag_id'] = context.contractIds.join(',')
      }
      continue
    }
    let value = rawValue
    if (context?.mieterId && value.includes(':id')) {
      value = value.replace(/:id/g, context.mieterId)
    }
    result[key] = value
  }
  return result
}

function getValue(record: Record<string, unknown> | undefined, field: string) {
  if (!record) return undefined
  const parts = field.split('.')
  let value: unknown = record
  for (const part of parts) {
    if (value && typeof value === 'object') {
      value = (value as Record<string, unknown>)[part]
    } else {
      return undefined
    }
  }
  return value
}

function formatValue(value: unknown) {
  if (value === undefined || value === null || value === '') {
    return '—'
  }
  if (typeof value === 'string') {
    if (/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(value)) {
      return value.match(/.{1,4}/g)?.join(' ') ?? value
    }
    return value
  }
  if (Array.isArray(value)) {
    return value.map(v => String(v)).join(', ')
  }
  if (typeof value === 'boolean') {
    return value ? 'Ja' : 'Nein'
  }
  if (typeof value === 'number') {
    return value.toString()
  }
  return JSON.stringify(value)
}
