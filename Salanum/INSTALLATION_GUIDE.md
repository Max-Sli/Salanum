# 📱 Salanum - Полная инструкция по установке и тестированию

## 🎯 Обзор

**Salanum** - децентрализованный мессенджер с Хранителем (Keeper) для максимальной безопасности. Данная инструкция покрывает установку и тестирование на всех платформах.

## 📋 Предварительные требования

### Для разработки:
- **Node.js 18+** - [Скачать](https://nodejs.org/)
- **npm 9+** - устанавливается с Node.js
- **Git** - [Скачать](https://git-scm.com/)
- **MongoDB 5+** - [Скачать](https://www.mongodb.com/try/download/community)

### Для Android:
- **Android Studio** - [Скачать](https://developer.android.com/studio)
- **Java 11+** - [Скачать](https://adoptium.net/)
- **Android SDK API 33+**
- **Android Emulator** или физическое устройство

### Для iOS:
- **macOS** (обязательно)
- **Xcode 14+** - [Скачать из App Store](https://apps.apple.com/app/xcode/id497799835)
- **iOS Simulator** или физическое устройство
- **CocoaPods** - `sudo gem install cocoapods`

### Для Docker:
- **Docker Desktop** - [Скачать](https://www.docker.com/products/docker-desktop/)
- **Docker Compose** - устанавливается с Docker Desktop

## 🚀 Установка

### 1. Клонирование репозитория
```bash
# Клонирование проекта
git clone <repository-url>
cd salanum

# Проверка структуры проекта
ls -la
```

### 2. Установка зависимостей
```bash
# Установка всех зависимостей
npm run install-all

# Или по отдельности
npm install                    # Корневые зависимости
cd server && npm install      # Backend зависимости
cd ../client && npm install   # Frontend зависимости
cd ../mobile && npm install   # Mobile зависимости
```

### 3. Настройка окружения
```bash
# Копирование файла конфигурации
cp env.example .env

# Редактирование переменных окружения
nano .env  # или любой другой редактор
```

### 4. Настройка переменных окружения
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/salanum

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Solana Configuration
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_PRIVATE_KEY=your-solana-private-key-here

# OpenAI Configuration (для AI маскировки)
OPENAI_API_KEY=your-openai-api-key-here

# Keeper Configuration
KEEPER_OFFLINE_PORT=3001
KEEPER_WEIGHTS_PATH=./data/keeper_weights.json
KEEPER_ENCRYPTION_KEY=your-32-character-encryption-key-here

# Security
ENCRYPTION_KEY=your-32-character-encryption-key-here
```

## 🖥 Веб-версия

### 1. Запуск веб-версии
```bash
# Запуск сервера и клиента одновременно
npm run dev

# Или по отдельности
npm run server  # Backend на порту 5000
npm run client  # Frontend на порту 3000
```

### 2. Доступ к приложению
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Keeper API:** http://localhost:5000/api/keeper-final

### 3. Тестирование веб-версии
```bash
# Проверка статуса сервера
curl http://localhost:5000/api/health

# Тест Хранителя
curl -X POST http://localhost:5000/api/keeper-final/handshake \
  -H "Content-Type: application/json" \
  -d '{"command": "handshake", "version": "0.1a", "user_id": "14"}'
```

## 📱 Android

### 1. Настройка Android Studio
```bash
# Открытие Android Studio
# Установка Android SDK API 33
# Создание Android Virtual Device (AVD)
```

### 2. Настройка Android проекта
```bash
cd mobile

# Установка зависимостей
npm install

# Проверка React Native окружения
npx react-native doctor

# Очистка кэша (если нужно)
npx react-native clean
```

### 3. Запуск на Android
```bash
# Запуск Metro bundler
npm start

# В новом терминале - запуск на Android
npm run android

# Или с конкретным устройством
npx react-native run-android --deviceId=DEVICE_ID
```

### 4. Сборка APK
```bash
# Debug APK
cd android
./gradlew assembleDebug

# Release APK
./gradlew assembleRelease

# APK будет в android/app/build/outputs/apk/
```

### 5. Установка APK на устройство
```bash
# Через ADB
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Или через файловый менеджер
# Скопируйте APK на устройство и установите
```

## 🍎 iOS

### 1. Настройка Xcode
```bash
# Установка CocoaPods зависимостей
cd mobile/ios
pod install
cd ../..
```

### 2. Запуск на iOS
```bash
# Запуск Metro bundler
npm start

# В новом терминале - запуск на iOS
npm run ios

# Или с конкретным симулятором
npx react-native run-ios --simulator="iPhone 14"
```

### 3. Сборка для App Store
```bash
# Открытие проекта в Xcode
open mobile/ios/Salanum.xcworkspace

# В Xcode:
# 1. Выберите Generic iOS Device
# 2. Product -> Archive
# 3. Upload to App Store Connect
```

## 🐳 Docker

### 1. Запуск через Docker Compose
```bash
# Запуск всех сервисов
docker-compose -f docker-compose.keeper.yml up -d

# Проверка статуса
docker-compose -f docker-compose.keeper.yml ps

# Просмотр логов
docker-compose -f docker-compose.keeper.yml logs -f
```

### 2. Доступ к сервисам
- **Salanum Server:** http://localhost:5000
- **Keeper Offline:** http://127.0.0.1:3001
- **MongoDB:** localhost:27017
- **Redis:** localhost:6379
- **Prometheus:** http://localhost:9090
- **Grafana:** http://localhost:3000

### 3. Остановка сервисов
```bash
# Остановка всех сервисов
docker-compose -f docker-compose.keeper.yml down

# Остановка с удалением данных
docker-compose -f docker-compose.keeper.yml down -v
```

## 🧪 Тестирование

### 1. Тестирование Хранителя
```bash
# Запуск финальных тестов
node test-keeper-final.js

# Тест handshake
curl -X POST http://localhost:5000/api/keeper-final/handshake \
  -H "Content-Type: application/json" \
  -d '{"command": "handshake", "version": "0.1a", "user_id": "14"}'

# Ожидаемый ответ:
# {
#   "status": "accepted",
#   "code": "Δ-14-307",
#   "message": "Keeper is online."
# }
```

### 2. Тестирование API
```bash
# Регистрация пользователя
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'

# Вход пользователя
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Получение баланса кошелька
curl -X GET http://localhost:5000/api/blockchain/balance \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Тестирование мобильного приложения
```bash
# Android тесты
cd mobile
npm test

# iOS тесты (на macOS)
npm run test:ios

# E2E тесты
npm run test:e2e
```

### 4. Тестирование Bluetooth P2P
```bash
# Требуется минимум 2 устройства с приложением
# 1. Запустите приложение на обоих устройствах
# 2. Откройте раздел "Bluetooth"
# 3. Найдите и подключитесь к другому устройству
# 4. Отправьте приложение через Bluetooth
# 5. Проверьте установку на принимающем устройстве
```

## 🔧 Отладка

### 1. Веб-версия
```bash
# Проверка логов сервера
tail -f server/logs/app.log

# Проверка логов Хранителя
tail -f server/logs/keeper_*.keeper_log

# Отладка в браузере
# Откройте Developer Tools (F12)
# Проверьте Console и Network вкладки
```

### 2. Android
```bash
# Логи Android
adb logcat | grep -i salanum

# Логи React Native
npx react-native log-android

# Отладка через Flipper
# Установите Flipper Desktop
# Подключитесь к приложению
```

### 3. iOS
```bash
# Логи iOS
xcrun simctl spawn booted log stream --predicate 'process == "Salanum"'

# Логи React Native
npx react-native log-ios

# Отладка через Xcode
# Откройте проект в Xcode
# Используйте Debug Navigator
```

### 4. Docker
```bash
# Логи контейнеров
docker logs salanum-main -f
docker logs keeper-offline -f
docker logs salanum-mongodb -f

# Вход в контейнер
docker exec -it salanum-main bash
docker exec -it keeper-offline bash
```

## 📊 Мониторинг

### 1. Health Checks
```bash
# Основной сервер
curl http://localhost:5000/api/health

# Оффлайн сервер Хранителя
curl http://127.0.0.1:3001/health

# MongoDB
curl http://localhost:27017

# Redis
redis-cli ping
```

### 2. Prometheus метрики
```bash
# Доступ к метрикам
curl http://localhost:9090/metrics

# Проверка targets
curl http://localhost:9090/api/v1/targets
```

### 3. Grafana дашборды
```bash
# Доступ к Grafana
# URL: http://localhost:3000
# Логин: admin
# Пароль: admin_password_123
```

## 🚀 Развертывание в продакшене

### 1. Веб-версия
```bash
# Сборка клиента
cd client
npm run build

# Запуск сервера в продакшене
cd ../server
NODE_ENV=production npm start

# Или через PM2
npm install -g pm2
pm2 start server/index.js --name salanum
```

### 2. Мобильные приложения
```bash
# Android
cd mobile/android
./gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk

# iOS
# Откройте Xcode
# Product -> Archive
# Upload to App Store Connect
```

### 3. Docker продакшен
```bash
# Сборка образов
docker-compose -f docker-compose.keeper.yml build

# Запуск в продакшене
docker-compose -f docker-compose.keeper.yml up -d

# Проверка статуса
docker-compose -f docker-compose.keeper.yml ps
```

## 🆘 Решение проблем

### 1. Проблемы с зависимостями
```bash
# Очистка кэша npm
npm cache clean --force

# Удаление node_modules
rm -rf node_modules package-lock.json
npm install

# Для React Native
cd mobile
npx react-native clean
npm install
```

### 2. Проблемы с Android
```bash
# Очистка Gradle кэша
cd mobile/android
./gradlew clean

# Переустановка зависимостей
cd ..
npx react-native doctor
```

### 3. Проблемы с iOS
```bash
# Очистка CocoaPods кэша
cd mobile/ios
pod deintegrate
pod install

# Очистка Xcode кэша
rm -rf ~/Library/Developer/Xcode/DerivedData
```

### 4. Проблемы с Docker
```bash
# Очистка Docker
docker system prune -a

# Пересборка образов
docker-compose -f docker-compose.keeper.yml build --no-cache
```

## 📱 Установка на гаджеты

### 1. Android устройства
```bash
# Включите "Отладка по USB" в настройках разработчика
# Подключите устройство к компьютеру
# Установите APK
adb install path/to/salanum.apk

# Или через файловый менеджер
# Скопируйте APK на устройство
# Откройте APK файл
# Разрешите установку из неизвестных источников
```

### 2. iOS устройства
```bash
# Требуется Apple Developer Account
# Откройте Xcode
# Подключите устройство
# Выберите устройство в Xcode
# Нажмите Run (▶️)
# Доверьте разработчику в настройках устройства
```

### 3. Bluetooth P2P установка
```bash
# 1. Установите приложение на первое устройство
# 2. Откройте раздел "Bluetooth"
# 3. Найдите другое устройство
# 4. Подключитесь к нему
# 5. Отправьте приложение через Bluetooth
# 6. На принимающем устройстве установите APK
```

## 🔒 Безопасность

### 1. Настройка HTTPS
```bash
# Генерация SSL сертификатов
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Настройка Nginx
# Добавьте SSL конфигурацию в nginx.conf
```

### 2. Настройка файрвола
```bash
# UFW (Ubuntu)
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable

# iptables
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

### 3. Настройка MongoDB
```bash
# Создание пользователя
use salanum
db.createUser({
  user: "salanum_user",
  pwd: "secure_password",
  roles: ["readWrite"]
})

# Настройка аутентификации
# Добавьте в mongod.conf:
# security:
#   authorization: enabled
```

## 📞 Поддержка

### Полезные команды:
```bash
# Проверка статуса всех сервисов
curl http://localhost:5000/api/health
curl http://127.0.0.1:3001/health

# Тест Хранителя
node test-keeper-final.js

# Просмотр логов
tail -f server/logs/app.log
docker logs salanum-main -f

# Перезапуск сервисов
docker-compose -f docker-compose.keeper.yml restart
```

### Контакты:
- **GitHub Issues:** [Создать issue](https://github.com/your-repo/issues)
- **Email:** support@salanum.com
- **Discord:** [Discord Server](https://discord.gg/salanum)

---

**Salanum** - Установка и тестирование завершены! 🚀📱

*Следуйте инструкциям для успешной установки на любом устройстве*
