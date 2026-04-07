$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$projectRoot = Split-Path -Parent $PSScriptRoot
$packageJsonPath = Join-Path $projectRoot 'package.json'
$packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
$version = [string]$packageJson.version

$releaseDir = Join-Path $projectRoot 'release'
$stageDir = Join-Path $releaseDir 'iexpress-stage'
$appDir = Join-Path $releaseDir 'win-unpacked'
$zipName = "Windows-Quick-Toolbox-$version-portable.zip"
$zipPath = Join-Path $stageDir $zipName
$installScriptName = 'install-release.ps1'
$installScriptPath = Join-Path $stageDir $installScriptName
$sedPath = Join-Path $stageDir 'windows-quick-toolbox-release.sed'
$artifactPath = Join-Path $releaseDir "Windows-Quick-Toolbox-v$version.exe"

Push-Location $projectRoot
try {
  npm run build
  npx electron-builder --dir --win --x64
} finally {
  Pop-Location
}

if (-not (Test-Path $appDir)) {
  throw "Missing unpacked app directory: $appDir"
}

if (Test-Path $stageDir) {
  Remove-Item $stageDir -Recurse -Force
}

New-Item -ItemType Directory -Path $stageDir | Out-Null
Compress-Archive -Path (Join-Path $appDir '*') -DestinationPath $zipPath -Force

$installScript = @"
`$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

`$version = '$version'
`$zipName = '$zipName'
`$packageDir = Split-Path -Parent `$MyInvocation.MyCommand.Path
`$zipPath = Join-Path `$packageDir `$zipName
`$baseDir = Join-Path `$env:LOCALAPPDATA 'Programs\Windows Quick Toolbox'
`$targetDir = Join-Path `$baseDir "app-`$version"
`$exePath = Join-Path `$targetDir 'Windows Quick Toolbox.exe'

if (Test-Path `$targetDir) {
  Remove-Item `$targetDir -Recurse -Force
}

New-Item -ItemType Directory -Path `$baseDir -Force | Out-Null
Expand-Archive -LiteralPath `$zipPath -DestinationPath `$targetDir -Force
Start-Process -FilePath `$exePath | Out-Null
"@

Set-Content -Path $installScriptPath -Value $installScript -Encoding UTF8

$sed = @"
[Version]
Class=IEXPRESS
SEDVersion=3
[Options]
PackagePurpose=InstallApp
ShowInstallProgramWindow=0
HideExtractAnimation=1
UseLongFileName=1
InsideCompressed=0
CAB_FixedSize=0
CAB_ResvCodeSigning=0
RebootMode=N
InstallPrompt=%InstallPrompt%
DisplayLicense=%DisplayLicense%
FinishMessage=%FinishMessage%
TargetName=%TargetName%
FriendlyName=%FriendlyName%
AppLaunched=%AppLaunched%
PostInstallCmd=%PostInstallCmd%
AdminQuietInstCmd=%AdminQuietInstCmd%
UserQuietInstCmd=%UserQuietInstCmd%
SourceFiles=SourceFiles
[Strings]
InstallPrompt=
DisplayLicense=
FinishMessage=
TargetName=$artifactPath
FriendlyName=Windows Quick Toolbox v$version
AppLaunched=powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File $installScriptName
PostInstallCmd=<None>
AdminQuietInstCmd=
UserQuietInstCmd=
FILE0="$zipName"
FILE1="$installScriptName"
[SourceFiles]
SourceFiles0=$stageDir\
[SourceFiles0]
%FILE0%=
%FILE1%=
"@

Set-Content -Path $sedPath -Value $sed -Encoding ASCII

$iexpressPath = Join-Path $env:WINDIR 'System32\iexpress.exe'
& $iexpressPath /N $sedPath | Out-Null

if (-not (Test-Path $artifactPath)) {
  throw "IExpress artifact was not created: $artifactPath"
}

Write-Host "Created offline release artifact: $artifactPath"
