import { Router } from 'express'
import { configService } from '../services/config.service'

export const apiRoutes = Router()

// Config Endpoints
apiRoutes.get('/config/app', async (_req, res, next) => {
  try {
    const config = await configService.getAppConfig()
    res.json(config)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/config/navigation', async (_req, res, next) => {
  try {
    const config = await configService.getNavigationConfig()
    res.json(config)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/config/entity/:name', async (req, res, next) => {
  try {
    const config = await configService.getEntityConfig(req.params.name)
    res.json(config)
  } catch (error) {
    next(error)
  }
})

// Placeholder for entity CRUD routes (will be added in Phase 1)
apiRoutes.get('/entities', (_req, res) => {
  res.json({ message: 'Entity routes will be implemented in Phase 1' })
})
