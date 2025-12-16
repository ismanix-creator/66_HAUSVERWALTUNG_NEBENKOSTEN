import express from 'express'
import { apiRoutes } from './routes/api.routes'
import { errorMiddleware } from './middleware/error.middleware'

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

// Start Server
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`)
  console.log(`API verfügbar unter http://localhost:${PORT}/api`)
})
