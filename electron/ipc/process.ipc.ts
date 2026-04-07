import { ipcMain } from 'electron'
import { processService } from '../services/process.service'

export function registerProcessIpc(): void {
  ipcMain.handle('process:list', () => processService.list())
  ipcMain.handle('process:kill', (_event, pid) => processService.kill(pid))
}
