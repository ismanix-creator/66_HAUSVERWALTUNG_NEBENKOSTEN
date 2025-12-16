/**
 * Entity Hooks: TanStack Query Hooks für CRUD-Operationen
 * 100% Config-Driven - generisch für alle Entities
 *
 * @lastModified 2025-12-16
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService, QueryOptions } from '../services/api.service'

/**
 * Hook für Entity-Liste mit Pagination
 */
export function useEntityList<T>(entityName: string, options?: QueryOptions) {
  return useQuery({
    queryKey: ['entity', entityName, 'list', options],
    queryFn: () => apiService.getAll<T>(entityName, options),
    enabled: !!entityName,
  })
}

/**
 * Hook für einzelnen Entity-Eintrag
 */
export function useEntityById<T>(entityName: string, id: string | undefined) {
  return useQuery({
    queryKey: ['entity', entityName, 'detail', id],
    queryFn: () => apiService.getById<T>(entityName, id!),
    enabled: !!entityName && !!id,
  })
}

/**
 * Hook für Create-Mutation
 */
export function useCreateEntity<T>(entityName: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<T>) => apiService.create<T>(entityName, data),
    onSuccess: () => {
      // Invalidate list queries to refetch
      queryClient.invalidateQueries({ queryKey: ['entity', entityName, 'list'] })
    },
  })
}

/**
 * Hook für Update-Mutation
 */
export function useUpdateEntity<T>(entityName: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<T> }) =>
      apiService.update<T>(entityName, id, data),
    onSuccess: (_, variables) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: ['entity', entityName, 'list'] })
      queryClient.invalidateQueries({
        queryKey: ['entity', entityName, 'detail', variables.id],
      })
    },
  })
}

/**
 * Hook für Delete-Mutation
 */
export function useDeleteEntity(entityName: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiService.delete(entityName, id),
    onSuccess: () => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ['entity', entityName, 'list'] })
    },
  })
}
