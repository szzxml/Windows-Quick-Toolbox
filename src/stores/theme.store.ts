import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type ThemeMode = 'system' | 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>('system')
  const systemTheme = ref<'light' | 'dark'>('light')
  const initialized = ref(false)
  let stopListening: (() => void) | undefined

  const resolvedTheme = computed(() => (mode.value === 'system' ? systemTheme.value : mode.value))

  function applyTheme(): void {
    document.documentElement.dataset.theme = resolvedTheme.value
  }

  async function init(): Promise<void> {
    if (initialized.value) {
      applyTheme()
      return
    }

    mode.value = (localStorage.getItem('toolbox.theme') as ThemeMode | null) ?? 'system'
    systemTheme.value = await window.api.theme.getSystem()
    applyTheme()

    stopListening = window.api.theme.onChange((theme) => {
      systemTheme.value = theme
      applyTheme()
    })

    initialized.value = true
  }

  function setMode(nextMode: ThemeMode): void {
    mode.value = nextMode
    localStorage.setItem('toolbox.theme', nextMode)
    applyTheme()
  }

  function dispose(): void {
    stopListening?.()
  }

  return { mode, resolvedTheme, init, setMode, dispose }
})
