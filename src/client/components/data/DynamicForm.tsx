/**
 * DynamicForm: Generische Formular-Komponente
 * Rendert Felder aus form.toml + entity.toml Config
 *
 * @lastModified 2025-12-19
 */

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { EntityConfig } from '@shared/types/config'
import { useCatalog, useDesignConfig } from '../../hooks/useConfig'

type BankCatalogItem = {
  value?: string
  label?: string
  bic?: string
}

type BankCatalogConfig = {
  name?: string
  items?: BankCatalogItem[]
}

const normalizeIban = (iban?: string) =>
  (iban || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')

const ensureGermanPrefix = (iban: string) => {
  if (!iban) return ''
  if (iban.startsWith('DE')) return iban
  return `DE${iban}`
}

const normalizeIbanInput = (raw: string) => {
  const cleaned = normalizeIban(raw)
  if (!cleaned) return ''
  return ensureGermanPrefix(cleaned)
}

const formatIbanDisplay = (iban: string) => {
  if (!iban) return ''
  const normalized = normalizeIbanInput(iban)
  const country = normalized.slice(0, 2)
  const check = normalized.slice(2, 4)
  const rest = normalized.slice(4)
  const chunks: string[] = []
  if (country || check) {
    chunks.push(`${country}${check}`)
  }
  for (let i = 0; i < rest.length; i += 4) {
    chunks.push(rest.slice(i, i + 4))
  }
  return chunks.filter(Boolean).join(' ').trim()
}

const extractGermanBankCode = (iban: string) => {
  if (!iban.startsWith('DE')) return null
  if (iban.length < 12) return null
  return iban.slice(4, 12)
}

const handleEnterAsTab = (e: React.KeyboardEvent<HTMLElement>) => {
  if (e.key !== 'Enter') return
  e.preventDefault()
  const form = (e.target as HTMLElement).closest('form')
  if (!form) return
  const focusables = Array.from(
    form.querySelectorAll<HTMLElement>('input, select, textarea, button')
  ).filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1)
  const currentIndex = focusables.indexOf(e.target as HTMLElement)
  if (currentIndex >= 0 && currentIndex < focusables.length - 1) {
    focusables[currentIndex + 1].focus()
  }
}

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
  const entityName = entityConfig.name
  const isMieterForm = entityName === 'mieter'
  const { data: bankCatalog } = useCatalog<BankCatalogConfig>(
    isMieterForm ? 'bankleitzahlen' : ''
  )
  const { data: designConfig } = useDesignConfig()
  const ibanValue = typeof formData['iban'] === 'string' ? (formData['iban'] as string) : ''

  // Initialize form data
  useEffect(() => {
    if (initialData) {
      if (isMieterForm && typeof initialData['iban'] === 'string') {
        const normalized = normalizeIbanInput(initialData['iban'] as string)
        setFormData({ ...initialData, iban: normalized })
        return
      }
      setFormData(initialData)
    } else {
      // Set defaults from entity config
      const defaults: Record<string, unknown> = {}
      for (const [fieldName, fieldConfig] of Object.entries(entityConfig.fields)) {
        if (fieldConfig.default !== undefined) {
          defaults[fieldName] = fieldConfig.default
        }
      }
      setFormData(defaults)
    }
  }, [initialData, entityConfig, isMieterForm])

  useEffect(() => {
    if (!isMieterForm) return
    if (!bankCatalog?.items?.length) return
    const normalized = normalizeIbanInput(ibanValue)
    if (!normalized) return
    const bankCode = extractGermanBankCode(normalized)
    if (!bankCode) return
    const matches = bankCatalog.items.filter(item => item.value === bankCode)
    if (!matches.length) return

    // If multiple entries for same BLZ exist, just take the first match (no PLZ-disambiguation)
    const match = matches[0]
    if (!match?.label && !match?.bic) return
    setFormData(prev => {
      const currentBankname = typeof prev['bankname'] === 'string' ? (prev['bankname'] as string) : ''
      const currentBic = typeof prev['bic'] === 'string' ? (prev['bic'] as string) : ''
      if (currentBankname.trim().length > 0) {
        if (currentBic.trim().length > 0 || !match?.bic) {
          return prev
        }
        return { ...prev, bic: match.bic }
      }
      const next: Record<string, unknown> = { ...prev }
      if (match.label) {
        next.bankname = match.label
      }
      if (!currentBic.trim().length && match.bic) {
        next.bic = match.bic
      }
      return next
    })
  }, [ibanValue, bankCatalog, isMieterForm])

  // Handle field change
  const handleChange = (fieldName: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
    // Clear error when field changes
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const processedFormData = { ...formData }

    // Pre-process IBAN: if only "DE", treat as empty
    const ibanRaw = formData['iban']
    if (typeof ibanRaw === 'string') {
      const ibanValue = normalizeIbanInput(ibanRaw)
      if (ibanValue === 'DE' || ibanValue === '') {
        processedFormData['iban'] = ''
      }
    }

    for (const [fieldName, fieldConfig] of Object.entries(entityConfig.fields)) {
      const value = processedFormData[fieldName]

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
        const candidate = value as string
        if (!new RegExp(fieldConfig.pattern).test(candidate)) {
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
      if (
        fieldConfig.max_length &&
        typeof value === 'string' &&
        value.length > fieldConfig.max_length
      ) {
        newErrors[fieldName] = `Maximal ${fieldConfig.max_length} Zeichen`
      }
    }

    // Update formData with processed values (especially IBAN set to empty)
    setFormData(processedFormData)
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
      const fieldConfig = entityConfig.fields[formField.field]
      if (!fieldConfig) return null

    // Skip auto-generated and hidden fields
    if (fieldConfig.auto_generate || fieldConfig.visible === false) return null
    if (isEdit === false && fieldConfig.visible_in_form === false) return null

    const value = formData[formField.field]
    const fieldError = errors[formField.field]
    const label = fieldConfig.label?.replace('labels.', '') || formField.field

    const placeholderText = fieldConfig.placeholder || ''
    const baseClasses = `w-full px-3 py-2 border rounded-lg h-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-slate-100 text-slate-900 placeholder-slate-400 ${
      fieldError ? 'border-red-500' : 'border-slate-300'
    }`

    // Monospace font for number inputs (from design.typography.numbers_font_class)
    const isNumberField = fieldConfig.type === 'integer' || fieldConfig.type === 'decimal' || fieldConfig.type === 'currency'
    const designTypography = designConfig?.['typography'] as Record<string, string> | undefined
    const numberFontClass = designTypography?.['numbers_font_class'] || 'font-mono'
    const numberFieldClasses = isNumberField ? `${baseClasses} ${numberFontClass}` : baseClasses

    const widthClasses: Record<string, string> = {
      full: 'col-span-2',
      half: 'col-span-1',
      third: 'col-span-1 md:col-span-1',
      two_thirds: 'col-span-2 md:col-span-1',
    }

    return (
      <div key={formField.field} className={widthClasses[formField.width]}>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          {label}
          {fieldConfig.required && <span className="text-red-400 ml-1">*</span>}
        </label>

        {/* Text input */}
        {(fieldConfig.type === 'string' || fieldConfig.type === 'uuid' || fieldConfig.type === 'email') && (
          <input
            type={fieldConfig.type === 'email' ? 'email' : 'text'}
            value={
              formField.field === 'iban'
                ? formatIbanDisplay((value as string) || '')
                : ((value as string) || '')
            }
            onChange={e => {
              if (formField.field === 'iban') {
                const normalized = normalizeIbanInput(e.target.value)
                handleChange(formField.field, normalized)
              } else {
                handleChange(formField.field, e.target.value)
              }
            }}
            onKeyDown={handleEnterAsTab}
            placeholder={placeholderText}
            className={baseClasses}
            disabled={fieldConfig.readonly}
          />
        )}

        {/* File input placeholder */}
        {fieldConfig.type === 'file' && (
          <input
            type="text"
            value={(value as string) || ''}
            onChange={e => handleChange(formField.field, e.target.value)}
            placeholder={fieldConfig.placeholder || placeholderText}
            className={baseClasses}
            disabled={fieldConfig.readonly}
          />
        )}

        {/* Text area */}
        {fieldConfig.type === 'text' && (
          <textarea
            value={(value as string) || ''}
            onChange={e => handleChange(formField.field, e.target.value)}
            rows={formField.rows || 3}
            onKeyDown={handleEnterAsTab}
            className={baseClasses}
            disabled={fieldConfig.readonly}
          />
        )}

        {/* Number input */}
        {(fieldConfig.type === 'integer' ||
          fieldConfig.type === 'decimal' ||
          fieldConfig.type === 'currency') && (
          <input
            type="number"
            value={value !== undefined && value !== null ? String(value) : ''}
            onChange={e =>
              handleChange(formField.field, e.target.value === '' ? null : Number(e.target.value))
            }
            min={fieldConfig.min}
            max={fieldConfig.max}
            step={fieldConfig.type === 'integer' ? 1 : 0.01}
            onKeyDown={handleEnterAsTab}
            className={numberFieldClasses}
            disabled={fieldConfig.readonly}
          />
        )}

        {/* Boolean checkbox */}
        {fieldConfig.type === 'boolean' && (
          <div className="flex items-center h-10">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={e => handleChange(formField.field, e.target.checked)}
              onKeyDown={handleEnterAsTab}
              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              disabled={fieldConfig.readonly}
            />
            {fieldConfig.description && (
              <span className="ml-2 text-sm text-slate-400">{fieldConfig.description}</span>
            )}
          </div>
        )}

        {/* Enum select */}
        {fieldConfig.type === 'enum' && fieldConfig.options && (
          <select
            value={(value as string) || ''}
            onChange={e => handleChange(formField.field, e.target.value)}
            onKeyDown={handleEnterAsTab}
            className={baseClasses}
            disabled={fieldConfig.readonly}
          >
            <option value="">Bitte wählen...</option>
            {fieldConfig.options.map(opt => (
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
            onChange={e => handleChange(formField.field, e.target.value)}
            onKeyDown={handleEnterAsTab}
            className={baseClasses}
            disabled={fieldConfig.readonly}
          />
        )}

        {/* Datetime input */}
        {fieldConfig.type === 'datetime' && (
          <input
            type="datetime-local"
            value={(value as string)?.slice(0, 16) || ''}
            onChange={e => handleChange(formField.field, e.target.value)}
            onKeyDown={handleEnterAsTab}
            className={baseClasses}
            disabled={fieldConfig.readonly}
          />
        )}

        {/* Error message */}
        {fieldError && <p className="mt-1 text-sm text-red-400">{fieldError}</p>}
      </div>
    )
  }

  const title = isEdit
    ? formConfig.form.title_edit.replace('labels.', '')
    : formConfig.form.title_create.replace('labels.', '')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onCancel} className="p-1 text-slate-400 hover:text-slate-200 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
        <div className="p-6 space-y-6 text-slate-100">
          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {formConfig.form.sections.map(section => (
            <div key={section.id}>
              <h3 className="text-sm font-medium uppercase tracking-wider text-slate-400 mb-4">
                {section.label.replace('labels.', '')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {section.fields.map(field => renderField(field))}
              </div>
            </div>
          ))}
        </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/60">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-100 border border-slate-700 rounded-lg bg-slate-800 hover:border-slate-500 hover:text-white"
              disabled={isLoading}
              tabIndex={-1}
            >
              {formConfig.form.actions?.cancel?.label?.replace('labels.', '') || 'Abbrechen'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500 disabled:opacity-50"
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
