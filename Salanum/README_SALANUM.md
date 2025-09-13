# 🔒 Salanum - Децентрализованный мессенджер с Хранителем

## 🎯 О проекте

**Salanum** - революционный децентрализованный мессенджер с интеграцией **Хранителя (Keeper)** - нейросетевой системы безопасности нового поколения. Это первый в мире мессенджер с AI-защитой, блокчейн интеграцией и Bluetooth P2P передачей.

## 🚀 Уникальные особенности

### 🔐 Хранитель (Keeper) - Protocol 14-Delta
- **Нейро-ключи** на основе биометрических данных
- **Оффлайн режим** работы для максимальной безопасности
- **Автоматическое обновление** весов нейросети
- **Многоуровневая защита** с выбором типа шифрования

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
- **React Native** - мобильные приложения
- **Styled Components** - стилизация
- **Socket.IO Client** - real-time
- **Solana Wallet Adapter** - кошельки

### Мобильные приложения
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

### Хранитель (Keeper)
- **Нейросетевое шифрование** на основе биометрии
- **Оффлайн серверы** без доступа в интернет
- **Автоматическое обновление** весов нейросети
- **Многофакторная аутентификация**

### Биометрические данные
1. **Голос** - анализ высоты тона, частоты, амплитуды
2. **Паттерны печати** - скорость, ритм, точность, паузы
3. **Энтропия устройства** - акселерометр, гироскоп, магнетометр

## 📦 Установка и запуск

### Предварительные требования
- Node.js 18+
- MongoDB 5+
- Solana CLI (опционально)
- OpenAI API ключ (опционально)
- Android Studio (для мобильной разработки)
- Xcode (для iOS разработки)

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd salanum
```

### 2. Установка зависимостей
```bash
# Установка всех зависимостей
npm run install-all

# Или по отдельности
npm install
cd server && npm install
cd ../client && npm install
cd ../mobile && npm install
```

### 3. Настройка окружения
```bash
# Копирование файла конфигурации
cp env.example .env

# Редактирование переменных окружения
nano .env
```

### 4. Настройка переменных окружения
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/solanum

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Solana Configuration
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_PRIVATE_KEY=your-solana-private-key-here

# OpenAI Configuration (for AI message masking)
OPENAI_API_KEY=your-openai-api-key-here

# Keeper Configuration
KEEPER_OFFLINE_PORT=3001
KEEPER_WEIGHTS_PATH=./data/keeper_weights.json

# Security
ENCRYPTION_KEY=your-32-character-encryption-key-here
```

### 5. Запуск приложения

#### Веб-версия:
```bash
# Запуск сервера и клиента одновременно
npm run dev

# Или по отдельности
npm run server  # Backend на порту 5000
npm run client  # Frontend на порту 3000
```

#### Мобильная версия:
```bash
cd mobile
npm install
npm run android  # Для Android
npm run ios      # Для iOS
```

### 6. Тестирование Хранителя
```bash
# Тест активации протокола
echo "Keeper: activate protocol 'Freedom'"
# Ожидаемый ответ: "Protocol 14_ACCEPTED"

# Запуск тестов
node test-keeper.js
```

## 📱 Использование

### Регистрация
1. Откройте приложение
2. Нажмите "Sign up"
3. Заполните форму регистрации
4. Автоматически создается Solana кошелек
5. Настройте Хранителя для максимальной безопасности

### Активация Хранителя
1. Перейдите в настройки
2. Включите "Keeper Neural Security"
3. Предоставьте биометрические данные:
   - Запишите голосовое сообщение
   - Наберите текст для анализа печати
   - Разрешите доступ к датчикам устройства
4. Хранитель активирован!

### Отправка сообщений
1. Выберите чат или создайте новый
2. Введите сообщение
3. AI автоматически маскирует чувствительную информацию
4. Хранитель шифрует сообщение нейро-ключом
5. Сообщение отправляется через mesh сеть

### Bluetooth P2P передача
1. Откройте раздел "Bluetooth"
2. Найдите устройства с приложением
3. Подключитесь к устройству
4. Отправьте приложение через Bluetooth
5. Получатель автоматически установит приложение

## 🔄 Архитектура

### Структура проекта
```
salanum/
├── server/                 # Backend сервер
│   ├── services/          # Сервисы (Solana, AI, Keeper)
│   ├── routes/            # API маршруты
│   ├── models/            # MongoDB модели
│   └── data/              # Данные Хранителя
├── client/                # React веб-клиент
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── contexts/      # React контексты
│   │   └── services/      # Клиентские сервисы
├── mobile/                # React Native приложение
│   ├── src/
│   │   ├── screens/       # Экраны приложения
│   │   ├── services/      # Bluetooth, Crypto сервисы
│   │   └── contexts/      # React контексты
└── docs/                  # Документация
```

### API Endpoints

#### Основные:
- `POST /api/auth/register` - регистрация
- `POST /api/auth/login` - вход
- `GET /api/messages/chat/:id` - получение сообщений
- `POST /api/messages/send` - отправка сообщения

#### Хранитель:
- `POST /api/keeper/validate` - валидация пользователя
- `POST /api/keeper/encrypt` - шифрование через Хранителя
- `POST /api/keeper/decrypt` - расшифровка через Хранителя
- `GET /api/keeper/status` - статус Хранителя

#### Блокчейн:
- `GET /api/blockchain/balance` - баланс кошелька
- `POST /api/blockchain/send-sol` - отправка SOL
- `POST /api/blockchain/send-tokens` - отправка токенов

## 🧪 Тестирование

### Веб-приложение:
```bash
# Запуск тестов
npm test

# Тестирование API
npm run test:api

# Тестирование Хранителя
node test-keeper.js
```

### Мобильное приложение:
```bash
cd mobile
npm test
```

### Тестовые сценарии:
1. **Регистрация и аутентификация**
2. **Активация Хранителя**
3. **Отправка и получение сообщений**
4. **Bluetooth P2P передача**
5. **Криптовалютные транзакции**
6. **AI маскировка сообщений**

## 🚀 Развертывание

### Продакшен настройки:
```bash
# Сборка клиента
cd client
npm run build

# Запуск сервера в продакшене
cd ../server
NODE_ENV=production npm start
```

### Docker (планируется):
```bash
docker-compose up -d
```

### Vercel/Netlify (планируется):
```bash
# Frontend
vercel --prod

# Backend
# Настройка через Vercel CLI
```

## 📊 Мониторинг

### Аналитика:
- **Firebase Analytics** - использование приложения
- **Crashlytics** - отчеты об ошибках
- **Performance Monitoring** - производительность
- **Custom Events** - пользовательские события

### Логирование:
- **React Native Flipper** - отладка
- **Console logs** - разработка
- **Remote logging** - продакшен
- **Error tracking** - отслеживание ошибок

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 🆘 Поддержка

- **Документация**: [Wiki](wiki-url)
- **Issues**: [GitHub Issues](issues-url)
- **Discord**: [Discord Server](discord-url)
- **Email**: support@salanum.com

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
