import { describe, expect, it } from 'vitest'
import { SchemaService } from '../../src/server/services/schema.service'
import type { EntityConfig } from '../../src/shared/types/config'

const createSampleConfig = (): EntityConfig => ({
  entity: {
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
  },
})

describe('SchemaService', () => {
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
    service.setTableName(config.entity.name, config.entity.table_name)

    const indexes = service.generateIndexSql(config)
    expect(indexes).toContain(
      'CREATE INDEX IF NOT EXISTS idx_beispiel_entity_objekt ON beispiel_entity(objekt)'
    )
    expect(indexes).toContain(
      'CREATE INDEX IF NOT EXISTS idx_beispiel_entity_status ON beispiel_entity(status)'
    )
  })
})
