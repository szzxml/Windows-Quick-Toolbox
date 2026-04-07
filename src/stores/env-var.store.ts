import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { EnvScope, EnvVariable } from '@/types/models'

function splitPath(value: string): string[] {
  return value
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

export const useEnvVarStore = defineStore('env-vars', () => {
  const scope = ref<EnvScope>('user')
  const variables = ref<EnvVariable[]>([])
  const loading = ref(false)
  const search = ref('')
  const selectedName = ref('')
  const pathDraft = ref<string[]>([])

  const filtered = computed(() => {
    const keyword = search.value.trim().toLowerCase()
    return variables.value.filter((item) => {
      if (!keyword) {
        return true
      }

      return item.name.toLowerCase().includes(keyword) || item.value.toLowerCase().includes(keyword)
    })
  })

  const selectedVariable = computed(
    () => variables.value.find((item) => item.name === selectedName.value) ?? filtered.value[0] ?? null
  )

  watch(selectedVariable, (value) => {
    if (value?.name.toUpperCase() === 'PATH') {
      pathDraft.value = splitPath(value.value)
    } else {
      pathDraft.value = []
    }
  })

  async function load(nextScope = scope.value): Promise<void> {
    scope.value = nextScope
    loading.value = true
    try {
      variables.value = await window.api.envVar.getByScope(scope.value)
      selectedName.value = variables.value[0]?.name ?? ''
    } finally {
      loading.value = false
    }
  }

  async function saveVariable(name: string, value: string, originalName?: string): Promise<void> {
    if (originalName && originalName !== name) {
      await window.api.envVar.delete(scope.value, originalName)
    }

    await window.api.envVar.set(scope.value, name, value)
    await load(scope.value)
    selectedName.value = name
  }

  async function removeVariable(name: string): Promise<void> {
    await window.api.envVar.delete(scope.value, name)
    await load(scope.value)
  }

  async function savePath(): Promise<void> {
    await saveVariable('Path', pathDraft.value.join(';'))
  }

  return {
    scope,
    variables,
    filtered,
    loading,
    search,
    selectedName,
    selectedVariable,
    pathDraft,
    load,
    saveVariable,
    removeVariable,
    savePath
  }
})
