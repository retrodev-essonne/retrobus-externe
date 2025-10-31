# 📱 APK Android - RétroBus Essonne

## ⚡ Démarrage rapide

### 1. **Installer les prérequis**
- **Java 17+** : https://www.oracle.com/java/technologies/downloads/
- **Android Studio** : https://developer.android.com/studio
- **Variables d'environnement** : Lire `GUIDE_APK.md`

### 2. **Générer l'APK Debug** (pour tester)
```powershell
.\build-apk-debug.ps1
```
**Résultat** : `.\android\app\build\outputs\apk\debug\app-debug.apk`

### 3. **Générer l'APK Release** (pour production)
```powershell
.\build-apk-release.ps1
```
**Résultat** : `.\android\app\build\outputs\apk\release\app-release-unsigned.apk`

## 📂 Structure

```
externe/
├── capacitor.config.ts          ✨ Configuration Capacitor
├── GUIDE_APK.md                 📖 Guide complet
├── build-apk-debug.ps1          🔧 Script build Debug
├── build-apk-release.ps1        🔧 Script build Release
├── dist/                         📦 Web build (généré par npm run build)
├── android/                      🤖 Projet Android (généré par capacitor)
├── src/                          💻 Code source web
├── package.json
└── ...
```

## 🚀 Processus de Build

```
1. npm run build        → Génère dist/
2. npx cap sync android → Copie dist/ dans android/
3. ./gradlew assembleDebug/Release → Génère l'APK
```

**Les scripts PowerShell automatisent tout cela !**

## 📥 Installer sur un téléphone

### Appareil avec USB
```powershell
adb install .\android\app\build\outputs\apk\debug\app-debug.apk
```

### Emulator Android Studio
- Créer un émulateur virtuel
- Lancer le build depuis Android Studio

## 🎨 Personnaliser

- **Icône app** : `android/app/src/main/res/mipmap-*/ic_launcher.png`
- **Nom app** : `android/app/src/main/res/values/strings.xml`
- **Couleurs** : `android/app/src/main/res/values/colors.xml`

## 🌐 Plus de détails

Consultez **`GUIDE_APK.md`** pour :
- Configuration avancée
- Signature pour Google Play
- Dépannage
- Publication

## ✅ État

- ✅ Capacitor installé
- ✅ Android configuré
- ✅ Web buildable
- ⏳ À faire : installer Java + Android SDK

---

**Prochaine étape** : Installer Java 17 et Android Studio, puis exécuter les scripts !
