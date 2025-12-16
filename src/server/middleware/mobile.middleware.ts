import type { Request, Response, NextFunction } from 'express'

const readOnlyMethods = ['GET', 'HEAD']

/**
 * Verhindert Schreiboperationen für mobile Read-Only-Routen.
 */
export function mobileReadOnlyMiddleware(req: Request, res: Response, next: NextFunction) {
  if (readOnlyMethods.includes(req.method)) {
    next()
    return
  }

  res.status(405).json({
    error: {
      message: 'Mobile-Routen sind Read-Only und erlauben keine Schreibzugriffe.',
      code: 'MOBILE_WRITE_PROHIBITED',
    },
  })
}
