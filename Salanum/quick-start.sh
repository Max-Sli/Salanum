#!/bin/bash

# Salanum - Быстрый запуск
echo "🚀 Salanum - Быстрый запуск"
echo "============================"

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

# Проверка .env файла
check_env() {
    if [ ! -f .env ]; then
        print_warning ".env файл не найден"
        if [ -f env.example ]; then
            print_status "Создание .env файла из env.example..."
            cp env.example .env
            print_success ".env файл создан"
            print_warning "Пожалуйста, отредактируйте .env файл с вашими настройками"
        else
            print_error "env.example файл не найден"
            exit 1
        fi
    else
        print_success ".env файл найден"
    fi
}

# Проверка зависимостей
check_dependencies() {
    print_status "Проверка зависимостей..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js не установлен"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm не установлен"
        exit 1
    fi
    
    print_success "Основные зависимости найдены"
}

# Установка зависимостей (если нужно)
install_dependencies() {
    if [ ! -d "node_modules" ]; then
        print_status "Установка зависимостей..."
        npm install
        if [ $? -eq 0 ]; then
            print_success "Зависимости установлены"
        else
            print_error "Ошибка установки зависимостей"
            exit 1
        fi
    else
        print_success "Зависимости уже установлены"
    fi
}

# Запуск MongoDB (если доступен Docker)
start_mongodb() {
    if command -v docker &> /dev/null; then
        print_status "Запуск MongoDB через Docker..."
        
        # Проверка, запущен ли уже контейнер
        if docker ps | grep -q salanum-mongodb; then
            print_success "MongoDB уже запущен"
        else
            # Запуск MongoDB контейнера
            docker run -d \
                --name salanum-mongodb \
                -p 27017:27017 \
                -e MONGO_INITDB_ROOT_USERNAME=admin \
                -e MONGO_INITDB_ROOT_PASSWORD=secure_password_123 \
                -e MONGO_INITDB_DATABASE=salanum \
                mongo:6.0
            
            if [ $? -eq 0 ]; then
                print_success "MongoDB запущен"
            else
                print_warning "Не удалось запустить MongoDB через Docker"
            fi
        fi
    else
        print_warning "Docker не найден. Убедитесь, что MongoDB запущен локально"
    fi
}

# Запуск сервера
start_server() {
    print_status "Запуск сервера..."
    
    # Проверка, запущен ли уже сервер
    if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
        print_success "Сервер уже запущен на порту 5000"
    else
        print_status "Запуск сервера в фоновом режиме..."
        cd server
        npm start &
        SERVER_PID=$!
        cd ..
        
        # Ожидание запуска сервера
        print_status "Ожидание запуска сервера..."
        for i in {1..30}; do
            if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
                print_success "Сервер запущен на порту 5000"
                break
            fi
            sleep 1
        done
        
        if [ $i -eq 30 ]; then
            print_error "Сервер не запустился за 30 секунд"
            exit 1
        fi
    fi
}

# Запуск клиента
start_client() {
    print_status "Запуск клиента..."
    
    # Проверка, запущен ли уже клиент
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_success "Клиент уже запущен на порту 3000"
    else
        print_status "Запуск клиента в фоновом режиме..."
        cd client
        npm start &
        CLIENT_PID=$!
        cd ..
        
        # Ожидание запуска клиента
        print_status "Ожидание запуска клиента..."
        for i in {1..60}; do
            if curl -s http://localhost:3000 > /dev/null 2>&1; then
                print_success "Клиент запущен на порту 3000"
                break
            fi
            sleep 1
        done
        
        if [ $i -eq 60 ]; then
            print_error "Клиент не запустился за 60 секунд"
            exit 1
        fi
    fi
}

# Тестирование Хранителя
test_keeper() {
    print_status "Тестирование Хранителя..."
    
    if [ -f "test-keeper-final.js" ]; then
        node test-keeper-final.js
        if [ $? -eq 0 ]; then
            print_success "Тесты Хранителя прошли успешно"
        else
            print_warning "Некоторые тесты Хранителя не прошли"
        fi
    else
        print_warning "Файл test-keeper-final.js не найден"
    fi
}

# Отображение информации
show_info() {
    echo ""
    echo "🎉 Salanum запущен!"
    echo "=================="
    echo ""
    echo "🌐 Веб-приложение: http://localhost:3000"
    echo "🖥 API сервер: http://localhost:5000"
    echo "🔒 Keeper API: http://localhost:5000/api/keeper-final"
    echo ""
    echo "🧪 Тестирование:"
    echo "   node test-keeper-final.js"
    echo ""
    echo "📱 Мобильная разработка:"
    echo "   cd mobile"
    echo "   npm run android  # Android"
    echo "   npm run ios      # iOS (только на macOS)"
    echo ""
    echo "🐳 Docker:"
    echo "   docker-compose -f docker-compose.keeper.yml up -d"
    echo ""
    echo "📖 Документация:"
    echo "   README_FINAL.md"
    echo "   INSTALLATION_GUIDE.md"
    echo "   KEEPER_FINAL_INTEGRATION.md"
    echo ""
    echo "🛑 Для остановки нажмите Ctrl+C"
}

# Обработка сигналов
cleanup() {
    echo ""
    print_status "Остановка Salanum..."
    
    # Остановка процессов
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null
    fi
    
    if [ ! -z "$CLIENT_PID" ]; then
        kill $CLIENT_PID 2>/dev/null
    fi
    
    print_success "Salanum остановлен"
    exit 0
}

# Установка обработчиков сигналов
trap cleanup SIGINT SIGTERM

# Основная функция
main() {
    echo "Быстрый запуск Salanum..."
    echo ""
    
    check_dependencies
    check_env
    install_dependencies
    start_mongodb
    start_server
    start_client
    test_keeper
    show_info
    
    # Ожидание
    while true; do
        sleep 1
    done
}

# Запуск
main "$@"
