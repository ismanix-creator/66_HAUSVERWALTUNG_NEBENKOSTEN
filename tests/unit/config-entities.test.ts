import { describe, expect, it } from 'vitest'
import { configLoader } from '../../src/server/services/config-loader.service'

describe('Konfigurations-Entities', () => {
  it('liefert mindestens eine Entity-Definition in config/config.toml', async () => {
    const entities = await configLoader.getEntities()
    expect(Object.keys(entities).length).toBeGreaterThan(0)
  })
})
