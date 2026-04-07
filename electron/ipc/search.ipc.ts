import { ipcMain } from 'electron'
import type { SearchResult } from '@/types/models'
import { launcherService } from '../services/launcher.service'

const ROUTES: SearchResult[] = [
  { id: 'home', label: '首页', description: '快速入口与系统概览', type: 'route', route: '/' },
  { id: 'env', label: '环境变量', description: '查看和编辑系统与用户变量', type: 'route', route: '/env-var' },
  { id: 'system-tools', label: '系统工具', description: '一键启动常用系统控制台', type: 'route', route: '/system-tools' },
  { id: 'control-panel', label: '控制面板', description: '常用设置面板与快捷入口', type: 'route', route: '/control-panel' },
  { id: 'advanced', label: '高级工具', description: 'Hosts、进程、网络与清理器', type: 'route', route: '/advanced/hosts' },
  { id: 'settings', label: '设置', description: '主题和应用配置', type: 'route', route: '/settings' }
]

export function registerSearchIpc(): void {
  ipcMain.handle('search:list', () => {
    const tools = launcherService.list().map<SearchResult>((tool) => ({
      id: tool.id,
      label: tool.name,
      description: tool.description,
      type: 'tool',
      toolId: tool.id
    }))

    return [...ROUTES, ...tools]
  })
}
