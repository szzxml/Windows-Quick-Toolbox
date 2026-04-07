<script setup lang="ts">
import { computed } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import CategoryGrid from '@/components/shared/CategoryGrid.vue'
import ToolCard from '@/components/shared/ToolCard.vue'
import { useToolStore } from '@/stores/tool.store'

const toolStore = useToolStore()
const tools = computed(() => toolStore.byCategory('control'))
</script>

<template>
  <div class="page-shell">
    <PageHeader title="控制面板快捷入口" description="集中放置网络、防火墙、电源、程序和功能等常用设置页。" />
    <CategoryGrid>
      <ToolCard v-for="tool in tools" :key="tool.id" :tool="tool" @launch="toolStore.open" />
    </CategoryGrid>
  </div>
</template>
