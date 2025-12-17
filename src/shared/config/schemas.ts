/**
 * =============================================================================
 * CONFIG SCHEMAS - Zod Validierung für alle Konfigurationen
 * =============================================================================
 * Definiert die Struktur und Validierung aller TOML-Konfigurationen.
 * Typen werden automatisch aus Zod abgeleitet.
 *
 * @lastModified 2025-12-17
 * =============================================================================
 */

import { z } from 'zod'

// =============================================================================
// META SCHEMA
// =============================================================================
export const MetaSchema = z.object({
  version: z.string().default('1.0.0'),
  schema_version: z.string().default('1'),
  last_modified: z.string().optional(),
  environment: z.enum(['development', 'staging', 'production']).default('development'),
  config_format: z.string().default('toml'),
})

// =============================================================================
// APP SCHEMA
// =============================================================================
export const AppOwnerSchema = z.object({
  name: z.string().default(''),
  address: z.string().default(''),
  tax_number: z.string().default(''),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().default(''),
  iban: z.string().default(''),
  bic: z.string().default(''),
})

export const AppDefaultsSchema = z.object({
  kuendigungsfrist_monate: z.number().int().min(0).default(3),
  kaution_monate: z.number().int().min(0).max(3).default(3),
  nk_abrechnungsfrist_monate: z.number().int().min(1).default(12),
  mieterhoehung_sperrfrist_monate: z.number().int().min(0).default(15),
  mahnfrist_tage: z.number().int().min(1).default(14),
  zahlungsziel_tage: z.number().int().min(1).default(14),
})

export const AppStorageSchema = z.object({
  dokumente_pfad: z.string().default('./data/dokumente'),
  backup_pfad: z.string().default('./data/backups'),
  temp_pfad: z.string().default('./data/temp'),
  max_upload_size_mb: z.number().int().min(1).max(100).default(25),
  allowed_file_types: z.array(z.string()).default(['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx']),
})

export const AppSchema = z.object({
  name: z.string().default('Mietverwaltung'),
  version: z.string().default('1.0.0'),
  description: z.string().default('Private Mietobjekt-Verwaltung'),
  locale: z.string().default('de-DE'),
  currency: z.string().default('EUR'),
  timezone: z.string().default('Europe/Berlin'),
  date_format: z.string().default('DD.MM.YYYY'),
  time_format: z.string().default('HH:mm'),
  datetime_format: z.string().default('DD.MM.YYYY HH:mm'),
  owner: AppOwnerSchema.optional().default({}),
  defaults: AppDefaultsSchema.optional().default({}),
  storage: AppStorageSchema.optional().default({}),
})

// =============================================================================
// SERVER SCHEMA
// =============================================================================
export const ServerApiSchema = z.object({
  base_path: z.string().default('/api'),
  version: z.string().default('v1'),
  rate_limit_requests: z.number().int().min(1).default(100),
  rate_limit_window_ms: z.number().int().min(1000).default(60000),
})

export const ServerStaticSchema = z.object({
  enabled: z.boolean().default(true),
  path: z.string().default('./dist/client'),
  cache_max_age: z.number().int().min(0).default(86400),
})

export const ServerSchema = z.object({
  host: z.string().default('127.0.0.1'),
  port: z.coerce.number().int().min(1).max(65535).default(3002),
  cors_origin: z.string().default('http://localhost:5174'),
  request_timeout_ms: z.number().int().min(1000).default(30000),
  max_request_size: z.string().default('50mb'),
  api: ServerApiSchema.optional().default({}),
  static: ServerStaticSchema.optional().default({}),
})

// =============================================================================
// DATABASE SCHEMA
// =============================================================================
export const DatabaseMigrationsSchema = z.object({
  enabled: z.boolean().default(true),
  path: z.string().default('./migrations'),
  auto_run: z.boolean().default(true),
})

export const DatabaseBackupSchema = z.object({
  enabled: z.boolean().default(true),
  interval_hours: z.number().int().min(1).default(24),
  keep_count: z.number().int().min(1).default(7),
  path: z.string().default('./data/backups'),
})

export const DatabaseSchema = z.object({
  type: z.enum(['sqlite', 'postgresql']).default('sqlite'),
  path: z.string().default('./data/mietverwaltung.db'),
  wal_mode: z.boolean().default(true),
  busy_timeout_ms: z.number().int().min(100).default(5000),
  cache_size: z.number().int().default(-2000),
  migrations: DatabaseMigrationsSchema.optional().default({}),
  backup: DatabaseBackupSchema.optional().default({}),
})

// =============================================================================
// IMPORTS SCHEMA
// =============================================================================
export const ImportsSchema = z.object({
  labels: z.string().optional(),
  navigation: z.string().optional(),
  catalogs: z.array(z.string()).optional().default([]),
  entities: z.array(z.string()).optional().default([]),
  views: z.array(z.string()).optional().default([]),
  forms: z.array(z.string()).optional().default([]),
  tables: z.array(z.string()).optional().default([]),
  validation: z.string().optional(),
  design: z.union([z.string(), z.array(z.string())]).optional(),
  features: z.string().optional(),
})

// =============================================================================
// ENTITIES REGISTRY SCHEMA
// =============================================================================
export const EntityRegistryItemSchema = z.object({
  config: z.string(),
  table: z.string(),
  label: z.string(),
})

export const EntitiesRegistrySchema = z.record(z.string(), EntityRegistryItemSchema)

// =============================================================================
// NAVIGATION SCHEMA
// =============================================================================
export const NavigationChildSchema = z.object({
  id: z.string(),
  label: z.string(),
  route: z.string(),
  icon: z.string().optional(),
})

export const NavigationItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: z.string(),
  route: z.string(),
  order: z.number().int(),
  position: z.enum(['top', 'bottom']).optional(),
  children: z.array(NavigationChildSchema).optional(),
})

export const NavigationSchema = z.object({
  default_route: z.string().default('/dashboard'),
  mobile_bottom_nav: z.boolean().default(true),
  sidebar_collapsible: z.boolean().default(true),
  sidebar_default_collapsed: z.boolean().default(false),
  items: z.array(NavigationItemSchema).optional().default([]),
})

// =============================================================================
// ROUTES SCHEMA
// =============================================================================
export const RoutePatternsSchema = z.object({
  list: z.string().default('/{entity}'),
  detail: z.string().default('/{entity}/:id'),
  create: z.string().default('/{entity}/new'),
  edit: z.string().default('/{entity}/:id/edit'),
})

export const RoutesSchema = z.object({
  home: z.string().default('/'),
  dashboard: z.string().default('/dashboard'),
  login: z.string().default('/login'),
  not_found: z.string().default('/404'),
  patterns: RoutePatternsSchema.optional().default({}),
  custom: z.record(z.string(), z.string()).optional().default({}),
})

// =============================================================================
// PAGINATION SCHEMA
// =============================================================================
export const PaginationSchema = z.object({
  default_page_size: z.number().int().min(1).default(25),
  page_size_options: z.array(z.number().int()).default([10, 25, 50, 100]),
  max_page_size: z.number().int().min(1).default(100),
  show_total: z.boolean().default(true),
  show_page_jump: z.boolean().default(true),
})

// =============================================================================
// SEARCH SCHEMA
// =============================================================================
export const SearchSchema = z.object({
  min_query_length: z.number().int().min(1).default(2),
  debounce_ms: z.number().int().min(0).default(300),
  highlight_matches: z.boolean().default(true),
  max_suggestions: z.number().int().min(1).default(10),
  fields: z.record(z.string(), z.array(z.string())).optional().default({}),
})

// =============================================================================
// EXPORT SCHEMA
// =============================================================================
export const ExportPdfSchema = z.object({
  orientation: z.enum(['portrait', 'landscape']).default('landscape'),
  page_size: z.string().default('A4'),
  include_logo: z.boolean().default(true),
  include_footer: z.boolean().default(true),
})

export const ExportSchema = z.object({
  formats: z.array(z.string()).default(['csv', 'xlsx', 'pdf']),
  default_format: z.string().default('xlsx'),
  include_headers: z.boolean().default(true),
  date_format: z.string().default('DD.MM.YYYY'),
  decimal_separator: z.string().default(','),
  thousands_separator: z.string().default('.'),
  pdf: ExportPdfSchema.optional().default({}),
})

// =============================================================================
// NOTIFICATIONS SCHEMA
// =============================================================================
export const NotificationTypeSchema = z.object({
  icon: z.string(),
  color: z.string(),
})

export const NotificationsSchema = z.object({
  position: z.enum(['top-left', 'top-right', 'bottom-left', 'bottom-right']).default('top-right'),
  duration_ms: z.number().int().min(0).default(5000),
  max_visible: z.number().int().min(1).default(3),
  animation: z.enum(['slide', 'fade', 'none']).default('slide'),
  closeable: z.boolean().default(true),
  types: z.record(z.string(), NotificationTypeSchema).optional().default({}),
})

// =============================================================================
// AUTOSAVE SCHEMA
// =============================================================================
export const AutosaveSchema = z.object({
  enabled: z.boolean().default(true),
  interval_ms: z.number().int().min(1000).default(30000),
  show_indicator: z.boolean().default(true),
  warn_on_leave: z.boolean().default(true),
})

// =============================================================================
// SHORTCUTS SCHEMA
// =============================================================================
export const ShortcutsSchema = z.object({
  enabled: z.boolean().default(true),
  global: z.record(z.string(), z.string()).optional().default({}),
  table: z.record(z.string(), z.string()).optional().default({}),
  form: z.record(z.string(), z.string()).optional().default({}),
})

// =============================================================================
// LOGGING SCHEMA
// =============================================================================
export const LoggingSchema = z.object({
  level: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  console: z.boolean().default(true),
  file: z.boolean().default(false),
  file_path: z.string().default('./logs/app.log'),
  max_file_size_mb: z.number().int().min(1).default(10),
  max_files: z.number().int().min(1).default(5),
})

// =============================================================================
// SECURITY SCHEMA
// =============================================================================
export const SecuritySchema = z.object({
  session_timeout_minutes: z.number().int().min(1).default(60),
  max_login_attempts: z.number().int().min(1).default(5),
  lockout_duration_minutes: z.number().int().min(1).default(15),
  require_https: z.boolean().default(false),
  csp_enabled: z.boolean().default(true),
})

// =============================================================================
// PERFORMANCE SCHEMA
// =============================================================================
export const PerformanceSchema = z.object({
  cache_enabled: z.boolean().default(true),
  cache_ttl_seconds: z.number().int().min(0).default(300),
  lazy_load_images: z.boolean().default(true),
  debounce_input_ms: z.number().int().min(0).default(300),
  virtual_scroll_threshold: z.number().int().min(0).default(100),
})

// =============================================================================
// DEBUG SCHEMA
// =============================================================================
export const DebugSchema = z.object({
  enabled: z.boolean().default(true),
  show_query_time: z.boolean().default(true),
  show_render_count: z.boolean().default(false),
  log_api_calls: z.boolean().default(true),
  mock_delay_ms: z.number().int().min(0).default(0),
})

// =============================================================================
// MASTER CONFIG SCHEMA
// =============================================================================
export const MasterConfigSchema = z.object({
  meta: MetaSchema.optional().default({}),
  app: AppSchema.optional().default({}),
  server: ServerSchema.optional().default({}),
  database: DatabaseSchema.optional().default({}),
  imports: ImportsSchema.optional().default({}),
  entities: EntitiesRegistrySchema.optional().default({}),
  navigation: NavigationSchema.optional().default({}),
  routes: RoutesSchema.optional().default({}),
  pagination: PaginationSchema.optional().default({}),
  search: SearchSchema.optional().default({}),
  export: ExportSchema.optional().default({}),
  notifications: NotificationsSchema.optional().default({}),
  autosave: AutosaveSchema.optional().default({}),
  shortcuts: ShortcutsSchema.optional().default({}),
  logging: LoggingSchema.optional().default({}),
  security: SecuritySchema.optional().default({}),
  performance: PerformanceSchema.optional().default({}),
  debug: DebugSchema.optional().default({}),
})

// =============================================================================
// LABELS SCHEMA
// =============================================================================
export const LabelsSchema = z.record(z.string(), z.unknown()).describe('UI Labels (i18n)')

// =============================================================================
// CATALOG SCHEMA
// =============================================================================
export const CatalogItemSchema = z.object({
  value: z.string().optional(),
  label: z.string().optional(),
  bezeichnung: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  sortierung: z.number().int().optional(),
}).passthrough()

export const CatalogSchema = z.object({
  catalog: z.object({
    name: z.string(),
    description: z.string().optional(),
    items: z.array(CatalogItemSchema).optional(),
  }).passthrough(),
})

// =============================================================================
// ENTITY CONFIG SCHEMA
// =============================================================================
export const FieldTypeSchema = z.enum([
  'uuid', 'string', 'text', 'integer', 'decimal', 'currency',
  'boolean', 'date', 'datetime', 'enum', 'multiselect', 'json', 'file', 'reference', 'email'
])

export const FieldConfigSchema = z.object({
  type: FieldTypeSchema,
  required: z.boolean().optional(),
  default: z.unknown().optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  max_length: z.number().int().optional(),
  min_length: z.number().int().optional(),
  pattern: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  options: z.array(z.string()).optional(),
  reference: z.string().optional(),
  visible: z.boolean().optional(),
  visible_in_form: z.boolean().optional(),
  readonly: z.boolean().optional(),
  auto_generate: z.boolean().optional(),
  suffix: z.string().optional(),
}).passthrough()

export const RelationConfigSchema = z.object({
  type: z.enum(['one_to_one', 'one_to_many', 'many_to_one', 'many_to_many']),
  target: z.string(),
  foreign_key: z.string(),
})

export const EntityConfigSchema = z.object({
  entity: z.object({
    name: z.string(),
    table_name: z.string(),
    label: z.string(),
    label_plural: z.string(),
    icon: z.string().optional(),
    primary_key: z.string().default('id'),
    fields: z.record(z.string(), FieldConfigSchema),
    relations: z.record(z.string(), RelationConfigSchema).optional(),
    computed: z.record(z.string(), z.unknown()).optional(),
    validation: z.record(z.string(), z.unknown()).optional(),
  }),
})

// =============================================================================
// DESIGN SYSTEM SCHEMA
// =============================================================================
export const DesignTypographySchema = z.object({
  fonts: z.record(z.string(), z.string()).optional(),
  sizes: z.record(z.string(), z.string()).optional(),
  weights: z.record(z.string(), z.number()).optional(),
  line_heights: z.record(z.string(), z.number()).optional(),
  letter_spacing: z.record(z.string(), z.string()).optional(),
  styles: z.record(z.string(), z.unknown()).optional(),
}).passthrough()

export const DesignSpacingSchema = z.object({
  scale: z.record(z.string(), z.string()).optional(),
  semantic: z.record(z.string(), z.string()).optional(),
}).passthrough()

export const DesignSizingSchema = z.object({
  scale: z.record(z.string(), z.string()).optional(),
  containers: z.record(z.string(), z.string()).optional(),
  components: z.record(z.string(), z.string()).optional(),
}).passthrough()

export const DesignBordersSchema = z.object({
  width: z.record(z.string(), z.string()).optional(),
  radius: z.record(z.string(), z.string()).optional(),
  components: z.record(z.string(), z.string()).optional(),
}).passthrough()

export const DesignShadowsSchema = z.record(z.string(), z.unknown())

export const DesignTransitionsSchema = z.object({
  duration: z.record(z.string(), z.string()).optional(),
  timing: z.record(z.string(), z.string()).optional(),
  presets: z.record(z.string(), z.string()).optional(),
}).passthrough()

export const DesignButtonsSchema = z.object({
  sizes: z.record(z.string(), z.unknown()).optional(),
  variants: z.record(z.string(), z.unknown()).optional(),
  disabled: z.unknown().optional(),
}).passthrough()

export const DesignInputsSchema = z.object({
  sizes: z.record(z.string(), z.unknown()).optional(),
  states: z.record(z.string(), z.unknown()).optional(),
}).passthrough()

export const DesignSystemSchema = z.object({
  design: z.object({
    name: z.string().optional(),
    version: z.string().optional(),
    typography: DesignTypographySchema.optional(),
    spacing: DesignSpacingSchema.optional(),
    sizing: DesignSizingSchema.optional(),
    borders: DesignBordersSchema.optional(),
    shadows: DesignShadowsSchema.optional(),
    transitions: DesignTransitionsSchema.optional(),
    z_index: z.record(z.string(), z.unknown()).optional(),
    buttons: DesignButtonsSchema.optional(),
    inputs: DesignInputsSchema.optional(),
    cards: z.unknown().optional(),
    badges: z.unknown().optional(),
    icons: z.record(z.string(), z.string()).optional(),
    avatars: z.record(z.string(), z.string()).optional(),
    breakpoints: z.record(z.string(), z.string()).optional(),
  }).passthrough(),
  theme: z.unknown().optional(),
}).passthrough()

// =============================================================================
// FEATURE FLAGS SCHEMA
// =============================================================================
export const FeatureItemSchema = z.object({
  enabled: z.boolean(),
  description: z.string().optional(),
  icon: z.string().optional(),
  beta: z.boolean().optional(),
  alpha: z.boolean().optional(),
  requires_license: z.boolean().optional(),
  requires_config: z.string().optional(),
}).passthrough()

export const FeatureFlagsSchema = z.object({
  features: z.object({
    version: z.string().optional(),
    core: z.record(z.string(), FeatureItemSchema).optional(),
    finanzen: z.record(z.string(), FeatureItemSchema).optional(),
    nebenkosten: z.record(z.string(), FeatureItemSchema).optional(),
    dokumente: z.record(z.string(), FeatureItemSchema).optional(),
    export: z.record(z.string(), FeatureItemSchema).optional(),
    erinnerungen: z.record(z.string(), FeatureItemSchema).optional(),
    ui: z.record(z.string(), FeatureItemSchema).optional(),
    security: z.record(z.string(), FeatureItemSchema).optional(),
    integrations: z.record(z.string(), FeatureItemSchema).optional(),
    experimental: z.record(z.string(), FeatureItemSchema).optional(),
  }).passthrough(),
})

// =============================================================================
// VALIDATION RULES SCHEMA
// =============================================================================
export const ValidationPatternSchema = z.object({
  pattern: z.string(),
  message: z.string(),
})

export const ValidationRulesSchema = z.object({
  validation: z.object({
    version: z.string().optional(),
    strict_mode: z.boolean().optional(),
    patterns: z.record(z.string(), ValidationPatternSchema).optional(),
    fields: z.record(z.string(), z.unknown()).optional(),
    entities: z.record(z.string(), z.unknown()).optional(),
    cross_entity: z.record(z.string(), z.unknown()).optional(),
    business: z.record(z.string(), z.unknown()).optional(),
  }).passthrough(),
})

// =============================================================================
// TYPE EXPORTS
// =============================================================================
export type MasterConfig = z.infer<typeof MasterConfigSchema>
export type AppConfig = z.infer<typeof AppSchema>
export type ServerConfig = z.infer<typeof ServerSchema>
export type DatabaseConfig = z.infer<typeof DatabaseSchema>
export type NavigationConfig = z.infer<typeof NavigationSchema>
export type NavigationItem = z.infer<typeof NavigationItemSchema>
export type EntityConfig = z.infer<typeof EntityConfigSchema>
export type FieldConfig = z.infer<typeof FieldConfigSchema>
export type FieldType = z.infer<typeof FieldTypeSchema>
export type CatalogConfig = z.infer<typeof CatalogSchema>
export type DesignSystem = z.infer<typeof DesignSystemSchema>
export type FeatureFlags = z.infer<typeof FeatureFlagsSchema>
export type ValidationRules = z.infer<typeof ValidationRulesSchema>
export type Labels = z.infer<typeof LabelsSchema>
