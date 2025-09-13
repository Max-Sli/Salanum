# 🪟 Установка Salanum на Windows

## 🎯 Обзор

Данная инструкция поможет вам установить **Salanum** на Windows. Есть несколько способов установки в зависимости от ваших потребностей.

## 📋 Предварительные требования

### Для разработки:
- **Windows 10/11** (64-bit)
- **Node.js 18+** - [Скачать](https://nodejs.org/)
- **Git for Windows** - [Скачать](https://git-scm.com/download/win)
- **Visual Studio Code** (рекомендуется) - [Скачать](https://code.visualstudio.com/)
- **Windows Subsystem for Linux (WSL)** (опционально) - [Установка](https://docs.microsoft.com/en-us/windows/wsl/install)

### Для пользователя:
- **Windows 10/11** (64-bit)
- **4 GB RAM** минимум
- **2 GB свободного места** на диске
- **Интернет соединение** для первоначальной установки

## 🚀 Способы установки

### 1. Установка через PowerShell (рекомендуется)

#### Шаг 1: Подготовка системы
```powershell
# Откройте PowerShell как администратор
# Установите Chocolatey (если не установлен)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Установите необходимые компоненты
choco install nodejs git vscode -y
```

#### Шаг 2: Клонирование проекта
```powershell
# Клонирование проекта
git clone <repository-url>
cd salanum

# Установка зависимостей
npm install
```

#### Шаг 3: Запуск приложения
```powershell
# Запуск в режиме разработки
npm run dev

# Или запуск отдельных компонентов
npm run server  # Запуск сервера
npm run client  # Запуск клиента
```

### 2. Установка через Command Prompt

#### Шаг 1: Подготовка
```cmd
# Откройте Command Prompt как администратор
# Установите Node.js с https://nodejs.org/
# Установите Git с https://git-scm.com/download/win
```

#### Шаг 2: Клонирование и установка
```cmd
# Клонирование проекта
git clone <repository-url>
cd salanum

# Установка зависимостей
npm install

# Запуск приложения
npm run dev
```

### 3. Установка через WSL (Windows Subsystem for Linux)

#### Шаг 1: Установка WSL
```powershell
# В PowerShell как администратор
wsl --install

# Перезагрузите компьютер
```

#### Шаг 2: Установка в WSL
```bash
# В WSL терминале
sudo apt update
sudo apt install nodejs npm git -y

# Клонирование проекта
git clone <repository-url>
cd salanum

# Установка зависимостей
npm install

# Запуск приложения
npm run dev
```

### 4. Установка через Docker Desktop

#### Шаг 1: Установка Docker Desktop
1. **Скачайте Docker Desktop** с [docker.com](https://www.docker.com/products/docker-desktop/)
2. **Установите Docker Desktop**
3. **Запустите Docker Desktop**

#### Шаг 2: Запуск через Docker
```powershell
# Клонирование проекта
git clone <repository-url>
cd salanum

# Запуск через Docker Compose
docker-compose up -d

# Или запуск отдельных сервисов
docker-compose up server client
```

## 🔧 Настройка окружения

### Переменные окружения
Создайте файл `.env` в корне проекта:
```env
# Основные настройки
NODE_ENV=development
PORT=3000
CLIENT_PORT=3001

# База данных
MONGODB_URI=mongodb://localhost:27017/salanum

# JWT секреты
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Solana настройки
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_PRIVATE_KEY=your-solana-private-key

# Keeper настройки
KEEPER_ENABLED=true
KEEPER_LOG_PATH=./server/logs/keeper.log
KEEPER_LOG_KEY=your-keeper-log-encryption-key

# AI настройки
AI_SERVICE_URL=http://localhost:5000
AI_API_KEY=your-ai-api-key

# Шифрование
ENCRYPTION_KEY=your-encryption-key
```

### Настройка Windows Firewall
```powershell
# Разрешить входящие соединения для Node.js
New-NetFirewallRule -DisplayName "Salanum Server" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
New-NetFirewallRule -DisplayName "Salanum Client" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow
```

## 🧪 Тестирование на Windows

### 1. Тестирование основных функций
```powershell
# Запуск всех тестов
npm test

# Запуск серверных тестов
npm run test:server

# Запуск клиентских тестов
npm run test:client
```

### 2. Тестирование Keeper
```powershell
# Тест Keeper активации
node test-keeper.js

# Тест финального Keeper
node test-keeper-final.js
```

### 3. Тестирование Bluetooth (если доступно)
```powershell
# Проверка Bluetooth адаптера
Get-PnpDevice -Class Bluetooth

# Тест Bluetooth соединения
npm run test:bluetooth
```

## 🐛 Решение проблем

### Проблема: "npm install failed"
**Решение:**
```powershell
# Очистка npm кэша
npm cache clean --force

# Удаление node_modules
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Переустановка
npm install
```

### Проблема: "Permission denied"
**Решение:**
1. Запустите PowerShell как администратор
2. Выполните:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### Проблема: "Port already in use"
**Решение:**
```powershell
# Найти процесс, использующий порт
netstat -ano | findstr :3000

# Завершить процесс
taskkill /PID <PID> /F

# Или изменить порт в .env файле
```

### Проблема: "Git not found"
**Решение:**
1. Установите Git for Windows
2. Добавьте Git в PATH:
   ```powershell
   $env:PATH += ";C:\Program Files\Git\bin"
   ```

### Проблема: "Node.js not found"
**Решение:**
1. Установите Node.js с [nodejs.org](https://nodejs.org/)
2. Перезапустите PowerShell
3. Проверьте установку:
   ```powershell
   node --version
   npm --version
   ```

## 📱 Особенности Windows версии

### 1. Производительность
- Windows Defender может замедлять работу
- Добавьте папку проекта в исключения
- Используйте SSD для лучшей производительности

### 2. Сеть
- Windows Firewall может блокировать соединения
- Настройте правила для портов 3000 и 3001
- Используйте VPN для обхода блокировок

### 3. Безопасность
- Windows Hello для биометрической аутентификации
- BitLocker для шифрования диска
- Windows Defender для защиты от вирусов

## 🔒 Настройка безопасности

### 1. Windows Defender исключения
```powershell
# Добавить папку проекта в исключения
Add-MpPreference -ExclusionPath "C:\path\to\salanum"

# Добавить процесс Node.js в исключения
Add-MpPreference -ExclusionProcess "node.exe"
```

### 2. Firewall настройки
```powershell
# Разрешить Salanum через брандмауэр
New-NetFirewallRule -DisplayName "Salanum" -Direction Inbound -Protocol TCP -LocalPort 3000,3001 -Action Allow
```

### 3. Шифрование данных
```powershell
# Включить BitLocker (если доступно)
manage-bde -on C: -usedspaceonly
```

## 📊 Мониторинг и отладка

### 1. Логи Windows
```powershell
# Просмотр логов приложения
Get-EventLog -LogName Application -Source "Salanum" -Newest 10

# Просмотр логов системы
Get-EventLog -LogName System -Newest 10
```

### 2. Мониторинг производительности
```powershell
# Мониторинг CPU и памяти
Get-Process node | Select-Object ProcessName, CPU, WorkingSet

# Мониторинг сети
netstat -an | findstr :3000
```

### 3. Отладка через Visual Studio Code
1. Установите расширения:
   - Node.js Extension Pack
   - JavaScript Debugger
   - GitLens

2. Настройте launch.json:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Launch Server",
         "type": "node",
         "request": "launch",
         "program": "${workspaceFolder}/server/index.js",
         "env": {
           "NODE_ENV": "development"
         }
       }
     ]
   }
   ```

## 🚀 Оптимизация для Windows

### 1. Автозапуск
```powershell
# Создать задачу в планировщике
$action = New-ScheduledTaskAction -Execute "node" -Argument "C:\path\to\salanum\server\index.js" -WorkingDirectory "C:\path\to\salanum"
$trigger = New-ScheduledTaskTrigger -AtStartup
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "Salanum Server"
```

### 2. Служба Windows
```powershell
# Установка как службы Windows
nssm install SalanumServer "C:\Program Files\nodejs\node.exe" "C:\path\to\salanum\server\index.js"
nssm start SalanumServer
```

### 3. Производительность
```powershell
# Оптимизация Node.js
$env:NODE_OPTIONS = "--max-old-space-size=4096"

# Оптимизация Windows
powercfg -setactive SCHEME_MIN
```

## 📞 Поддержка

### Полезные команды:
```powershell
# Очистка проекта
Remove-Item -Recurse -Force node_modules
npm install

# Перезапуск сервисов
Restart-Service -Name "SalanumServer"

# Проверка статуса
Get-Service -Name "SalanumServer"
```

### Контакты:
- **GitHub Issues:** [Создать issue](https://github.com/your-repo/issues)
- **Email:** support@salanum.com
- **Discord:** [Discord Server](https://discord.gg/salanum)

---

**Salanum для Windows** - Безопасная коммуникация на Windows! 🪟🔒

*Следуйте инструкциям для успешной установки на Windows*
