# 📱 Guide de Génération de l'APK RétroBus Essonne

## Prérequis à installer

### 1. **Java Development Kit (JDK 17+)**
- Télécharger depuis : https://www.oracle.com/java/technologies/downloads/
- Ou installer via Chocolatey :
  ```powershell
  choco install openjdk17
  ```

### 2. **Android Studio + Android SDK**
- Télécharger depuis : https://developer.android.com/studio
- Lors de l'installation, cocher les options :
  - Android SDK Build Tools 34.0.0+
  - Android SDK Platform 34+
  - NDK (optional)
  - Emulator (optional)

### 3. **Gradle (inclus avec Android Studio)**
- Ou installer via : `choco install gradle`

### 4. **Android SDK Path**
Après installation, ajouter les variables d'environnement :
```
ANDROID_HOME = C:\Users\[VotreUtilisateur]\AppData\Local\Android\Sdk
JAVA_HOME = C:\Program Files\Java\jdk-17.x.x (selon votre installation)
```

Ajouter au PATH :
```
%ANDROID_HOME%\tools
%ANDROID_HOME%\platform-tools
%JAVA_HOME%\bin
```

## 🚀 Générer l'APK

Une fois tous les prérequis installés :

```powershell
# 1. Se positionner dans le répertoire
cd C:\Dev\RETROBUS_ESSONNE\externe

# 2. Builder le site web
npm run build

# 3. Synchroniser avec Android
npx cap sync android

# 4. Ouvrir Android Studio pour compiler l'APK
npx cap open android

# Ou directement via Gradle (en ligne de commande) :
cd android
./gradlew build
# ou pour Release APK :
./gradlew assembleRelease
```

## 📦 Options de Build

### Debug APK (rapide, pour tests)
```powershell
cd C:\Dev\RETROBUS_ESSONNE\externe\android
./gradlew assembleDebug
```
**Résultat** : `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK (signé, pour production)
```powershell
cd C:\Dev\RETROBUS_ESSONNE\externe\android
./gradlew assembleRelease
```
**Résultat** : `android/app/build/outputs/apk/release/app-release-unsigned.apk`

### Bundle Android App (pour Google Play Store)
```powershell
cd C:\Dev\RETROBUS_ESSONNE\externe\android
./gradlew bundleRelease
```
**Résultat** : `android/app/build/outputs/bundle/release/app-release.aab`

## 🔐 Signer l'APK Release

Pour pouvoir publier sur le Google Play Store, il faut signer l'APK :

### 1. Créer une clé de signature (une seule fois) :
```powershell
keytool -genkey -v -keystore retrobus-essonne.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias retrobus_key
```

### 2. Configurer la signature dans `android/app/build.gradle.kts`

Ajouter après `android { }` :
```kotlin
android {
    // ... existing config ...
    
    signingConfigs {
        create("release") {
            storeFile = file("../retrobus-essonne.keystore")
            storePassword = "votre_mot_de_passe"
            keyAlias = "retrobus_key"
            keyPassword = "votre_mot_de_passe"
        }
    }
    
    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}
```

### 3. Builder l'APK signé :
```powershell
cd C:\Dev\RETROBUS_ESSONNE\externe\android
./gradlew assembleRelease
```

## 📥 Installer sur un appareil Android

### Via USB (mode Debug)
```powershell
# Connecter le téléphone en USB avec "Débogage USB" activé
adb install C:\Dev\RETROBUS_ESSONNE\externe\android\app\build\outputs\apk\debug\app-debug.apk
```

### Via Android Studio Emulator
- Ouvrir Android Studio
- Créer/démarrer un emulator
- Build & Run dans Android Studio

## ✨ Fichiers générés automatiquement

```
externe/
├── android/                          # Projet Android Gradle
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml   # Configuration Android
│   │   │   ├── java/                 # Code Java Capacitor
│   │   │   └── assets/public/        # Fichiers web (dist/)
│   │   └── build/outputs/apk/        # 📦 APK GÉNÉRÉS ICI
│   └── build.gradle.kts              # Configuration Gradle
├── capacitor.config.ts               # Configuration Capacitor ✅
└── package.json                      # (npm packages avec Capacitor)
```

## 🎨 Personnaliser l'app

### Icône et Splash Screen
Les fichiers se trouvent dans :
```
android/app/src/main/res/
├── drawable/                         # Icônes
├── drawable-xxxhdpi/
├── mipmap-xxxhdpi/
└── values/
    └── strings.xml                   # Nom de l'app
```

### Changer le nom de l'app
Éditer `android/app/src/main/AndroidManifest.xml` :
```xml
<application
    android:label="@string/app_name"
    ...>
```

Et mettre à jour `android/app/src/main/res/values/strings.xml` :
```xml
<resources>
    <string name="app_name">RétroBus Essonne</string>
</resources>
```

## 🐛 Dépannage

### Error: Unable to find gradle
```powershell
# Ajouter le PATH du SDK Android
$env:ANDROID_HOME = "C:\Users\[VotreUtilisateur]\AppData\Local\Android\Sdk"
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17.x.x"
```

### Error: Minimum SDK version
Éditer `android/variables.gradle` et augmenter `minSdkVersion` si nécessaire

### APK trop volumineux
Activez la minification et l'obfuscation (voir section "Signer l'APK Release")

## 📱 Publier sur Google Play Store

1. Créer un compte Google Play Developer ($25, une fois)
2. Générer un APK signé (voir ci-dessus)
3. Charger l'APK dans Google Play Console
4. Remplir les informations de l'app et soumettre pour review

## 📞 Support et Documentation

- Capacitor : https://capacitorjs.com/docs
- Android Studio : https://developer.android.com/docs
- Google Play Console : https://play.google.com/console

---

**Généré automatiquement pour : RétroBus Essonne**
**Date : 2025-10-31**
