import { contextBridge, ipcRenderer } from 'electron'
import type { EnvScope } from '@/types/models'

contextBridge.exposeInMainWorld('api', {
  envVar: {
    getAll: () => ipcRenderer.invoke('env-var:get-all'),
    getByScope: (scope: EnvScope) => ipcRenderer.invoke('env-var:get-by-scope', scope),
    set: (scope: EnvScope, name: string, value: string) => ipcRenderer.invoke('env-var:set', scope, name, value),
    delete: (scope: EnvScope, name: string) => ipcRenderer.invoke('env-var:delete', scope, name)
  },
  launcher: {
    list: () => ipcRenderer.invoke('launcher:list'),
    open: (toolId: string) => ipcRenderer.invoke('launcher:open', toolId)
  },
  hosts: {
    read: () => ipcRenderer.invoke('hosts:read'),
    write: (content: string) => ipcRenderer.invoke('hosts:write', content)
  },
  sysinfo: {
    get: () => ipcRenderer.invoke('sysinfo:get'),
    onUpdate: (callback: (payload: { cpuLoad: number; memoryLoad: number }) => void) => {
      const listener = (_event: Electron.IpcRendererEvent, payload: { cpuLoad: number; memoryLoad: number }) =>
        callback(payload)
      ipcRenderer.on('sysinfo:update', listener)
      return () => ipcRenderer.removeListener('sysinfo:update', listener)
    }
  },
  cleaner: {
    scan: () => ipcRenderer.invoke('cleaner:scan'),
    clean: (paths: string[]) => ipcRenderer.invoke('cleaner:clean', paths)
  },
  process: {
    list: () => ipcRenderer.invoke('process:list'),
    kill: (pid: number) => ipcRenderer.invoke('process:kill', pid)
  },
  network: {
    flushDns: () => ipcRenderer.invoke('network:flush-dns'),
    getIpConfig: () => ipcRenderer.invoke('network:ip-config')
  },
  search: {
    list: () => ipcRenderer.invoke('search:list')
  },
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close')
  },
  theme: {
    getSystem: () => ipcRenderer.invoke('theme:get-system'),
    onChange: (callback: (theme: 'light' | 'dark') => void) => {
      const listener = (_event: Electron.IpcRendererEvent, theme: 'light' | 'dark') => callback(theme)
      ipcRenderer.on('theme:changed', listener)
      return () => ipcRenderer.removeListener('theme:changed', listener)
    }
  }
})
