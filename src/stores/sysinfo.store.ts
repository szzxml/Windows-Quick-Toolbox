import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { SysInfoSnapshot } from '@/types/models'

export const useSysInfoStore = defineStore('sysinfo', () => {
  const snapshot = ref<SysInfoSnapshot | null>(null)
  const loading = ref(false)
  const initialized = ref(false)
  let stopListening: (() => void) | undefined

  async function init(): Promise<void> {
    if (initialized.value) {
      return
    }

    loading.value = true
    try {
      snapshot.value = await window.api.sysinfo.get()
      stopListening = window.api.sysinfo.onUpdate((payload) => {
        if (snapshot.value) {
          snapshot.value.overview.cpuLoad = payload.cpuLoad
          snapshot.value.overview.memoryLoad = payload.memoryLoad
        }
      })
      initialized.value = true
    } finally {
      loading.value = false
    }
  }

  function dispose(): void {
    stopListening?.()
  }

  return { snapshot, loading, init, dispose }
})
