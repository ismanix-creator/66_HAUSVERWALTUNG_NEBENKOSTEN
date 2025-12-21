/**
 * Server Entry Point: Express Setup und Initialisierung
 *
 * @lastModified 2025-12-16
 */

import express from 'express'
import { apiRoutes } from './routes/api.routes'
import { mobileRoutes } from './routes/mobile.routes'
import { errorMiddleware } from './middleware/error.middleware'
import { mobileReadOnlyMiddleware } from './middleware/mobile.middleware'
import { databaseService } from './services/database.service'
import { schemaService } from './services/schema.service'
import { configLoader } from './services/config-loader.service'
import { logger } from './utils/logger'
import { rateLimitMiddleware } from './middleware/rate-limit.middleware'

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes
// Routen werden nach Laden der Master-Config in startServer() montiert

// Health Check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error Handling
app.use(errorMiddleware)

// Initialize and Start Server
async function startServer() {
  try {
    const masterConfig = await configLoader.getMaster()
    const serverConfig = masterConfig.server
    const port = serverConfig?.port ?? 3002
    const host = serverConfig?.host ?? '0.0.0.0'

    // Routen-Basis (config/config.toml -> [routes])
    const routesConfig = masterConfig.routes || {}
    const base = routesConfig.base || (serverConfig?.api?.base_path ?? '/api')
    const version = routesConfig.version ? `/${routesConfig.version}` : ''
    const apiBasePath = `${base}${version}`

    // Mount mobile und api routes unter konfigurierbarer Basis
    app.use(`${apiBasePath}/mobile`, mobileReadOnlyMiddleware)
    app.use(`${apiBasePath}/mobile`, mobileRoutes)
    app.use(apiBasePath, rateLimitMiddleware)
    app.use(apiBasePath, apiRoutes)

    // Datenbank initialisieren
    await databaseService.initialize()

    // Schema initialisieren (Tabellen erstellen)
    await schemaService.initializeAllTables()
    await schemaService.verifyTables()

    // SQLite-Integrität prüfen
    databaseService.integrityCheck()

    // Server starten
    app.listen(port, host, () => {
      logger.info(`Server läuft auf http://${host}:${port}`)
      logger.info(`API verfügbar unter http://${host}:${port}${apiBasePath}`)
    })
  } catch (error) {
    console.error('Fehler beim Starten des Servers:', error)
    process.exit(1)
  }
}

startServer()
