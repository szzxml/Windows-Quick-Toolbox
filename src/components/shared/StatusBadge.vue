<script setup lang="ts">
import Badge from '@/components/ui/Badge.vue'

defineProps<{
  tone: 'accent' | 'warning' | 'danger' | 'neutral'
}>()
</script>

<template>
  <Badge :tone="tone">
    <slot />
  </Badge>
</template>
