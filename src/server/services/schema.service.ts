/**
 * Schema-Generator: Konvertiert EntityConfig zu SQL CREATE TABLE
 * 100% Config-Driven - keine hardcodierten Entity-Details
 *
 * @lastModified 2025-12-16
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { configService } from './config.service'
import { databaseService } from './database.service'
import { logger } from '../utils/logger'
import type { EntityConfig, FieldConfig, FieldType } from '../../shared/types/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const CONFIG_DIR = path.resolve(__dirname, '../../../config')

export class SchemaService {
  /**
   * Mappt FieldType zu SQLite-Datentyp
   */
  private fieldTypeToSql(fieldType: FieldType): string {
    const typeMap: Record<FieldType, string> = {
      uuid: 'TEXT',
      string: 'TEXT',
      text: 'TEXT',
      integer: 'INTEGER',
      decimal: 'REAL',
      currency: 'REAL',
      boolean: 'INTEGER', // SQLite hat kein BOOLEAN
      date: 'TEXT', // ISO 8601 Format
      datetime: 'TEXT', // ISO 8601 Format
      enum: 'TEXT',
      multiselect: 'TEXT', // JSON Array
      json: 'TEXT', // JSON String
      file: 'TEXT', // Dateipfad
      reference: 'TEXT', // UUID des referenzierten Eintrags
    }
    return typeMap[fieldType] || 'TEXT'
  }

  /**
   * Generiert SQL CREATE TABLE aus EntityConfig
   */
  generateCreateTableSql(config: EntityConfig): string {
    const entity = config.entity
    // table_name direkt aus Config lesen
    const tableName = entity.table_name || this.getTableName(entity.name)
    // Cache setzen für spätere Verwendung
    this.tableNameCache.set(entity.name, tableName)
    const columns: string[] = []
    const foreignKeys: string[] = []

    // Felder zu Spalten konvertieren
    for (const [fieldName, field] of Object.entries(entity.fields)) {
      const columnDef = this.generateColumnDef(fieldName, field, entity.primary_key)
      columns.push(columnDef)

      // Foreign Key für reference-Felder
      if (field.type === 'reference' && field.reference) {
        const refTable = this.getTableName(field.reference)
        foreignKeys.push(
          `FOREIGN KEY (${fieldName}) REFERENCES ${refTable}(id) ON DELETE SET NULL`
        )
      }
    }

    // Timestamps hinzufügen wenn nicht vorhanden
    if (!entity.fields['erstellt_am']) {
      columns.push("erstellt_am TEXT DEFAULT (datetime('now'))")
    }
    if (!entity.fields['aktualisiert_am']) {
      columns.push("aktualisiert_am TEXT DEFAULT (datetime('now'))")
    }

    const allDefs = [...columns, ...foreignKeys].join(',\n  ')

    return `CREATE TABLE IF NOT EXISTS ${tableName} (\n  ${allDefs}\n)`
  }

  /**
   * Generiert Spalten-Definition für ein Feld
   */
  private generateColumnDef(
    fieldName: string,
    field: FieldConfig,
    primaryKey: string
  ): string {
    const sqlType = this.fieldTypeToSql(field.type)
    const parts: string[] = [fieldName, sqlType]

    // Primary Key
    if (fieldName === primaryKey) {
      parts.push('PRIMARY KEY')
    }

    // NOT NULL für required Felder (außer auto_generate)
    if (field.required && !field.auto_generate) {
      parts.push('NOT NULL')
    }

    // Default Value
    if (field.default !== undefined) {
      const defaultValue = this.formatDefaultValue(field.default)
      parts.push(`DEFAULT ${defaultValue}`)
    } else if (field.auto_generate && (field.type === 'datetime' || field.type === 'date')) {
      parts.push("DEFAULT (datetime('now'))")
    }

    return parts.join(' ')
  }

  /**
   * Formatiert Default-Wert für SQL
   */
  private formatDefaultValue(value: unknown): string {
    if (value === null) return 'NULL'
    if (typeof value === 'boolean') return value ? '1' : '0'
    if (typeof value === 'number') return String(value)
    if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`
    if (Array.isArray(value) || typeof value === 'object') {
      return `'${JSON.stringify(value).replace(/'/g, "''")}'`
    }
    return `'${String(value)}'`
  }

  /**
   * Holt Tabellen-Name aus EntityConfig
   * Cached für Performance
   */
  private tableNameCache: Map<string, string> = new Map()

  getTableName(entityName: string): string {
    // Aus Cache wenn vorhanden
    if (this.tableNameCache.has(entityName)) {
      return this.tableNameCache.get(entityName)!
    }
    // Fallback: Pluralisierung (sollte nicht passieren wenn Config korrekt)
    return `${entityName}s`
  }

  /**
   * Setzt Tabellen-Name aus Config (beim Laden der Configs)
   */
  setTableName(entityName: string, tableName: string): void {
    this.tableNameCache.set(entityName, tableName)
  }

  /**
   * Holt Tabellen-Name aus Config (async Version für initiales Laden)
   */
  async getTableNameFromConfig(entityName: string): Promise<string> {
    if (this.tableNameCache.has(entityName)) {
      return this.tableNameCache.get(entityName)!
    }
    const config = await configService.getEntityConfig(entityName) as EntityConfig | null
    if (config?.entity?.table_name) {
      this.tableNameCache.set(entityName, config.entity.table_name)
      return config.entity.table_name
    }
    return `${entityName}s`
  }

  /**
   * Generiert Index-SQL für ein Entity
   */
  generateIndexSql(config: EntityConfig): string[] {
    const entity = config.entity
    const tableName = this.getTableName(entity.name)
    const indexes: string[] = []

    for (const [fieldName, field] of Object.entries(entity.fields)) {
      // Index für reference-Felder (Foreign Keys)
      if (field.type === 'reference') {
        indexes.push(
          `CREATE INDEX IF NOT EXISTS idx_${tableName}_${fieldName} ON ${tableName}(${fieldName})`
        )
      }

      // Index für enum-Felder (häufig gefiltert)
      if (field.type === 'enum') {
        indexes.push(
          `CREATE INDEX IF NOT EXISTS idx_${tableName}_${fieldName} ON ${tableName}(${fieldName})`
        )
      }
    }

    return indexes
  }

  /**
   * Lädt alle Entity-Namen aus dem Config-Verzeichnis
   * 100% dynamisch - keine hardcodierten Entity-Listen
   */
  async getEntityNames(): Promise<string[]> {
    const entitiesDir = path.join(CONFIG_DIR, 'entities')
    const files = await fs.readdir(entitiesDir)
    return files
      .filter((f) => f.endsWith('.config.toml'))
      .map((f) => f.replace('.config.toml', ''))
  }

  /**
   * Initialisiert alle Entity-Tabellen
   * Dynamisch aus config/entities/ Verzeichnis
   */
  async initializeAllTables(): Promise<void> {
    // Entity-Namen dynamisch aus Config-Verzeichnis laden
    const entityNames = await this.getEntityNames()

    logger.info(`Initialisiere Datenbank-Schema (${entityNames.length} Entities)...`)

    for (const entityName of entityNames) {
      try {
        const config = await configService.getEntityConfig(entityName) as EntityConfig | null
        if (!config) {
          logger.warn(`  ⚠ Entity-Config nicht gefunden: ${entityName}`)
          continue
        }

        // Tabelle erstellen
        const createSql = this.generateCreateTableSql(config)
        databaseService.run(createSql)
        const tableName = config.entity.table_name || this.getTableName(entityName)
        logger.info(`  ✓ Tabelle erstellt: ${tableName}`)

        // Indizes erstellen
        const indexSqls = this.generateIndexSql(config)
        for (const indexSql of indexSqls) {
          databaseService.run(indexSql)
        }
      } catch (error) {
        logger.error(`  ✗ Fehler bei Entity ${entityName}:`, error)
      }
    }

    logger.info('Datenbank-Schema initialisiert.')
  }
}

export const schemaService = new SchemaService()
