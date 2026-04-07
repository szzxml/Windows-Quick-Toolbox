import type {
  CleanerEntry,
  CleanerResult,
  EnvScope,
  EnvVariable,
  ProcessInfo,
  SearchResult,
  SysInfoSnapshot,
  SystemTool
} from './models'

interface ToolboxApi {
  envVar: {
    getAll(): Promise<EnvVariable[]>
    getByScope(scope: EnvScope): Promise<EnvVariable[]>
    set(scope: EnvScope, name: string, value: string): Promise<void>
    delete(scope: EnvScope, name: string): Promise<void>
  }
  launcher: {
    list(): Promise<SystemTool[]>
    open(toolId: string): Promise<void>
  }
  hosts: {
    read(): Promise<string>
    write(content: string): Promise<void>
  }
  sysinfo: {
    get(): Promise<SysInfoSnapshot>
    onUpdate(callback: (payload: Pick<SysInfoSnapshot['overview'], 'cpuLoad' | 'memoryLoad'>) => void): () => void
  }
  cleaner: {
    scan(): Promise<CleanerEntry[]>
    clean(paths: string[]): Promise<CleanerResult>
  }
  process: {
    list(): Promise<ProcessInfo[]>
    kill(pid: number): Promise<void>
  }
  network: {
    flushDns(): Promise<string>
    getIpConfig(): Promise<string>
  }
  search: {
    list(): Promise<SearchResult[]>
  }
  window: {
    minimize(): Promise<void>
    maximize(): Promise<boolean>
    close(): Promise<void>
  }
  theme: {
    getSystem(): Promise<'light' | 'dark'>
    onChange(callback: (theme: 'light' | 'dark') => void): () => void
  }
}

declare global {
  interface Window {
    api: ToolboxApi
  }
}

export {}
