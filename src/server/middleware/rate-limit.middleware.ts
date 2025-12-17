import type { NextFunction, Request, Response } from 'express'
import { configLoader } from '../services/config-loader.service'

interface Bucket {
  count: number
  expiresAt: number
}

const buckets = new Map<string, Bucket>()

const getClientKey = (req: Request): string =>
  req.ip || req.socket.remoteAddress || req.headers['x-forwarded-for']?.toString() || 'global'

export async function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const master = await configLoader.getMaster()
    const apiConfig = master.server?.api
    const limit = apiConfig?.rate_limit_requests
    const windowMs = apiConfig?.rate_limit_window_ms

    if (!limit || limit <= 0 || !windowMs) {
      next()
      return
    }

    const key = getClientKey(req)
    const now = Date.now()
    const bucket = buckets.get(key)

    if (!bucket || bucket.expiresAt <= now) {
      buckets.set(key, { count: 1, expiresAt: now + windowMs })
      next()
      return
    }

    bucket.count += 1
    if (bucket.count > limit) {
      const retryAfterMs = Math.max(bucket.expiresAt - now, 0)
      res.setHeader('Retry-After', Math.ceil(retryAfterMs / 1000))
      res.status(429).json({
        error: {
          message: 'Zu viele Anfragen. Bitte später erneut versuchen.',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfterMs,
        },
      })
      return
    }

    buckets.set(key, bucket)
    next()
  } catch (error) {
    next(error)
  }
}

export const resetRateLimitBuckets = (): void => {
  buckets.clear()
}
