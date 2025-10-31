#!/usr/bin/env powershell
# Script pour builder l'APK Debug rapidement

Write-Host "🚀 Génération de l'APK Debug (RétroBus Essonne)" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Vérifier les prérequis
Write-Host "`n📋 Vérification des prérequis..." -ForegroundColor Yellow

$checks = @{
    "Node.js" = { node --version }
    "npm" = { npm --version }
    "Java" = { java -version 2>&1 | Select-Object -First 1 }
    "Gradle" = { gradle --version 2>&1 | Select-Object -First 1 }
}

foreach ($check in $checks.GetEnumerator()) {
    try {
        $result = & $check.Value 2>&1
        Write-Host "✅ $($check.Key): $($result | Select-Object -First 1)" -ForegroundColor Green
    } catch {
        Write-Host "❌ $($check.Key) : NON TROUVÉ" -ForegroundColor Red
        Write-Host "   Veuillez installer les prérequis selon GUIDE_APK.md" -ForegroundColor Red
        exit 1
    }
}

# Étapes du build
Write-Host "`n📦 Début du processus de build..." -ForegroundColor Cyan

# 1. Build web
Write-Host "`n1️⃣ Building le site web..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build web" -ForegroundColor Red
    exit 1
}

# 2. Sync avec Android
Write-Host "`n2️⃣ Synchronisation avec Android..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la sync Capacitor" -ForegroundColor Red
    exit 1
}

# 3. Build APK Debug
Write-Host "`n3️⃣ Building l'APK Debug..." -ForegroundColor Yellow
cd android
./gradlew assembleDebug
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build Gradle" -ForegroundColor Red
    cd ..
    exit 1
}
cd ..

# Résultats
$apkPath = ".\android\app\build\outputs\apk\debug\app-debug.apk"
$apkSize = (Get-Item $apkPath).Length / 1MB

Write-Host "`n" -ForegroundColor Green
Write-Host "✅ APK Debug généré avec succès !" -ForegroundColor Green
Write-Host "📍 Localisation : $apkPath" -ForegroundColor Cyan
Write-Host "📏 Taille : $([Math]::Round($apkSize, 2)) MB" -ForegroundColor Cyan

Write-Host "`n💡 Prochaines étapes :" -ForegroundColor Yellow
Write-Host "   • Installer sur appareil : adb install '$apkPath'" -ForegroundColor Gray
Write-Host "   • Tester l'application" -ForegroundColor Gray
Write-Host "   • Pour la version Release, exécuter : .\build-apk-release.ps1" -ForegroundColor Gray

Write-Host "`n✨ Terminé !" -ForegroundColor Green
