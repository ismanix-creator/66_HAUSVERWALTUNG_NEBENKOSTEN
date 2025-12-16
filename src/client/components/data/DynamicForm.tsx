/**
 * DynamicForm: Generische Formular-Komponente
 * Rendert Felder aus form.toml + entity.toml Config
 *
 * @lastModified 2025-12-16
 */

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { EntityConfig } from '@shared/types/config'

export interface FormField {
  field: string
  width: 'full' | 'half' | 'third' | 'two_thirds'
  rows?: number
}

export interface FormSection {
  id: string
  label: string
  fields: FormField[]
}

export interface FormConfig {
  form: {
    entity: string
    title_create: string
    title_edit: string
    sections: FormSection[]
    actions?: {
      submit?: { label: string }
      cancel?: { label: string }
    }
  }
}

interface DynamicFormProps {
  formConfig: FormConfig
  entityConfig: EntityConfig
  initialData?: Record<string, unknown>
  isEdit?: boolean
  onSubmit: (data: Record<string, unknown>) => void
  onCancel: () => void
  isLoading?: boolean
  error?: string
}

export function DynamicForm({
  formConfig,
  entityConfig,
  initialData,
  isEdit = false,
  onSubmit,
  onCancel,
  isLoading,
  error,
}: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form data
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      // Set defaults from entity config
      const defaults: Record<string, unknown> = {}
      for (const [fieldName, fieldConfig] of Object.entries(entityConfig.entity.fields)) {
        if (fieldConfig.default !== undefined) {
          defaults[fieldName] = fieldConfig.default
        }
      }
      setFormData(defaults)
    }
  }, [initialData, entityConfig])

  // Handle field change
  const handleChange = (fieldName: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
    // Clear error when field changes
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    for (const [fieldName, fieldConfig] of Object.entries(entityConfig.entity.fields)) {
      const value = formData[fieldName]

      // Skip auto-generated fields
      if (fieldConfig.auto_generate) continue

      // Required check
      if (fieldConfig.required && (value === undefined || value === null || value === '')) {
        newErrors[fieldName] = 'Dieses Feld ist erforderlich'
        continue
      }

      // Skip further validation if empty and not required
      if (value === undefined || value === null || value === '') continue

      // Pattern validation
      if (fieldConfig.pattern && typeof value === 'string') {
        if (!new RegExp(fieldConfig.pattern).test(value)) {
          newErrors[fieldName] = 'Ungültiges Format'
        }
      }

      // Min/Max for numbers
      if (fieldConfig.type === 'integer' || fieldConfig.type === 'decimal') {
        const numValue = Number(value)
        if (fieldConfig.min !== undefined && numValue < fieldConfig.min) {
          newErrors[fieldName] = `Minimum: ${fieldConfig.min}`
        }
        if (fieldConfig.max !== undefined && numValue > fieldConfig.max) {
          newErrors[fieldName] = `Maximum: ${fieldConfig.max}`
        }
      }

      // Max length for strings
      if (fieldConfig.max_length && typeof value === 'string' && value.length > fieldConfig.max_length) {
        newErrors[fieldName] = `Maximal ${fieldConfig.max_length} Zeichen`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  // Render field input based on type
  const renderField = (formField: FormField) => {
    const fieldConfig = entityConfig.entity.fields[formField.field]
    if (!fieldConfig) return null

    // Skip auto-generated and hidden fields
    if (fieldConfig.auto_generate || fieldConfig.visible === false) return null
    if (isEdit === false && fieldConfig.visible_in_form === false) return null

    const value = formData[formField.field]
    const fieldError = errors[formField.field]
    const label = fieldConfig.label?.replace('labels.', '') || formField.field

    const baseClasses = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
      fieldError ? 'border-red-500' : 'border-gray-300'
    }`

    const widthClasses: Record<string, string> = {
      full: 'col-span-2',
      half: 'col-span-1',
      third: 'col-span-1 md:col-span-1',
      two_thirds: 'col-span-2 md:col-span-1',
    }

    return (
      <div key={formField.field} className={widthClasses[formField.width]}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {fieldConfig.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Text input */}
        {(fieldConfig.type === 'string' || fieldConfig.type === 'uuid') && (
          <input
            type="text"
            value={(value as string) || ''}
            onChange={(e) => handleChange(formField.field, e.target.value)}
            placeholder={fieldConfig.placeholder}
            className={baseClasses}
            disabled={fieldConfig.readonly}
          />
        )}

        {/* File input placeholder */}
        {fieldConfig.type === 'file' && (
          <input
            type="text"
            value={(value as string) || ''}
            onChange={(e) => handleChange(formField.field, e.target.value)}
            placeholder={fieldConfig.placeholder || 'Pfad oder URL'}
            className={baseClasses}
            disabled={fieldConfig.readonly}
          />
        )}

        {/* Text area */}
        {fieldConfig.type === 'text' && (
          <textarea
            value={(value as string) || ''}
            onChange={(e) => handleChange(formField.field, e.target.value)}
            rows={formField.rows || 3}
            className={baseClasses}
            disabled={fieldConfig.readonly}
          />
        )}

        {/* Number input */}
        {(fieldConfig.type === 'integer' || fieldConfig.type === 'decimal' || fieldConfig.type === 'currency') && (
          <input
            type="number"
            value={value !== undefined && value !== null ? String(value) : ''}
            onChange={(e) => handleChange(formField.field, e.target.value === '' ? null : Number(e.target.value))}
            min={fieldConfig.min}
            max={fieldConfig.max}
            step={fieldConfig.type === 'integer' ? 1 : 0.01}
            className={baseClasses}
            disabled={fieldConfig.readonly}
          />
        )}

        {/* Boolean checkbox */}
        {fieldConfig.type === 'boolean' && (
          <div className="flex items-center h-10">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => handleChange(formField.field, e.target.checked)}
              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              disabled={fieldConfig.readonly}
            />
            {fieldConfig.description && (
              <span className="ml-2 text-sm text-gray-500">{fieldConfig.description}</span>
            )}
          </div>
        )}

        {/* Enum select */}
        {fieldConfig.type === 'enum' && fieldConfig.options && (
          <select
            value={(value as string) || ''}
            onChange={(e) => handleChange(formField.field, e.target.value)}
            className={baseClasses}
            disabled={fieldConfig.readonly}
          >
            <option value="">Bitte wählen...</option>
            {fieldConfig.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}

        {/* Date input */}
        {fieldConfig.type === 'date' && (
          <input
            type="date"
            value={(value as string) || ''}
            onChange={(e) => handleChange(formField.field, e.target.value)}
            className={baseClasses}
            disabled={fieldConfig.readonly}
          />
        )}

        {/* Datetime input */}
        {fieldConfig.type === 'datetime' && (
          <input
            type="datetime-local"
            value={(value as string)?.slice(0, 16) || ''}
            onChange={(e) => handleChange(formField.field, e.target.value)}
            className={baseClasses}
            disabled={fieldConfig.readonly}
          />
        )}

        {/* Error message */}
        {fieldError && <p className="mt-1 text-sm text-red-500">{fieldError}</p>}
      </div>
    )
  }

  const title = isEdit
    ? formConfig.form.title_edit.replace('labels.', '')
    : formConfig.form.title_create.replace('labels.', '')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onCancel} className="p-1 text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>
            )}

            {formConfig.form.sections.map((section) => (
              <div key={section.id}>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  {section.label.replace('labels.', '')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {section.fields.map((field) => renderField(field))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isLoading}
            >
              {formConfig.form.actions?.cancel?.label?.replace('labels.', '') || 'Abbrechen'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading
                ? 'Speichern...'
                : formConfig.form.actions?.submit?.label?.replace('labels.', '') || 'Speichern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
