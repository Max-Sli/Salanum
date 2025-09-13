# 📱 Установка Salanum на iPhone

## 🎯 Обзор

Данная инструкция поможет вам установить **Salanum** на iPhone. Есть несколько способов установки в зависимости от ваших потребностей.

## 📋 Предварительные требования

### Для разработки (требуется macOS):
- **macOS** (обязательно для разработки iOS)
- **Xcode 14+** - [Скачать из App Store](https://apps.apple.com/app/xcode/id497799835)
- **Apple Developer Account** - [Зарегистрироваться](https://developer.apple.com/programs/)
- **Node.js 18+** - [Скачать](https://nodejs.org/)
- **Git** - [Скачать](https://git-scm.com/)

### Для пользователя:
- **iPhone** с iOS 13.0 или выше
- **macOS** (для установки через Xcode)
- **Apple ID** (бесплатный или платный Developer Account)

## 🚀 Способы установки

### 1. Установка через Xcode (рекомендуется для разработки)

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

#### Шаг 2: Установка iOS зависимостей
```bash
# Установка CocoaPods
sudo gem install cocoapods

# Установка iOS зависимостей
cd ios
pod install
cd ..
```

#### Шаг 3: Открытие проекта в Xcode
```bash
# Открытие workspace файла
open ios/Salanum.xcworkspace
```

#### Шаг 4: Настройка в Xcode
1. **Выберите команду разработки:**
   - В Xcode выберите `Salanum` в списке команд
   - Нажмите на команду и выберите "Edit Scheme"
   - В разделе "Run" выберите "Debug"

2. **Настройте Bundle Identifier:**
   - Выберите проект `Salanum` в навигаторе
   - В разделе "General" измените Bundle Identifier на уникальный (например: `com.yourname.salanum`)

3. **Настройте команду разработки:**
   - В разделе "Signing & Capabilities"
   - Выберите вашу команду разработки
   - Убедитесь, что "Automatically manage signing" включено

#### Шаг 5: Подключение iPhone
1. **Подключите iPhone к Mac через USB**
2. **На iPhone:**
   - Перейдите в Настройки → Основные → Управление VPN и устройством
   - Нажмите "Доверять" для вашего Mac

3. **В Xcode:**
   - Выберите ваш iPhone в списке устройств
   - Нажмите кнопку "Run" (▶️) или `Cmd + R`

#### Шаг 6: Доверие разработчику на iPhone
1. После установки на iPhone появится сообщение о недоверенном разработчике
2. Перейдите в **Настройки → Основные → Управление VPN и устройством**
3. Найдите ваше приложение и нажмите "Доверять"
4. Подтвердите доверие

### 2. Установка через TestFlight (для бета-тестирования)

#### Шаг 1: Подготовка для TestFlight
```bash
# Сборка для TestFlight
cd mobile/ios
xcodebuild -workspace Salanum.xcworkspace -scheme Salanum -configuration Release -destination generic/platform=iOS -archivePath Salanum.xcarchive archive
```

#### Шаг 2: Загрузка в App Store Connect
1. Откройте Xcode
2. Выберите **Window → Organizer**
3. Выберите архив и нажмите **"Distribute App"**
4. Выберите **"App Store Connect"**
5. Следуйте инструкциям для загрузки

#### Шаг 3: Настройка в App Store Connect
1. Войдите в [App Store Connect](https://appstoreconnect.apple.com/)
2. Выберите ваше приложение
3. Перейдите в раздел **"TestFlight"**
4. Добавьте тестировщиков
5. Отправьте приглашения

#### Шаг 4: Установка через TestFlight
1. Тестировщики получат приглашение по email
2. Скачайте приложение **TestFlight** из App Store
3. Откройте приглашение и установите приложение

### 3. Установка через AltStore (для пользователей без Developer Account)

#### Шаг 1: Установка AltStore
1. Скачайте **AltStore** с [altstore.io](https://altstore.io/)
2. Установите AltServer на ваш Mac
3. Подключите iPhone к Mac
4. Установите AltStore на iPhone

#### Шаг 2: Подготовка IPA файла
```bash
# Сборка IPA файла
cd mobile/ios
xcodebuild -workspace Salanum.xcworkspace -scheme Salanum -configuration Release -destination generic/platform=iOS -archivePath Salanum.xcarchive archive

# Экспорт IPA
xcodebuild -exportArchive -archivePath Salanum.xcarchive -exportPath ./build -exportOptionsPlist ExportOptions.plist
```

#### Шаг 3: Установка через AltStore
1. Откройте AltStore на iPhone
2. Нажмите **"+"** в верхнем левом углу
3. Выберите IPA файл
4. Дождитесь установки

## 🔧 Настройка разрешений

### Необходимые разрешения в Info.plist:
```xml
<!-- Bluetooth -->
<key>NSBluetoothAlwaysUsageDescription</key>
<string>Salanum использует Bluetooth для P2P передачи сообщений и файлов между устройствами без интернета.</string>

<!-- Камера -->
<key>NSCameraUsageDescription</key>
<string>Камера используется для сканирования QR кодов и создания фото для профиля.</string>

<!-- Микрофон -->
<key>NSMicrophoneUsageDescription</key>
<string>Микрофон используется для голосовых сообщений и звонков.</string>

<!-- Местоположение -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>Местоположение необходимо для Bluetooth сканирования и поиска ближайших устройств.</string>

<!-- Face ID -->
<key>NSFaceIDUsageDescription</key>
<string>Face ID используется для безопасной аутентификации в приложении.</string>
```

## 🧪 Тестирование на iPhone

### 1. Тестирование основных функций
```bash
# Запуск Metro bundler
cd mobile
npm start

# В новом терминале - запуск на iPhone
npm run ios --device="iPhone"
```

### 2. Тестирование Bluetooth P2P
1. Установите приложение на два iPhone
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

### Проблема: "Untrusted Enterprise Developer"
**Решение:**
1. Перейдите в Настройки → Основные → Управление VPN и устройством
2. Найдите ваше приложение
3. Нажмите "Доверять"
4. Подтвердите доверие

### Проблема: "Could not find iPhone"
**Решение:**
1. Убедитесь, что iPhone подключен через USB
2. Разблокируйте iPhone
3. Нажмите "Доверять" на iPhone
4. Перезапустите Xcode

### Проблема: "Code signing error"
**Решение:**
1. В Xcode выберите проект
2. Перейдите в "Signing & Capabilities"
3. Выберите правильную команду разработки
4. Убедитесь, что Bundle Identifier уникален

### Проблема: "Pod install failed"
**Решение:**
```bash
# Очистка CocoaPods кэша
cd mobile/ios
pod deintegrate
pod cache clean --all
pod install
```

### Проблема: "Metro bundler not starting"
**Решение:**
```bash
# Очистка кэша
cd mobile
npx react-native clean
npm start --reset-cache
```

## 📱 Особенности iOS версии

### 1. Bluetooth ограничения
- iOS имеет ограничения на Bluetooth Classic
- Используется Bluetooth Low Energy (BLE)
- Требуется разрешение пользователя для Bluetooth

### 2. Фоновые процессы
- Приложение может работать в фоне ограниченное время
- Используйте Background App Refresh
- Настройте Background Modes в Info.plist

### 3. Безопасность
- iOS автоматически шифрует данные приложения
- Keychain используется для хранения ключей
- Touch ID/Face ID для биометрической аутентификации

## 🔒 Настройка безопасности

### 1. Keychain настройки
```javascript
// В коде приложения
import Keychain from 'react-native-keychain';

// Сохранение ключей
await Keychain.setInternetCredentials('salanum', username, password);

// Получение ключей
const credentials = await Keychain.getInternetCredentials('salanum');
```

### 2. Биометрическая аутентификация
```javascript
import TouchID from 'react-native-touch-id';

// Проверка доступности
TouchID.isSupported()
  .then(biometryType => {
    // Touch ID или Face ID доступны
  })
  .catch(error => {
    // Биометрия недоступна
  });
```

## 📊 Мониторинг и отладка

### 1. Логи в Xcode
- Откройте Xcode
- Выберите Window → Devices and Simulators
- Выберите ваш iPhone
- Нажмите "Open Console"

### 2. React Native Debugger
```bash
# Установка
npm install -g react-native-debugger

# Запуск
react-native-debugger
```

### 3. Flipper
1. Скачайте Flipper Desktop
2. Установите на Mac
3. Подключитесь к приложению на iPhone

## 🚀 Оптимизация для App Store

### 1. Подготовка к публикации
```bash
# Сборка для App Store
cd mobile/ios
xcodebuild -workspace Salanum.xcworkspace -scheme Salanum -configuration Release -destination generic/platform=iOS -archivePath Salanum.xcarchive archive
```

### 2. Требования App Store
- Уникальный Bundle Identifier
- Описание приложения
- Скриншоты для всех размеров iPhone
- Политика конфиденциальности
- Возрастной рейтинг

### 3. Метаданные
- Название: "Salanum"
- Подзаголовок: "Secure Messenger with Keeper"
- Описание: "Decentralized messenger with neural security"
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
cd ios && pod install && cd ..

# Запуск на iPhone
npm run ios --device="iPhone"
```

### Контакты:
- **GitHub Issues:** [Создать issue](https://github.com/your-repo/issues)
- **Email:** support@salanum.com
- **Discord:** [Discord Server](https://discord.gg/salanum)

---

**Salanum для iPhone** - Безопасная коммуникация на iOS! 📱🔒

*Следуйте инструкциям для успешной установки на iPhone*
