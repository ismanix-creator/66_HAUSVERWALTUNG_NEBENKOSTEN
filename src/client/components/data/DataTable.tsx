/**
 * DataTable: Generische Tabellen-Komponente
 * Rendert Spalten aus table.toml Config
 *
 * @lastModified 2025-12-19
 */

import { Fragment, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWidthsConfig } from '../../hooks/useConfig'
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  FileSignature,
  FileText,
  History,
  Home,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  XCircle,
  CheckCircle,
  type LucideIcon,
} from 'lucide-react'
// Labels sind jetzt im Format entity.field (z.B. mieter.name, mieter.aktionen)
// Diese werden direkt als Text angezeigt, keine Auflösung nötig

export interface TableColumn {
  field: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  fallback_fields?: string[]
  template?: string
  display?: 'text' | 'badge' | 'date' | 'currency'
  badge_colors?: Record<string, string>
  format?: 'number' | 'currency' | 'date'
  suffix?: string
}

export interface TableConfig {
  table: {
    entity: string
    row_click?: 'navigate' | 'expand' | 'select'
    row_click_route?: string
    columns: TableColumn[]
    row_actions?: Record<string, RowActionConfig>
    actions?: {
      label?: string
      width?: string
    }
  }
}

export interface RowActionConfig {
  icon: string
  label?: string
  dialog?: string
  handler?: string
  confirm?: boolean
  confirm_message?: string
  visible_if?: VisibilityCondition
  defaults?: Record<string, unknown>
}

export interface VisibilityCondition {
  field: string
  equals?: unknown
  not_equals?: unknown
  in?: unknown[]
  not_in?: unknown[]
  is_set?: boolean
  not_set?: boolean
}

interface DataTableProps<T> {
  config: TableConfig
  data: T[]
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onSort?: (field: string, dir: 'ASC' | 'DESC') => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  sortField?: string
  sortDir?: 'ASC' | 'DESC'
  isLoading?: boolean
  onRowAction?: (item: T, actionId: string, actionConfig: RowActionConfig) => void
}

export function DataTable<T extends Record<string, unknown>>({
  config,
  data,
  total,
  page,
  pageSize,
  onPageChange,
  onSort,
  onEdit,
  onDelete,
  sortField,
  sortDir,
  isLoading,
  onRowAction,
}: DataTableProps<T>) {
  const navigate = useNavigate()
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [confirmAction, setConfirmAction] = useState<{ itemId: string; actionId: string } | null>(null)
  const { data: widthsConfig = {} } = useWidthsConfig()

  const iconLookup: Record<string, LucideIcon> = {
    Pencil,
    Trash2,
    FileSignature,
    XCircle,
    Plus,
    Upload,
    Search,
    History,
    Eye,
    Download,
    FileText,
  CheckCircle,
  Home,
}

  // Width resolver: resolves "width.w100" and other width references to actual px values
  // Falls back to the value as-is if it's already a px value
  const resolveWidth = useMemo(() => {
    return (width?: string): string => {
      if (!width) return 'auto'

      // If already a px value, return as-is
      if (width.includes('px') || width.includes('rem')) return width

      // If it's a reference like "width.w100", resolve from config
      if (width.startsWith('width.')) {
        const key = width.substring(6) // Remove "width." prefix
        const resolvedValue = widthsConfig[key]
        return resolvedValue || width // Fallback to original if not found
      }

      return width
    }
  }, [widthsConfig])

  const { columns, row_click, row_click_route, row_actions } = config.table
  const totalPages = Math.ceil(total / pageSize)
  const actionEntries = row_actions ? Object.entries(row_actions) : []
  const actionHeaderLabel = config.table.actions?.label
  const actionWidth = resolveWidth(config.table.actions?.width) || '130px'

  const getItemId = (item: T, index: number) => {
    const rawId = (item as Record<string, unknown>).id ?? (item as Record<string, unknown>)._id ?? index
    return String(rawId)
  }

  const toggleExpand = (rowId: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      if (next.has(rowId)) {
        next.delete(rowId)
      } else {
        next.add(rowId)
      }
      return next
    })
  }

  // Handle row click
  const handleRowClick = (item: T, index: number) => {
    if (row_click === 'navigate' && row_click_route) {
      const route = row_click_route.replace(':id', getItemId(item, index))
      navigate(route)
      return
    }

    if (row_click === 'expand') {
      toggleExpand(getItemId(item, index))
    }
  }

  // Handle sort
  const handleSort = (field: string) => {
    if (!onSort) return
    const newDir = sortField === field && sortDir === 'ASC' ? 'DESC' : 'ASC'
    onSort(field, newDir)
  }

  // Get value from nested path (e.g., "computed.anzahl_einheiten")
  const getValue = (item: T, field: string, fallbackFields?: string[]): unknown => {
    const parts = field.split('.')
    let value: unknown = item
    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[part]
      } else {
        return undefined
      }
    }
    if ((value === undefined || value === null || value === '') && fallbackFields?.length) {
      for (const fb of fallbackFields) {
        const fbValue = getValue(item, fb)
        if (fbValue !== undefined && fbValue !== null && fbValue !== '') {
          return fbValue
        }
      }
    }
    return value
  }

  // Format cell value based on column config
  const formatValue = (item: T, column: TableColumn): string => {
    if (column.template) {
      return column.template.replace(/\{(\w+)\}/g, (_, field) => {
        const val = getValue(item, field, column.fallback_fields)
        return val !== undefined && val !== null ? String(val) : ''
      })
    }

    const value = getValue(item, column.field, column.fallback_fields)
    if (value === undefined || value === null) return '-'

    if (column.format === 'currency') {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
      }).format(Number(value))
    }

    if (column.format === 'number') {
      const formatted = new Intl.NumberFormat('de-DE').format(Number(value))
      return column.suffix ? `${formatted}${column.suffix}` : formatted
    }

    if (column.format === 'date' && value) {
      return new Date(String(value)).toLocaleDateString('de-DE')
    }

    return String(value) + (column.suffix || '')
  }

  const renderCell = (item: T, column: TableColumn) => {
    const value = getValue(item, column.field)
    const displayValue = formatValue(item, column)

    if (column.display === 'badge' && column.badge_colors) {
      const color = column.badge_colors[String(value)] || 'gray'
      const colorClasses: Record<string, string> = {
        blue: 'bg-blue-900/50 text-blue-100 border border-blue-800',
        green: 'bg-emerald-900/50 text-emerald-100 border border-emerald-800',
        orange: 'bg-amber-900/40 text-amber-100 border border-amber-800',
        purple: 'bg-purple-900/40 text-purple-100 border border-purple-800',
        red: 'bg-red-900/50 text-red-100 border border-red-800',
        yellow: 'bg-yellow-900/40 text-yellow-100 border border-yellow-800',
        gray: 'bg-slate-800 text-slate-200 border border-slate-700',
      }
      return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[color]}`}>
          {displayValue}
        </span>
      )
    }

    return displayValue
  }

  const evaluateVisibility = (item: T, condition: VisibilityCondition): boolean => {
    const value = getValue(item, condition.field)

    if (condition.is_set) {
      return value !== undefined && value !== null && value !== ''
    }

    if (condition.not_set) {
      return value === undefined || value === null || value === ''
    }

    if (condition.equals !== undefined) {
      return value === condition.equals
    }

    if (condition.not_equals !== undefined) {
      return value !== condition.not_equals
    }

    if (condition.in) {
      return condition.in.includes(value)
    }

    if (condition.not_in) {
      return !condition.not_in.includes(value)
    }

    return true
  }

  const shouldShowAction = (item: T, action: RowActionConfig) => {
    if (!action.visible_if) return true
    return evaluateVisibility(item, action.visible_if)
  }

  const handleRowAction = (item: T, actionId: string, actionConfig: RowActionConfig) => {
    setConfirmAction(null)

    if (actionId === 'edit') {
      onEdit?.(item)
      return
    }

    if (actionId === 'delete') {
      onDelete?.(item)
      return
    }

    onRowAction?.(item, actionId, actionConfig)
  }

  const totalColumns = columns.length + (actionEntries.length > 0 ? 1 : 0)

  const getAlignClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'left':
        return 'text-left'
      case 'right':
        return 'text-right'
      default:
        return 'text-center'
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900 shadow-lg shadow-black/30">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-slate-800" style={{ tableLayout: 'fixed' }}>
          <thead className="bg-slate-800/80">
            <tr>
              {columns.map(column => (
                <th
                  key={column.field}
                  style={{ width: resolveWidth(column.width) }}
                  className={`px-4 py-3 text-xs font-medium text-slate-300 uppercase tracking-wider ${getAlignClass(column.align)} ${
                    column.sortable ? 'cursor-pointer hover:bg-slate-700/60' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.field)}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{column.label}</span>
                    {column.sortable &&
                      sortField === column.field &&
                      (sortDir === 'ASC' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </div>
                </th>
              ))}
              {actionEntries.length > 0 && (
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider"
                  style={{ width: actionWidth }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{actionHeaderLabel || 'Aktionen'}</span>
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900">
            {isLoading ? (
              <tr>
                <td colSpan={totalColumns} className="px-4 py-8 text-center text-slate-500">
                  Laden...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={totalColumns} className="px-4 py-8 text-center text-slate-500">
                  Keine Einträge vorhanden
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const rowId = getItemId(item, index)
                const isExpanded = expandedRows.has(rowId)

                return (
                  <Fragment key={rowId}>
                    <tr
                      className={`${row_click ? 'cursor-pointer hover:bg-slate-800/60' : ''} ${
                        isExpanded ? 'bg-slate-900/90' : ''
                      }`}
                      onClick={() => handleRowClick(item, index)}
                    >
                      {columns.map(column => (
                        <td
                          key={`${rowId}-${column.field}`}
                          style={{ width: resolveWidth(column.width) }}
                          className={`px-4 py-3 text-sm text-slate-100 ${getAlignClass(column.align)}`}
                        >
                          {renderCell(item, column)}
                        </td>
                      ))}
                      {actionEntries.length > 0 && (
                        <td
                          className="px-4 py-3 text-center"
                          style={{ width: actionWidth }}
                        >
                          <div className="flex flex-wrap items-center justify-center gap-1">
                          {actionEntries.map(([actionId, actionConfig]) => {
                            if (!shouldShowAction(item, actionConfig)) return null

                            const Icon = iconLookup[actionConfig.icon] || Pencil
                            // Use actionConfig.label if defined (even if empty string), otherwise use actionId
                            const label = actionConfig.label !== undefined ? actionConfig.label : actionId
                            const isConfirmActive =
                              confirmAction?.itemId === rowId && confirmAction?.actionId === actionId

                            if (isConfirmActive) {
                              return (
                                <div
                                  key={`${rowId}-${actionId}-confirm`}
                                  className="flex items-center gap-2 text-xs text-red-300"
                                >
                                  <span>{actionConfig.confirm_message || label}</span>
                                  <button
                                    onClick={e => {
                                      e.stopPropagation()
                                      handleRowAction(item, actionId, actionConfig)
                                    }}
                                    className="px-2 py-1 text-[10px] font-bold text-white bg-red-700 rounded"
                                  >
                                    Bestätigen
                                  </button>
                                  <button
                                    onClick={e => {
                                      e.stopPropagation()
                                      setConfirmAction(null)
                                    }}
                                    className="px-2 py-1 text-[10px] font-medium text-slate-200 bg-slate-800 rounded"
                                  >
                                    Abbrechen
                                  </button>
                                </div>
                              )
                            }

                            return (
                              <button
                                key={`${rowId}-${actionId}`}
                                onClick={e => {
                                  e.stopPropagation()
                                  if (actionConfig.confirm) {
                                    setConfirmAction({ itemId: rowId, actionId })
                                    return
                                  }
                                  handleRowAction(item, actionId, actionConfig)
                                }}
                                title={label || undefined}
                                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-200 transition hover:text-white"
                              >
                                <Icon className="h-4 w-4" />
                                {label && <span>{label}</span>}
                              </button>
                            )
                          })}
                          </div>
                        </td>
                      )}
                    </tr>
                    {row_click === 'expand' && isExpanded && (
                      <tr className="bg-slate-950">
                        <td colSpan={totalColumns} className="px-4 py-4 text-sm text-slate-300">
                          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                            {columns.map(column => (
                              <div key={`${rowId}-detail-${column.field}`} className="space-y-1">
                                <div className="text-[10px] uppercase tracking-wider text-slate-500">
                                  {column.label}
                                </div>
                                <div className="text-sm text-slate-100">{renderCell(item, column)}</div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 bg-slate-800/60">
          <div className="text-sm text-slate-300">
            {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} von {total}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1 rounded hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-slate-200">
              Seite {page} von {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1 rounded hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
