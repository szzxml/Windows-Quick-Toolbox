import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

function encodeScript(script: string): string {
  return Buffer.from(script, 'utf16le').toString('base64')
}

export function escapePowerShell(value: string): string {
  return value.replace(/'/g, "''")
}

export async function runPowerShell(script: string): Promise<string> {
  const { stdout } = await execFileAsync(
    'powershell.exe',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', encodeScript(script)],
    {
      windowsHide: true,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 16
    }
  )

  return stdout.trim()
}

export async function runPowerShellJson<T>(script: string): Promise<T> {
  const output = await runPowerShell(script)
  if (!output) {
    return [] as T
  }

  return JSON.parse(output) as T
}
