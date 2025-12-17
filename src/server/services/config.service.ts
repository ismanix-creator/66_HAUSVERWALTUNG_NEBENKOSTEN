import { configLoader } from './config-loader.service'

class ConfigService {
  async getAppConfig() {
    const master = await configLoader.getMaster()
    return { app: master.app }
  }

  async getNavigationConfig() {
    const navigation = await configLoader.getNavigation()
    return { navigation }
  }

  async getEntityConfig(entityName: string) {
    const entity = await configLoader.getEntity(entityName)
    if (!entity) {
      throw new Error(`Entity-Config nicht gefunden: ${entityName}`)
    }
    return entity
  }

  async getViewConfig(viewName: string) {
    const view = await configLoader.getView(viewName)
    if (!view) {
      throw new Error(`View-Config nicht gefunden: ${viewName}`)
    }
    return view
  }

  async getFormConfig(formName: string) {
    const form = await configLoader.getForm(formName)
    if (!form) {
      throw new Error(`Form-Config nicht gefunden: ${formName}`)
    }
    return form
  }

  async getCatalog<T>(catalogName: string) {
    const catalog = await configLoader.getCatalog(catalogName)
    if (!catalog) {
      throw new Error(`Catalog nicht gefunden: ${catalogName}`)
    }
    return catalog as T
  }

  async getTableConfig(tableName: string) {
    const table = await configLoader.getTable(tableName)
    if (!table) {
      throw new Error(`Table-Config nicht gefunden: ${tableName}`)
    }
    return table
  }

  clearCache() {
    void configLoader.reload()
  }
}

export const configService = new ConfigService()
