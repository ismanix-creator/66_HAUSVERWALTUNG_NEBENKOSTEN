/**
 * Server Entry Point: Express Setup und Initialisierung
 *
 * @lastModified 2025-12-16
 */

import express from 'express'
import { apiRoutes } from './routes/api.routes'
import { errorMiddleware } from './middleware/error.middleware'
import { databaseService } from './services/database.service'
import { schemaService } from './services/schema.service'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes
app.use('/api', apiRoutes)

// Health Check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error Handling
app.use(errorMiddleware)

// Initialize and Start Server
async function startServer() {
  try {
    // Datenbank initialisieren
    databaseService.initialize()

    // Schema initialisieren (Tabellen erstellen)
    await schemaService.initializeAllTables()

    // Server starten
    app.listen(PORT, () => {
      console.log(`Server läuft auf http://localhost:${PORT}`)
      console.log(`API verfügbar unter http://localhost:${PORT}/api`)
    })
  } catch (error) {
    console.error('Fehler beim Starten des Servers:', error)
    process.exit(1)
  }
}

startServer()
