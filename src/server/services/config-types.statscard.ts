export type StatsCardConfig = {
  id?: string
  title?: string
  field: string
  icon?: string
  color?: string
  // optional endpoint/query for advanced metrics
  endpoint?: string
  query?: Record<string, unknown>
}

export type DashboardView = {
  title?: string
  styling?: Record<string, unknown>
  stats_cards?: StatsCardConfig[]
  cards?: Record<string, unknown>[]
}

// Hinweis: importiere diese Typen in deinem config-loader und in der generierten Config-Definition
