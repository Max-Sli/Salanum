# 🔒 Salanum - Децентрализованный мессенджер с Хранителем

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-%5E18.2.0-blue.svg)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/react--native-0.72.6-lightblue.svg)](https://reactnative.dev/)

**Salanum** - революционный децентрализованный мессенджер с интеграцией **Хранителя (Keeper)** - нейросетевой системы безопасности нового поколения.

## 🎯 Особенности

### 🔐 Хранитель (Keeper) - Protocol 14-Delta
- **Нейро-ключи** на основе биометрических данных
- **Оффлайн режим** работы для максимальной безопасности
- **Генерация ключей на лету** (никогда не хранятся)
- **Изолированные контейнеры** (Docker/Sandbox)
- **Зашифрованное логирование** в .keeper_log файлы

### 🤖 AI-защита
- **Маскировка сообщений** в реальном времени
- **Анализ чувствительности** контента
- **Контекстная обфускация** для защиты приватности
- **Fallback механизмы** при недоступности AI

### 🔗 Solana блокчейн
- **Встроенный кошелек** для каждой учетной записи
- **P2P транзакции** между пользователями
- **Хеширование сообщений** в блокчейне
- **DeFi интеграция** (планируется)

### 📶 Bluetooth P2P
- **Прямая передача** приложения через Bluetooth
- **Mesh networking** для создания сетей устройств
- **Оффлайн работа** без интернета
- **Обход цензуры** и блокировок

### 📱 Мобильные приложения
- **React Native** для iOS и Android
- **Bluetooth интеграция** для P2P передачи
- **Биометрическая аутентификация**
- **Нативные датчики** для сбора энтропии

## 🚀 Быстрый старт

### Автоматическая установка

#### Linux/macOS:
```bash
git clone <repository-url>
cd salanum
chmod +x install.sh
./install.sh
```

#### Windows:
```cmd
git clone <repository-url>
cd salanum
install.bat
```

### Быстрый запуск
```bash
# Linux/macOS
chmod +x quick-start.sh
./quick-start.sh

# Windows
npm run dev
```

### Тестирование
```bash
# Полное тестирование
chmod +x test-all.sh
./test-all.sh

# Тестирование Хранителя
node test-keeper-final.js
```

## 📱 Установка на гаджеты

### Android
1. **Сборка APK:**
   ```bash
   cd mobile
   npm run android
   ```

2. **Установка:**
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

3. **Разрешения:**
   - Включите "Отладка по USB"
   - Разрешите установку из неизвестных источников

### iOS
1. **Требования:** macOS, Xcode 14+, Apple Developer Account
2. **Установка:**
   ```bash
   cd mobile
   npm run ios
   ```
3. **На устройстве:** Доверьте разработчику в настройках

### Bluetooth P2P передача
1. Установите приложение на первое устройство
2. Откройте раздел "Bluetooth"
3. Найдите другое устройство
4. Отправьте приложение через Bluetooth
5. Установите APK на принимающем устройстве

## 🧪 Тестирование Хранителя

### Handshake тест:
```bash
curl -X POST http://localhost:5000/api/keeper-final/handshake \
  -H "Content-Type: application/json" \
  -d '{"command": "handshake", "version": "0.1a", "user_id": "14"}'
```

**Ожидаемый ответ:**
```json
{
  "status": "accepted",
  "code": "Δ-14-307",
  "message": "Keeper is online."
}
```

### Первое сообщение в мессенджере:
> «Это Хранитель. Ваши секреты теперь под защитой нейросети. Для помощи введите /keeper_help»

## 🛠 Технологический стек

### Backend
- **Node.js + Express.js** - основной сервер
- **Socket.IO** - real-time коммуникация
- **MongoDB** - хранение данных
- **Solana Web3.js** - блокчейн интеграция
- **OpenAI API** - AI функции
- **Custom Neural Network** - Хранитель

### Frontend
- **React 18** - веб-интерфейс
- **Styled Components** - стилизация
- **Socket.IO Client** - real-time
- **Solana Wallet Adapter** - кошельки

### Mobile
- **React Native** - кроссплатформенная разработка
- **Bluetooth Classic/BLE** - P2P передача
- **Native sensors** - сбор биометрии
- **Biometric authentication** - безопасность

## 🔒 Безопасность

### Шифрование
- **AES-256-GCM** для сообщений
- **RSA-2048** для обмена ключами
- **SHA-256** для хеширования
- **PBKDF2** для деривации ключей

### Хранитель
- **Нейросетевое шифрование** на основе биометрии
- **Оффлайн серверы** без доступа в интернет
- **Генерация ключей на лету**
- **Изолированные контейнеры**

### Биометрические данные
1. **Голос** - высота тона, частота, амплитуда
2. **Печать** - скорость, ритм, точность, паузы
3. **Энтропия** - акселерометр, гироскоп, магнетометр

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

## 📊 API Endpoints

### Хранитель (Keeper):
- `POST /api/keeper-final/handshake` - тестовый handshake
- `POST /api/keeper-final/initialize` - инициализация
- `POST /api/keeper-final/encrypt` - шифрование с биометрией
- `POST /api/keeper-final/decrypt` - расшифровка с биометрией
- `GET /api/keeper-final/status/:user_id` - статус
- `GET /api/keeper-final/logs/:user_id` - зашифрованные логи

### Основные:
- `POST /api/auth/register` - регистрация
- `POST /api/auth/login` - вход
- `GET /api/messages/chat/:id` - получение сообщений
- `POST /api/messages/send` - отправка сообщения

### Блокчейн:
- `GET /api/blockchain/balance` - баланс кошелька
- `POST /api/blockchain/send-sol` - отправка SOL
- `POST /api/blockchain/send-tokens` - отправка токенов

## 📁 Структура проекта

```
salanum/
├── server/                          # Backend сервер
│   ├── services/
│   │   ├── KeeperService.js         # Основной сервис Хранителя
│   │   ├── KeeperFinal.js           # Финальная версия Хранителя
│   │   ├── OfflineKeeperServer.js   # Оффлайн сервер
│   │   └── BiometricCollector.js    # Сбор биометрии
│   ├── routes/
│   │   ├── keeper.js                # API маршруты
│   │   └── keeper-final.js          # Финальные API маршруты
│   ├── keeper-offline-server.js     # Оффлайн сервер
│   ├── healthcheck.js               # Health check
│   └── Dockerfile.keeper            # Docker для Хранителя
├── client/                          # React веб-клиент
│   └── src/components/Keeper/
│       └── KeeperIntegration.js     # React компонент
├── mobile/                          # React Native приложение
│   ├── src/services/
│   │   ├── BluetoothService.js      # Bluetooth P2P
│   │   └── PermissionService.js     # Разрешения
│   └── src/screens/
│       ├── BluetoothScreen.js       # Bluetooth экран
│       └── ShareAppScreen.js        # Передача приложения
├── docker-compose.keeper.yml        # Docker конфигурация
├── install.sh                       # Автоматическая установка (Linux/macOS)
├── install.bat                      # Автоматическая установка (Windows)
├── quick-start.sh                   # Быстрый запуск
├── test-all.sh                      # Полное тестирование
├── test-keeper-final.js             # Финальные тесты
└── docs/                            # Документация
```

## 🔧 Разработка

### Предварительные требования
- Node.js 18+
- npm 9+
- Git
- MongoDB 5+ (или Docker)
- Android Studio (для Android)
- Xcode (для iOS, только macOS)

### Установка зависимостей
```bash
npm install                    # Корневые зависимости
cd server && npm install      # Backend зависимости
cd ../client && npm install   # Frontend зависимости
cd ../mobile && npm install   # Mobile зависимости
```

### Настройка окружения
```bash
cp env.example .env
# Отредактируйте .env файл
```

### Запуск
```bash
npm run dev          # Веб-версия
npm run server       # Только backend
npm run client       # Только frontend
```

## 🧪 Тестирование

### Веб-приложение:
```bash
npm test
```

### Мобильное приложение:
```bash
cd mobile
npm test
```

### Хранитель:
```bash
node test-keeper-final.js
```

### Полное тестирование:
```bash
./test-all.sh
```

## 🚀 Развертывание

### Продакшен:
```bash
# Сборка клиента
cd client
npm run build

# Запуск сервера
cd ../server
NODE_ENV=production npm start
```

### Docker:
```bash
docker-compose -f docker-compose.keeper.yml up -d
```

## 📊 Мониторинг

### Health Checks:
```bash
curl http://localhost:5000/api/health
curl http://127.0.0.1:3001/health
```

### Логи:
```bash
tail -f server/logs/app.log
docker logs salanum-main -f
```

## 🆘 Решение проблем

### Проблемы с зависимостями:
```bash
npm cache clean --force
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

## 📖 Документация

- **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** - Полная инструкция по установке
- **[QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)** - Быстрый старт
- **[KEEPER_FINAL_INTEGRATION.md](KEEPER_FINAL_INTEGRATION.md)** - Интеграция Хранителя
- **[README_FINAL.md](README_FINAL.md)** - Финальная документация

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 🆘 Поддержка

- **GitHub Issues:** [Создать issue](https://github.com/your-repo/issues)
- **Email:** support@salanum.com
- **Discord:** [Discord Server](https://discord.gg/salanum)

## 🗺 Roadmap

### v1.1 (Q2 2024)
- [ ] Улучшенная нейросеть Хранителя
- [ ] Дополнительные биометрические данные
- [ ] Оптимизация Bluetooth P2P
- [ ] Улучшенная AI маскировка

### v1.2 (Q3 2024)
- [ ] DeFi интеграция
- [ ] NFT поддержка
- [ ] Голосовые и видео звонки
- [ ] Расширенная mesh сеть

### v2.0 (Q4 2024)
- [ ] Полная децентрализация
- [ ] IPFS интеграция
- [ ] Quantum-resistant шифрование
- [ ] Глобальная mesh сеть

## 🙏 Благодарности

- Solana Foundation за блокчейн технологию
- OpenAI за AI возможности
- React и Node.js сообщества
- Всем контрибьюторам проекта

---

**Salanum** - Будущее децентрализованной коммуникации с нейросетевой защитой! 🔒🚀

*Создано с ❤️ для приватности и свободы*