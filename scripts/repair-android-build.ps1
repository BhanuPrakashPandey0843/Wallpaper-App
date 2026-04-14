$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$androidDir = Join-Path $projectRoot "android"
$localGradleHome = "D:\.g9-ff"
$globalGradleCache = "$env:USERPROFILE\.gradle\caches\9.0.0"

# 0. Deep Clean Native
Write-Host "Cleaning native directories..." -ForegroundColor Cyan
Remove-Item -Path "android" -Recurse -Force -ErrorAction SilentlyContinue

# 1. Stop Gradle
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

# 3.5 Re-install Native Modules
Write-Host "Ensuring native modules are installed correctly..." -ForegroundColor Cyan
npx expo install expo-secure-store expo-linking expo-constants expo-crypto react-native-safe-area-context --non-interactive

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
