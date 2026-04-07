import { execFile } from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'
import type { SystemTool } from '@/types/models'
import { quoted, runElevatedPowerShell } from '../utils/elevated'

const execFileAsync = promisify(execFile)

function getSystem32Path(fileName: string): string {
  const windowsRoot = process.env.WINDIR ?? process.env.SystemRoot ?? 'C:\\Windows'
  return join(windowsRoot, 'System32', fileName)
}

async function startDetached(filePath: string, args: string[] = []): Promise<void> {
  await execFileAsync('cmd.exe', ['/c', 'start', '', filePath, ...args], { windowsHide: true })
}

const TOOL_CATALOG: SystemTool[] = [
  { id: 'devmgmt', name: '设备管理器', description: '管理硬件设备与驱动', icon: 'chip', command: 'devmgmt.msc', category: 'system' },
  { id: 'services', name: '服务管理', description: '查看和管理 Windows 服务', icon: 'layers', command: 'services.msc', category: 'system' },
  { id: 'diskmgmt', name: '磁盘管理', description: '查看磁盘分区与卷', icon: 'disk', command: 'diskmgmt.msc', elevated: true, category: 'system' },
  { id: 'compmgmt', name: '计算机管理', description: '打开综合管理控制台', icon: 'desktop', command: 'compmgmt.msc', elevated: true, category: 'system' },
  { id: 'eventvwr', name: '事件查看器', description: '检查系统日志与错误', icon: 'pulse', command: 'eventvwr.msc', category: 'system' },
  { id: 'msinfo32', name: '系统信息', description: '查看硬件和软件详情', icon: 'info', command: 'msinfo32', category: 'system' },
  { id: 'ncpa', name: '网络连接', description: '管理网络适配器', icon: 'network', command: 'ncpa.cpl', category: 'control' },
  { id: 'firewall', name: '防火墙', description: '打开 Windows 防火墙设置', icon: 'shield', command: 'firewall.cpl', category: 'control' },
  { id: 'windows-update', name: 'Windows 更新', description: '跳转到系统更新设置页', icon: 'refresh', command: 'ms-settings:windowsupdate', category: 'control' },
  { id: 'powercfg', name: '电源选项', description: '查看与调整电源计划', icon: 'bolt', command: 'powercfg.cpl', category: 'control' },
  { id: 'appwiz', name: '程序和功能', description: '卸载或修改已安装程序', icon: 'apps', command: 'appwiz.cpl', category: 'control' },
  { id: 'sysdm', name: '系统属性', description: '打开计算机属性和环境变量', icon: 'settings', command: 'sysdm.cpl', category: 'control' },
  { id: 'regedit', name: '注册表编辑器', description: '编辑 Windows 注册表', icon: 'braces', command: 'regedit', elevated: true, category: 'advanced' },
  { id: 'taskmgr', name: '任务管理器', description: '查看进程和性能占用', icon: 'tasks', command: 'taskmgr', category: 'advanced' },
  { id: 'cmd', name: '命令提示符', description: '打开标准命令行窗口', icon: 'terminal', command: 'cmd', category: 'advanced' }
]

export class LauncherService {
  list(): SystemTool[] {
    return TOOL_CATALOG
  }

  async launch(toolId: string): Promise<void> {
    const tool = TOOL_CATALOG.find((item) => item.id === toolId)
    if (!tool) {
      throw new Error(`Unknown tool: ${toolId}`)
    }

    if (tool.command.startsWith('ms-settings:')) {
      await execFileAsync('cmd.exe', ['/c', 'start', '', tool.command], { windowsHide: true })
      return
    }

    if (tool.elevated) {
      if (tool.command.endsWith('.msc')) {
        await runElevatedPowerShell(
          `Start-Process -FilePath ${quoted(getSystem32Path('mmc.exe'))} -ArgumentList ${quoted(getSystem32Path(tool.command))}`
        )
        return
      }

      if (tool.command.endsWith('.cpl')) {
        await runElevatedPowerShell(
          `Start-Process -FilePath ${quoted(getSystem32Path('control.exe'))} -ArgumentList ${quoted(getSystem32Path(tool.command))}`
        )
        return
      }

      await runElevatedPowerShell(`Start-Process -FilePath ${quoted(tool.command)}`)
      return
    }

    if (tool.command.endsWith('.msc')) {
      await startDetached(getSystem32Path('mmc.exe'), [getSystem32Path(tool.command)])
      return
    }

    if (tool.command.endsWith('.cpl')) {
      await startDetached(getSystem32Path('control.exe'), [getSystem32Path(tool.command)])
      return
    }

    await execFileAsync('cmd.exe', ['/c', 'start', '', tool.command], { windowsHide: true })
  }
}

export const launcherService = new LauncherService()
