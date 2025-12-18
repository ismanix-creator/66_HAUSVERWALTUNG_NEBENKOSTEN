import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { configLoader } from '../../src/server/services/config-loader.service'

const originalEnv = { ...process.env }

describe('ConfigLoaderService', () => {
  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterEach(async () => {
    process.env = { ...originalEnv }
    await configLoader.reload()
  })

  test('lädt konsolidierte Master-Config mit allen Sektionen', async () => {
    const config = await configLoader.reload()

    // Master Basic
    expect(config.master.app.name).toBeTruthy()
    expect(config.master.server.port).toBeGreaterThan(0)
    expect(config.master.database.type).toBe('sqlite')

    // Top-Level Collections
    expect(Object.keys(config.entities).length).toBeGreaterThan(0)
    expect(Object.keys(config.forms).length).toBeGreaterThan(0)
    expect(Object.keys(config.tables).length).toBeGreaterThan(0)
    expect(Object.keys(config.views).length).toBeGreaterThan(0)
  })

  test('extrahiert Entities aus [entities.*] Struktur', async () => {
    const config = await configLoader.reload()
    const entities = config.entities

    // Mindestens 2 Entities erwartet
    expect(Object.keys(entities).length).toBeGreaterThanOrEqual(2)

    // Jede Entity sollte grundlegende Felder haben
    const keys = Object.keys(entities)
    for (const key of keys) {
      const entity = entities[key]
      expect(entity).toHaveProperty('name')
      expect(entity).toHaveProperty('table_name')
      expect(entity).toHaveProperty('fields')
    }
  })

  test('extrahiert Forms aus [forms.*] Struktur', async () => {
    const config = await configLoader.reload()
    const forms = config.forms

    // Mindestens 1 Form erwartet
    expect(Object.keys(forms).length).toBeGreaterThanOrEqual(1)

    // Jede Form sollte Felder haben
    const formKeys = Object.keys(forms)
    for (const key of formKeys) {
      const form = forms[key] as Record<string, unknown>
      expect(form).toHaveProperty('form')
    }
  })

  test('extrahiert Tables aus [tables.*] Struktur', async () => {
    const config = await configLoader.reload()
    const tables = config.tables

    // Mindestens 1 Table erwartet
    expect(Object.keys(tables).length).toBeGreaterThanOrEqual(1)

    // Jede Table sollte Felder haben
    const tableKeys = Object.keys(tables)
    for (const key of tableKeys) {
      const table = tables[key] as Record<string, unknown>
      expect(table).toHaveProperty('table')
    }
  })

  test('extrahiert Views aus [views.*] Struktur', async () => {
    const config = await configLoader.reload()
    const views = config.views

    // Mindestens 1 View erwartet
    expect(Object.keys(views).length).toBeGreaterThanOrEqual(1)
  })

  test('convenience getters für einzelne Entities/Forms/Tables/Views', async () => {
    const entities = await configLoader.getEntities()
    const firstEntityKey = Object.keys(entities)[0]

    const entity = await configLoader.getEntity(firstEntityKey)
    expect(entity).toBeDefined()
    expect(entity?.name).toBe(firstEntityKey)
  })

  test('übernimmt ENV-Overrides für Server und Security', async () => {
    process.env.PORT = '4000'
    process.env.REQUIRE_HTTPS = 'true'

    const config = await configLoader.reload()

    expect(config.master.server.port).toBe(4000)
    expect(config.master.security.require_https).toBe(true)
  })

  test('reload invalidiert Cache und übernimmt geänderte Env-Overrides', async () => {
    process.env.APP_NAME = 'Alpha-Test'

    const firstLoad = await configLoader.reload()
    expect(firstLoad.master.app.name).toBe('Alpha-Test')

    process.env.APP_NAME = 'Beta-Test'

    const cachedMaster = await configLoader.getMaster()
    expect(cachedMaster.app.name).toBe('Alpha-Test')

    const secondLoad = await configLoader.reload()
    expect(secondLoad.master.app.name).toBe('Beta-Test')
  })
})
