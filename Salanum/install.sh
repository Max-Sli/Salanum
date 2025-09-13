#!/bin/bash

# Salanum - Автоматическая установка
echo "🔒 Salanum - Автоматическая установка"
echo "======================================"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
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
        print_success "Обнаружена Linux система"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        print_success "Обнаружена macOS система"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        OS="windows"
        print_success "Обнаружена Windows система"
    else
        print_error "Неподдерживаемая операционная система: $OSTYPE"
        exit 1
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
        print_error "Node.js не установлен. Пожалуйста, установите Node.js 18+ с https://nodejs.org/"
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
        print_error "Git не установлен. Пожалуйста, установите Git с https://git-scm.com/"
        exit 1
    fi
    
    # Проверка MongoDB (опционально)
    if command -v mongod &> /dev/null; then
        print_success "MongoDB установлен"
    else
        print_warning "MongoDB не установлен. Будет использован Docker контейнер"
    fi
    
    # Проверка Docker (опционально)
    if command -v docker &> /dev/null; then
        print_success "Docker установлен"
        DOCKER_AVAILABLE=true
    else
        print_warning "Docker не установлен. Некоторые функции будут недоступны"
        DOCKER_AVAILABLE=false
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
    
    # Установка серверных зависимостей
    print_status "Установка серверных зависимостей..."
    cd server
    npm install
    cd ..
    
    if [ $? -eq 0 ]; then
        print_success "Серверные зависимости установлены"
    else
        print_error "Ошибка установки серверных зависимостей"
        exit 1
    fi
    
    # Установка клиентских зависимостей
    print_status "Установка клиентских зависимостей..."
    cd client
    npm install
    cd ..
    
    if [ $? -eq 0 ]; then
        print_success "Клиентские зависимости установлены"
    else
        print_error "Ошибка установки клиентских зависимостей"
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
}

# Настройка окружения
setup_environment() {
    print_status "Настройка окружения..."
    
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
    mkdir -p client/build
    mkdir -p mobile/android/app/build
    
    print_success "Директории созданы"
}

# Настройка MongoDB
setup_mongodb() {
    if [ "$DOCKER_AVAILABLE" = true ]; then
        print_status "Настройка MongoDB через Docker..."
        
        # Запуск MongoDB контейнера
        docker run -d \
            --name salanum-mongodb \
            -p 27017:27017 \
            -e MONGO_INITDB_ROOT_USERNAME=admin \
            -e MONGO_INITDB_ROOT_PASSWORD=secure_password_123 \
            -e MONGO_INITDB_DATABASE=salanum \
            mongo:6.0
        
        if [ $? -eq 0 ]; then
            print_success "MongoDB контейнер запущен"
        else
            print_warning "Не удалось запустить MongoDB контейнер"
        fi
    else
        print_warning "Docker недоступен. Пожалуйста, установите MongoDB вручную"
    fi
}

# Настройка мобильного окружения
setup_mobile() {
    print_status "Настройка мобильного окружения..."
    
    # Проверка React Native CLI
    if ! command -v react-native &> /dev/null; then
        print_status "Установка React Native CLI..."
        npm install -g react-native-cli
    fi
    
    # Настройка Android (если доступно)
    if command -v adb &> /dev/null; then
        print_success "Android SDK обнаружен"
    else
        print_warning "Android SDK не обнаружен. Установите Android Studio для разработки Android приложений"
    fi
    
    # Настройка iOS (только на macOS)
    if [[ "$OS" == "macos" ]]; then
        if command -v xcodebuild &> /dev/null; then
            print_success "Xcode обнаружен"
            
            # Установка CocoaPods
            if ! command -v pod &> /dev/null; then
                print_status "Установка CocoaPods..."
                sudo gem install cocoapods
            fi
            
            # Установка iOS зависимостей
            print_status "Установка iOS зависимостей..."
            cd mobile/ios
            pod install
            cd ../..
            
            if [ $? -eq 0 ]; then
                print_success "iOS зависимости установлены"
            else
                print_warning "Ошибка установки iOS зависимостей"
            fi
        else
            print_warning "Xcode не обнаружен. Установите Xcode для разработки iOS приложений"
        fi
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
    
    # Тест серверных зависимостей
    cd server
    if npm list &> /dev/null; then
        print_success "Серверные зависимости установлены корректно"
    else
        print_error "Проблемы с серверными зависимостями"
        return 1
    fi
    cd ..
    
    # Тест клиентских зависимостей
    cd client
    if npm list &> /dev/null; then
        print_success "Клиентские зависимости установлены корректно"
    else
        print_error "Проблемы с клиентскими зависимостями"
        return 1
    fi
    cd ..
    
    return 0
}

# Запуск приложения
start_application() {
    print_status "Запуск приложения..."
    
    # Проверка .env файла
    if [ ! -f .env ]; then
        print_error ".env файл не найден. Пожалуйста, создайте его на основе env.example"
        exit 1
    fi
    
    print_success "Установка завершена!"
    echo ""
    echo "🚀 Для запуска приложения используйте:"
    echo "   npm run dev          # Запуск веб-версии"
    echo "   npm run server       # Только backend"
    echo "   npm run client       # Только frontend"
    echo ""
    echo "📱 Для мобильной разработки:"
    echo "   cd mobile"
    echo "   npm run android      # Android"
    echo "   npm run ios          # iOS (только на macOS)"
    echo ""
    echo "🐳 Для Docker:"
    echo "   docker-compose -f docker-compose.keeper.yml up -d"
    echo ""
    echo "🧪 Для тестирования:"
    echo "   node test-keeper-final.js"
    echo ""
    echo "📖 Документация:"
    echo "   README_FINAL.md"
    echo "   INSTALLATION_GUIDE.md"
    echo "   KEEPER_FINAL_INTEGRATION.md"
}

# Основная функция
main() {
    echo "Начинаем установку Salanum..."
    echo ""
    
    check_os
    check_dependencies
    install_dependencies
    setup_environment
    setup_mongodb
    setup_mobile
    
    if test_installation; then
        start_application
    else
        print_error "Установка завершена с ошибками"
        exit 1
    fi
}

# Запуск основной функции
main "$@"
