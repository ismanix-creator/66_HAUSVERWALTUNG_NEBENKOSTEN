/* eslint-disable no-console */

type LogFn = (...args: unknown[]) => void

const shouldLog = () => process.env.NODE_ENV !== 'test'

const createLogger = (fn: LogFn): LogFn => {
  return (...args) => {
    if (!shouldLog()) {
      return
    }
    fn(...args)
  }
}

export const logger = {
  info: createLogger(console.info),
  warn: createLogger(console.warn),
  error: createLogger(console.error),
}
