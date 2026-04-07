import sudoPrompt from 'sudo-prompt'
import { escapePowerShell } from './powershell'

function encodeScript(script: string): string {
  return Buffer.from(script, 'utf16le').toString('base64')
}

export async function runElevatedPowerShell(script: string): Promise<void> {
  const encoded = encodeScript(script)
  const command = `powershell.exe -NoProfile -ExecutionPolicy Bypass -EncodedCommand ${encoded}`

  await new Promise<void>((resolve, reject) => {
    sudoPrompt.exec(command, { name: 'Windows Quick Toolbox' }, (error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })
}

export function getUtf8Base64(content: string): string {
  return Buffer.from(content, 'utf8').toString('base64')
}

export function quoted(value: string): string {
  return `'${escapePowerShell(value)}'`
}
