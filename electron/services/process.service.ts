import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import * as si from 'systeminformation'
import type { ProcessInfo } from '@/types/models'

const execFileAsync = promisify(execFile)

export class ProcessService {
  async list(): Promise<ProcessInfo[]> {
    const processes = await si.processes()
    return processes.list
      .map((processItem) => ({
        pid: processItem.pid,
        name: processItem.name,
        cpu: processItem.cpu,
        mem: processItem.mem,
        memRss: processItem.memRss,
        user: processItem.user,
        started: processItem.started,
        path: processItem.path
      }))
      .sort((left, right) => right.cpu - left.cpu)
  }

  async kill(pid: number): Promise<void> {
    await execFileAsync('taskkill.exe', ['/PID', String(pid), '/F'], { windowsHide: true })
  }
}

export const processService = new ProcessService()
