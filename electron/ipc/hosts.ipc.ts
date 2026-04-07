import { ipcMain } from 'electron'
import { hostsService } from '../services/hosts.service'

export function registerHostsIpc(): void {
  ipcMain.handle('hosts:read', () => hostsService.read())
  ipcMain.handle('hosts:write', (_event, content) => hostsService.write(content))
}
