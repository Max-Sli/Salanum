#!/bin/bash

# Salanum - Автоматическая установка для Android
echo "🤖 Salanum - Автоматическая установка для Android"
echo "================================================"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для вывода
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка операционной системы
check_os() {
    print_status "Проверка операционной системы..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
        print_success "Linux обнаружена"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        print_success "macOS обнаружена"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        OS="windows"
        print_success "Windows обнаружена"
    else
        print_warning "Неизвестная операционная система: $OSTYPE"
        OS="unknown"
    fi
}

# Проверка зависимостей
check_dependencies() {
    print_status "Проверка зависимостей..."
    
    # Проверка Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js установлен: $NODE_VERSION"
        
        # Проверка версии Node.js
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR" -lt 18 ]; then
            print_error "Требуется Node.js версии 18 или выше. Текущая версия: $NODE_VERSION"
            exit 1
        fi
    else
        print_error "Node.js не установлен. Установите Node.js 18+ с https://nodejs.org/"
        exit 1
    fi
    
    # Проверка npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm установлен: $NPM_VERSION"
    else
        print_error "npm не установлен"
        exit 1
    fi
    
    # Проверка Git
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version)
        print_success "Git установлен: $GIT_VERSION"
    else
        print_error "Git не установлен. Установите Git с https://git-scm.com/"
        exit 1
    fi
    
    # Проверка Java
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | head -n1)
        print_success "Java установлен: $JAVA_VERSION"
    else
        print_warning "Java не установлен. Установите JDK 11+ с https://adoptium.net/"
    fi
    
    # Проверка Android SDK
    if [ -d "$ANDROID_HOME" ] || [ -d "$ANDROID_SDK_ROOT" ]; then
        print_success "Android SDK обнаружен"
    else
        print_warning "Android SDK не найден. Установите Android Studio с https://developer.android.com/studio"
    fi
    
    # Проверка ADB
    if command -v adb &> /dev/null; then
        ADB_VERSION=$(adb version | head -n1)
        print_success "ADB установлен: $ADB_VERSION"
    else
        print_warning "ADB не установлен. Установите Android Platform Tools"
    fi
}

# Установка зависимостей
install_dependencies() {
    print_status "Установка зависимостей..."
    
    # Установка корневых зависимостей
    print_status "Установка корневых зависимостей..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Корневые зависимости установлены"
    else
        print_error "Ошибка установки корневых зависимостей"
        exit 1
    fi
    
    # Установка мобильных зависимостей
    print_status "Установка мобильных зависимостей..."
    cd mobile
    npm install
    cd ..
    
    if [ $? -eq 0 ]; then
        print_success "Мобильные зависимости установлены"
    else
        print_error "Ошибка установки мобильных зависимостей"
        exit 1
    fi
    
    # Установка Android зависимостей
    print_status "Установка Android зависимостей..."
    cd mobile/android
    ./gradlew clean
    cd ../..
    
    if [ $? -eq 0 ]; then
        print_success "Android зависимости установлены"
    else
        print_error "Ошибка установки Android зависимостей"
        exit 1
    fi
}

# Настройка проекта
setup_project() {
    print_status "Настройка проекта..."
    
    # Создание .env файла если не существует
    if [ ! -f .env ]; then
        print_status "Создание .env файла..."
        cp env.example .env
        print_success ".env файл создан"
        print_warning "Пожалуйста, отредактируйте .env файл с вашими настройками"
    else
        print_success ".env файл уже существует"
    fi
    
    # Создание директорий
    print_status "Создание необходимых директорий..."
    mkdir -p server/logs
    mkdir -p server/data
    mkdir -p mobile/android/app/build
    
    print_success "Директории созданы"
}

# Проверка подключенных устройств
check_devices() {
    print_status "Проверка подключенных Android устройств..."
    
    if command -v adb &> /dev/null; then
        # Получение списка устройств
        DEVICES=$(adb devices | grep -v "List of devices" | grep -v "^$" | wc -l)
        
        if [ $DEVICES -gt 0 ]; then
            print_success "Обнаружены подключенные Android устройства"
            print_status "Подключенные устройства:"
            adb devices
            print_warning "Убедитесь, что USB отладка включена на устройстве"
        else
            print_warning "Android устройства не обнаружены"
            print_warning "Подключите Android устройство и включите USB отладку"
        fi
    else
        print_warning "ADB не установлен, проверка устройств пропущена"
    fi
}

# Открытие проекта в Android Studio
open_android_studio() {
    print_status "Попытка открыть проект в Android Studio..."
    
    if [ -d "mobile/android" ]; then
        if [[ "$OS" == "macos" ]]; then
            if [ -d "/Applications/Android Studio.app" ]; then
                open -a "Android Studio" mobile/android
                print_success "Проект открыт в Android Studio"
            else
                print_warning "Android Studio не найден в /Applications/"
            fi
        elif [[ "$OS" == "linux" ]]; then
            if command -v android-studio &> /dev/null; then
                android-studio mobile/android &
                print_success "Проект открыт в Android Studio"
            else
                print_warning "Android Studio не найден в PATH"
            fi
        elif [[ "$OS" == "windows" ]]; then
            if [ -d "/c/Program Files/Android/Android Studio" ]; then
                "/c/Program Files/Android/Android Studio/bin/studio64.exe" mobile/android &
                print_success "Проект открыт в Android Studio"
            else
                print_warning "Android Studio не найден в стандартной директории"
            fi
        fi
        
        print_warning "В Android Studio:"
        print_warning "1. Выберите ваше Android устройство в списке устройств"
        print_warning "2. Нажмите Run (▶️) для установки на устройство"
    else
        print_error "Android проект не найден"
        exit 1
    fi
}

# Тестирование установки
test_installation() {
    print_status "Тестирование установки..."
    
    # Тест Node.js
    if node --version &> /dev/null; then
        print_success "Node.js работает корректно"
    else
        print_error "Node.js не работает"
        return 1
    fi
    
    # Тест npm
    if npm --version &> /dev/null; then
        print_success "npm работает корректно"
    else
        print_error "npm не работает"
        return 1
    fi
    
    # Тест мобильных зависимостей
    cd mobile
    if npm list &> /dev/null; then
        print_success "Мобильные зависимости установлены корректно"
    else
        print_error "Проблемы с мобильными зависимостями"
        return 1
    fi
    cd ..
    
    # Тест Android зависимостей
    cd mobile/android
    if [ -d "app" ]; then
        print_success "Android проект найден"
    else
        print_error "Android проект не найден"
        return 1
    fi
    cd ../..
    
    return 0
}

# Отображение инструкций
show_instructions() {
    echo ""
    echo "🎉 Установка завершена!"
    echo "======================"
    echo ""
    echo "🤖 Следующие шаги для установки на Android:"
    echo ""
    echo "1. 📱 На Android устройстве:"
    echo "   - Включите режим разработчика (Настройки → О телефоне → Номер сборки, нажмите 7 раз)"
    echo "   - Включите USB отладку (Настройки → Система → Для разработчиков → Отладка по USB)"
    echo "   - Подключите устройство к компьютеру через USB"
    echo "   - Разрешите отладку по USB на устройстве"
    echo ""
    echo "2. 🖥 На компьютере:"
    echo "   - Откройте Android Studio"
    echo "   - Выберите ваше Android устройство в списке устройств"
    echo "   - Нажмите Run (▶️)"
    echo ""
    echo "3. 🚀 Альтернативные способы запуска:"
    echo "   npm run android                    # Запуск через React Native CLI"
    echo "   cd mobile && npx react-native run-android  # Прямой запуск"
    echo ""
    echo "📖 Документация:"
    echo "   ANDROID_INSTALLATION.md            # Подробная инструкция"
    echo "   ANDROID_QUICK_START.md             # Быстрый старт"
    echo "   ANDROID_SIMPLE.md                  # Для обычных пользователей"
    echo ""
    echo "🆘 Если возникли проблемы:"
    echo "   - Убедитесь, что USB отладка включена на Android"
    echo "   - Проверьте USB кабель"
    echo "   - Перезапустите ADB: adb kill-server && adb start-server"
    echo "   - Очистите проект: cd mobile && npx react-native clean"
}

# Основная функция
main() {
    echo "Начинаем установку Salanum для Android..."
    echo ""
    
    check_os
    check_dependencies
    install_dependencies
    setup_project
    check_devices
    
    if test_installation; then
        open_android_studio
        show_instructions
    else
        print_error "Установка завершена с ошибками"
        exit 1
    fi
}

# Запуск основной функции
main "$@"
