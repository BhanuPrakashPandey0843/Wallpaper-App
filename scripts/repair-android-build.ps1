$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$androidDir = Join-Path $projectRoot "android"
$localGradleHome = Join-Path $projectRoot ".gradle-local"
$globalGradleCache = "$env:USERPROFILE\.gradle\caches\9.0.0"

Write-Host "Stopping Java/Gradle processes..." -ForegroundColor Cyan
Get-Process java, javaw, gradle -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "Cleaning project local Gradle caches..." -ForegroundColor Cyan
if (Test-Path $localGradleHome) {
  Remove-Item $localGradleHome -Recurse -Force -ErrorAction SilentlyContinue
}
if (Test-Path (Join-Path $androidDir ".gradle")) {
  Remove-Item (Join-Path $androidDir ".gradle") -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "Cleaning global Gradle 9 cache..." -ForegroundColor Cyan
if (Test-Path $globalGradleCache) {
  Remove-Item $globalGradleCache -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "Setting project-local GRADLE_USER_HOME..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $localGradleHome | Out-Null
$env:GRADLE_USER_HOME = $localGradleHome

Write-Host "Running expo prebuild..." -ForegroundColor Cyan
Push-Location $projectRoot
npx expo prebuild

Write-Host "Running expo run:android with repaired cache..." -ForegroundColor Cyan
npx expo run:android
Pop-Location

Write-Host "Android build repair flow completed." -ForegroundColor Green
