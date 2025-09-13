@echo off
setlocal enabledelayedexpansion

REM Salanum - Автоматическая установка для Windows
echo 🔒 Salanum - Автоматическая установка для Windows
echo ================================================

REM Функция для вывода сообщений
:print_status
echo [INFO] %~1
goto :eof

:print_success
echo [SUCCESS] %~1
goto :eof

:print_warning
echo [WARNING] %~1
goto :eof

:print_error
echo [ERROR] %~1
goto :eof

REM Проверка зависимостей
:check_dependencies
call :print_status "Проверка зависимостей..."

REM Проверка Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_error "Node.js не установлен. Пожалуйста, установите Node.js 18+ с https://nodejs.org/"
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    call :print_success "Node.js установлен: !NODE_VERSION!"
)

REM Проверка npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_error "npm не установлен"
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    call :print_success "npm установлен: !NPM_VERSION!"
)

REM Проверка Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_error "Git не установлен. Пожалуйста, установите Git с https://git-scm.com/"
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('git --version') do set GIT_VERSION=%%i
    call :print_success "Git установлен: !GIT_VERSION!"
)

REM Проверка MongoDB (опционально)
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_warning "MongoDB не установлен. Будет использован Docker контейнер"
) else (
    call :print_success "MongoDB установлен"
)

REM Проверка Docker (опционально)
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_warning "Docker не установлен. Некоторые функции будут недоступны"
    set DOCKER_AVAILABLE=false
) else (
    call :print_success "Docker установлен"
    set DOCKER_AVAILABLE=true
)

goto :eof

REM Установка зависимостей
:install_dependencies
call :print_status "Установка зависимостей..."

REM Установка корневых зависимостей
call :print_status "Установка корневых зависимостей..."
call npm install
if %errorlevel% neq 0 (
    call :print_error "Ошибка установки корневых зависимостей"
    exit /b 1
) else (
    call :print_success "Корневые зависимости установлены"
)

REM Установка серверных зависимостей
call :print_status "Установка серверных зависимостей..."
cd server
call npm install
cd ..
if %errorlevel% neq 0 (
    call :print_error "Ошибка установки серверных зависимостей"
    exit /b 1
) else (
    call :print_success "Серверные зависимости установлены"
)

REM Установка клиентских зависимостей
call :print_status "Установка клиентских зависимостей..."
cd client
call npm install
cd ..
if %errorlevel% neq 0 (
    call :print_error "Ошибка установки клиентских зависимостей"
    exit /b 1
) else (
    call :print_success "Клиентские зависимости установлены"
)

REM Установка мобильных зависимостей
call :print_status "Установка мобильных зависимостей..."
cd mobile
call npm install
cd ..
if %errorlevel% neq 0 (
    call :print_error "Ошибка установки мобильных зависимостей"
    exit /b 1
) else (
    call :print_success "Мобильные зависимости установлены"
)

goto :eof

REM Настройка окружения
:setup_environment
call :print_status "Настройка окружения..."

REM Создание .env файла если не существует
if not exist .env (
    call :print_status "Создание .env файла..."
    copy env.example .env >nul
    call :print_success ".env файл создан"
    call :print_warning "Пожалуйста, отредактируйте .env файл с вашими настройками"
) else (
    call :print_success ".env файл уже существует"
)

REM Создание директорий
call :print_status "Создание необходимых директорий..."
if not exist server\logs mkdir server\logs
if not exist server\data mkdir server\data
if not exist client\build mkdir client\build
if not exist mobile\android\app\build mkdir mobile\android\app\build

call :print_success "Директории созданы"
goto :eof

REM Настройка MongoDB
:setup_mongodb
if "%DOCKER_AVAILABLE%"=="true" (
    call :print_status "Настройка MongoDB через Docker..."
    
    REM Запуск MongoDB контейнера
    docker run -d --name salanum-mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=secure_password_123 -e MONGO_INITDB_DATABASE=salanum mongo:6.0
    
    if %errorlevel% neq 0 (
        call :print_warning "Не удалось запустить MongoDB контейнер"
    ) else (
        call :print_success "MongoDB контейнер запущен"
    )
) else (
    call :print_warning "Docker недоступен. Пожалуйста, установите MongoDB вручную"
)
goto :eof

REM Настройка мобильного окружения
:setup_mobile
call :print_status "Настройка мобильного окружения..."

REM Проверка React Native CLI
react-native --version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_status "Установка React Native CLI..."
    call npm install -g react-native-cli
)

REM Настройка Android (если доступно)
adb version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_warning "Android SDK не обнаружен. Установите Android Studio для разработки Android приложений"
) else (
    call :print_success "Android SDK обнаружен"
)

goto :eof

REM Тестирование установки
:test_installation
call :print_status "Тестирование установки..."

REM Тест Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_error "Node.js не работает"
    exit /b 1
) else (
    call :print_success "Node.js работает корректно"
)

REM Тест npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_error "npm не работает"
    exit /b 1
) else (
    call :print_success "npm работает корректно"
)

REM Тест серверных зависимостей
cd server
npm list >nul 2>&1
if %errorlevel% neq 0 (
    call :print_error "Проблемы с серверными зависимостями"
    exit /b 1
) else (
    call :print_success "Серверные зависимости установлены корректно"
)
cd ..

REM Тест клиентских зависимостей
cd client
npm list >nul 2>&1
if %errorlevel% neq 0 (
    call :print_error "Проблемы с клиентскими зависимостями"
    exit /b 1
) else (
    call :print_success "Клиентские зависимости установлены корректно"
)
cd ..

goto :eof

REM Запуск приложения
:start_application
call :print_status "Запуск приложения..."

REM Проверка .env файла
if not exist .env (
    call :print_error ".env файл не найден. Пожалуйста, создайте его на основе env.example"
    exit /b 1
)

call :print_success "Установка завершена!"
echo.
echo 🚀 Для запуска приложения используйте:
echo    npm run dev          # Запуск веб-версии
echo    npm run server       # Только backend
echo    npm run client       # Только frontend
echo.
echo 📱 Для мобильной разработки:
echo    cd mobile
echo    npm run android      # Android
echo.
echo 🐳 Для Docker:
echo    docker-compose -f docker-compose.keeper.yml up -d
echo.
echo 🧪 Для тестирования:
echo    node test-keeper-final.js
echo.
echo 📖 Документация:
echo    README_FINAL.md
echo    INSTALLATION_GUIDE.md
echo    KEEPER_FINAL_INTEGRATION.md
goto :eof

REM Основная функция
:main
echo Начинаем установку Salanum...
echo.

call :check_dependencies
call :install_dependencies
call :setup_environment
call :setup_mongodb
call :setup_mobile

call :test_installation
if %errorlevel% neq 0 (
    call :print_error "Установка завершена с ошибками"
    exit /b 1
) else (
    call :start_application
)

goto :eof

REM Запуск основной функции
call :main

pause
