# 🤖 Установка Salanum на Android

## 🎯 Обзор

Данная инструкция поможет вам установить **Salanum** на Android устройства. Есть несколько способов установки в зависимости от ваших потребностей.

## 📋 Предварительные требования

### Для разработки:
- **Windows/macOS/Linux** с Node.js 18+
- **Android Studio** - [Скачать](https://developer.android.com/studio)
- **Java Development Kit (JDK) 11+** - [Скачать](https://adoptium.net/)
- **Android SDK** (устанавливается с Android Studio)
- **Git** - [Скачать](https://git-scm.com/)

### Для пользователя:
- **Android устройство** с Android 7.0 (API 24) или выше
- **USB кабель** для подключения к компьютеру
- **Включенная отладка по USB** (Developer Options)

## 🚀 Способы установки

### 1. Установка через Android Studio (рекомендуется для разработки)

#### Шаг 1: Подготовка проекта
```bash
# Клонирование проекта
git clone <repository-url>
cd salanum

# Установка зависимостей
npm install
cd mobile
npm install
```

#### Шаг 2: Установка Android зависимостей
```bash
# Установка Android зависимостей
cd android
./gradlew clean
cd ..
```

#### Шаг 3: Настройка Android Studio
1. **Откройте Android Studio**
2. **Выберите "Open an existing project"**
3. **Перейдите в папку `mobile/android`**
4. **Дождитесь синхронизации Gradle**

#### Шаг 4: Настройка устройства
1. **Включите Developer Options на Android:**
   - Перейдите в Настройки → О телефоне
   - Нажмите 7 раз на "Номер сборки"
   - Вернитесь в Настройки → Система → Для разработчиков

2. **Включите USB отладку:**
   - В разделе "Для разработчиков" включите "Отладка по USB"
   - Включите "Установка через USB"

3. **Подключите устройство:**
   - Подключите Android к компьютеру через USB
   - Разрешите отладку по USB на устройстве

#### Шаг 5: Запуск приложения
1. **В Android Studio:**
   - Выберите ваше устройство в списке
   - Нажмите кнопку "Run" (▶️) или `Shift + F10`

2. **Альтернативно через командную строку:**
   ```bash
   cd mobile
   npx react-native run-android
   ```

### 2. Установка через APK файл (для пользователей)

#### Шаг 1: Сборка APK
```bash
# Сборка debug APK
cd mobile/android
./gradlew assembleDebug

# APK файл будет в: mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

#### Шаг 2: Установка APK
1. **Скопируйте APK файл на Android устройство**
2. **Включите "Неизвестные источники":**
   - Настройки → Безопасность → Неизвестные источники
   - Или Настройки → Приложения → Специальный доступ → Установка неизвестных приложений

3. **Установите APK:**
   - Откройте файловый менеджер
   - Найдите APK файл
   - Нажмите на него и следуйте инструкциям

### 3. Установка через ADB (командная строка)

#### Шаг 1: Установка ADB
```bash
# Windows (через Chocolatey)
choco install adb

# macOS (через Homebrew)
brew install android-platform-tools

# Linux (Ubuntu/Debian)
sudo apt-get install android-tools-adb
```

#### Шаг 2: Подключение устройства
```bash
# Проверка подключенных устройств
adb devices

# Если устройство не обнаружено:
adb kill-server
adb start-server
adb devices
```

#### Шаг 3: Установка APK
```bash
# Установка APK
adb install mobile/android/app/build/outputs/apk/debug/app-debug.apk

# Или установка с перезаписью
adb install -r mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

## 🔧 Настройка разрешений

### Необходимые разрешения в AndroidManifest.xml:
```xml
<!-- Bluetooth -->
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

<!-- Камера -->
<uses-permission android:name="android.permission.CAMERA" />

<!-- Микрофон -->
<uses-permission android:name="android.permission.RECORD_AUDIO" />

<!-- Интернет -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- Хранилище -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

<!-- Биометрия -->
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.USE_FINGERPRINT" />
```

## 🧪 Тестирование на Android

### 1. Тестирование основных функций
```bash
# Запуск Metro bundler
cd mobile
npm start

# В новом терминале - запуск на Android
npm run android
```

### 2. Тестирование Bluetooth P2P
1. Установите приложение на два Android устройства
2. Откройте раздел "Bluetooth" в приложении
3. Найдите и подключитесь к другому устройству
4. Отправьте приложение через Bluetooth
5. Проверьте установку на принимающем устройстве

### 3. Тестирование Хранителя
1. Откройте приложение
2. Перейдите в настройки
3. Включите "Keeper Neural Security"
4. Предоставьте биометрические данные
5. Протестируйте шифрование сообщений

## 🐛 Решение проблем

### Проблема: "Device not found"
**Решение:**
1. Убедитесь, что USB отладка включена
2. Проверьте USB кабель
3. Перезапустите ADB:
   ```bash
   adb kill-server
   adb start-server
   ```

### Проблема: "Build failed"
**Решение:**
```bash
# Очистка проекта
cd mobile/android
./gradlew clean
./gradlew build

# Очистка кэша React Native
cd ..
npx react-native clean
```

### Проблема: "Permission denied"
**Решение:**
1. Проверьте разрешения в AndroidManifest.xml
2. Запросите разрешения в runtime
3. Проверьте настройки приложения на устройстве

### Проблема: "Metro bundler not starting"
**Решение:**
```bash
# Очистка кэша
cd mobile
npx react-native clean
npm start --reset-cache
```

### Проблема: "Gradle sync failed"
**Решение:**
1. Откройте Android Studio
2. File → Invalidate Caches and Restart
3. Дождитесь повторной синхронизации

## 📱 Особенности Android версии

### 1. Bluetooth ограничения
- Android 6.0+ требует разрешения на местоположение для Bluetooth
- BLE (Bluetooth Low Energy) поддерживается с Android 4.3+
- Bluetooth Classic доступен на всех версиях

### 2. Фоновые процессы
- Android 8.0+ ограничивает фоновые сервисы
- Используйте Foreground Service для важных задач
- Настройте Battery Optimization исключения

### 3. Безопасность
- Android Keystore для хранения ключей
- BiometricPrompt для биометрической аутентификации
- Scoped Storage для файлов

## 🔒 Настройка безопасности

### 1. Android Keystore
```javascript
// В коде приложения
import { NativeModules } from 'react-native';

// Сохранение ключей
NativeModules.KeychainModule.setItem('salanum_key', keyData);

// Получение ключей
const keyData = await NativeModules.KeychainModule.getItem('salanum_key');
```

### 2. Биометрическая аутентификация
```javascript
import TouchID from 'react-native-touch-id';

// Проверка доступности
TouchID.isSupported()
  .then(biometryType => {
    // Отпечаток пальца или Face ID доступны
  })
  .catch(error => {
    // Биометрия недоступна
  });
```

## 📊 Мониторинг и отладка

### 1. Логи через ADB
```bash
# Просмотр логов
adb logcat

# Фильтрация логов приложения
adb logcat | grep "Salanum"

# Очистка логов
adb logcat -c
```

### 2. React Native Debugger
```bash
# Установка
npm install -g react-native-debugger

# Запуск
react-native-debugger
```

### 3. Flipper
1. Скачайте Flipper Desktop
2. Установите на компьютер
3. Подключитесь к приложению на Android

## 🚀 Оптимизация для Google Play

### 1. Подготовка к публикации
```bash
# Сборка release APK
cd mobile/android
./gradlew assembleRelease

# APK файл будет в: mobile/android/app/build/outputs/apk/release/app-release.apk
```

### 2. Создание AAB (Android App Bundle)
```bash
# Сборка AAB
cd mobile/android
./gradlew bundleRelease

# AAB файл будет в: mobile/android/app/build/outputs/bundle/release/app-release.aab
```

### 3. Требования Google Play
- Уникальный Package Name
- Описание приложения
- Скриншоты для всех размеров экранов
- Политика конфиденциальности
- Возрастной рейтинг
- Цифровая подпись

### 4. Метаданные
- Название: "Salanum"
- Краткое описание: "Secure Messenger with Keeper"
- Полное описание: "Decentralized messenger with neural security"
- Ключевые слова: "messenger, security, blockchain, privacy"

## 📞 Поддержка

### Полезные команды:
```bash
# Очистка проекта
cd mobile
npx react-native clean

# Переустановка зависимостей
rm -rf node_modules
npm install
cd android && ./gradlew clean && cd ..

# Запуск на Android
npm run android

# Запуск на эмуляторе
npm run android --variant=debug
```

### Контакты:
- **GitHub Issues:** [Создать issue](https://github.com/your-repo/issues)
- **Email:** support@salanum.com
- **Discord:** [Discord Server](https://discord.gg/salanum)

---

**Salanum для Android** - Безопасная коммуникация на Android! 🤖🔒

*Следуйте инструкциям для успешной установки на Android*
