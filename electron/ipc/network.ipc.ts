import { ipcMain } from 'electron'
import { networkService } from '../services/network.service'

export function registerNetworkIpc(): void {
  ipcMain.handle('network:flush-dns', () => networkService.flushDns())
  ipcMain.handle('network:ip-config', () => networkService.getIpConfig())
}
