import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { configLoader } from './config-loader.service'
import { logger } from '../utils/logger'

class DatabaseService {
  private db: Database.Database | null = null
  private initPromise: Promise<Database.Database> | null = null

  /**
   * Initialisiert die Datenbank auf Basis der TOML-Konfiguration.
   * Muss genau einmal zu Serverstart aufgerufen werden, bevor Queries ausgeführt werden.
   */
  async initialize(): Promise<Database.Database> {
    if (this.db) {
      return this.db
    }
    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = this.createConnection()
    this.db = await this.initPromise
    this.initPromise = null
    return this.db
  }

  private async createConnection(): Promise<Database.Database> {
    const master = await configLoader.getMaster()
    const dbConfig = master.database

    const resolvedPath = path.isAbsolute(dbConfig.path)
      ? dbConfig.path
      : path.resolve(process.cwd(), dbConfig.path)

    const dataDir = path.dirname(resolvedPath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    const db = new Database(resolvedPath)

    if (dbConfig.wal_mode) {
      db.pragma('journal_mode = WAL')
    }

    if (dbConfig.busy_timeout_ms) {
      db.pragma(`busy_timeout = ${dbConfig.busy_timeout_ms}`)
    }

    if (dbConfig.cache_size) {
      db.pragma(`cache_size = ${dbConfig.cache_size}`)
    }

    db.pragma('foreign_keys = ON')

    logger.info(`SQLite-Datenbank initialisiert: ${resolvedPath}`)
    return db
  }

  private getDb(): Database.Database {
    if (!this.db) {
      throw new Error('DatabaseService nicht initialisiert. Bitte initialize() aufrufen.')
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

  /**
   * Führt einen SQLite-Integritätscheck durch und wirft bei Fehlern
   */
  integrityCheck(): void {
    const result = this.getDb()
      .prepare('PRAGMA integrity_check')
      .get() as { integrity_check?: string } | undefined

    if (!result || result.integrity_check !== 'ok') {
      throw new Error(
        `SQLite-Integritätscheck fehlgeschlagen: ${result?.integrity_check ?? 'unbekannt'}`
      )
    }

    logger.info('SQLite-Integritätscheck erfolgreich')
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
