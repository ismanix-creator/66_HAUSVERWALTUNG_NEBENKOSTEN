/**
 * DataTable: Generische Tabellen-Komponente
 * Rendert Spalten aus table.toml Config
 *
 * @lastModified 2025-12-16
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronUp, ChevronDown, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

export interface TableColumn {
  field: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  template?: string
  display?: 'text' | 'badge' | 'date' | 'currency'
  badge_colors?: Record<string, string>
  format?: 'number' | 'currency' | 'date'
  suffix?: string
}

export interface TableConfig {
  table: {
    entity: string
    row_click?: 'navigate' | 'select'
    row_click_route?: string
    columns: TableColumn[]
    row_actions?: {
      edit?: { icon: string; dialog?: string }
      delete?: { icon: string; confirm?: boolean; confirm_message?: string }
    }
  }
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
}: DataTableProps<T>) {
  const navigate = useNavigate()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const { columns, row_click, row_click_route, row_actions } = config.table
  const totalPages = Math.ceil(total / pageSize)

  // Handle row click
  const handleRowClick = (item: T) => {
    if (row_click === 'navigate' && row_click_route) {
      const route = row_click_route.replace(':id', item.id as string)
      navigate(route)
    }
  }

  // Handle sort
  const handleSort = (field: string) => {
    if (!onSort) return
    const newDir = sortField === field && sortDir === 'ASC' ? 'DESC' : 'ASC'
    onSort(field, newDir)
  }

  // Get value from nested path (e.g., "computed.anzahl_einheiten")
  const getValue = (item: T, field: string): unknown => {
    const parts = field.split('.')
    let value: unknown = item
    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[part]
      } else {
        return undefined
      }
    }
    return value
  }

  // Format cell value based on column config
  const formatValue = (item: T, column: TableColumn): string => {
    // Handle template
    if (column.template) {
      return column.template.replace(/\{(\w+)\}/g, (_, field) => {
        const val = getValue(item, field)
        return val !== undefined && val !== null ? String(val) : ''
      })
    }

    const value = getValue(item, column.field)
    if (value === undefined || value === null) return '-'

    // Format based on type
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

  // Render cell content
  const renderCell = (item: T, column: TableColumn) => {
    const value = getValue(item, column.field)
    const displayValue = formatValue(item, column)

    // Badge display
    if (column.display === 'badge' && column.badge_colors) {
      const color = column.badge_colors[String(value)] || 'gray'
      const colorClasses: Record<string, string> = {
        blue: 'bg-blue-100 text-blue-800',
        green: 'bg-green-100 text-green-800',
        orange: 'bg-orange-100 text-orange-800',
        purple: 'bg-purple-100 text-purple-800',
        red: 'bg-red-100 text-red-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        gray: 'bg-gray-100 text-gray-800',
      }
      return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[color]}`}>
          {displayValue}
        </span>
      )
    }

    return displayValue
  }

  // Confirm delete dialog
  const handleDeleteClick = (item: T, e: React.MouseEvent) => {
    e.stopPropagation()
    if (row_actions?.delete?.confirm) {
      setDeleteConfirm(item.id as string)
    } else {
      onDelete?.(item)
    }
  }

  const confirmDelete = (item: T) => {
    onDelete?.(item)
    setDeleteConfirm(null)
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.field}
                  style={{ width: column.width }}
                  className={`px-4 py-3 text-${column.align || 'left'} text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.field)}
                >
                  <div className="flex items-center gap-1">
                    <span>{column.label.replace('labels.', '')}</span>
                    {column.sortable && sortField === column.field && (
                      sortDir === 'ASC' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
              {row_actions && <th className="px-4 py-3 w-24"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (row_actions ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                  Laden...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (row_actions ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                  Keine Einträge vorhanden
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id as string}
                  className={`${row_click ? 'cursor-pointer hover:bg-gray-50' : ''} ${
                    deleteConfirm === item.id ? 'bg-red-50' : ''
                  }`}
                  onClick={() => handleRowClick(item)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.field}
                      className={`px-4 py-3 text-sm text-gray-900 text-${column.align || 'left'}`}
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}
                  {row_actions && (
                    <td className="px-4 py-3 text-right">
                      {deleteConfirm === item.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              confirmDelete(item)
                            }}
                            className="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                          >
                            Löschen
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteConfirm(null)
                            }}
                            className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                          >
                            Abbrechen
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {row_actions.edit && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onEdit?.(item)
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          )}
                          {row_actions.delete && (
                            <button
                              onClick={(e) => handleDeleteClick(item, e)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, total)} von {total}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-600">
              Seite {page} von {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
