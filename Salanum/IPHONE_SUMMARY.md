# 📱 Salanum на iPhone - Сводка

## 🎯 Все способы установки

### 1. 🚀 Автоматическая установка (рекомендуется)
```bash
# На Mac выполните:
git clone <repository-url>
cd salanum
chmod +x install-ios.sh
./install-ios.sh
```

### 2. 📖 Пошаговая инструкция
Следуйте [IPHONE_INSTALLATION.md](IPHONE_INSTALLATION.md) для подробной инструкции

### 3. ⚡ Быстрый старт
Следуйте [IPHONE_QUICK_START.md](IPHONE_QUICK_START.md) для быстрой установки

### 4. 👥 Для обычных пользователей
Следуйте [IPHONE_SIMPLE.md](IPHONE_SIMPLE.md) для простой инструкции

## 📋 Что нужно:

### Обязательно:
- **Mac** с macOS
- **iPhone** с iOS 13.0+
- **Xcode** (бесплатно из App Store)
- **Apple ID** (бесплатный)

### Автоматически устанавливается:
- Node.js 18+
- CocoaPods
- Все зависимости проекта

## 🚀 Быстрый процесс:

1. **Подготовка Mac** (5 минут)
   - Установите Xcode из App Store
   - Установите Node.js

2. **Скачивание проекта** (2 минуты)
   ```bash
   git clone <repository-url>
   cd salanum
   ```

3. **Автоматическая установка** (5 минут)
   ```bash
   chmod +x install-ios.sh
   ./install-ios.sh
   ```

4. **Установка на iPhone** (3 минуты)
   - Подключите iPhone к Mac
   - В Xcode выберите iPhone и нажмите ▶️
   - Доверьте разработчику в настройках iPhone

## ✅ Результат:

После установки у вас будет:
- **Salanum** на iPhone
- **Хранитель** для защиты сообщений
- **Bluetooth P2P** для передачи приложения
- **AI маскировка** сообщений
- **Solana кошелек** для криптовалют

## 🆘 Решение проблем:

### Частые проблемы:
1. **"Untrusted Developer"** → Настройки → Основные → Управление VPN и устройством → Доверять
2. **"Could not find iPhone"** → Убедитесь, что iPhone подключен и разблокирован
3. **"Code signing error"** → Измените Bundle Identifier на уникальный в Xcode

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

## 📱 Особенности iPhone версии:

### 🔒 Безопасность:
- Face ID/Touch ID аутентификация
- Хранитель с нейросетевой защитой
- End-to-end шифрование
- Биометрические ключи

### 📶 Bluetooth P2P:
- Передача приложения без интернета
- Mesh networking
- Обход цензуры
- Прямая связь между устройствами

### 🤖 AI функции:
- Маскировка сообщений в реальном времени
- Анализ чувствительности контента
- Контекстная обфускация
- Fallback механизмы

## 🎯 Альтернативные способы:

### 1. TestFlight (для бета-тестирования)
- Требует Apple Developer Account ($99/год)
- Позволяет тестировать без подключения к Mac
- До 10,000 тестировщиков

### 2. AltStore (без Developer Account)
- Бесплатная установка
- Требует обновления каждые 7 дней
- Ограниченное количество приложений

### 3. App Store (для публикации)
- Требует Apple Developer Account
- Процесс ревью Apple
- Доступно всем пользователям

## 📊 Статистика установки:

- **Время установки:** 15 минут
- **Размер приложения:** ~50 MB
- **Требования:** iOS 13.0+, 2 GB RAM
- **Совместимость:** iPhone 6s и новее

## 🔧 Для разработчиков:

### Полезные команды:
```bash
# Запуск на симуляторе
npm run ios

# Запуск на конкретном устройстве
npm run ios --device="iPhone 14 Pro"

# Сборка для TestFlight
cd mobile/ios
xcodebuild -workspace Salanum.xcworkspace -scheme Salanum -configuration Release -destination generic/platform=iOS -archivePath Salanum.xcarchive archive

# Отладка
npx react-native log-ios
```

### Настройки Xcode:
- Bundle Identifier: `com.yourname.salanum`
- Team: Ваша команда разработки
- Signing: Automatically manage signing
- Deployment Target: iOS 13.0

## 📞 Поддержка:

### Документация:
- [IPHONE_INSTALLATION.md](IPHONE_INSTALLATION.md) - Подробная инструкция
- [IPHONE_QUICK_START.md](IPHONE_QUICK_START.md) - Быстрый старт
- [IPHONE_SIMPLE.md](IPHONE_SIMPLE.md) - Для обычных пользователей

### Контакты:
- **Email:** support@salanum.com
- **GitHub Issues:** [Создать issue](https://github.com/your-repo/issues)
- **Discord:** [Discord Server](https://discord.gg/salanum)

---

**Salanum на iPhone** - Выберите удобный способ установки! 📱🚀

*Все инструкции готовы для успешной установки*
