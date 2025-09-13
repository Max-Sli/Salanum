# 🪟 Salanum на Windows - Простая инструкция

## 🎯 Для обычных пользователей

### ❗ Важно знать:
- **Нужен Windows 10/11** (64-bit)
- **Нужен интернет** для скачивания
- **Бесплатно** - не нужны платные программы

## 🚀 Простая установка (5 шагов)

### Шаг 1: Подготовка Windows
1. **Скачайте Node.js** с сайта [nodejs.org](https://nodejs.org/)
2. **Скачайте Git** с сайта [git-scm.com](https://git-scm.com/download/win)
3. **Откройте PowerShell** (найдите в поиске)

### Шаг 2: Скачивание Salanum
```powershell
# Скопируйте и вставьте эти команды в PowerShell:
git clone https://github.com/your-repo/salanum.git
cd salanum
```

### Шаг 3: Автоматическая установка
```powershell
# Скопируйте и вставьте:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\install-windows.bat
```

### Шаг 4: Запуск приложения
```powershell
# В PowerShell выполните:
npm run dev
```

### Шаг 5: Открытие в браузере
1. **Откройте браузер** (Chrome, Firefox, Edge)
2. **Перейдите по адресу:** http://localhost:3001
3. **Создайте аккаунт** и начните использовать

## ✅ Готово!

Теперь у вас есть Salanum на Windows! 🎉

## 🔧 Что делать дальше:

### 1. Первый запуск
- Откройте http://localhost:3001 в браузере
- Создайте аккаунт
- Настройте профиль

### 2. Включение Хранителя
- Перейдите в **Настройки**
- Включите **"Keeper Neural Security"**
- Предоставьте разрешения на:
  - Микрофон (для голоса)
  - Камеру (для сканирования QR)
  - Windows Hello (для безопасности)

### 3. Настройка Solana кошелька
- Создайте Solana кошелек
- Пополните баланс
- Начните отправлять криптовалюту

## 🆘 Если что-то не работает:

### ❌ "Не удается установить зависимости"
**Решение:**
```powershell
# В PowerShell выполните:
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install
```

### ❌ "Ошибка разрешений"
**Решение:**
1. Запустите PowerShell как администратор
2. Выполните:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### ❌ "Порт уже используется"
**Решение:**
```powershell
# Найдите и завершите процесс:
netstat -ano | findstr :3000
taskkill /PID <номер_процесса> /F
```

### ❌ "Git не найден"
**Решение:**
1. Установите Git for Windows
2. Перезапустите PowerShell
3. Проверьте: `git --version`

## 🪟 Особенности Windows версии:

### 🔒 Безопасность
- **Windows Hello** для входа
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
- **Быстрый старт:** [WINDOWS_QUICK_START.md](WINDOWS_QUICK_START.md)

---

**Salanum на Windows** - Безопасная коммуникация на вашем ПК! 🪟🔒

*Простая установка за 5 минут*
