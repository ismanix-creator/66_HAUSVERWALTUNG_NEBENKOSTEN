/**
 * =============================================================================
 * CONFIG LOADER SERVICE
 * =============================================================================
 * Lädt die Master-Konfiguration (config/config.toml) und löst alle Imports auf.
 * Unterstützt Env-Overrides und Zod-Validierung.
 *
 * Architektur:
 * ┌─────────────────┐
 * │  config.toml    │ ← Master (TOML-Datei)
 * └────────┬────────┘
 *          ↓
 * ┌─────────────────┐
 * │  Env-Overrides  │ ← process.env überschreibt TOML
 * └────────┬────────┘
 *          ↓
 * ┌─────────────────┐
 * │  Zod-Validation │ ← Schema validiert + Defaults
 * └────────┬────────┘
 *          ↓
 * ┌─────────────────┐
 * │  Typed Config   │ ← Typsichere Konfiguration
 * └─────────────────┘
 *
 * @lastModified 2025-12-17
 * =============================================================================
 */

import fs from 'fs/promises'
import path from 'path'
import TOML from '@iarna/toml'
import { z } from 'zod'
import {
  MasterConfigSchema,
  EntityConfigSchema,
  type MasterConfig,
  type LabelsRoot,
  type CatalogsRoot,
  type EntityConfig,
  type FeatureFlags,
  type ValidationRoot,
  type DesignRoot,
} from '../../shared/config/schemas'

const CONFIG_DIR = path.resolve(process.cwd(), 'config')
const MASTER_CONFIG_FILE = 'config.toml'
const ALLOWED_META_ENVIRONMENTS = ['development', 'staging', 'production'] as const

// =============================================================================
// ENV OVERRIDE MAPPINGS
// =============================================================================
/**
 * Definiert welche Umgebungsvariablen welche Config-Werte überschreiben.
 * Format: ENV_VAR_NAME -> config.path.to.value
 */
const ENV_MAPPINGS: Record<string, string> = {
  // Server
  PORT: 'server.port',
  HOST: 'server.host',
  CORS_ORIGIN: 'server.cors_origin',

  // Database
  DATABASE_PATH: 'database.path',
  DATABASE_TYPE: 'database.type',

  // App
  APP_NAME: 'app.name',
  APP_LOCALE: 'app.locale',
  APP_TIMEZONE: 'app.timezone',

  // Logging
  LOG_LEVEL: 'logging.level',
  LOG_FILE: 'logging.file',

  // Security
  SESSION_TIMEOUT: 'security.session_timeout_minutes',
  REQUIRE_HTTPS: 'security.require_https',

  // Debug
  DEBUG_ENABLED: 'debug.enabled',

  // Environment
  NODE_ENV: 'meta.environment',
}

const EnvSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).optional(),
  HOST: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
  DATABASE_PATH: z.string().optional(),
  DATABASE_TYPE: z.enum(['sqlite', 'postgresql']).optional(),
  APP_NAME: z.string().optional(),
  APP_LOCALE: z.string().optional(),
  APP_TIMEZONE: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).optional(),
  LOG_FILE: z.string().optional(),
  SESSION_TIMEOUT: z.coerce.number().int().min(1).optional(),
  REQUIRE_HTTPS: z.coerce.boolean().optional(),
  DEBUG_ENABLED: z.coerce.boolean().optional(),
  NODE_ENV: z.enum([...ALLOWED_META_ENVIRONMENTS, 'test'] as const).optional(),
})

// =============================================================================
// LOADED CONFIG TYPE
// =============================================================================
interface LoadedConfig {
  master: MasterConfig
  labels: LabelsRoot
  catalogs: CatalogsRoot
  entities: Record<string, EntityConfig>
  views: Record<string, unknown>
  forms: Record<string, unknown>
  tables: Record<string, unknown>
  design: DesignRoot
  features: FeatureFlags
  validation: ValidationRoot
}

// =============================================================================
// CONFIG LOADER SERVICE
// =============================================================================
class ConfigLoaderService {
  private config: LoadedConfig | null = null
  private loading: Promise<LoadedConfig> | null = null
  private lastLoadTime = 0
  private readonly CACHE_TTL_MS = process.env.NODE_ENV === 'production' ? 0 : 60000 // Production: kein Cache-Timeout

  // ---------------------------------------------------------------------------
  // PRIVATE: TOML Loading
  // ---------------------------------------------------------------------------

  /**
   * Lädt eine TOML-Datei
   */
  private async loadToml<T>(filePath: string): Promise<T> {
    const fullPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(CONFIG_DIR, filePath)

    try {
      const content = await fs.readFile(fullPath, 'utf-8')
      return TOML.parse(content) as T
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.warn(`[ConfigLoader] Config nicht gefunden: ${fullPath}`)
        return {} as T
      }
      throw new Error(`[ConfigLoader] Fehler beim Laden von ${fullPath}: ${error}`)
    }
  }


  // ---------------------------------------------------------------------------
  // PRIVATE: Env Overrides
  // ---------------------------------------------------------------------------

  /**
   * Wendet Umgebungsvariablen auf die Konfiguration an
   */
  private applyEnvOverrides(
    config: Record<string, unknown>,
    env: Record<string, unknown>
  ): Record<string, unknown> {
    const result = this.deepClone(config)

    for (const [envKey, configPath] of Object.entries(ENV_MAPPINGS)) {
      const envValue = env[envKey]
      if (envValue !== undefined) {
        if (
          envKey === 'NODE_ENV' &&
          typeof envValue === 'string' &&
          !ALLOWED_META_ENVIRONMENTS.includes(
            envValue as (typeof ALLOWED_META_ENVIRONMENTS)[number]
          )
        ) {
          continue
        }

        const parsedValue =
          typeof envValue === 'string' ? this.parseEnvValue(envValue) : envValue

        this.setNestedValue(result, configPath, parsedValue)
        if (process.env.DEBUG_CONFIG) {
          // eslint-disable-next-line no-console
          console.log(`[ConfigLoader] ENV Override: ${envKey} -> ${configPath}`)
        }
      }
    }

    return result
  }

  /**
   * Parsed einen Env-Wert in den richtigen Typ
   */
  private parseEnvValue(value: string): unknown {
    // Boolean
    if (value.toLowerCase() === 'true') return true
    if (value.toLowerCase() === 'false') return false

    // Number
    const num = Number(value)
    if (!isNaN(num) && value.trim() !== '') return num

    // String
    return value
  }

  /**
   * Lädt alle Catalog-Dateien aus config/catalogs/
   */
  private async loadCatalogsFromFiles(): Promise<CatalogsRoot> {
    const catalogsDir = path.join(CONFIG_DIR, 'catalogs')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = {}

    try {
      const files = await fs.readdir(catalogsDir)
      const catalogFiles = files.filter(f => f.endsWith('.catalog.toml'))

      for (const file of catalogFiles) {
        const filePath = path.join(catalogsDir, file)
        try {
          const content = await fs.readFile(filePath, 'utf-8')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const parsed = TOML.parse(content) as any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const catalog = parsed.catalog as any
          const catalogName = (catalog?.name as string) || file.replace('.catalog.toml', '')
          if (catalog) {
            result[catalogName] = catalog
          }
        } catch (error) {
          console.warn(`[ConfigLoader] Fehler beim Laden von ${file}:`, error)
        }
      }
    } catch (error) {
      console.warn(`[ConfigLoader] Fehler beim Lesen von catalogs/ Verzeichnis:`, error)
    }

    return result
  }

  /**
   * Extrahiert Labels aus der konsolidierten config.toml
   * Labels sind nun direkt in config.toml unter top-level Sektionen (z.B. [app], [nav], etc.)
   */
  private extractLabelsFromMaster(master: Record<string, unknown>): LabelsRoot {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = {}

    // Labels sind in top-level Sektionen organisiert, die wir extrahieren müssen
    // Die wichtigsten Label-Sektionen sind:
    const labelSections = ['app', 'nav', 'buttons', 'forms', 'validation', 'tables', 'entity', 'common', 'errors', 'status', 'actions', 'fields']

    for (const section of labelSections) {
      if (section in master) {
        result[section] = master[section]
      }
    }

    return result as LabelsRoot
  }

  /**
   * Validiert relevante ENV-Variablen gegen ein Schema
   */
  private validateEnv(env: NodeJS.ProcessEnv): Record<string, unknown> {
    const parsed = EnvSchema.parse(env)
    return parsed as Record<string, unknown>
  }

  /**
   * Setzt einen verschachtelten Wert
   */
  private setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
    const parts = path.split('.')
    let current: Record<string, unknown> = obj

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      if (!(part in current) || typeof current[part] !== 'object') {
        current[part] = {}
      }
      current = current[part] as Record<string, unknown>
    }

    current[parts[parts.length - 1]] = value
  }

  /**
   * Deep Clone eines Objekts
   */
  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj))
  }


  // ---------------------------------------------------------------------------
  // PRIVATE: Main Loading Logic
  // ---------------------------------------------------------------------------

  /**
   * Lädt die gesamte Konfiguration aus konsolidierter config.toml
   */
  private async loadAll(): Promise<LoadedConfig> {
    const startTime = Date.now()
    if (process.env.DEBUG_CONFIG) {
      // eslint-disable-next-line no-console
      console.log('[ConfigLoader] Lade konsolidierte Master-Konfiguration...')
    }

    // 1. Master-Config laden (enthält nun alle Sektionen)
    const rawMaster = await this.loadToml<Record<string, unknown>>(MASTER_CONFIG_FILE)

    // 2. Env-Overrides anwenden
    const validatedEnv = this.validateEnv(process.env)
    const withEnv = this.applyEnvOverrides(rawMaster, validatedEnv)

    // 3. Zod-Validierung mit Defaults
    const master = MasterConfigSchema.parse(withEnv)

    // 4. Root-Level Sektionen direkt aus master extrahieren
    const labels = this.extractLabelsFromMaster(withEnv)
    const views = master.views || {}
    const forms = master.forms || {}
    const tables = master.tables || {}
    const validation = master.validation || {}
    const design = master.design || {}
    const features = master.features || { features: {} }

    // 4b. Catalogs aus separaten Dateien laden (noch nicht in config.toml konsolidiert)
    const catalogs = await this.loadCatalogsFromFiles()
    if (process.env.DEBUG_CONFIG) {
      // eslint-disable-next-line no-console
      console.log(`[ConfigLoader] - Geladeene Kataloge: ${Object.keys(catalogs).join(', ')}`)
    }

    // 5. Entities mit EntityConfigSchema validieren
    const entities: Record<string, EntityConfig> = {}
    for (const [key, value] of Object.entries(master.entities || {})) {
      try {
        entities[key] = EntityConfigSchema.parse(value)
      } catch (e) {
        console.warn(`[ConfigLoader] Entity ${key} ungültig:`, e)
        entities[key] = value as EntityConfig
      }
    }

    const loadTime = Date.now() - startTime
    if (process.env.DEBUG_CONFIG) {
      // eslint-disable-next-line no-console
      console.log(`[ConfigLoader] Konfiguration geladen in ${loadTime}ms`)
      // eslint-disable-next-line no-console
      console.log(`[ConfigLoader] - Kataloge: ${Object.keys(catalogs).length}`)
      // eslint-disable-next-line no-console
      console.log(`[ConfigLoader] - Entities: ${Object.keys(entities).length}`)
      // eslint-disable-next-line no-console
      console.log(`[ConfigLoader] - Views: ${Object.keys(views).length}`)
      // eslint-disable-next-line no-console
      console.log(`[ConfigLoader] - Forms: ${Object.keys(forms).length}`)
      // eslint-disable-next-line no-console
      console.log(`[ConfigLoader] - Tables: ${Object.keys(tables).length}`)
    }

    return {
      master,
      labels,
      catalogs,
      entities,
      views,
      forms,
      tables,
      design,
      features,
      validation,
    }
  }

  // ---------------------------------------------------------------------------
  // PUBLIC: Main API
  // ---------------------------------------------------------------------------

  /**
   * Holt die geladene Konfiguration (cached)
   */
  async getConfig(): Promise<LoadedConfig> {
    const now = Date.now()

    // Cache prüfen (in Production: immer gecacht)
    if (this.config) {
      if (this.CACHE_TTL_MS === 0 || now - this.lastLoadTime < this.CACHE_TTL_MS) {
        return this.config
      }
    }

    // Parallele Ladevorgänge verhindern
    if (this.loading) {
      return this.loading
    }

    this.loading = this.loadAll()
    try {
      this.config = await this.loading
      this.lastLoadTime = now
      return this.config
    } finally {
      this.loading = null
    }
  }

  /**
   * Cache leeren und neu laden
   */
  async reload(): Promise<LoadedConfig> {
    this.config = null
    this.lastLoadTime = 0
    return this.getConfig()
  }

  // ---------------------------------------------------------------------------
  // PUBLIC: Convenience Methods
  // ---------------------------------------------------------------------------

  /**
   * Master-Konfiguration
   */
  async getMaster(): Promise<MasterConfig> {
    return (await this.getConfig()).master
  }

  /**
   * App-Konfiguration
   */
  async getApp(): Promise<MasterConfig['app']> {
    return (await this.getMaster()).app
  }

  /**
   * Server-Konfiguration
   */
  async getServer(): Promise<MasterConfig['server']> {
    return (await this.getMaster()).server
  }

  /**
   * Datenbank-Konfiguration
   */
  async getDatabase(): Promise<MasterConfig['database']> {
    return (await this.getMaster()).database
  }

  /**
   * Navigation-Konfiguration
   */
  async getNavigation(): Promise<MasterConfig['navigation']> {
    return (await this.getMaster()).navigation
  }

  /**
   * Labels (i18n)
   */
  async getLabels(): Promise<LabelsRoot> {
    return (await this.getConfig()).labels
  }

  /**
   * Einzelnes Label abrufen
   * @param labelPath z.B. "nav.dashboard" oder "buttons.save"
   */
  async getLabel(labelPath: string): Promise<string> {
    const labels = await this.getLabels()
    const parts = labelPath.split('.')

    let current: unknown = labels
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = (current as Record<string, unknown>)[part]
      } else {
        console.warn(`[ConfigLoader] Label nicht gefunden: ${labelPath}`)
        return labelPath
      }
    }

    return typeof current === 'string' ? current : labelPath
  }

  /**
   * Alle Kataloge
   */
  async getCatalogs(): Promise<CatalogsRoot> {
    return (await this.getConfig()).catalogs
  }

  /**
   * Einzelner Katalog
   */
  async getCatalog(name: string): Promise<unknown> {
    return (await this.getCatalogs())[name]
  }

  /**
   * Alle Entities
   */
  async getEntities(): Promise<Record<string, EntityConfig>> {
    return (await this.getConfig()).entities
  }

  /**
   * Einzelne Entity
   */
  async getEntity(name: string): Promise<EntityConfig | undefined> {
    return (await this.getEntities())[name]
  }

  /**
   * Alle Views
   */
  async getViews(): Promise<Record<string, unknown>> {
    return (await this.getConfig()).views
  }

  /**
   * Einzelne View
   */
  async getView(name: string): Promise<unknown> {
    return (await this.getViews())[name]
  }

  /**
   * Alle Forms
   */
  async getForms(): Promise<Record<string, unknown>> {
    return (await this.getConfig()).forms
  }

  /**
   * Einzelnes Form
   */
  async getForm(name: string): Promise<unknown> {
    return (await this.getForms())[name]
  }

  /**
   * Alle Tables
   */
  async getTables(): Promise<Record<string, unknown>> {
    return (await this.getConfig()).tables
  }

  /**
   * Einzelne Table
   */
  async getTable(name: string): Promise<unknown> {
    return (await this.getTables())[name]
  }

  /**
   * Design System
   */
  async getDesign(): Promise<DesignRoot> {
    return (await this.getConfig()).design
  }

  /**
   * Feature Flags
   */
  async getFeatures(): Promise<FeatureFlags> {
    return (await this.getConfig()).features
  }

  /**
   * Prüft ob ein Feature aktiviert ist
   * @param featurePath z.B. "core.objekte" oder "experimental.ai_analysis"
   */
  async isFeatureEnabled(featurePath: string): Promise<boolean> {
    const features = await this.getFeatures()
    const parts = featurePath.split('.')

    let current: unknown = features.features
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = (current as Record<string, unknown>)[part]
      } else {
        return false
      }
    }

    if (current && typeof current === 'object' && 'enabled' in current) {
      return Boolean((current as { enabled: boolean }).enabled)
    }

    return Boolean(current)
  }

  /**
   * Validierungsregeln
   */
  async getValidation(): Promise<ValidationRoot> {
    return (await this.getConfig()).validation
  }

  /**
   * Pagination-Einstellungen
   */
  async getPagination(): Promise<MasterConfig['pagination']> {
    return (await this.getMaster()).pagination
  }

  /**
   * Search-Einstellungen
   */
  async getSearch(): Promise<MasterConfig['search']> {
    return (await this.getMaster()).search
  }

  /**
   * Export-Einstellungen
   */
  async getExport(): Promise<MasterConfig['export']> {
    return (await this.getMaster()).export
  }

  /**
   * Debug-Einstellungen
   */
  async getDebug(): Promise<MasterConfig['debug']> {
    return (await this.getMaster()).debug
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================
export const configLoader = new ConfigLoaderService()

// Export für Tests
export { ConfigLoaderService }
export type { LoadedConfig }
