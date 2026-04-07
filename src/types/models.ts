export type EnvScope = 'system' | 'user'

export interface EnvVariable {
  name: string
  value: string
  scope: EnvScope
  type: string
}

export type ToolCategory = 'system' | 'control' | 'advanced'

export interface SystemTool {
  id: string
  name: string
  description: string
  icon: string
  command: string
  elevated?: boolean
  category: ToolCategory
}

export interface CpuSummary {
  manufacturer: string
  brand: string
  cores: number
  physicalCores: number
}

export interface MemorySummary {
  total: number
  used: number
  free: number
  active: number
}

export interface DiskSummary {
  fs: string
  size: number
  used: number
  available: number
  mount: string
}

export interface SystemOverview {
  hostname: string
  platform: string
  distro: string
  release: string
  arch: string
  uptime: number
  cpuLoad: number
  memoryLoad: number
}

export interface SysInfoSnapshot {
  overview: SystemOverview
  cpu: CpuSummary
  memory: MemorySummary
  disks: DiskSummary[]
}

export interface CleanerEntry {
  path: string
  size: number
  files: number
}

export interface CleanerResult {
  deleted: number
  freed: number
  errors: string[]
}

export interface ProcessInfo {
  pid: number
  name: string
  cpu: number
  mem: number
  memRss: number
  user: string
  started: string
  path?: string
}

export interface SearchResult {
  id: string
  label: string
  description: string
  type: 'route' | 'tool'
  route?: string
  toolId?: string
}
