#!/bin/bash

# Salanum - Автоматическая установка для iOS
echo "📱 Salanum - Автоматическая установка для iOS"
echo "============================================="

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
check_macos() {
    if [[ "$OSTYPE" != "darwin"* ]]; then
        print_error "Этот скрипт работает только на macOS"
        print_error "Для установки на iPhone требуется macOS и Xcode"
        exit 1
    fi
    print_success "macOS обнаружена"
}

# Проверка зависимостей
check_dependencies() {
    print_status "Проверка зависимостей..."
    
    # Проверка Xcode
    if command -v xcodebuild &> /dev/null; then
        XCODE_VERSION=$(xcodebuild -version | head -n1)
        print_success "Xcode установлен: $XCODE_VERSION"
    else
        print_error "Xcode не установлен. Установите Xcode из App Store"
        exit 1
    fi
    
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
    
    # Проверка CocoaPods
    if command -v pod &> /dev/null; then
        POD_VERSION=$(pod --version)
        print_success "CocoaPods установлен: $POD_VERSION"
    else
        print_warning "CocoaPods не установлен. Устанавливаем..."
        sudo gem install cocoapods
        if [ $? -eq 0 ]; then
            print_success "CocoaPods установлен"
        else
            print_error "Не удалось установить CocoaPods"
            exit 1
        fi
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
    
    # Установка iOS зависимостей
    print_status "Установка iOS зависимостей..."
    cd mobile/ios
    pod install
    cd ../..
    
    if [ $? -eq 0 ]; then
        print_success "iOS зависимости установлены"
    else
        print_error "Ошибка установки iOS зависимостей"
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
    mkdir -p mobile/ios/build
    
    print_success "Директории созданы"
}

# Проверка подключенных устройств
check_devices() {
    print_status "Проверка подключенных iOS устройств..."
    
    # Получение списка устройств
    DEVICES=$(xcrun simctl list devices | grep "iPhone" | grep "Booted" | wc -l)
    PHYSICAL_DEVICES=$(system_profiler SPUSBDataType | grep -i "iphone" | wc -l)
    
    if [ $PHYSICAL_DEVICES -gt 0 ]; then
        print_success "Обнаружены подключенные iPhone устройства"
        print_status "Убедитесь, что iPhone разблокирован и доверяет компьютеру"
    else
        print_warning "Физические iPhone устройства не обнаружены"
    fi
    
    if [ $DEVICES -gt 0 ]; then
        print_success "Обнаружены запущенные симуляторы iPhone"
    else
        print_warning "Симуляторы iPhone не запущены"
    fi
}

# Открытие проекта в Xcode
open_xcode() {
    print_status "Открытие проекта в Xcode..."
    
    if [ -f "mobile/ios/Salanum.xcworkspace" ]; then
        open mobile/ios/Salanum.xcworkspace
        print_success "Проект открыт в Xcode"
        print_warning "В Xcode:"
        print_warning "1. Выберите ваш iPhone в списке устройств"
        print_warning "2. Измените Bundle Identifier на уникальный"
        print_warning "3. Настройте команду разработки в Signing & Capabilities"
        print_warning "4. Нажмите Run (▶️) для установки на iPhone"
    else
        print_error "Workspace файл не найден"
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
    
    # Тест iOS зависимостей
    cd mobile/ios
    if [ -d "Pods" ]; then
        print_success "iOS зависимости установлены корректно"
    else
        print_error "Проблемы с iOS зависимостями"
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
    echo "📱 Следующие шаги для установки на iPhone:"
    echo ""
    echo "1. 🔌 Подключите iPhone к Mac через USB"
    echo "2. 📱 На iPhone: Разблокируйте и нажмите 'Доверять'"
    echo "3. 🖥 В Xcode:"
    echo "   - Выберите ваш iPhone в списке устройств"
    echo "   - Измените Bundle Identifier на уникальный (например: com.yourname.salanum)"
    echo "   - В Signing & Capabilities выберите вашу команду разработки"
    echo "   - Нажмите Run (▶️)"
    echo "4. 📱 На iPhone после установки:"
    echo "   - Перейдите в Настройки → Основные → Управление VPN и устройством"
    echo "   - Найдите ваше приложение и нажмите 'Доверять'"
    echo ""
    echo "🚀 Альтернативные способы запуска:"
    echo "   npm run ios                    # Запуск на симуляторе"
    echo "   npm run ios --device='iPhone'  # Запуск на подключенном iPhone"
    echo ""
    echo "📖 Документация:"
    echo "   IPHONE_INSTALLATION.md         # Подробная инструкция"
    echo "   IPHONE_QUICK_START.md          # Быстрый старт"
    echo ""
    echo "🆘 Если возникли проблемы:"
    echo "   - Убедитесь, что iPhone разблокирован"
    echo "   - Проверьте, что iPhone доверяет компьютеру"
    echo "   - Убедитесь, что Bundle Identifier уникален"
    echo "   - Проверьте настройки команды разработки в Xcode"
}

# Основная функция
main() {
    echo "Начинаем установку Salanum для iOS..."
    echo ""
    
    check_macos
    check_dependencies
    install_dependencies
    setup_project
    check_devices
    
    if test_installation; then
        open_xcode
        show_instructions
    else
        print_error "Установка завершена с ошибками"
        exit 1
    fi
}

# Запуск основной функции
main "$@"
