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

  test('lädt Master-Config und Imports', async () => {
    const config = await configLoader.reload()

    expect(config.master.app.name).toBeTruthy()
    expect(Object.keys(config.entities).length).toBeGreaterThan(0)
    expect(Object.keys(config.forms)).toContain('objekt')
  })

  test('übernimmt ENV-Overrides für Server und Security', async () => {
    process.env.PORT = '4000'
    process.env.REQUIRE_HTTPS = 'true'

    const config = await configLoader.reload()

    expect(config.master.server.port).toBe(4000)
    expect(config.master.security.require_https).toBe(true)
  })
})
