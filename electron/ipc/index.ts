import { registerCleanerIpc } from './cleaner.ipc'
import { registerEnvVarIpc } from './env-var.ipc'
import { registerHostsIpc } from './hosts.ipc'
import { registerLauncherIpc } from './launcher.ipc'
import { registerNetworkIpc } from './network.ipc'
import { registerProcessIpc } from './process.ipc'
import { registerSearchIpc } from './search.ipc'
import { registerSysInfoIpc } from './sysinfo.ipc'
import { registerWindowIpc } from './window.ipc'

export function registerAllIpc(): void {
  registerEnvVarIpc()
  registerLauncherIpc()
  registerHostsIpc()
  registerSysInfoIpc()
  registerCleanerIpc()
  registerProcessIpc()
  registerNetworkIpc()
  registerSearchIpc()
  registerWindowIpc()
}
