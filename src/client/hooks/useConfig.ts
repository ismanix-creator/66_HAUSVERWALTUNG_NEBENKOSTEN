/**
 * Config Hooks: TanStack Query Hooks für TOML-Konfigurationen
 *
 * @lastModified 2025-12-16
 */

import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api.service'
import type { AppConfig, NavigationConfig, EntityConfig, ViewConfig } from '@shared/types/config'
import type { DashboardSummary } from '@shared/types/dashboard'

/**
 * Hook für App-Konfiguration
 */
export function useAppConfig() {
  return useQuery({
    queryKey: ['config', 'app'],
    queryFn: () => apiService.getAppConfig<AppConfig>(),
    staleTime: Infinity, // Config ändert sich nicht zur Laufzeit
  })
}

/**
 * Hook für Navigation-Konfiguration
 */
export function useNavigationConfig() {
  return useQuery({
    queryKey: ['config', 'navigation'],
    queryFn: () => apiService.getNavigationConfig<NavigationConfig>(),
    staleTime: Infinity,
  })
}

/**
 * Hook für Entity-Konfiguration
 */
export function useEntityConfig(entityName: string) {
  return useQuery({
    queryKey: ['config', 'entity', entityName],
    queryFn: () => apiService.getEntityConfig<EntityConfig>(entityName),
    staleTime: Infinity,
    enabled: !!entityName,
  })
}

/**
 * Hook für Table-Konfiguration
 */
export function useTableConfig<T = unknown>(tableName: string) {
  return useQuery({
    queryKey: ['config', 'table', tableName],
    queryFn: () => apiService.getTableConfig<T>(tableName),
    staleTime: Infinity,
    enabled: !!tableName,
  })
}

/**
 * Hook für Form-Konfiguration
 */
export function useFormConfig<T = unknown>(formName: string) {
  return useQuery({
    queryKey: ['config', 'form', formName],
    queryFn: () => apiService.getFormConfig<T>(formName),
    staleTime: Infinity,
    enabled: !!formName,
  })
}

export function useViewConfig(viewName: string) {
  return useQuery({
    queryKey: ['config', 'view', viewName],
    queryFn: () => apiService.getViewConfig<ViewConfig>(viewName),
    staleTime: Infinity,
    enabled: !!viewName,
  })
}

/**
 * Hook für Dashboard-Konfiguration (Stats Cards, Cards, Actions, Styling)
 */
export function useDashboardConfig() {
  return useQuery({
    queryKey: ['config', 'dashboard'],
    queryFn: () => apiService.getDashboardConfig(),
    staleTime: Infinity,
  })
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => apiService.getDashboardSummary<DashboardSummary>(),
    staleTime: 60_000,
  })
}

export function useCatalog<T = unknown>(catalogName: string) {
  return useQuery({
    queryKey: ['catalog', catalogName],
    queryFn: () => apiService.getCatalog<T>(catalogName),
    staleTime: Infinity,
    enabled: !!catalogName,
  })
}

/**
 * Hook für Widths-Konfiguration (Spaltenbreiten)
 */
export function useWidthsConfig() {
  return useQuery({
    queryKey: ['config', 'widths'],
    queryFn: () => apiService.getWidthsConfig(),
    staleTime: Infinity,
  })
}

/**
 * Hook für Button-Konfiguration (Styling)
 */
export function useButtonConfig() {
  return useQuery({
    queryKey: ['config', 'buttons'],
    queryFn: () => apiService.getButtonConfig(),
    staleTime: Infinity,
  })
}

/**
 * Hook für globale Table-Styling Konfiguration (Zebrastreifen, Zeilenhöhen, etc.)
 */
export function useTableStyleConfig() {
  return useQuery({
    queryKey: ['config', 'table', 'style'],
    queryFn: () => apiService.getTableStyleConfig(),
    staleTime: Infinity,
  })
}

/**
 * Hook für Table-Spacing Konfiguration
 */
export function useTableSpacingConfig() {
  return useQuery({
    queryKey: ['config', 'table', 'spacing'],
    queryFn: () => apiService.getTableSpacingConfig(),
    staleTime: Infinity,
  })
}
