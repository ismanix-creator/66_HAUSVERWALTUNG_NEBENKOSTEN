import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { logger } from '../utils/logger'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.resolve(__dirname, '../../../data')
const DB_PATH = path.join(DATA_DIR, 'database.sqlite')

class DatabaseService {
  private db: Database.Database | null = null

  initialize(): Database.Database {
    if (this.db) {
      return this.db
    }

    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    this.db = new Database(DB_PATH)

    // Enable WAL mode for better concurrency
    this.db.pragma('journal_mode = WAL')

    // Enable foreign keys
    this.db.pragma('foreign_keys = ON')

    logger.info(`SQLite-Datenbank initialisiert: ${DB_PATH}`)
    return this.db
  }

  getDb(): Database.Database {
    if (!this.db) {
      return this.initialize()
    }
    return this.db
  }

  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
      logger.info('Datenbankverbindung geschlossen')
    }
  }

  // Run a single statement
  run(sql: string, params: unknown[] = []) {
    return this.getDb()
      .prepare(sql)
      .run(...params)
  }

  // Get single row
  get<T>(sql: string, params: unknown[] = []): T | undefined {
    return this.getDb()
      .prepare(sql)
      .get(...params) as T | undefined
  }

  // Get all rows
  all<T>(sql: string, params: unknown[] = []): T[] {
    return this.getDb()
      .prepare(sql)
      .all(...params) as T[]
  }

  // Execute multiple statements in a transaction
  transaction<T>(fn: () => T): T {
    return this.getDb().transaction(fn)()
  }
}

export const databaseService = new DatabaseService()
