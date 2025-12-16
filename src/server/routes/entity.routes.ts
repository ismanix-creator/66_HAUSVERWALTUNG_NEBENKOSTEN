/**
 * Entity Routes: Generische REST API für alle Entities
 * 100% Config-Driven - keine hardcodierten Entity-Details
 *
 * @lastModified 2025-12-16
 */

import { Router, Request, Response, NextFunction } from 'express'
import { entityService, EntityNotFoundError, ValidationError } from '../services/entity.service'
import { schemaService } from '../services/schema.service'

export const entityRoutes = Router()

// Cache für unterstützte Entities (wird beim ersten Request geladen)
let supportedEntitiesCache: string[] | null = null

/**
 * Lädt unterstützte Entities dynamisch aus Config-Verzeichnis
 */
async function getSupportedEntities(): Promise<string[]> {
  if (supportedEntitiesCache) {
    return supportedEntitiesCache
  }
  supportedEntitiesCache = await schemaService.getEntityNames()
  return supportedEntitiesCache
}

/**
 * Middleware: Prüft ob Entity unterstützt wird
 * Dynamisch aus config/entities/ Verzeichnis
 */
async function validateEntity(req: Request, res: Response, next: NextFunction) {
  const { entity } = req.params
  const supportedEntities = await getSupportedEntities()

  if (!supportedEntities.includes(entity)) {
    res.status(404).json({
      error: {
        message: `Entity '${entity}' nicht gefunden`,
        code: 'ENTITY_NOT_SUPPORTED',
      },
    })
    return
  }
  next()
}

/**
 * GET /api/:entity - Liste aller Einträge
 *
 * Query-Parameter:
 * - limit: Anzahl der Ergebnisse (default: 100)
 * - offset: Offset für Pagination (default: 0)
 * - orderBy: Feld zum Sortieren
 * - orderDir: ASC oder DESC
 * - filter[feldname]: Filter nach Feldwert
 */
entityRoutes.get(
  '/:entity',
  validateEntity,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { entity } = req.params
      const { limit, offset, orderBy, orderDir, ...rest } = req.query

      // Filter aus Query-Parametern extrahieren
      const filters: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(rest)) {
        if (key.startsWith('filter[') && key.endsWith(']')) {
          const fieldName = key.slice(7, -1)
          filters[fieldName] = value
        }
      }

      const options = {
        limit: limit ? parseInt(limit as string, 10) : 100,
        offset: offset ? parseInt(offset as string, 10) : 0,
        orderBy: orderBy as string | undefined,
        orderDir: (orderDir as 'ASC' | 'DESC') || 'DESC',
        filters: Object.keys(filters).length > 0 ? filters : undefined,
      }

      const [data, total] = await Promise.all([
        entityService.getAll(entity, options),
        entityService.count(entity, filters),
      ])

      res.json({
        data,
        meta: {
          total,
          limit: options.limit,
          offset: options.offset,
        },
      })
    } catch (error) {
      next(error)
    }
  }
)

/**
 * GET /api/:entity/:id - Einzelner Eintrag
 */
entityRoutes.get(
  '/:entity/:id',
  validateEntity,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { entity, id } = req.params
      const data = await entityService.getById(entity, id)

      if (!data) {
        res.status(404).json({
          error: {
            message: `${entity} mit ID '${id}' nicht gefunden`,
            code: 'ENTITY_NOT_FOUND',
          },
        })
        return
      }

      res.json({ data })
    } catch (error) {
      next(error)
    }
  }
)

/**
 * POST /api/:entity - Neuen Eintrag erstellen
 */
entityRoutes.post(
  '/:entity',
  validateEntity,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { entity } = req.params
      const data = await entityService.create(entity, req.body)

      res.status(201).json({ data })
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: {
            message: error.message,
            code: error.code,
            details: error.details,
          },
        })
        return
      }
      next(error)
    }
  }
)

/**
 * PUT /api/:entity/:id - Eintrag aktualisieren
 */
entityRoutes.put(
  '/:entity/:id',
  validateEntity,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { entity, id } = req.params
      const data = await entityService.update(entity, id, req.body)

      res.json({ data })
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        res.status(404).json({
          error: {
            message: error.message,
            code: error.code,
          },
        })
        return
      }
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: {
            message: error.message,
            code: error.code,
            details: error.details,
          },
        })
        return
      }
      next(error)
    }
  }
)

/**
 * DELETE /api/:entity/:id - Eintrag löschen
 */
entityRoutes.delete(
  '/:entity/:id',
  validateEntity,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { entity, id } = req.params
      await entityService.delete(entity, id)

      res.status(204).send()
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        res.status(404).json({
          error: {
            message: error.message,
            code: error.code,
          },
        })
        return
      }
      next(error)
    }
  }
)
