import type {
  AppConfig as AppSection,
  NavigationConfig as NavigationSection,
  NavigationItem as NavigationItemSchema,
  EntityConfig as EntityConfigSchema,
  FieldConfig as FieldConfigSchema,
  FieldType as FieldTypeSchema,
} from '../config/schemas'

type EntitySection = EntityConfigSchema['entity']

// App Config
export interface AppConfig {
  app: AppSection
}

// Navigation Config
export interface NavigationConfig {
  navigation: NavigationSection
}

export type NavigationItem = NavigationItemSchema

// Entity Config
export type EntityConfig = EntityConfigSchema
export type FieldConfig = FieldConfigSchema
export type FieldType = FieldTypeSchema
export type RelationConfig = EntitySection['relations'] extends Record<string, infer T> ? T : never
export type ComputedFieldConfig = EntitySection['computed'] extends Record<string, infer T> ? T : never
export type ValidationRule = EntitySection['validation'] extends Record<string, infer T> ? T : never

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
  type: 'form_readonly' | 'table' | 'custom'
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
