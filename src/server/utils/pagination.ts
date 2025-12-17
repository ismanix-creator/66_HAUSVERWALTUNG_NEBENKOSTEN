import type { MasterConfig } from '../../shared/config/schemas'

interface PaginationResult {
  limit: number
  offset: number
}

const DEFAULT_LIMIT = 100

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return null
}

export const resolvePaginationParams = (
  limitParam: unknown,
  offsetParam: unknown,
  paginationConfig: MasterConfig['pagination'] | undefined
): PaginationResult => {
  const defaultLimit = paginationConfig?.default_page_size ?? DEFAULT_LIMIT
  const maxLimit = paginationConfig?.max_page_size ?? DEFAULT_LIMIT

  const parsedLimit = toNumber(limitParam)
  const parsedOffset = toNumber(offsetParam)

  const safeLimit = Math.min(Math.max(parsedLimit ?? defaultLimit, 1), maxLimit)
  const safeOffset = Math.max(parsedOffset ?? 0, 0)

  return {
    limit: safeLimit,
    offset: safeOffset,
  }
}
