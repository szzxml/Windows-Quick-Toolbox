import type { EnvScope, EnvVariable } from '@/types/models'
import { runElevatedPowerShell } from '../utils/elevated'
import { escapePowerShell, runPowerShellJson, runPowerShell } from '../utils/powershell'

const REGISTRY_PATHS: Record<EnvScope, string> = {
  user: 'HKCU:\\Environment',
  system: 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment'
}

function getScopeScript(scope: EnvScope): string {
  const path = REGISTRY_PATHS[scope]

  return `
$path = '${path}'
$item = Get-ItemProperty -Path $path
$key = Get-Item -Path $path
$result = foreach ($name in $key.Property | Sort-Object) {
  $kind = $key.GetValueKind($name).ToString()
  [PSCustomObject]@{
    name = $name
    value = [string]$item.$name
    scope = '${scope}'
    type = $kind
  }
}
$result | ConvertTo-Json -Depth 4
`.trim()
}

function getPropertyType(value: string): 'ExpandString' | 'String' {
  return /%[^%]+%/.test(value) ? 'ExpandString' : 'String'
}

export class EnvVarService {
  async getByScope(scope: EnvScope): Promise<EnvVariable[]> {
    const output = await runPowerShellJson<EnvVariable[] | EnvVariable>(getScopeScript(scope))
    if (Array.isArray(output)) {
      return output
    }

    return output ? [output] : []
  }

  async getAll(): Promise<EnvVariable[]> {
    const [user, system] = await Promise.all([this.getByScope('user'), this.getByScope('system')])
    return [...user, ...system].sort((left, right) => {
      if (left.scope !== right.scope) {
        return left.scope.localeCompare(right.scope)
      }

      return left.name.localeCompare(right.name)
    })
  }

  async setVar(scope: EnvScope, name: string, value: string): Promise<void> {
    const path = REGISTRY_PATHS[scope]
    const propertyType = getPropertyType(value)
    const script = `
$path = '${path}'
$name = '${escapePowerShell(name)}'
$value = '${escapePowerShell(value)}'
$type = '${propertyType}'
New-ItemProperty -Path $path -Name $name -Value $value -PropertyType $type -Force | Out-Null
`.trim()

    if (scope === 'system') {
      await runElevatedPowerShell(script)
    } else {
      await runPowerShell(script)
    }

    await this.broadcastSettingChange()
  }

  async deleteVar(scope: EnvScope, name: string): Promise<void> {
    const path = REGISTRY_PATHS[scope]
    const script = `
Remove-ItemProperty -Path '${path}' -Name '${escapePowerShell(name)}' -ErrorAction SilentlyContinue
`.trim()

    if (scope === 'system') {
      await runElevatedPowerShell(script)
    } else {
      await runPowerShell(script)
    }

    await this.broadcastSettingChange()
  }

  private async broadcastSettingChange(): Promise<void> {
    const script = `
Add-Type -Namespace Win32 -Name NativeMethods -MemberDefinition @"
[System.Runtime.InteropServices.DllImport("user32.dll", SetLastError=true, CharSet=System.Runtime.InteropServices.CharSet.Auto)]
public static extern System.IntPtr SendMessageTimeout(
  System.IntPtr hWnd,
  uint Msg,
  System.UIntPtr wParam,
  string lParam,
  uint fuFlags,
  uint uTimeout,
  out System.UIntPtr lpdwResult
);
"@
$result = [System.UIntPtr]::Zero
[Win32.NativeMethods]::SendMessageTimeout([System.IntPtr]0xffff, 0x1A, [System.UIntPtr]::Zero, 'Environment', 2, 5000, [ref]$result) | Out-Null
`.trim()

    await runPowerShell(script)
  }
}

export const envVarService = new EnvVarService()
