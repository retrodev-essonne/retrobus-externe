# ⚡ TL;DR - Générer l'APK en 5 minutes

## 1. Installer Java + Android Studio (première fois seulement)

**Java 17+** → https://www.oracle.com/java/technologies/downloads/
**Android Studio** → https://developer.android.com/studio

Ajouter au PATH Windows :
```
ANDROID_HOME=C:\Users\[Vous]\AppData\Local\Android\Sdk
JAVA_HOME=C:\Program Files\Java\jdk-17.x.x
```

## 2. Vérifier la config (optionnel)

```powershell
cd C:\Dev\RETROBUS_ESSONNE\externe
powershell .\check-apk-setup.ps1
```

## 3. Générer APK Debug (pour tester)

```powershell
cd C:\Dev\RETROBUS_ESSONNE\externe
powershell .\build-apk-debug.ps1
```

**Résultat** : `.\android\app\build\outputs\apk\debug\app-debug.apk`

Installer sur téléphone :
```powershell
adb install .\android\app\build\outputs\apk\debug\app-debug.apk
```

## 4. Générer APK Release (production)

```powershell
cd C:\Dev\RETROBUS_ESSONNE\externe
powershell .\build-apk-release.ps1
```

**Résultat** : `.\android\app\build\outputs\apk\release\app-release-unsigned.apk`

Télécharger sur Google Play Store 📱

## ❓ J'ai une erreur ?

→ Lire `GUIDE_APK.md` (section Dépannage)
→ Vérifier variables d'environnement
→ Relancer `check-apk-setup.ps1`

## 📚 Pour plus de détails

- `GUIDE_APK.md` - Guide complet
- `STATUS_APK.md` - État actuel
- `APK_PROCESS.txt` - Diagramme

---

**C'est tout ! 🚀**
