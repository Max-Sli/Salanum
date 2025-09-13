# Solana Messenger Mobile

Мобильное приложение Solana Messenger с Bluetooth P2P передачей для iOS и Android.

## 🚀 Особенности

### 📱 Мобильная платформа
- **React Native** для кроссплатформенной разработки
- **Нативный UI** с адаптивным дизайном
- **Оптимизация** для сенсорных устройств
- **Офлайн режим** работы

### 📶 Bluetooth P2P
- **Прямая передача** приложения через Bluetooth
- **Mesh networking** для создания сетей устройств
- **Автоматическое обнаружение** ближайших устройств
- **Шифрованная передача** данных

### 🔐 Безопасность
- **End-to-end шифрование** всех сообщений
- **AI маскировка** в реальном времени
- **Биометрическая аутентификация**
- **Локальное хранение** ключей

## 🛠 Установка и настройка

### Предварительные требования
- Node.js 18+
- React Native CLI
- Android Studio (для Android)
- Xcode (для iOS)
- Java 11+ (для Android)

### 1. Установка зависимостей
```bash
cd mobile
npm install
```

### 2. Настройка Android
```bash
# Установка зависимостей
cd android
./gradlew clean
cd ..

# Запуск на Android
npm run android
```

### 3. Настройка iOS
```bash
# Установка CocoaPods зависимостей
cd ios
pod install
cd ..

# Запуск на iOS
npm run ios
```

## 📱 Функции приложения

### 🔵 Bluetooth экран
- **Поиск устройств** в радиусе действия
- **Подключение** к найденным устройствам
- **Создание mesh сети** для группового общения
- **Передача приложения** новым пользователям

### 💬 Мессенджер
- **Real-time сообщения** через Bluetooth
- **Голосовые сообщения** с шифрованием
- **Файловые вложения** (изображения, документы)
- **Групповые чаты** в mesh сети

### 💰 Кошелек
- **Solana интеграция** для криптовалют
- **P2P транзакции** между пользователями
- **QR коды** для быстрых переводов
- **История транзакций**

### 🔄 Передача приложения
- **Bluetooth P2P** - прямая передача APK/IPA
- **QR коды** - сканирование для скачивания
- **Mesh распространение** - передача через сеть
- **Ссылки** - обычное скачивание

## 🔧 Разработка

### Структура проекта
```
mobile/
├── src/
│   ├── components/          # React компоненты
│   ├── screens/            # Экраны приложения
│   ├── contexts/           # React контексты
│   ├── services/           # Сервисы (Bluetooth, API)
│   ├── utils/              # Утилиты
│   └── styles/             # Стили и темы
├── android/                # Android нативные файлы
├── ios/                    # iOS нативные файлы
└── assets/                 # Ресурсы приложения
```

### Основные сервисы
- **BluetoothService** - управление Bluetooth соединениями
- **MeshService** - создание и управление mesh сетями
- **CryptoService** - шифрование и безопасность
- **SolanaService** - интеграция с блокчейном

### Сборка для продакшена

#### Android
```bash
# Сборка APK
npm run build:android

# Сборка AAB (Google Play)
cd android
./gradlew bundleRelease
```

#### iOS
```bash
# Сборка для App Store
npm run build:ios

# Архив для TestFlight
cd ios
xcodebuild -workspace SolanaMessenger.xcworkspace -scheme SolanaMessenger archive
```

## 📋 Разрешения

### Android
- `BLUETOOTH` - основной Bluetooth доступ
- `BLUETOOTH_ADMIN` - управление Bluetooth
- `BLUETOOTH_SCAN` - сканирование устройств
- `BLUETOOTH_CONNECT` - подключение к устройствам
- `ACCESS_FINE_LOCATION` - для Bluetooth сканирования
- `CAMERA` - для QR кодов и фото
- `RECORD_AUDIO` - для голосовых сообщений
- `WRITE_EXTERNAL_STORAGE` - для файлов

### iOS
- `NSBluetoothAlwaysUsageDescription` - Bluetooth доступ
- `NSCameraUsageDescription` - камера
- `NSMicrophoneUsageDescription` - микрофон
- `NSLocationWhenInUseUsageDescription` - местоположение
- `NSFaceIDUsageDescription` - Face ID
- `NSPhotoLibraryUsageDescription` - галерея

## 🔄 Bluetooth P2P передача

### Процесс передачи
1. **Обнаружение** - поиск устройств с приложением
2. **Подключение** - установка Bluetooth соединения
3. **Аутентификация** - проверка безопасности
4. **Передача** - отправка APK/IPA файла
5. **Установка** - автоматическая установка на устройство

### Mesh сеть
- **Автоматическое создание** при подключении 2+ устройств
- **Ретрансляция сообщений** через промежуточные узлы
- **Самоорганизация** сети
- **Отказоустойчивость** при отключении узлов

## 🛡 Безопасность

### Шифрование
- **AES-256** для всех сообщений
- **RSA-2048** для обмена ключами
- **SHA-256** для хеширования
- **PBKDF2** для деривации ключей

### Аутентификация
- **JWT токены** для сессий
- **Биометрические данные** для входа
- **2FA** через SMS/Email
- **Recovery фразы** для восстановления

### Приватность
- **AI маскировка** чувствительной информации
- **Локальное хранение** данных
- **Нет централизованных серверов**
- **Анонимные транзакции**

## 🚀 Развертывание

### Google Play Store
1. Создайте AAB файл
2. Загрузите в Google Play Console
3. Настройте метаданные
4. Отправьте на проверку

### Apple App Store
1. Создайте архив в Xcode
2. Загрузите в App Store Connect
3. Настройте информацию о приложении
4. Отправьте на ревью

### Прямое распространение
- **APK файлы** для Android
- **IPA файлы** для iOS (требует подписи)
- **Bluetooth передача** между устройствами
- **QR коды** для скачивания

## 📊 Мониторинг

### Аналитика
- **Firebase Analytics** - использование приложения
- **Crashlytics** - отчеты об ошибках
- **Performance Monitoring** - производительность
- **Custom Events** - пользовательские события

### Логирование
- **React Native Flipper** - отладка
- **Console logs** - разработка
- **Remote logging** - продакшен
- **Error tracking** - отслеживание ошибок

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch
3. Внесите изменения
4. Протестируйте на устройствах
5. Создайте Pull Request

## 📄 Лицензия

MIT License - см. файл LICENSE для деталей.

## 🆘 Поддержка

- **Документация**: [Wiki](wiki-url)
- **Issues**: [GitHub Issues](issues-url)
- **Discord**: [Discord Server](discord-url)
- **Email**: mobile@solana-messenger.com

---

**Solana Messenger Mobile** - Будущее мобильной децентрализованной коммуникации! 📱🚀
