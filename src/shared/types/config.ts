// App Config
export interface AppConfig {
  app: {
    name: string
    version: string
    description: string
    locale: string
    currency: string
    timezone: string
    owner?: {
      name: string
      address: string
      tax_number: string
    }
    features: {
      dokumente_upload: boolean
      pdf_generation: boolean
      zaehler_management: boolean
      mahnwesen_hinweis: boolean
      mieterhoehung_reminder: boolean
    }
    storage: {
      dokumente_pfad: string
      backup_pfad: string
      max_upload_size_mb: number
    }
    defaults: {
      kuendigungsfrist_monate: number
      kaution_monate: number
      nk_abrechnungsfrist_monate: number
      mieterhoehung_sperrfrist_monate: number
    }
  }
}

// Navigation Config
export interface NavigationConfig {
  navigation: {
    default_route: string
    items: NavigationItem[]
  }
}

export interface NavigationItem {
  id: string
  label: string
  icon: string
  route: string
  order: number
  position?: 'top' | 'bottom'
  children?: NavigationItem[]
}

// Entity Config
export interface EntityConfig {
  entity: {
    name: string
    label: string
    label_plural: string
    icon: string
    primary_key: string
    fields: Record<string, FieldConfig>
    relations?: Record<string, RelationConfig>
    computed?: Record<string, ComputedFieldConfig>
    validation?: Record<string, ValidationRule>
  }
}

export interface FieldConfig {
  type: FieldType
  required?: boolean
  default?: unknown
  label?: string
  description?: string
  placeholder?: string
  // String
  max_length?: number
  min_length?: number
  pattern?: string
  // Number
  min?: number
  max?: number
  // Enum
  options?: string[]
  // Reference
  reference?: string
  // Display
  visible?: boolean
  visible_in_form?: boolean
  readonly?: boolean
  auto_generate?: boolean
  suffix?: string
}

export type FieldType =
  | 'uuid'
  | 'string'
  | 'text'
  | 'integer'
  | 'decimal'
  | 'currency'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'enum'
  | 'multiselect'
  | 'json'
  | 'file'
  | 'reference'

export interface RelationConfig {
  type: 'one_to_one' | 'one_to_many' | 'many_to_one' | 'many_to_many'
  target: string
  foreign_key: string
}

export interface ComputedFieldConfig {
  formula: string
  type?: FieldType
  suffix?: string
}

export interface ValidationRule {
  rule: string
  message: string
}

// View Config
export interface ViewConfig {
  view: {
    id: string
    title: string
    route: string
    layout: 'dashboard' | 'list_detail' | 'tabbed' | 'single' | 'settings'
    entity?: string
    list?: ListConfig
    detail?: DetailConfig
    widgets?: WidgetConfig[]
  }
}

export interface ListConfig {
  table: string
  search_fields?: string[]
  filters?: FilterConfig[]
  actions?: Record<string, ActionConfig>
}

export interface DetailConfig {
  route: string
  title_field: string
  tabs: TabConfig[]
}

export interface FilterConfig {
  field: string
  type: 'select' | 'boolean' | 'daterange'
  label: string
  condition?: string
}

export interface ActionConfig {
  label: string
  form?: string
  icon?: string
  confirm?: string
  variant?: 'primary' | 'secondary' | 'danger'
}

export interface TabConfig {
  id: string
  label: string
  type: 'form' | 'table' | 'custom'
  form?: string
  table?: string
  readonly?: boolean
  filter?: Record<string, string>
  actions?: Record<string, ActionConfig>
}

export interface WidgetConfig {
  id: string
  type: 'stats_card' | 'table_widget' | 'list_widget' | 'action_buttons'
  title: string
  position: { row: number; col: number; width: number }
  stats?: StatsConfig[]
  table?: string
  query?: string
  actions?: ActionConfig[]
  max_rows?: number
  show_more_link?: string
}

export interface StatsConfig {
  label: string
  value: { query: string }
  format?: 'currency' | 'number' | 'fraction'
  total?: { query: string }
  color_rule?: Record<string, string>
}
