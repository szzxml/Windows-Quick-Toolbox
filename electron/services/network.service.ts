import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export class NetworkService {
  async flushDns(): Promise<string> {
    const { stdout } = await execFileAsync('ipconfig.exe', ['/flushdns'], {
      windowsHide: true,
      encoding: 'utf8'
    })
    return stdout.trim()
  }

  async getIpConfig(): Promise<string> {
    const { stdout } = await execFileAsync('ipconfig.exe', ['/all'], {
      windowsHide: true,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 8
    })
    return stdout.trim()
  }
}

export const networkService = new NetworkService()
