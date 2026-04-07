import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { SystemTool, ToolCategory } from '@/types/models'

export const useToolStore = defineStore('tools', () => {
  const items = ref<SystemTool[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load(): Promise<void> {
    if (loaded.value) {
      return
    }

    loading.value = true
    try {
      items.value = await window.api.launcher.list()
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  const favorites = computed(() => items.value.slice(0, 6))

  function byCategory(category: ToolCategory): SystemTool[] {
    return items.value.filter((tool) => tool.category === category)
  }

  async function open(toolId: string): Promise<void> {
    await window.api.launcher.open(toolId)
  }

  return { items, loading, favorites, load, byCategory, open }
})
