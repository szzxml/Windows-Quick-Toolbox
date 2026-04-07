import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { SearchResult } from '@/types/models'

export const useSearchStore = defineStore('search', () => {
  const items = ref<SearchResult[]>([])
  const query = ref('')
  const ready = ref(false)

  const results = computed(() => {
    const keyword = query.value.trim().toLowerCase()
    if (!keyword) {
      return []
    }

    return items.value
      .filter((item) =>
        [item.label, item.description, item.id]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(keyword))
      )
      .slice(0, 8)
  })

  async function init(): Promise<void> {
    if (ready.value) {
      return
    }

    items.value = await window.api.search.list()
    ready.value = true
  }

  function setQuery(value: string): void {
    query.value = value
  }

  function clear(): void {
    query.value = ''
  }

  return { query, results, init, setQuery, clear }
})
