import { storeToRefs } from 'pinia'
import { useSearchStore } from '@/stores/search.store'

export function useSearch() {
  const store = useSearchStore()
  const { query, results } = storeToRefs(store)

  return {
    query,
    results,
    init: store.init,
    setQuery: store.setQuery,
    clear: store.clear
  }
}
