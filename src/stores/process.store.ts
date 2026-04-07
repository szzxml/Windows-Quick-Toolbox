import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ProcessInfo } from '@/types/models'

export const useProcessStore = defineStore('process', () => {
  const items = ref<ProcessInfo[]>([])
  const loading = ref(false)

  async function refresh(): Promise<void> {
    loading.value = true
    try {
      items.value = await window.api.process.list()
    } finally {
      loading.value = false
    }
  }

  async function kill(pid: number): Promise<void> {
    await window.api.process.kill(pid)
    await refresh()
  }

  return { items, loading, refresh, kill }
})
