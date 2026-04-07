import { readFile } from 'node:fs/promises'
import { getUtf8Base64, runElevatedPowerShell } from '../utils/elevated'

const HOSTS_PATH = 'C:\\Windows\\System32\\drivers\\etc\\hosts'

export class HostsService {
  async read(): Promise<string> {
    return readFile(HOSTS_PATH, 'utf8')
  }

  async write(content: string): Promise<void> {
    const payload = getUtf8Base64(content)
    const script = `
$content = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${payload}'))
$encoding = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText('${HOSTS_PATH}', $content, $encoding)
`.trim()

    await runElevatedPowerShell(script)
  }
}

export const hostsService = new HostsService()
