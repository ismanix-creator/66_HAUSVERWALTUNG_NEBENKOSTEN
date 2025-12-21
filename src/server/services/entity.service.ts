/**
 * Generischer Entity-Service: CRUD-Operationen basierend auf Config
 * 100% Config-Driven - keine hardcodierten Entity-Details
 *
 * @lastModified 2025-12-19
 */

import { v4 as uuidv4 } from 'uuid'
import { configService } from './config.service'
import { databaseService } from './database.service'
import { schemaService } from './schema.service'
import type { EntityConfig, FieldConfig } from '../../shared/types/config'

export interface QueryOptions {
  limit?: number
  offset?: number
  orderBy?: string
  orderDir?: 'ASC' | 'DESC'
  filters?: Record<string, unknown>
}

export interface EntityRecord {
  id: string
  [key: string]: unknown
}

class EntityService {
  /**
   * Holt alle Einträge einer Entity mit optionaler Filterung/Sortierung
   */
  async getAll(entityName: string, options: QueryOptions = {}): Promise<EntityRecord[]> {
    const config = await this.getConfig(entityName)
    const tableName = schemaService.getTableName(entityName)

    let sql = `SELECT * FROM ${tableName}`
    const params: unknown[] = []

    // WHERE Klausel für Filter
    if (options.filters && Object.keys(options.filters).length > 0) {
      const whereClauses: string[] = []
      for (const [field, value] of Object.entries(options.filters)) {
        if (!this.isValidField(config, field)) continue
        if (Array.isArray(value)) {
          const placeholders = value.map(() => '?').join(', ')
          whereClauses.push(`${field} IN (${placeholders})`)
          params.push(...value)
        } else {
          whereClauses.push(`${field} = ?`)
          params.push(value)
        }
      }
      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(' AND ')}`
      }
    }

    // ORDER BY
    if (options.orderBy && this.isValidField(config, options.orderBy)) {
      const dir = options.orderDir === 'DESC' ? 'DESC' : 'ASC'
      sql += ` ORDER BY ${options.orderBy} ${dir}`
    } else {
      sql += ' ORDER BY erstellt_am DESC'
    }

    // LIMIT und OFFSET
    if (options.limit) {
      sql += ` LIMIT ${options.limit}`
      if (options.offset) {
        sql += ` OFFSET ${options.offset}`
      }
    }

    const rows = databaseService.all<EntityRecord>(sql, params)
    return rows.map(r => this.parseRow(config, r))
  }

  /**
   * Holt einen einzelnen Eintrag nach ID
   */
  async getById(entityName: string, id: string): Promise<EntityRecord | null> {
    const tableName = schemaService.getTableName(entityName)
    const sql = `SELECT * FROM ${tableName} WHERE id = ?`
    const result = databaseService.get<EntityRecord>(sql, [id])
    if (!result) return null
    return this.parseRow(await this.getConfig(entityName), result)
  }

  /**
   * Parst JSON-ähnliche Felder basierend auf Entity-Config
   */
  private parseRow(config: EntityConfig, row: EntityRecord): EntityRecord {
    const parsed: EntityRecord = { ...row }
    for (const [fieldName, fieldConfig] of Object.entries(config.fields)) {
      const raw = parsed[fieldName]
      if (raw === undefined || raw === null) continue

      // Falls Feld vom Typ json oder multiselect und als String gespeichert wurde,
      // versuchen wir, es zu parsen. Silently fail und belasse den Originalwert.
      if ((fieldConfig.type === 'json' || fieldConfig.type === 'multiselect') && typeof raw === 'string') {
        const s = raw.trim()
        if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
          try {
            parsed[fieldName] = JSON.parse(s)
          } catch (e) {
            // leave as-is
          }
        }
      }
    }
    // Compute basic computed fields (best-effort)
    try {
      const computedDefs = (config as any).computed as Record<string, any> | undefined
      if (computedDefs && Object.keys(computedDefs).length > 0) {
        const computed: Record<string, unknown> = {}
        for (const [cname, cdef] of Object.entries(computedDefs)) {
          const formula = cdef && (cdef as any).formula
          if (!formula || typeof formula !== 'string') continue

          // Support simple concat(...) formulas: concat(field1, ' ', field2)
          const concatMatch = formula.match(/concat\((.*)\)/i)
          if (concatMatch) {
            const inner = concatMatch[1]
            // split on commas not inside quotes (simple split is ok for our TOML patterns)
            const parts = inner.split(',').map(p => p.trim())
            const outParts: string[] = []
            for (const part of parts) {
              if (part.startsWith("'") && part.endsWith("'")) {
                outParts.push(part.slice(1, -1))
                continue
              }
              if (part.startsWith('"') && part.endsWith('"')) {
                outParts.push(part.slice(1, -1))
                continue
              }
              // treat as field name
              const val = parsed[part]
              if (val !== undefined && val !== null) outParts.push(String(val))
            }
            computed[cname] = outParts.join('')
            continue
          }

          // Other formula types: best-effort placeholder (skip)
        }
        if (Object.keys(computed).length > 0) {
          parsed['computed'] = { ...(parsed['computed'] as Record<string, unknown> || {}), ...computed }
        }
      }
    } catch (e) {
      // don't break on computed errors
    }
    return parsed
  }

  /**
   * Erstellt einen neuen Eintrag
   */
  async create(entityName: string, data: Record<string, unknown>): Promise<EntityRecord> {
    const config = await this.getConfig(entityName)
    const tableName = schemaService.getTableName(entityName)

    // Validierung
    this.validateData(config, data, false)

    // Auto-generierte Felder
    const processedData = this.processAutoFields(config, data, true)

    // SQL generieren
    const fields = Object.keys(processedData)
    const placeholders = fields.map(() => '?').join(', ')
    const values = fields.map(f => this.convertValueForSqlite(processedData[f]))

    const sql = `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${placeholders})`
    databaseService.run(sql, values)

    // Erstellten Eintrag zurückgeben
    const created = await this.getById(entityName, processedData.id as string)
    if (!created) {
      throw new Error('Eintrag konnte nicht erstellt werden')
    }
    return created
  }

  /**
   * Aktualisiert einen bestehenden Eintrag
   */
  async update(
    entityName: string,
    id: string,
    data: Record<string, unknown>
  ): Promise<EntityRecord> {
    const config = await this.getConfig(entityName)
    const tableName = schemaService.getTableName(entityName)

    // Prüfen ob Eintrag existiert
    const existing = await this.getById(entityName, id)
    if (!existing) {
      throw new EntityNotFoundError(entityName, id)
    }

    // Validierung
    this.validateData(config, data, true)

    // Auto-generierte Felder (aktualisiert_am)
    const processedData = this.processAutoFields(config, data, false)

    // SQL generieren
    const fields = Object.keys(processedData)
    const setClauses = fields.map(f => `${f} = ?`).join(', ')
    const values = [...fields.map(f => this.convertValueForSqlite(processedData[f])), id]

    const sql = `UPDATE ${tableName} SET ${setClauses} WHERE id = ?`
    databaseService.run(sql, values)

    // Aktualisierten Eintrag zurückgeben
    const updated = await this.getById(entityName, id)
    if (!updated) {
      throw new Error('Eintrag konnte nicht aktualisiert werden')
    }
    return updated
  }

  /**
   * Löscht einen Eintrag
   */
  async delete(entityName: string, id: string): Promise<void> {
    const tableName = schemaService.getTableName(entityName)

    // Prüfen ob Eintrag existiert
    const existing = await this.getById(entityName, id)
    if (!existing) {
      throw new EntityNotFoundError(entityName, id)
    }

    const sql = `DELETE FROM ${tableName} WHERE id = ?`
    databaseService.run(sql, [id])
  }

  /**
   * Zählt Einträge (für Pagination)
   */
  async count(entityName: string, filters?: Record<string, unknown>): Promise<number> {
    const config = await this.getConfig(entityName)
    const tableName = schemaService.getTableName(entityName)

    let sql = `SELECT COUNT(*) as count FROM ${tableName}`
    const params: unknown[] = []

    if (filters && Object.keys(filters).length > 0) {
      const whereClauses: string[] = []
      for (const [field, value] of Object.entries(filters)) {
        if (!this.isValidField(config, field)) continue
        if (Array.isArray(value)) {
          const placeholders = value.map(() => '?').join(', ')
          whereClauses.push(`${field} IN (${placeholders})`)
          params.push(...value)
        } else {
          whereClauses.push(`${field} = ?`)
          params.push(value)
        }
      }
      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(' AND ')}`
      }
    }

    const result = databaseService.get<{ count: number }>(sql, params)
    return result?.count || 0
  }

  /**
   * Holt Entity-Config
   */
  private async getConfig(entityName: string): Promise<EntityConfig> {
    const config = (await configService.getEntityConfig(entityName)) as EntityConfig | null
    if (!config) {
      throw new Error(`Entity-Config nicht gefunden: ${entityName}`)
    }
    return config
  }

  /**
   * Prüft ob ein Feld in der Entity existiert
   */
  private isValidField(config: EntityConfig, fieldName: string): boolean {
    return (
      fieldName in config.fields ||
      fieldName === 'erstellt_am' ||
      fieldName === 'aktualisiert_am'
    )
  }

  /**
   * Validiert Daten gegen Entity-Config
   */
  private validateData(
    config: EntityConfig,
    data: Record<string, unknown>,
    isUpdate: boolean
  ): void {
    const errors: string[] = []

    for (const [fieldName, fieldConfig] of Object.entries(config.fields)) {
      const value = data[fieldName]

      // Required Check (nicht bei Update, wenn Feld nicht mitgesendet)
      if (
        fieldConfig.required &&
        !fieldConfig.auto_generate &&
        !isUpdate &&
        (value === undefined || value === null || value === '')
      ) {
        errors.push(`Feld '${fieldName}' ist erforderlich`)
      }

      // Skip validation if empty and not required
      if (value === undefined || value === null || value === '') {
        continue
      }

      // Wenn Wert vorhanden, Typ-Validierung
      const typeError = this.validateFieldType(fieldName, value, fieldConfig)
      if (typeError) {
        errors.push(typeError)
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors)
    }
  }

  /**
   * Validiert Feldtyp
   */
  private validateFieldType(fieldName: string, value: unknown, config: FieldConfig): string | null {
    switch (config.type) {
      case 'string':
      case 'text':
      case 'uuid':
        if (typeof value !== 'string') {
          return `Feld '${fieldName}' muss ein String sein`
        }
        if (config.max_length && value.length > config.max_length) {
          return `Feld '${fieldName}' darf maximal ${config.max_length} Zeichen haben`
        }
        if (config.pattern && !new RegExp(config.pattern).test(value)) {
          return `Feld '${fieldName}' entspricht nicht dem erwarteten Format`
        }
        break

      case 'integer':
        if (typeof value !== 'number' || !Number.isInteger(value)) {
          return `Feld '${fieldName}' muss eine Ganzzahl sein`
        }
        if (config.min !== undefined && value < config.min) {
          return `Feld '${fieldName}' muss mindestens ${config.min} sein`
        }
        if (config.max !== undefined && value > config.max) {
          return `Feld '${fieldName}' darf maximal ${config.max} sein`
        }
        break

      case 'decimal':
      case 'currency':
        if (typeof value !== 'number') {
          return `Feld '${fieldName}' muss eine Zahl sein`
        }
        break

      case 'boolean':
        if (typeof value !== 'boolean' && value !== 0 && value !== 1) {
          return `Feld '${fieldName}' muss ein Boolean sein`
        }
        break

      case 'enum':
        if (config.options && !config.options.includes(value as string)) {
          return `Feld '${fieldName}' muss einer der Werte sein: ${config.options.join(', ')}`
        }
        break
    }

    return null
  }

  /**
   * Verarbeitet auto-generierte Felder
   */
  private processAutoFields(
    config: EntityConfig,
    data: Record<string, unknown>,
    isCreate: boolean
  ): Record<string, unknown> {
    const processed = { ...data }

    // ID generieren bei Create
    if (isCreate && !processed.id) {
      const idField = config.fields[config.primary_key]
      if (idField?.type === 'uuid' && idField?.auto_generate) {
        processed.id = uuidv4()
      }
    }

    // Timestamps
    const now = new Date().toISOString()
    if (isCreate) {
      processed.erstellt_am = now
    }
    processed.aktualisiert_am = now

    return processed
  }

  /**
   * Konvertiert Werte für SQLite-Kompatibilität
   * SQLite unterstützt nur: number, string, bigint, Buffer, null
   */
  private convertValueForSqlite(value: unknown): string | number | bigint | Buffer | null {
    // null/undefined → null
    if (value === null || value === undefined) {
      return null
    }

    // Boolean → 0 oder 1
    if (typeof value === 'boolean') {
      return value ? 1 : 0
    }

    // Arrays/Objects → JSON string
    if (typeof value === 'object' && !(value instanceof Buffer)) {
      return JSON.stringify(value)
    }

    // Alles andere durchreichen (string, number, bigint, Buffer)
    return value as string | number | bigint | Buffer
  }
}

/**
 * Custom Error für nicht gefundene Entities
 */
export class EntityNotFoundError extends Error {
  statusCode = 404
  code = 'ENTITY_NOT_FOUND'

  constructor(entityName: string, id: string) {
    super(`${entityName} mit ID '${id}' nicht gefunden`)
    this.name = 'EntityNotFoundError'
  }
}

/**
 * Custom Error für Validierungsfehler
 */
export class ValidationError extends Error {
  statusCode = 400
  code = 'VALIDATION_ERROR'
  details: string[]

  constructor(errors: string[]) {
    super(errors.join('; '))
    this.name = 'ValidationError'
    this.details = errors
  }
}

export const entityService = new EntityService()
