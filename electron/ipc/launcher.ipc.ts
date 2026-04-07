import { ipcMain } from 'electron'
import { launcherService } from '../services/launcher.service'

export function registerLauncherIpc(): void {
  ipcMain.handle('launcher:list', () => launcherService.list())
  ipcMain.handle('launcher:open', (_event, toolId) => launcherService.launch(toolId))
}
