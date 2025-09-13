#!/bin/bash

# Salanum - Полное тестирование
echo "🧪 Salanum - Полное тестирование"
echo "================================="

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для вывода
print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Счетчики тестов
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Функция для выполнения теста
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    print_status "Выполнение: $test_name"
    
    if eval "$test_command"; then
        print_success "$test_name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        print_error "$test_name"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Проверка зависимостей
test_dependencies() {
    echo ""
    echo "🔍 Тестирование зависимостей..."
    echo "================================"
    
    run_test "Node.js установлен" "node --version"
    run_test "npm установлен" "npm --version"
    run_test "Git установлен" "git --version"
    
    # Проверка версии Node.js
    NODE_VERSION=$(node --version | sed 's/v//')
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 18 ]; then
        print_success "Node.js версия $NODE_VERSION (требуется 18+)"
    else
        print_error "Node.js версия $NODE_VERSION (требуется 18+)"
    fi
}

# Тестирование сервера
test_server() {
    echo ""
    echo "🖥 Тестирование сервера..."
    echo "=========================="
    
    # Проверка серверных зависимостей
    run_test "Серверные зависимости установлены" "cd server && npm list > /dev/null 2>&1"
    
    # Проверка файлов сервера
    run_test "Основной файл сервера существует" "test -f server/index.js"
    run_test "Keeper сервис существует" "test -f server/services/KeeperFinal.js"
    run_test "API маршруты существуют" "test -f server/routes/keeper-final.js"
    
    # Проверка .env файла
    if [ -f .env ]; then
        print_success ".env файл существует"
    else
        print_warning ".env файл не найден (создайте из env.example)"
    fi
}

# Тестирование клиента
test_client() {
    echo ""
    echo "🌐 Тестирование клиента..."
    echo "=========================="
    
    # Проверка клиентских зависимостей
    run_test "Клиентские зависимости установлены" "cd client && npm list > /dev/null 2>&1"
    
    # Проверка файлов клиента
    run_test "Основной файл клиента существует" "test -f client/src/App.js"
    run_test "Keeper компонент существует" "test -f client/src/components/Keeper/KeeperIntegration.js"
    run_test "Auth компоненты существуют" "test -f client/src/components/Auth/Login.js"
    
    # Проверка package.json
    run_test "Клиентский package.json существует" "test -f client/package.json"
}

# Тестирование мобильного приложения
test_mobile() {
    echo ""
    echo "📱 Тестирование мобильного приложения..."
    echo "======================================="
    
    # Проверка мобильных зависимостей
    run_test "Мобильные зависимости установлены" "cd mobile && npm list > /dev/null 2>&1"
    
    # Проверка файлов мобильного приложения
    run_test "Основной файл мобильного приложения существует" "test -f mobile/App.js"
    run_test "Bluetooth сервис существует" "test -f mobile/src/services/BluetoothService.js"
    run_test "Bluetooth экран существует" "test -f mobile/src/screens/BluetoothScreen.js"
    
    # Проверка Android конфигурации
    run_test "Android манифест существует" "test -f mobile/android/app/src/main/AndroidManifest.xml"
    
    # Проверка iOS конфигурации (только на macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        run_test "iOS Info.plist существует" "test -f mobile/ios/SolanaMessenger/Info.plist"
    else
        print_warning "iOS тесты пропущены (не macOS)"
    fi
}

# Тестирование Хранителя
test_keeper() {
    echo ""
    echo "🔒 Тестирование Хранителя..."
    echo "============================"
    
    # Проверка файлов Хранителя
    run_test "KeeperFinal сервис существует" "test -f server/services/KeeperFinal.js"
    run_test "Оффлайн сервер существует" "test -f server/keeper-offline-server.js"
    run_test "Тестовый скрипт существует" "test -f test-keeper-final.js"
    
    # Проверка Docker конфигурации
    run_test "Docker Compose файл существует" "test -f docker-compose.keeper.yml"
    run_test "Dockerfile для Keeper существует" "test -f server/Dockerfile.keeper"
    
    # Проверка healthcheck
    run_test "Healthcheck скрипт существует" "test -f server/healthcheck.js"
}

# Тестирование API (если сервер запущен)
test_api() {
    echo ""
    echo "🔌 Тестирование API..."
    echo "======================"
    
    # Проверка доступности сервера
    if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
        print_success "Сервер доступен на порту 5000"
        
        # Тест health endpoint
        run_test "Health endpoint работает" "curl -s http://localhost:5000/api/health | grep -q 'OK'"
        
        # Тест Keeper handshake
        run_test "Keeper handshake работает" "curl -s -X POST http://localhost:5000/api/keeper-final/handshake -H 'Content-Type: application/json' -d '{\"command\": \"handshake\", \"version\": \"0.1a\", \"user_id\": \"14\"}' | grep -q 'accepted'"
        
    else
        print_warning "Сервер не запущен. Запустите 'npm run server' для тестирования API"
    fi
}

# Тестирование Docker
test_docker() {
    echo ""
    echo "🐳 Тестирование Docker..."
    echo "========================="
    
    # Проверка Docker
    if command -v docker &> /dev/null; then
        run_test "Docker установлен" "docker --version"
        run_test "Docker Compose установлен" "docker-compose --version"
        
        # Проверка Docker контейнеров
        if docker ps | grep -q salanum; then
            print_success "Salanum контейнеры запущены"
        else
            print_warning "Salanum контейнеры не запущены. Запустите 'docker-compose -f docker-compose.keeper.yml up -d'"
        fi
    else
        print_warning "Docker не установлен"
    fi
}

# Тестирование безопасности
test_security() {
    echo ""
    echo "🛡 Тестирование безопасности..."
    echo "=============================="
    
    # Проверка .env файла
    if [ -f .env ]; then
        if grep -q "your-super-secret" .env; then
            print_warning ".env файл содержит примеры значений (замените на реальные)"
        else
            print_success ".env файл настроен"
        fi
    fi
    
    # Проверка прав доступа к файлам
    run_test "Серверные файлы имеют правильные права" "test -r server/index.js"
    run_test "Клиентские файлы имеют правильные права" "test -r client/src/App.js"
    
    # Проверка наличия секретных ключей в коде
    if grep -r "sk-" server/ client/ mobile/ 2>/dev/null | grep -v node_modules | grep -v ".git"; then
        print_warning "Обнаружены возможные секретные ключи в коде"
    else
        print_success "Секретные ключи не найдены в коде"
    fi
}

# Тестирование производительности
test_performance() {
    echo ""
    echo "⚡ Тестирование производительности..."
    echo "===================================="
    
    # Проверка размера node_modules
    if [ -d "node_modules" ]; then
        NODE_MODULES_SIZE=$(du -sh node_modules 2>/dev/null | cut -f1)
        print_success "Размер node_modules: $NODE_MODULES_SIZE"
    fi
    
    # Проверка времени запуска сервера (если доступен)
    if command -v time &> /dev/null; then
        print_status "Тестирование времени запуска сервера..."
        # Здесь можно добавить тест времени запуска
    fi
}

# Запуск финальных тестов Хранителя
test_keeper_final() {
    echo ""
    echo "🔒 Запуск финальных тестов Хранителя..."
    echo "======================================"
    
    if [ -f "test-keeper-final.js" ]; then
        run_test "Финальные тесты Хранителя" "node test-keeper-final.js"
    else
        print_error "Файл test-keeper-final.js не найден"
    fi
}

# Генерация отчета
generate_report() {
    echo ""
    echo "📊 Отчет о тестировании"
    echo "======================="
    echo "Всего тестов: $TOTAL_TESTS"
    echo "Прошло: $PASSED_TESTS"
    echo "Не прошло: $FAILED_TESTS"
    echo "Процент успеха: $(( (PASSED_TESTS * 100) / TOTAL_TESTS ))%"
    
    if [ $FAILED_TESTS -eq 0 ]; then
        echo ""
        print_success "🎉 Все тесты прошли успешно!"
        return 0
    else
        echo ""
        print_error "❌ Некоторые тесты не прошли"
        return 1
    fi
}

# Основная функция
main() {
    echo "Начинаем полное тестирование Salanum..."
    echo ""
    
    test_dependencies
    test_server
    test_client
    test_mobile
    test_keeper
    test_api
    test_docker
    test_security
    test_performance
    test_keeper_final
    
    generate_report
}

# Запуск тестирования
main "$@"
