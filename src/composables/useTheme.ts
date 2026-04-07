import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme.store'

export function useTheme() {
  const store = useThemeStore()
  const { mode, resolvedTheme } = storeToRefs(store)

  return {
    mode,
    resolvedTheme,
    init: store.init,
    setMode: store.setMode
  }
}
