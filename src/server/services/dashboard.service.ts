import { databaseService } from './database.service'
import { schemaService } from './schema.service'
import type { DashboardSummary } from '@shared/types/dashboard'

type SummaryMetric = {
  key: keyof DashboardSummary
  entity: string
  whereClause?: string
  params?: unknown[]
}

const summaryMetrics: SummaryMetric[] = [
  { key: 'objekte', entity: 'objekt' },
  { key: 'einheiten', entity: 'einheit' },
  { key: 'mieter', entity: 'mieter' },
  { key: 'vertraege', entity: 'vertrag' },
  { key: 'offeneRechnungen', entity: 'rechnung', whereClause: 'bezahlt_am IS NULL' },
  { key: 'dokumente', entity: 'dokument' },
  { key: 'offeneErinnerungen', entity: 'erinnerung', whereClause: "status != 'erledigt'" },
]

class DashboardService {
  private async countTable(
    entityName: string,
    whereClause?: string,
    params: unknown[] = []
  ): Promise<number> {
    const tableName = schemaService.getTableName(entityName)
    const where = whereClause ? ` WHERE ${whereClause}` : ''
    const result = await databaseService.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${tableName}${where}`,
      params
    )
    return result?.count || 0
  }

  async getSummary(): Promise<DashboardSummary> {
    const counts = await Promise.all(
      summaryMetrics.map(metric => this.countTable(metric.entity, metric.whereClause, metric.params))
    )

    return summaryMetrics.reduce<DashboardSummary>((summary, metric, index) => {
      summary[metric.key] = counts[index]
      return summary
    }, {} as DashboardSummary)
  }
}

export const dashboardService = new DashboardService()
