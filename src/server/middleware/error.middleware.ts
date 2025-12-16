import { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  statusCode?: number
  code?: string
}

export function errorMiddleware(err: AppError, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Interner Serverfehler'

  console.error(`[Error] ${statusCode}: ${message}`)
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack)
  }

  res.status(statusCode).json({
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  })
}
