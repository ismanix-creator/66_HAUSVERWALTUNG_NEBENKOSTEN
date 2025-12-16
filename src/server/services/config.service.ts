import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import TOML from '@iarna/toml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const CONFIG_DIR = path.resolve(__dirname, '../../../config')

class ConfigService {
  private cache: Map<string, unknown> = new Map()

  private async loadToml<T>(filePath: string): Promise<T> {
    const cacheKey = filePath

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as T
    }

    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const parsed = TOML.parse(content) as T
      this.cache.set(cacheKey, parsed)
      return parsed
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(`Config-Datei nicht gefunden: ${filePath}`)
      }
      throw error
    }
  }

  async getAppConfig() {
    return this.loadToml(path.join(CONFIG_DIR, 'app.config.toml'))
  }

  async getNavigationConfig() {
    return this.loadToml(path.join(CONFIG_DIR, 'navigation.config.toml'))
  }

  async getEntityConfig(entityName: string) {
    return this.loadToml(
      path.join(CONFIG_DIR, 'entities', `${entityName}.config.toml`)
    )
  }

  async getViewConfig(viewName: string) {
    return this.loadToml(
      path.join(CONFIG_DIR, 'views', `${viewName}.config.toml`)
    )
  }

  async getFormConfig(formName: string) {
    return this.loadToml(
      path.join(CONFIG_DIR, 'forms', `${formName}.form.toml`)
    )
  }

  async getCatalog<T>(catalogName: string) {
    return this.loadToml<T>(
      path.join(CONFIG_DIR, 'catalogs', `${catalogName}.catalog.toml`)
    )
  }

  async getTableConfig(tableName: string) {
    return this.loadToml(
      path.join(CONFIG_DIR, 'tables', `${tableName}.table.toml`)
    )
  }

  clearCache() {
    this.cache.clear()
  }
}

export const configService = new ConfigService()
