# 📱 Solana Messenger Mobile - Настройка и запуск

## 🎯 Обзор проекта

Создано полнофункциональное мобильное приложение **Solana Messenger** с уникальной возможностью **Bluetooth P2P передачи** приложения между устройствами. Это позволяет распространять приложение без централизованных серверов и магазинов приложений.

## 🚀 Ключевые особенности

### 📶 Bluetooth P2P передача
- **Прямая передача APK/IPA** файлов через Bluetooth
- **Mesh networking** для создания сетей устройств
- **Автоматическое обнаружение** ближайших устройств
- **Шифрованная передача** данных

### 🔐 Безопасность и приватность
- **End-to-end шифрование** всех сообщений
- **AI маскировка** чувствительной информации в реальном времени
- **Локальное хранение** ключей шифрования
- **Биометрическая аутентификация**

### 💰 Криптовалюта
- **Solana блокчейн** интеграция
- **Встроенный кошелек** для каждой учетной записи
- **P2P транзакции** между пользователями
- **QR коды** для быстрых переводов

## 🛠 Технологический стек

### Frontend (React Native)
- **React Native 0.72.6** - кроссплатформенная разработка
- **React Navigation** - навигация между экранами
- **Styled Components** - стилизация компонентов
- **Vector Icons** - иконки Material Design

### Bluetooth интеграция
- **react-native-bluetooth-classic** - Bluetooth Classic
- **react-native-ble-manager** - Bluetooth Low Energy
- **react-native-ble-plx** - BLE управление
- **Custom mesh networking** - создание mesh сетей

### Безопасность
- **react-native-crypto-js** - шифрование
- **react-native-keychain** - безопасное хранение ключей
- **react-native-biometrics** - биометрическая аутентификация
- **Custom AI service** - маскировка сообщений

## 📦 Установка и настройка

### Предварительные требования

#### Для Android разработки:
- **Node.js 18+**
- **Java 11+**
- **Android Studio**
- **Android SDK API 33+**
- **Android Emulator** или физическое устройство

#### Для iOS разработки:
- **macOS** (обязательно)
- **Xcode 14+**
- **iOS Simulator** или физическое устройство
- **CocoaPods**

### 1. Клонирование и установка
```bash
# Переход в папку mobile
cd mobile

# Установка зависимостей
npm install

# Установка iOS зависимостей (только на macOS)
cd ios
pod install
cd ..
```

### 2. Настройка Android

#### Android Studio настройка:
1. Откройте Android Studio
2. Установите Android SDK API 33
3. Создайте Android Virtual Device (AVD)
4. Включите USB Debugging на устройстве

#### Запуск на Android:
```bash
# Запуск Metro bundler
npm start

# В новом терминале - запуск на Android
npm run android
```

### 3. Настройка iOS

#### Xcode настройка:
1. Откройте `ios/SolanaMessenger.xcworkspace` в Xcode
2. Выберите команду разработки
3. Настройте Bundle Identifier
4. Подключите устройство или выберите симулятор

#### Запуск на iOS:
```bash
# Запуск Metro bundler
npm start

# В новом терминале - запуск на iOS
npm run ios
```

## 📱 Структура приложения

### Основные экраны:
- **SplashScreen** - загрузочный экран
- **LoginScreen** - вход в приложение
- **RegisterScreen** - регистрация
- **HomeScreen** - главная страница
- **ChatScreen** - мессенджер
- **BluetoothScreen** - управление Bluetooth
- **ShareAppScreen** - передача приложения
- **WalletScreen** - криптокошелек
- **SettingsScreen** - настройки

### Сервисы:
- **BluetoothService** - управление Bluetooth соединениями
- **MeshService** - создание mesh сетей
- **CryptoService** - шифрование данных
- **SolanaService** - блокчейн интеграция
- **AIService** - маскировка сообщений

## 🔄 Bluetooth P2P передача

### Как это работает:

1. **Обнаружение устройств**
   - Сканирование Bluetooth устройств в радиусе действия
   - Фильтрация устройств с установленным приложением
   - Отображение доступных для подключения устройств

2. **Установка соединения**
   - Подключение к выбранному устройству
   - Аутентификация и обмен ключами
   - Установка зашифрованного канала связи

3. **Передача приложения**
   - Упаковка APK/IPA файла
   - Разбиение на части для передачи
   - Отправка через Bluetooth с проверкой целостности
   - Автоматическая установка на принимающем устройстве

4. **Mesh сеть**
   - Создание сети при подключении 2+ устройств
   - Ретрансляция сообщений через промежуточные узлы
   - Автоматическое восстановление при отключении узлов

### Пример использования:
```javascript
// Поиск устройств
await bluetoothService.startDiscovery();

// Подключение к устройству
await bluetoothService.connectToDevice(deviceId);

// Передача приложения
await bluetoothService.sendAppData(deviceId, appPackage);

// Создание mesh сети
await bluetoothService.createMeshNetwork();
```

## 🛡 Безопасность

### Шифрование:
- **AES-256-GCM** для шифрования сообщений
- **RSA-2048** для обмена ключами
- **SHA-256** для хеширования данных
- **PBKDF2** для деривации ключей из паролей

### AI маскировка:
- **OpenAI GPT-3.5** для анализа и маскировки
- **Множественные стратегии** маскировки
- **Fallback механизмы** при недоступности AI
- **Локальная обработка** для максимальной приватности

### Аутентификация:
- **JWT токены** для сессий
- **Биометрические данные** (Face ID, Touch ID, Fingerprint)
- **2FA** через SMS/Email
- **Recovery фразы** для восстановления доступа

## 📊 Разрешения

### Android (AndroidManifest.xml):
```xml
<!-- Bluetooth -->
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />

<!-- Location (требуется для Bluetooth сканирования) -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

<!-- Camera -->
<uses-permission android:name="android.permission.CAMERA" />

<!-- Audio -->
<uses-permission android:name="android.permission.RECORD_AUDIO" />

<!-- Storage -->
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### iOS (Info.plist):
```xml
<!-- Bluetooth -->
<key>NSBluetoothAlwaysUsageDescription</key>
<string>Solana Messenger использует Bluetooth для P2P передачи</string>

<!-- Camera -->
<key>NSCameraUsageDescription</key>
<string>Камера используется для QR кодов</string>

<!-- Microphone -->
<key>NSMicrophoneUsageDescription</key>
<string>Микрофон для голосовых сообщений</string>

<!-- Location -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>Местоположение для Bluetooth сканирования</string>
```

## 🚀 Сборка для продакшена

### Android:
```bash
# Сборка APK
cd android
./gradlew assembleRelease

# Сборка AAB (Google Play)
./gradlew bundleRelease
```

### iOS:
```bash
# Сборка в Xcode
# 1. Откройте ios/SolanaMessenger.xcworkspace
# 2. Выберите Generic iOS Device
# 3. Product -> Archive
# 4. Upload to App Store Connect
```

## 📱 Тестирование

### На эмуляторах:
- **Android Emulator** - полная функциональность
- **iOS Simulator** - ограниченный Bluetooth

### На физических устройствах:
- **Android** - полная функциональность Bluetooth
- **iOS** - полная функциональность Bluetooth
- **Тестирование P2P** - требует минимум 2 устройства

### Тестовые сценарии:
1. **Поиск и подключение** к Bluetooth устройствам
2. **Передача приложения** между устройствами
3. **Создание mesh сети** из 3+ устройств
4. **Отправка сообщений** через mesh сеть
5. **Криптовалютные транзакции** между пользователями

## 🔧 Отладка

### React Native Debugger:
```bash
# Установка
npm install -g react-native-debugger

# Запуск
react-native-debugger
```

### Flipper:
```bash
# Установка Flipper Desktop
# https://fbflipper.com/

# Подключение к приложению
# Автоматически при запуске приложения
```

### Логи:
```bash
# Android logs
adb logcat

# iOS logs
# Используйте Xcode Console
```

## 📈 Производительность

### Оптимизации:
- **Lazy loading** компонентов
- **Image optimization** для изображений
- **Memory management** для Bluetooth соединений
- **Battery optimization** для фоновых процессов

### Мониторинг:
- **Flipper** для отладки
- **React Native Performance** для метрик
- **Custom analytics** для пользовательских событий

## 🚀 Развертывание

### Прямое распространение:
1. **Сборка APK/IPA** файлов
2. **Передача через Bluetooth** первым пользователям
3. **Mesh распространение** через сеть устройств
4. **QR коды** для скачивания

### Магазины приложений:
1. **Google Play Store** - стандартная публикация
2. **Apple App Store** - стандартная публикация
3. **Enterprise distribution** - корпоративное распространение

## 🎯 Уникальные преимущества

### 1. **Полная децентрализация**
- Нет зависимости от централизованных серверов
- Работа в офлайн режиме
- Mesh networking для связи

### 2. **Максимальная приватность**
- AI маскировка сообщений
- Локальное хранение данных
- End-to-end шифрование

### 3. **Инновационная передача**
- Bluetooth P2P передача приложения
- Автоматическое распространение через mesh
- Обход цензуры и блокировок

### 4. **Криптовалютная интеграция**
- Встроенный Solana кошелек
- P2P транзакции
- DeFi возможности

## 🆘 Поддержка

### Документация:
- **README.md** - основная документация
- **API Documentation** - документация API
- **Troubleshooting** - решение проблем

### Сообщество:
- **GitHub Issues** - баг-репорты и предложения
- **Discord** - чат сообщества
- **Telegram** - новости и обновления

---

**Solana Messenger Mobile** - революция в мобильной коммуникации! 📱🚀

*Создано с ❤️ для приватности и децентрализации*
