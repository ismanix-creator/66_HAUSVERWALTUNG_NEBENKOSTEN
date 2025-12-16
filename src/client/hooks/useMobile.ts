import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api.service'
import type { MobileSnapshot } from '@shared/types/mobile'

export function useMobileSnapshot() {
  return useQuery({
    queryKey: ['mobile', 'snapshot'],
    queryFn: () => apiService.getMobileSnapshot<MobileSnapshot>(),
    staleTime: 30_000,
  })
}
