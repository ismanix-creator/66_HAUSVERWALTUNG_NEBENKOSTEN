import fs from 'fs'
import path from 'path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { databaseService } from '../../src/server/services/database.service'
import { configLoader } from '../../src/server/services/config-loader.service'

const originalEnv = { ...process.env }
const testDbRelativePath = './tmp/test-integrity.db'
const testDbAbsolutePath = path.resolve(process.cwd(), testDbRelativePath)

describe('DatabaseService', () => {
  beforeAll(async () => {
    process.env.DATABASE_PATH = testDbRelativePath
    await configLoader.reload()
    await databaseService.initialize()
  })

  afterAll(async () => {
    databaseService.close()
    const cleanupTargets = [
      testDbAbsolutePath,
      `${testDbAbsolutePath}-wal`,
      `${testDbAbsolutePath}-shm`,
    ]
    for (const target of cleanupTargets) {
      if (fs.existsSync(target)) {
        fs.unlinkSync(target)
      }
    }
    process.env = { ...originalEnv }
    await configLoader.reload()
  })

  it('besteht Integritätsprüfung nach Initialisierung', () => {
    expect(() => databaseService.integrityCheck()).not.toThrow()
  })
})
