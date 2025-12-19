/**
 * API Routes: Haupt-Router für alle API-Endpunkte
 *
 * @lastModified 2025-12-16
 */

import { Router } from 'express'
import { configService } from '../services/config.service'
import { dashboardService } from '../services/dashboard.service'
import { pdfService } from '../services/pdf.service'
import { schemaService } from '../services/schema.service'
import { entityRoutes } from './entity.routes'

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

apiRoutes.get('/catalog/:name', async (req, res, next) => {
  try {
    const catalog = await configService.getCatalog(req.params.name)
    res.json(catalog)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/config/table/:name', async (req, res, next) => {
  try {
    const config = await configService.getTableConfig(req.params.name)
    res.json(config)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/config/form/:name', async (req, res, next) => {
  try {
    const config = await configService.getFormConfig(req.params.name)
    res.json(config)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/config/view/:name', async (req, res, next) => {
  try {
    const config = await configService.getViewConfig(req.params.name)
    res.json(config)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/config/widths', async (_req, res, next) => {
  try {
    const widths = await configService.getWidths()
    res.json(widths)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/dashboard/summary', async (_req, res, next) => {
  try {
    const summary = await dashboardService.getSummary()
    res.json(summary)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/export/steuerberater', async (_req, res, next) => {
  try {
    const summary = await dashboardService.getSummary()
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=steuerberater-export.pdf')
    const pdfDoc = pdfService.createSteuerberaterExport(summary)
    pdfDoc.pipe(res)
    pdfDoc.end()
  } catch (error) {
    next(error)
  }
})

// Liste unterstützter Entities - dynamisch aus Config-Verzeichnis
apiRoutes.get('/entities', async (_req, res, next) => {
  try {
    const entities = await schemaService.getEntityNames()
    res.json({ entities })
  } catch (error) {
    next(error)
  }
})

// Entity CRUD Routes (generisch für alle Entities)
apiRoutes.use(entityRoutes)
