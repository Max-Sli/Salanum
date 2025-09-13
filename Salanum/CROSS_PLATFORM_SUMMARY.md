# 🌐 Salanum - Установка на все платформы

## 🎯 Обзор

**Salanum** - это децентрализованный мессенджер с интеграцией Solana блокчейна, AI-защитой сообщений и системой "Хранитель" для нейросетевой безопасности. Доступен на всех основных платформах.

## 📱 Поддерживаемые платформы

### 🍎 **iOS (iPhone/iPad)**
- **Требования:** iOS 13.0+, macOS для разработки
- **Установка:** Xcode, TestFlight, AltStore
- **Особенности:** Face ID/Touch ID, Bluetooth P2P

### 🤖 **Android**
- **Требования:** Android 7.0+ (API 24)
- **Установка:** Android Studio, APK, Google Play
- **Особенности:** Отпечаток пальца, Bluetooth Classic/BLE

### 🪟 **Windows**
- **Требования:** Windows 10/11 (64-bit)
- **Установка:** Node.js, PowerShell, Docker
- **Особенности:** Windows Hello, BitLocker

### 🐧 **Linux**
- **Требования:** Ubuntu 18.04+, CentOS 7+
- **Установка:** Node.js, systemd, Docker
- **Особенности:** OpenSSL, systemd службы

### 🍎 **macOS**
- **Требования:** macOS 10.15+
- **Установка:** Homebrew, Xcode, Docker
- **Особенности:** Touch ID, Keychain

## 🚀 Быстрый старт по платформам

### 📱 **iPhone (iOS)**
```bash
# На Mac выполните:
git clone <repository-url>
cd salanum
chmod +x install-ios.sh
./install-ios.sh
```

### 🤖 **Android**
```bash
# На любом компьютере:
git clone <repository-url>
cd salanum
chmod +x install-android.sh
./install-android.sh
```

### 🪟 **Windows**
```cmd
# В PowerShell:
git clone <repository-url>
cd salanum
.\install-windows.bat
```

### 🐧 **Linux**
```bash
# На Linux:
git clone <repository-url>
cd salanum
chmod +x install.sh
./install.sh
```

## 📋 Системные требования

### **Минимальные требования:**
- **RAM:** 2 GB
- **Диск:** 2 GB свободного места
- **Интернет:** Для первоначальной установки
- **Процессор:** 64-bit

### **Рекомендуемые требования:**
- **RAM:** 4 GB+
- **Диск:** 5 GB+ свободного места
- **Интернет:** Стабильное соединение
- **Процессор:** 4+ ядра

## 🔧 Установка зависимостей

### **Общие зависимости:**
```bash
# Node.js 18+
# Git
# npm/yarn
```

### **Платформо-специфичные:**
- **iOS:** Xcode, CocoaPods, Apple Developer Account
- **Android:** Android Studio, JDK 11+, Android SDK
- **Windows:** PowerShell, Visual Studio Code
- **Linux:** systemd, OpenSSL, build-essential
- **macOS:** Homebrew, Xcode Command Line Tools

## 🧪 Тестирование

### **Автоматические тесты:**
```bash
# Запуск всех тестов
npm test

# Тесты по платформам
npm run test:ios
npm run test:android
npm run test:windows
npm run test:linux
npm run test:macos
```

### **Ручное тестирование:**
- **Основные функции:** Регистрация, авторизация, отправка сообщений
- **Keeper:** Нейросетевая защита, биометрическая аутентификация
- **Bluetooth P2P:** Передача приложения, mesh networking
- **Solana:** Создание кошелька, транзакции

## 🐛 Решение проблем

### **Общие проблемы:**

#### **"npm install failed"**
```bash
# Решение для всех платформ:
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### **"Permission denied"**
```bash
# Linux/macOS:
sudo chmod +x install.sh
sudo npm install -g

# Windows:
# Запустите PowerShell как администратор
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### **"Port already in use"**
```bash
# Linux/macOS:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### **Платформо-специфичные проблемы:**

#### **iOS:**
- **"Untrusted Developer"** → Настройки → Основные → Управление VPN и устройством → Доверять
- **"Could not find iPhone"** → Убедитесь, что iPhone подключен и разблокирован

#### **Android:**
- **"Device not found"** → Включите USB отладку, проверьте кабель
- **"Build failed"** → Очистите Gradle кэш, переустановите зависимости

#### **Windows:**
- **"PowerShell execution policy"** → Set-ExecutionPolicy RemoteSigned
- **"Firewall blocking"** → Добавьте исключения для портов 3000, 3001

#### **Linux:**
- **"Permission denied"** → Используйте sudo для системных операций
- **"Service not starting"** → Проверьте systemd статус, логи

## 🔒 Безопасность по платформам

### **iOS:**
- **Keychain** для хранения ключей
- **Face ID/Touch ID** для биометрии
- **App Sandbox** для изоляции

### **Android:**
- **Android Keystore** для ключей
- **BiometricPrompt** для биометрии
- **Scoped Storage** для файлов

### **Windows:**
- **Windows Hello** для биометрии
- **BitLocker** для шифрования
- **Windows Defender** для защиты

### **Linux:**
- **OpenSSL** для криптографии
- **systemd** для служб
- **SELinux/AppArmor** для изоляции

### **macOS:**
- **Keychain** для ключей
- **Touch ID** для биометрии
- **Gatekeeper** для безопасности

## 📊 Производительность

### **Оптимизация по платформам:**

#### **iOS:**
- Используйте **Metal** для графики
- **Core Data** для базы данных
- **Background App Refresh** для фоновых задач

#### **Android:**
- **RecyclerView** для списков
- **Room** для базы данных
- **WorkManager** для фоновых задач

#### **Windows:**
- **Windows Performance Toolkit** для профилирования
- **SSD** для лучшей производительности
- **Windows Defender исключения** для проекта

#### **Linux:**
- **systemd** для управления службами
- **cgroups** для ограничения ресурсов
- **perf** для профилирования

#### **macOS:**
- **Instruments** для профилирования
- **Core Animation** для графики
- **Grand Central Dispatch** для многопоточности

## 🚀 Развертывание

### **Разработка:**
```bash
# Локальная разработка
npm run dev

# Тестирование
npm test

# Сборка
npm run build
```

### **Продакшн:**
```bash
# Docker
docker-compose up -d

# PM2 (Node.js)
pm2 start ecosystem.config.js

# systemd (Linux)
sudo systemctl start salanum
```

### **Мобильные приложения:**
- **iOS:** App Store, TestFlight, AltStore
- **Android:** Google Play, APK, F-Droid

## 📞 Поддержка

### **Документация по платформам:**
- **iOS:** [IPHONE_INSTALLATION.md](IPHONE_INSTALLATION.md)
- **Android:** [ANDROID_INSTALLATION.md](ANDROID_INSTALLATION.md)
- **Windows:** [WINDOWS_INSTALLATION.md](WINDOWS_INSTALLATION.md)
- **Linux:** [LINUX_INSTALLATION.md](LINUX_INSTALLATION.md)
- **macOS:** [MACOS_INSTALLATION.md](MACOS_INSTALLATION.md)

### **Быстрые старты:**
- **iOS:** [IPHONE_QUICK_START.md](IPHONE_QUICK_START.md)
- **Android:** [ANDROID_QUICK_START.md](ANDROID_QUICK_START.md)
- **Windows:** [WINDOWS_QUICK_START.md](WINDOWS_QUICK_START.md)

### **Простые инструкции:**
- **iOS:** [IPHONE_SIMPLE.md](IPHONE_SIMPLE.md)
- **Android:** [ANDROID_SIMPLE.md](ANDROID_SIMPLE.md)
- **Windows:** [WINDOWS_SIMPLE.md](WINDOWS_SIMPLE.md)

### **Контакты:**
- **Email:** support@salanum.com
- **GitHub Issues:** [Создать issue](https://github.com/your-repo/issues)
- **Discord:** [Discord Server](https://discord.gg/salanum)
- **Telegram:** [Telegram Channel](https://t.me/salanum)

## 🎯 Выбор платформы

### **Для разработчиков:**
- **iOS:** Если у вас есть Mac и Apple Developer Account
- **Android:** Если вы хотите быстро протестировать на любом устройстве
- **Windows:** Если вы используете Windows для разработки
- **Linux:** Если вы предпочитаете open-source окружение

### **Для пользователей:**
- **iOS:** Если у вас iPhone/iPad и вы цените безопасность
- **Android:** Если у вас Android устройство и вы хотите гибкость
- **Windows:** Если вы используете Windows как основную ОС
- **Linux:** Если вы используете Linux и цените приватность

### **Для предприятий:**
- **Все платформы:** Для максимального покрытия пользователей
- **Docker:** Для контейнеризованного развертывания
- **Kubernetes:** Для масштабируемого развертывания

---

**Salanum** - Выберите вашу платформу и начните безопасную коммуникацию! 🌐🔒

*Полная поддержка всех основных платформ*
