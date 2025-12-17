import { describe, expect, it } from 'vitest'
import { resolvePaginationParams } from '../../src/server/utils/pagination'
import type { MasterConfig } from '../../src/shared/config/schemas'

const baseConfig: MasterConfig['pagination'] = {
  default_page_size: 25,
  page_size_options: [10, 25, 50, 100],
  max_page_size: 100,
  show_total: true,
  show_page_jump: true,
}

describe('resolvePaginationParams', () => {
  it('nutzt Defaults wenn keine Parameter gesetzt sind', () => {
    const result = resolvePaginationParams(undefined, undefined, baseConfig)
    expect(result.limit).toBe(25)
    expect(result.offset).toBe(0)
  })

  it('klemmt das Limit am Maximalwert', () => {
    const result = resolvePaginationParams('999', '0', baseConfig)
    expect(result.limit).toBe(100)
  })

  it('verhindert negative Werte', () => {
    const result = resolvePaginationParams('-5', '-30', baseConfig)
    expect(result.limit).toBe(1)
    expect(result.offset).toBe(0)
  })

  it('fällt auf Defaults zurück, wenn Config fehlt', () => {
    const result = resolvePaginationParams(undefined, undefined, undefined)
    expect(result.limit).toBe(100)
    expect(result.offset).toBe(0)
  })
})
