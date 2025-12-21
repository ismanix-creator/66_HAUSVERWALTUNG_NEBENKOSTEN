/**
 * API Routes: Haupt-Router für alle API-Endpunkte
 *
 * @lastModified 2025-12-16
 */

import { Router } from 'express'
import { configLoader } from '../services/config-loader.service'
import { dashboardService } from '../services/dashboard.service'
import { pdfService } from '../services/pdf.service'
import { schemaService } from '../services/schema.service'
import { entityRoutes } from './entity.routes'

export const apiRoutes = Router()

// Config Endpoints
apiRoutes.get('/config/app', async (_req, res, next) => {
  try {
    const config = await configLoader.getApp()
    res.json(config)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/config/navigation', async (_req, res, next) => {
  try {
    const config = await configLoader.getNavigation()
    res.json(config)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/config/entity/:name', async (req, res, next) => {
  try {
    const config = await configLoader.getEntity(req.params.name)
    res.json(config)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/catalog/:name', async (req, res, next) => {
  try {
    const catalog = await configLoader.getCatalog(req.params.name)
    res.json(catalog)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/config/table/:name', async (req, res, next) => {
  try {
    const config = await configLoader.getTable(req.params.name)
    res.json(config)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/config/form/:name', async (req, res, next) => {
  try {
    const config = await configLoader.getForm(req.params.name)
    res.json(config)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/config/view/:name', async (req, res, next) => {
  try {
    const config = await configLoader.getView(req.params.name)
    res.json(config)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/config/dashboard', async (_req, res, next) => {
  try {
    const dashboardConfig = await configLoader.getSection('views.dashboard')
    res.json(dashboardConfig)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/config/widths', async (_req, res, next) => {
  try {
    const widths = await configLoader.getWidths()
    res.json(widths)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/config/buttons', async (_req, res, next) => {
  try {
    const buttons = await configLoader.getSection('buttons')
    res.json(buttons)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/config/table', async (_req, res, next) => {
  try {
    const tableConfig = await configLoader.getSection('table')
    res.json(tableConfig)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/config/table/spacing', async (_req, res, next) => {
  try {
    const spacing = await configLoader.getSection('table.spacing')
    res.json(spacing)
  } catch (error) {
    next(error)
  }
})

apiRoutes.get('/config/design', async (_req, res, next) => {
  try {
    const design = await configLoader.getSection('design')
    res.json(design)
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

// Generic config accessor: ermöglicht Zugriff auf beliebige Sections aus config/config.toml
// Beispiel: GET /config/routes  -> liefert [routes]
//          GET /config/entities -> liefert [entities]
// Der Platzhalter fängt alle Pfadsegmente nach /config/ ein (dot-notated keys werden unterstützt von configLoader.getSection)
apiRoutes.get('/config/*', async (req, res, next) => {
  try {
    // Express speichert den Wildcard-Teil in req.params[0]
    const path = (req.params as any)[0] || ''
    const section = await configLoader.getSection(path)
    res.json({ path, section })
  } catch (error) {
    next(error)
  }
})

// Entity CRUD Routes (generisch für alle Entities)
apiRoutes.use(entityRoutes)
