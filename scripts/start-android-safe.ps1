$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$localGradleHome = Join-Path $projectRoot ".gradle-local"

New-Item -ItemType Directory -Force -Path $localGradleHome | Out-Null
$env:GRADLE_USER_HOME = $localGradleHome

Push-Location $projectRoot
Write-Host "Starting Expo with local GRADLE_USER_HOME..." -ForegroundColor Cyan
npx expo start --dev-client
Pop-Location
