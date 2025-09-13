# 🪟 Salanum на Windows - Быстрый старт

## 🎯 Простой способ установки

### 📋 Что нужно:
- **Windows 10/11** (64-bit)
- **Node.js 18+** - [Скачать](https://nodejs.org/)
- **Git for Windows** - [Скачать](https://git-scm.com/download/win)
- **PowerShell** (встроен в Windows)

## 🚀 Пошаговая установка

### Шаг 1: Подготовка системы
```powershell
# Откройте PowerShell как администратор
# Установите Node.js с https://nodejs.org/
# Установите Git с https://git-scm.com/download/win
```

### Шаг 2: Скачивание проекта
```powershell
# Клонирование проекта
git clone <repository-url>
cd salanum

# Установка зависимостей
npm install
```

### Шаг 3: Настройка окружения
```powershell
# Создание .env файла
Copy-Item env.example .env

# Редактирование .env файла (опционально)
notepad .env
```

### Шаг 4: Запуск приложения
```powershell
# Запуск в режиме разработки
npm run dev

# Приложение будет доступно по адресам:
# Сервер: http://localhost:3000
# Клиент: http://localhost:3001
```

### Шаг 5: Открытие в браузере
1. **Откройте браузер**
2. **Перейдите по адресу:** http://localhost:3001
3. **Создайте аккаунт** и начните использовать Salanum

## ✅ Готово!

Теперь у вас есть Salanum на Windows! 

### 🔧 Что делать дальше:
1. Откройте http://localhost:3001 в браузере
2. Создайте аккаунт
3. Включите "Keeper Neural Security" в настройках
4. Настройте Solana кошелек

## 🆘 Если что-то не работает:

### ❌ "npm install failed"
**Решение:**
```powershell
# Очистка кэша
npm cache clean --force

# Переустановка
Remove-Item -Recurse -Force node_modules
npm install
```

### ❌ "Permission denied"
**Решение:**
1. Запустите PowerShell как администратор
2. Выполните:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### ❌ "Port already in use"
**Решение:**
```powershell
# Найти процесс, использующий порт
netstat -ano | findstr :3000

# Завершить процесс
taskkill /PID <PID> /F
```

### ❌ "Git not found"
**Решение:**
1. Установите Git for Windows
2. Перезапустите PowerShell
3. Проверьте: `git --version`

## 🪟 Особенности Windows версии:

### 🔒 Безопасность
- **Windows Hello** для биометрической аутентификации
- **Хранитель** защищает сообщения
- **BitLocker** для шифрования данных

### 🌐 Сеть
- **Windows Firewall** настройки
- **VPN** поддержка
- **Proxy** настройки

### 🤖 AI защита
- Маскирует чувствительные сообщения
- Работает в реальном времени
- Защищает даже если систему взломают

## 💡 Полезные советы:

### Для лучшей работы:
1. **Добавьте папку проекта в исключения Windows Defender**
2. **Настройте автозапуск** через планировщик задач
3. **Используйте SSD** для лучшей производительности
4. **Настройте резервное копирование** данных

### Для разработчиков:
- Используйте **Visual Studio Code** для разработки
- **WSL** для Linux-подобного окружения
- **Docker Desktop** для контейнеризации

## 📞 Нужна помощь?

### Контакты:
- **Email:** support@salanum.com
- **GitHub:** [Создать issue](https://github.com/your-repo/issues)
- **Discord:** [Присоединиться](https://discord.gg/salanum)

### Документация:
- **Подробная инструкция:** [WINDOWS_INSTALLATION.md](WINDOWS_INSTALLATION.md)
- **Простая инструкция:** [WINDOWS_SIMPLE.md](WINDOWS_SIMPLE.md)

---

**Salanum на Windows** - Безопасная коммуникация на вашем ПК! 🪟🔒

*Простая установка за 5 минут*
