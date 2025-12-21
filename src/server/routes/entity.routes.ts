/**
 * Entity Routes: Generische REST API für alle Entities
 * 100% Config-Driven - keine hardcodierten Entity-Details
 *
 * @lastModified 2025-12-16
 */

import { Router, Request, Response, NextFunction } from 'express'
import { entityService, EntityNotFoundError, ValidationError } from '../services/entity.service'
import { schemaService } from '../services/schema.service'
import { configLoader } from '../services/config-loader.service'
import { resolvePaginationParams } from '../utils/pagination'

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
 * Dynamisch über zentrale Master-Config (`config/config.toml`) via `schemaService`/`configLoader`
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
 * GET /api/:entity - Liste aller Einträge (kürzester Pfad, config-driven)
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
          const candidates = Array.isArray(value) ? value : [value]
          const normalized = candidates
            .map(v => (v === undefined || v === null ? '' : String(v).trim()))
            .filter(v => v.length > 0)
          if (normalized.length === 0) continue
          filters[fieldName] = normalized.length === 1 ? normalized[0] : normalized
        }
      }

      const paginationConfig = await configLoader.getPagination()
      const { limit: safeLimit, offset: safeOffset } = resolvePaginationParams(
        limit,
        offset,
        paginationConfig
      )

      const options = {
        limit: safeLimit,
        offset: safeOffset,
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
 * GET /api/:entity/:id - Einzelner Eintrag (kürzester Pfad)
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
 * POST /api/:entity - Neuen Eintrag erstellen (kürzester Pfad)
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
 * PUT /api/:entity/:id - Eintrag aktualisieren (kürzester Pfad)
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
 * DELETE /api/:entity/:id - Eintrag löschen (kürzester Pfad)
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
