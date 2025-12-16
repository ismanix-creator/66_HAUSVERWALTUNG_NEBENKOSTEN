/**
 * Config Hooks: TanStack Query Hooks für TOML-Konfigurationen
 *
 * @lastModified 2025-12-16
 */

import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api.service'
import type { AppConfig, NavigationConfig, EntityConfig } from '@shared/types/config'
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
