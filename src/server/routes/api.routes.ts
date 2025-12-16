/**
 * API Routes: Haupt-Router für alle API-Endpunkte
 *
 * @lastModified 2025-12-16
 */

import { Router } from 'express'
import { configService } from '../services/config.service'
import { entityRoutes } from './entity.routes'

export const apiRoutes = Router()

// Entity CRUD Routes (generisch für alle Entities)
apiRoutes.use(entityRoutes)

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

// Liste unterstützter Entities
apiRoutes.get('/entities', (_req, res) => {
  res.json({
    entities: [
      'objekt',
      'einheit',
      'mieter',
      'vertrag',
      'kaution',
      'zahlung',
      'sollstellung',
      'nebenkostenabrechnung',
      'zaehler',
      'zaehlerstand',
      'dokument',
      'kostenart',
      'rechnung',
      'erinnerung',
    ],
  })
})
