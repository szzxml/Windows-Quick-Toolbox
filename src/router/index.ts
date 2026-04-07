import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue'),
      meta: { label: '首页', icon: 'home' }
    },
    {
      path: '/env-var',
      name: 'env-var',
      component: () => import('@/views/EnvVarPage.vue'),
      meta: { label: '环境变量', icon: 'env' }
    },
    {
      path: '/system-tools',
      name: 'system-tools',
      component: () => import('@/views/SystemToolsPage.vue'),
      meta: { label: '系统工具', icon: 'tools' }
    },
    {
      path: '/control-panel',
      name: 'control-panel',
      component: () => import('@/views/ControlPanelPage.vue'),
      meta: { label: '控制面板', icon: 'panel' }
    },
    {
      path: '/advanced',
      component: () => import('@/views/AdvancedPage.vue'),
      meta: { label: '高级工具', icon: 'advanced' },
      children: [
        { path: '', redirect: '/advanced/hosts' },
        { path: 'hosts', name: 'advanced-hosts', component: () => import('@/views/advanced/HostsEditor.vue') },
        { path: 'sysinfo', name: 'advanced-sysinfo', component: () => import('@/views/advanced/SysInfoDash.vue') },
        { path: 'cleaner', name: 'advanced-cleaner', component: () => import('@/views/advanced/TempCleaner.vue') },
        { path: 'process', name: 'advanced-process', component: () => import('@/views/advanced/ProcessMgr.vue') },
        { path: 'network', name: 'advanced-network', component: () => import('@/views/advanced/NetworkTools.vue') }
      ]
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsPage.vue'),
      meta: { label: '设置', icon: 'settings' }
    }
  ]
})

export default router
