<script setup lang="ts">
import { computed } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import CategoryGrid from '@/components/shared/CategoryGrid.vue'
import ToolCard from '@/components/shared/ToolCard.vue'
import { useToolStore } from '@/stores/tool.store'

const toolStore = useToolStore()
const tools = computed(() => toolStore.byCategory('system'))
</script>

<template>
  <div class="page-shell">
    <PageHeader title="系统工具" description="快速打开设备管理器、服务管理、磁盘管理等 Windows 控制台。" />
    <CategoryGrid>
      <ToolCard v-for="tool in tools" :key="tool.id" :tool="tool" @launch="toolStore.open" />
    </CategoryGrid>
  </div>
</template>
