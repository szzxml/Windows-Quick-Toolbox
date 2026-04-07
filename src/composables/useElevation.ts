import { computed } from 'vue'
import type { EnvScope } from '@/types/models'

export function useElevation(scope: () => EnvScope) {
  const requiresElevation = computed(() => scope() === 'system')
  return { requiresElevation }
}
