import { ipcMain } from 'electron'
import { envVarService } from '../services/env-var.service'

export function registerEnvVarIpc(): void {
  ipcMain.handle('env-var:get-all', () => envVarService.getAll())
  ipcMain.handle('env-var:get-by-scope', (_event, scope) => envVarService.getByScope(scope))
  ipcMain.handle('env-var:set', (_event, scope, name, value) => envVarService.setVar(scope, name, value))
  ipcMain.handle('env-var:delete', (_event, scope, name) => envVarService.deleteVar(scope, name))
}
