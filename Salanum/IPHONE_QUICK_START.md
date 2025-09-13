# 📱 Salanum на iPhone - Быстрый старт

## 🎯 Простой способ установки

### 📋 Что нужно:
- **Mac** с macOS
- **iPhone** с iOS 13.0+
- **Xcode** (бесплатно из App Store)
- **Apple ID** (бесплатный)

## 🚀 Пошаговая установка

### Шаг 1: Подготовка Mac
```bash
# 1. Установите Xcode из App Store
# 2. Установите Node.js с https://nodejs.org/
# 3. Откройте Terminal и выполните:
sudo gem install cocoapods
```

### Шаг 2: Скачивание проекта
```bash
# Клонирование проекта
git clone <repository-url>
cd salanum

# Установка зависимостей
npm install
cd mobile
npm install
```

### Шаг 3: Настройка iOS
```bash
# Установка iOS зависимостей
cd ios
pod install
cd ..
```

### Шаг 4: Открытие в Xcode
```bash
# Открытие проекта
open ios/Salanum.xcworkspace
```

### Шаг 5: Настройка в Xcode
1. **Выберите ваш iPhone** в списке устройств
2. **Измените Bundle Identifier:**
   - Выберите проект "Salanum"
   - В "General" измените Bundle Identifier на `com.yourname.salanum`
3. **Настройте подпись:**
   - В "Signing & Capabilities"
   - Выберите вашу команду разработки
   - Включите "Automatically manage signing"

### Шаг 6: Установка на iPhone
1. **Подключите iPhone к Mac через USB**
2. **На iPhone:** Нажмите "Доверять" когда появится запрос
3. **В Xcode:** Нажмите кнопку "Run" (▶️)
4. **На iPhone:** После установки перейдите в Настройки → Основные → Управление VPN и устройством → Доверять разработчику

## ✅ Готово!

Теперь у вас есть Salanum на iPhone! 

### 🔧 Что делать дальше:
1. Откройте приложение
2. Создайте аккаунт
3. Включите "Keeper Neural Security" в настройках
4. Настройте Bluetooth для P2P передачи

## 🆘 Если что-то не работает:

### Проблема: "Untrusted Developer"
**Решение:** Настройки → Основные → Управление VPN и устройством → Доверять

### Проблема: "Could not find iPhone"
**Решение:** 
1. Убедитесь, что iPhone подключен
2. Разблокируйте iPhone
3. Нажмите "Доверять" на iPhone

### Проблема: "Code signing error"
**Решение:**
1. В Xcode выберите проект
2. Signing & Capabilities → выберите команду разработки
3. Сделайте Bundle Identifier уникальным

## 📞 Нужна помощь?
- **GitHub Issues:** [Создать issue](https://github.com/your-repo/issues)
- **Email:** support@salanum.com

---

**Salanum на iPhone** - Простая установка за 5 минут! 📱🚀
