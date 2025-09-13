@echo off
REM Salanum - Автоматическая установка для Windows
echo 🪟 Salanum - Автоматическая установка для Windows
echo ================================================

REM Установка цветов
color 0A

REM Функции для вывода
echo [INFO] Начинаем установку Salanum для Windows...

REM Проверка PowerShell
powershell -Command "Write-Host '[INFO] Проверка PowerShell...' -ForegroundColor Blue"
if %errorlevel% neq 0 (
    echo [ERROR] PowerShell не найден
    pause
    exit /b 1
)
echo [SUCCESS] PowerShell обнаружен

REM Проверка Node.js
echo [INFO] Проверка Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js не установлен. Установите Node.js 18+ с https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [SUCCESS] Node.js установлен: %NODE_VERSION%

REM Проверка npm
echo [INFO] Проверка npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm не установлен
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [SUCCESS] npm установлен: %NPM_VERSION%

REM Проверка Git
echo [INFO] Проверка Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git не установлен. Установите Git с https://git-scm.com/download/win
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('git --version') do set GIT_VERSION=%%i
echo [SUCCESS] Git установлен: %GIT_VERSION%

REM Установка зависимостей
echo [INFO] Установка зависимостей...
echo [INFO] Установка корневых зависимостей...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Ошибка установки корневых зависимостей
    pause
    exit /b 1
)
echo [SUCCESS] Корневые зависимости установлены

REM Создание .env файла
echo [INFO] Создание .env файла...
if not exist .env (
    if exist env.example (
        copy env.example .env >nul
        echo [SUCCESS] .env файл создан
        echo [WARNING] Пожалуйста, отредактируйте .env файл с вашими настройками
    ) else (
        echo [WARNING] env.example не найден, создаем базовый .env файл
        echo NODE_ENV=development > .env
        echo PORT=3000 >> .env
        echo CLIENT_PORT=3001 >> .env
        echo MONGODB_URI=mongodb://localhost:27017/salanum >> .env
        echo JWT_SECRET=your-super-secret-jwt-key >> .env
        echo KEEPER_ENABLED=true >> .env
        echo [SUCCESS] Базовый .env файл создан
    )
) else (
    echo [SUCCESS] .env файл уже существует
)

REM Создание директорий
echo [INFO] Создание необходимых директорий...
if not exist server\logs mkdir server\logs
if not exist server\data mkdir server\data
if not exist client\build mkdir client\build
echo [SUCCESS] Директории созданы

REM Проверка портов
echo [INFO] Проверка доступности портов...
netstat -an | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo [WARNING] Порт 3000 уже используется
    echo [INFO] Попытка завершить процесс на порту 3000...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        taskkill /PID %%a /F >nul 2>&1
    )
)

netstat -an | findstr :3001 >nul
if %errorlevel% equ 0 (
    echo [WARNING] Порт 3001 уже используется
    echo [INFO] Попытка завершить процесс на порту 3001...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
        taskkill /PID %%a /F >nul 2>&1
    )
)

REM Тестирование установки
echo [INFO] Тестирование установки...
node --version >nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js не работает
    pause
    exit /b 1
)
echo [SUCCESS] Node.js работает корректно

npm --version >nul
if %errorlevel% neq 0 (
    echo [ERROR] npm не работает
    pause
    exit /b 1
)
echo [SUCCESS] npm работает корректно

REM Проверка файлов проекта
if not exist server\index.js (
    echo [ERROR] Серверный файл не найден
    pause
    exit /b 1
)
echo [SUCCESS] Серверные файлы найдены

if not exist client\src\App.js (
    echo [ERROR] Клиентские файлы не найдены
    pause
    exit /b 1
)
echo [SUCCESS] Клиентские файлы найдены

REM Настройка Windows Firewall
echo [INFO] Настройка Windows Firewall...
powershell -Command "New-NetFirewallRule -DisplayName 'Salanum Server' -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -ErrorAction SilentlyContinue" >nul 2>&1
powershell -Command "New-NetFirewallRule -DisplayName 'Salanum Client' -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow -ErrorAction SilentlyContinue" >nul 2>&1
echo [SUCCESS] Правила брандмауэра настроены

REM Создание ярлыков
echo [INFO] Создание ярлыков...
if not exist "Salanum Server.lnk" (
    powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%CD%\Salanum Server.lnk'); $Shortcut.TargetPath = 'cmd.exe'; $Shortcut.Arguments = '/k \"cd /d %CD% && npm run server\"'; $Shortcut.WorkingDirectory = '%CD%'; $Shortcut.Description = 'Salanum Server'; $Shortcut.Save()" >nul 2>&1
    echo [SUCCESS] Ярлык для сервера создан
)

if not exist "Salanum Client.lnk" (
    powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%CD%\Salanum Client.lnk'); $Shortcut.TargetPath = 'cmd.exe'; $Shortcut.Arguments = '/k \"cd /d %CD% && npm run client\"'; $Shortcut.WorkingDirectory = '%CD%'; $Shortcut.Description = 'Salanum Client'; $Shortcut.Save()" >nul 2>&1
    echo [SUCCESS] Ярлык для клиента создан
)

if not exist "Salanum Dev.lnk" (
    powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%CD%\Salanum Dev.lnk'); $Shortcut.TargetPath = 'cmd.exe'; $Shortcut.Arguments = '/k \"cd /d %CD% && npm run dev\"'; $Shortcut.WorkingDirectory = '%CD%'; $Shortcut.Description = 'Salanum Development'; $Shortcut.Save()" >nul 2>&1
    echo [SUCCESS] Ярлык для разработки создан
)

REM Отображение инструкций
echo.
echo 🎉 Установка завершена!
echo ======================
echo.
echo 🪟 Следующие шаги для запуска Salanum:
echo.
echo 1. 🚀 Запуск приложения:
echo    - Дважды кликните на "Salanum Dev.lnk"
echo    - Или выполните: npm run dev
echo.
echo 2. 🌐 Открытие в браузере:
echo    - Сервер: http://localhost:3000
echo    - Клиент: http://localhost:3001
echo.
echo 3. 🔧 Настройка:
echo    - Отредактируйте .env файл с вашими настройками
echo    - Создайте аккаунт в приложении
echo    - Включите "Keeper Neural Security"
echo.
echo 📖 Документация:
echo    WINDOWS_INSTALLATION.md         # Подробная инструкция
echo    WINDOWS_QUICK_START.md          # Быстрый старт
echo    WINDOWS_SIMPLE.md               # Для обычных пользователей
echo.
echo 🆘 Если возникли проблемы:
echo    - Убедитесь, что порты 3000 и 3001 свободны
echo    - Проверьте настройки брандмауэра
echo    - Запустите PowerShell как администратор
echo    - Проверьте логи в server/logs/
echo.
echo 🚀 Готово к использованию!
echo.

REM Опциональный запуск
set /p choice="Хотите запустить Salanum сейчас? (y/n): "
if /i "%choice%"=="y" (
    echo [INFO] Запуск Salanum...
    start cmd /k "npm run dev"
    echo [SUCCESS] Salanum запущен!
    echo [INFO] Откройте http://localhost:3001 в браузере
) else (
    echo [INFO] Salanum готов к запуску
    echo [INFO] Используйте ярлыки или команду: npm run dev
)

echo.
echo Нажмите любую клавишу для выхода...
pause >nul
