import type { Request, Response } from 'express'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { rateLimitMiddleware, resetRateLimitBuckets } from '../../src/server/middleware/rate-limit.middleware'
import { configLoader } from '../../src/server/services/config-loader.service'
import type { MasterConfig } from '../../src/shared/config/schemas'

const createMasterConfig = (limit: number, windowMs = 1000): MasterConfig =>
  ({
    server: {
      api: {
        rate_limit_requests: limit,
        rate_limit_window_ms: windowMs,
        base_path: '/api',
        version: 'v1',
      },
    },
  } as unknown as MasterConfig)

const createMockReq = (): Request =>
  ({
    ip: '127.0.0.1',
    socket: {
      remoteAddress: '127.0.0.1',
    },
    headers: {},
  } as unknown as Request)

const createMockRes = () => {
  const res: Partial<Response> = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  res.setHeader = vi.fn()
  return res as Response
}

describe('rateLimitMiddleware', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    resetRateLimitBuckets()
  })

  it('lässt Anfragen unterhalb des Limits durch', async () => {
    vi.spyOn(configLoader, 'getMaster').mockResolvedValue(createMasterConfig(5))
    const req = createMockReq()
    const res = createMockRes()
    const next = vi.fn()

    await rateLimitMiddleware(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(res.status).not.toHaveBeenCalled()
  })

  it('blockiert Anfragen nach Überschreiten des Limits', async () => {
    vi.spyOn(configLoader, 'getMaster').mockResolvedValue(createMasterConfig(1))
    const req = createMockReq()
    const res = createMockRes()
    const next = vi.fn()

    await rateLimitMiddleware(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)

    next.mockClear()

    await rateLimitMiddleware(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(429)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'RATE_LIMIT_EXCEEDED' }),
      })
    )
  })
})
