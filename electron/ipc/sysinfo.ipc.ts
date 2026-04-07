import { ipcMain } from 'electron'
import { sysInfoService } from '../services/sysinfo.service'

export function registerSysInfoIpc(): void {
  ipcMain.handle('sysinfo:get', () => sysInfoService.getSnapshot())
}
