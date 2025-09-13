# 🚀 Salanum - Быстрый старт

## 📋 Краткая инструкция по установке и запуску

### 🎯 Для быстрого запуска (рекомендуется)

#### Linux/macOS:
```bash
# 1. Клонирование проекта
git clone <repository-url>
cd salanum

# 2. Автоматическая установка
chmod +x install.sh
./install.sh

# 3. Быстрый запуск
chmod +x quick-start.sh
./quick-start.sh
```

#### Windows:
```cmd
# 1. Клонирование проекта
git clone <repository-url>
cd salanum

# 2. Автоматическая установка
install.bat

# 3. Запуск
npm run dev
```

### 🧪 Тестирование
```bash
# Полное тестирование
chmod +x test-all.sh
./test-all.sh

# Тестирование Хранителя
node test-keeper-final.js
```

## 📱 Установка на гаджеты

### Android:
1. **Сборка APK:**
   ```bash
   cd mobile
   npm run android
   # APK будет в android/app/build/outputs/apk/debug/
   ```

2. **Установка на устройство:**
   ```bash
   # Через ADB
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   
   # Или скопируйте APK на устройство и установите
   ```

3. **Разрешения:**
   - Включите "Отладка по USB" в настройках разработчика
   - Разрешите установку из неизвестных источников

### iOS:
1. **Требования:**
   - macOS
   - Xcode 14+
   - Apple Developer Account

2. **Установка:**
   ```bash
   cd mobile
   npm run ios
   ```

3. **На устройстве:**
   - Доверьте разработчику в настройках

### Bluetooth P2P передача:
1. Установите приложение на первое устройство
2. Откройте раздел "Bluetooth"
3. Найдите другое устройство
4. Отправьте приложение через Bluetooth
5. Установите APK на принимающем устройстве

## 🔧 Ручная установка

### 1. Предварительные требования
- Node.js 18+
- npm 9+
- Git
- MongoDB 5+ (или Docker)
- Android Studio (для Android)
- Xcode (для iOS, только macOS)

### 2. Установка зависимостей
```bash
# Корневые зависимости
npm install

# Серверные зависимости
cd server && npm install && cd ..

# Клиентские зависимости
cd client && npm install && cd ..

# Мобильные зависимости
cd mobile && npm install && cd ..
```

### 3. Настройка окружения
```bash
# Копирование конфигурации
cp env.example .env

# Редактирование настроек
nano .env
```

### 4. Запуск
```bash
# Веб-версия
npm run dev

# Только сервер
npm run server

# Только клиент
npm run client
```

## 🐳 Docker

### Запуск всех сервисов:
```bash
docker-compose -f docker-compose.keeper.yml up -d
```

### Доступ:
- **Salanum:** http://localhost:5000
- **Keeper Offline:** http://127.0.0.1:3001
- **MongoDB:** localhost:27017
- **Grafana:** http://localhost:3000

## 🧪 Тестирование

### Основные тесты:
```bash
# Тест Хранителя
curl -X POST http://localhost:5000/api/keeper-final/handshake \
  -H "Content-Type: application/json" \
  -d '{"command": "handshake", "version": "0.1a", "user_id": "14"}'

# Ожидаемый ответ:
# {"status": "accepted", "code": "Δ-14-307", "message": "Keeper is online."}
```

### Полное тестирование:
```bash
./test-all.sh
```

## 🔒 Хранитель (Keeper)

### Активация:
1. Откройте приложение
2. Перейдите в настройки
3. Включите "Keeper Neural Security"
4. Предоставьте биометрические данные

### Тестирование:
```bash
node test-keeper-final.js
```

## 📊 Мониторинг

### Health Checks:
```bash
# Основной сервер
curl http://localhost:5000/api/health

# Оффлайн сервер
curl http://127.0.0.1:3001/health
```

### Логи:
```bash
# Серверные логи
tail -f server/logs/app.log

# Логи Хранителя
tail -f server/logs/keeper_*.keeper_log

# Docker логи
docker logs salanum-main -f
```

## 🆘 Решение проблем

### Проблемы с зависимостями:
```bash
# Очистка кэша
npm cache clean --force

# Переустановка
rm -rf node_modules package-lock.json
npm install
```

### Проблемы с Android:
```bash
cd mobile
npx react-native clean
npm install
```

### Проблемы с iOS:
```bash
cd mobile/ios
pod deintegrate
pod install
```

### Проблемы с Docker:
```bash
docker system prune -a
docker-compose -f docker-compose.keeper.yml build --no-cache
```

## 📞 Поддержка

### Полезные команды:
```bash
# Проверка статуса
curl http://localhost:5000/api/health

# Тест Хранителя
node test-keeper-final.js

# Полное тестирование
./test-all.sh

# Перезапуск
docker-compose -f docker-compose.keeper.yml restart
```

### Контакты:
- **GitHub Issues:** [Создать issue](https://github.com/your-repo/issues)
- **Email:** support@salanum.com
- **Discord:** [Discord Server](https://discord.gg/salanum)

---

**Salanum** - Быстрый старт завершен! 🚀📱

*Следуйте инструкциям для успешной установки на любом устройстве*
