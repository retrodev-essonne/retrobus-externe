#!/usr/bin/env powershell
# Script pour vérifier la configuration APK

Write-Host "🔍 Vérification de la configuration APK/Android" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

$allGood = $true
$details = @()

# Vérifier Node.js
Write-Host "`n📌 Node.js & NPM" -ForegroundColor Yellow
try {
    $nodeVersion = & node --version 2>&1
    $npmVersion = & npm --version 2>&1
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js/npm NON TROUVÉ" -ForegroundColor Red
    Write-Host "   Télécharger depuis : https://nodejs.org/" -ForegroundColor Gray
    $allGood = $false
}

# Vérifier Java
Write-Host "`n📌 Java (JDK)" -ForegroundColor Yellow
try {
    $javaVersion = & java -version 2>&1 | Select-Object -First 1
    Write-Host "✅ Java: $javaVersion" -ForegroundColor Green
    
    # Vérifier la version
    if ($javaVersion -match "11|17|21") {
        Write-Host "   ✅ Version compatible" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Version non optimale (recommandé: 17+)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Java NON TROUVÉ" -ForegroundColor Red
    Write-Host "   Télécharger depuis : https://www.oracle.com/java/technologies/downloads/" -ForegroundColor Gray
    Write-Host "   Ou via Chocolatey : choco install openjdk17" -ForegroundColor Gray
    $allGood = $false
}

# Vérifier Gradle
Write-Host "`n📌 Gradle" -ForegroundColor Yellow
$gradleExe = if ($PSVersionTable.Platform -eq "Win32NT") { 
    ".\android\gradlew.bat" 
} else { 
    "./android/gradlew" 
}

if (Test-Path $gradleExe) {
    Write-Host "✅ Gradle (local): Trouvé dans android/" -ForegroundColor Green
} else {
    try {
        $gradleVersion = & gradle --version 2>&1 | Select-Object -First 1
        Write-Host "✅ Gradle (global): $gradleVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Gradle NON TROUVÉ" -ForegroundColor Red
        Write-Host "   Sera téléchargé automatiquement lors du premier build" -ForegroundColor Gray
        Write-Host "   Ou installer : choco install gradle" -ForegroundColor Gray
    }
}

# Vérifier Android SDK
Write-Host "`n📌 Android SDK" -ForegroundColor Yellow
$androidHome = $env:ANDROID_HOME
if (-not $androidHome) {
    Write-Host "❌ ANDROID_HOME NON CONFIGURÉ" -ForegroundColor Red
    Write-Host "   Ajouter la variable d'environnement :" -ForegroundColor Gray
    Write-Host "   ANDROID_HOME = C:\Users\[User]\AppData\Local\Android\Sdk" -ForegroundColor Gray
    $allGood = $false
} else {
    Write-Host "✅ ANDROID_HOME: $androidHome" -ForegroundColor Green
    
    # Vérifier si les outils existent
    if (Test-Path "$androidHome\platform-tools\adb.exe") {
        Write-Host "✅ ADB (Android Debug Bridge): Trouvé" -ForegroundColor Green
    } else {
        Write-Host "⚠️  ADB non trouvé - sera nécessaire pour installer sur appareil" -ForegroundColor Yellow
    }
}

# Vérifier Java Home
Write-Host "`n📌 JAVA_HOME" -ForegroundColor Yellow
$javaHome = $env:JAVA_HOME
if (-not $javaHome) {
    Write-Host "❌ JAVA_HOME NON CONFIGURÉ" -ForegroundColor Red
    Write-Host "   Ajouter la variable d'environnement :" -ForegroundColor Gray
    Write-Host "   JAVA_HOME = C:\Program Files\Java\jdk-17.x.x" -ForegroundColor Gray
    $allGood = $false
} else {
    Write-Host "✅ JAVA_HOME: $javaHome" -ForegroundColor Green
}

# Vérifier les fichiers Capacitor
Write-Host "`n📌 Configuration Capacitor" -ForegroundColor Yellow
if (Test-Path ".\capacitor.config.ts") {
    Write-Host "✅ capacitor.config.ts: Trouvé" -ForegroundColor Green
} else {
    Write-Host "❌ capacitor.config.ts: MANQUANT" -ForegroundColor Red
    $allGood = $false
}

if (Test-Path ".\android") {
    Write-Host "✅ Dossier android/: Créé" -ForegroundColor Green
} else {
    Write-Host "⚠️  Dossier android/ non créé - sera créé au premier build" -ForegroundColor Yellow
}

# Vérifier les dépendances npm
Write-Host "`n📌 Dépendances NPM" -ForegroundColor Yellow
$packageJson = Get-Content package.json | ConvertFrom-Json
if ($packageJson.dependencies.'@capacitor/core') {
    Write-Host "✅ @capacitor/core: Installé" -ForegroundColor Green
} else {
    Write-Host "❌ Capacitor NPM packages NON INSTALLÉS" -ForegroundColor Red
    Write-Host "   Exécuter : npm install" -ForegroundColor Gray
    $allGood = $false
}

# Résumé
Write-Host "`n" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "✨ TOUT EST CONFIGURÉ ! ✨" -ForegroundColor Green
    Write-Host "`n🚀 Vous pouvez maintenant générer l'APK :" -ForegroundColor Green
    Write-Host "   • Debug  : .\build-apk-debug.ps1" -ForegroundColor Cyan
    Write-Host "   • Release: .\build-apk-release.ps1" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  CONFIGURATION INCOMPLÈTE" -ForegroundColor Red
    Write-Host "`n📖 Consultez GUIDE_APK.md pour l'installation des prérequis" -ForegroundColor Yellow
}

Write-Host "`n📚 Pour plus de détails :" -ForegroundColor Gray
Write-Host "   • GUIDE_APK.md      - Guide complet" -ForegroundColor Gray
Write-Host "   • APK_README.md     - Démarrage rapide" -ForegroundColor Gray
Write-Host "   • build-apk-*.ps1   - Scripts automation" -ForegroundColor Gray
