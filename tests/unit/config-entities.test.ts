import { describe, expect, it } from 'vitest'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

describe('Konfigurations-Entities', () => {
  it('liefert mindestens eine TOML-Definition', () => {
    const entitiesDir = join(process.cwd(), 'config', 'entities')
    const entries = readdirSync(entitiesDir).filter((file) => file.endsWith('.toml'))
    expect(entries.length).toBeGreaterThan(0)
  })
})
