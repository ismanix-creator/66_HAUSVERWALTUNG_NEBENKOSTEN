import { afterEach, describe, expect, it, vi } from 'vitest'
import { SchemaService } from '../../src/server/services/schema.service'
import { configLoader } from '../../src/server/services/config-loader.service'
import { configService } from '../../src/server/services/config.service'
import { databaseService } from '../../src/server/services/database.service'
import type { EntityConfig } from '../../src/shared/types/config'

const createSampleConfig = (): EntityConfig => ({
  name: 'beispiel_entity',
  table_name: 'beispiel_entity',
  label: 'Beispiel',
  label_plural: 'Beispiele',
  icon: 'cube',
  primary_key: 'id',
  fields: {
    id: { type: 'uuid', required: true },
    name: { type: 'string', required: true, default: 'Demo' },
    objekt: { type: 'reference', reference: 'objekt' },
    status: { type: 'enum', options: ['aktiv', 'inaktiv'] },
  },
})

const createNamedConfig = (name: string, tableName?: string): EntityConfig => ({
  name,
  table_name: tableName || `${name}s`,
  label: name,
  label_plural: `${name}s`,
  icon: 'cube',
  primary_key: 'id',
  fields: {
    id: { type: 'uuid', required: true },
  },
})

describe('SchemaService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fügt timestamps und Fremdschlüssel ein', () => {
    const service = new SchemaService()
    const sql = service.generateCreateTableSql(createSampleConfig())

    expect(sql).toContain("FOREIGN KEY (objekt) REFERENCES objekts(id) ON DELETE SET NULL")
    expect(sql).toContain("erstellt_am TEXT DEFAULT (datetime('now'))")
    expect(sql).toContain("aktualisiert_am TEXT DEFAULT (datetime('now'))")
  })

  it('erzeugt Indizes für reference- und enum-Felder', () => {
    const service = new SchemaService()
    const config = createSampleConfig()
    service.setTableName(config.name, config.table_name)

    const indexes = service.generateIndexSql(config)
    expect(indexes).toContain(
      'CREATE INDEX IF NOT EXISTS idx_beispiel_entity_objekt ON beispiel_entity(objekt)'
    )
    expect(indexes).toContain(
      'CREATE INDEX IF NOT EXISTS idx_beispiel_entity_status ON beispiel_entity(status)'
    )
  })

  it('bestätigt Schema, wenn alle Tabellen existieren', async () => {
    const service = new SchemaService()
    vi.spyOn(configLoader, 'getEntities').mockResolvedValue({
      objekt: createNamedConfig('objekt', 'objekte'),
      dokument: createNamedConfig('dokument'),
    })
    vi.spyOn(configService, 'getEntityConfig').mockImplementation(async (entityName: string) =>
      entityName === 'objekt'
        ? createNamedConfig('objekt', 'objekte')
        : createNamedConfig('dokument')
    )
    vi.spyOn(databaseService, 'get').mockImplementation((_sql, params) => {
      const tableName = (params?.[0] as string) ?? ''
      return { name: tableName }
    })

    await expect(service.verifyTables()).resolves.toBeUndefined()
  })

  it('wirft Fehlermeldung, wenn Tabellen fehlen', async () => {
    const service = new SchemaService()
    vi.spyOn(configLoader, 'getEntities').mockResolvedValue({
      objekt: createNamedConfig('objekt', 'objekte'),
      fehlend: createNamedConfig('fehlend', 'fehlende_tabelle'),
    })
    const configMap: Record<string, EntityConfig> = {
      objekt: createNamedConfig('objekt', 'objekte'),
      fehlend: createNamedConfig('fehlend', 'fehlende_tabelle'),
    }
    vi.spyOn(configService, 'getEntityConfig').mockImplementation(async (entityName: string) => {
      return configMap[entityName]
    })
    vi.spyOn(databaseService, 'get').mockImplementation((_sql, params) => {
      const tableName = params?.[0] as string
      if (tableName === 'fehlende_tabelle') {
        return undefined
      }
      return { name: tableName }
    })

    await expect(service.verifyTables()).rejects.toThrow(/fehlende_tabelle/)
  })
})
