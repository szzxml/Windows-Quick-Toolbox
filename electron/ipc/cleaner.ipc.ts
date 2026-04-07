import { ipcMain } from 'electron'
import { cleanerService } from '../services/cleaner.service'

export function registerCleanerIpc(): void {
  ipcMain.handle('cleaner:scan', () => cleanerService.scan())
  ipcMain.handle('cleaner:clean', (_event, paths) => cleanerService.clean(paths))
}
