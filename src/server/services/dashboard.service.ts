import { databaseService } from './database.service'
import { schemaService } from './schema.service'
import type { DashboardSummary } from '@shared/types/dashboard'

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
    const [objekte, einheiten, mieter, vertraege, offeneRechnungen, dokumente, offeneErinnerungen] =
      await Promise.all([
        this.countTable('objekt'),
        this.countTable('einheit'),
        this.countTable('mieter'),
        this.countTable('vertrag'),
        this.countTable('rechnung', 'bezahlt_am IS NULL'),
        this.countTable('dokument'),
        this.countTable('erinnerung', "status != 'erledigt'"),
      ])

    return {
      objekte,
      einheiten,
      mieter,
      vertraege,
      offeneRechnungen,
      dokumente,
      offeneErinnerungen,
    }
  }
}

export const dashboardService = new DashboardService()
