import type { BrowserWindow } from 'electron'
import * as si from 'systeminformation'
import type { SysInfoSnapshot } from '@/types/models'

export class SysInfoService {
  private timer?: NodeJS.Timeout

  async getSnapshot(): Promise<SysInfoSnapshot> {
    const [cpu, memory, disks, osInfo, load, time] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.fsSize(),
      si.osInfo(),
      si.currentLoad(),
      si.time()
    ])

    const memoryUsed = memory.total - memory.available

    return {
      overview: {
        hostname: osInfo.hostname,
        platform: osInfo.platform,
        distro: osInfo.distro,
        release: osInfo.release,
        arch: osInfo.arch,
        uptime: time.uptime,
        cpuLoad: Number(load.currentLoad.toFixed(1)),
        memoryLoad: Number(((memoryUsed / memory.total) * 100).toFixed(1))
      },
      cpu: {
        manufacturer: cpu.manufacturer,
        brand: cpu.brand,
        cores: cpu.cores,
        physicalCores: cpu.physicalCores
      },
      memory: {
        total: memory.total,
        used: memoryUsed,
        free: memory.available,
        active: memory.active
      },
      disks: disks.map((disk) => ({
        fs: disk.fs,
        size: disk.size,
        used: disk.used,
        available: disk.available,
        mount: disk.mount
      }))
    }
  }

  startMonitor(window: BrowserWindow): void {
    this.stopMonitor()

    this.timer = setInterval(async () => {
      try {
        const [load, memory] = await Promise.all([si.currentLoad(), si.mem()])
        const used = memory.total - memory.available
        window.webContents.send('sysinfo:update', {
          cpuLoad: Number(load.currentLoad.toFixed(1)),
          memoryLoad: Number(((used / memory.total) * 100).toFixed(1))
        })
      } catch (error) {
        console.error('Failed to push sysinfo update', error)
      }
    }, 3000)
  }

  stopMonitor(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = undefined
    }
  }
}

export const sysInfoService = new SysInfoService()
