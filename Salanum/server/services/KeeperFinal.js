const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Signature: Keeper-14-Delta
class KeeperFinal {
  constructor(userId, mode = 'neuro_encrypt') {
    this.userId = userId;
    this.mode = mode;
    this.version = '0.1a';
    this.isOnline = false;
    this.isolatedContainer = null;
    this.logFile = null;
    this.encryptionKey = this.generateMasterKey();
    
    // Инициализация изолированного контейнера
    this.initializeIsolatedContainer();
    
    // Настройка зашифрованного логирования
    this.setupEncryptedLogging();
    
    console.log(`🔒 Keeper initialized for user ${userId} in ${mode} mode`);
  }

  // Инициализация изолированного контейнера
  initializeIsolatedContainer() {
    try {
      // Создание изолированной среды
      this.isolatedContainer = {
        id: `keeper_${this.userId}_${Date.now()}`,
        environment: 'sandbox',
        restrictions: {
          networkAccess: false,
          fileSystemAccess: 'limited',
          memoryLimit: '256MB',
          cpuLimit: '50%'
        },
        status: 'initialized'
      };
      
      this.log('Container initialized', 'INFO');
    } catch (error) {
      this.log(`Container initialization error: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  // Настройка зашифрованного логирования
  setupEncryptedLogging() {
    try {
      const logDir = path.join(__dirname, '../logs');
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      
      this.logFile = path.join(logDir, `keeper_${this.userId}.keeper_log`);
      
      // Создание зашифрованного лог файла
      this.log('Encrypted logging initialized', 'INFO');
    } catch (error) {
      console.error('Logging setup error:', error);
    }
  }

  // Зашифрованное логирование
  log(message, level = 'INFO') {
    try {
      const timestamp = new Date().toISOString();
      const logEntry = {
        timestamp,
        level,
        userId: this.userId,
        message,
        container: this.isolatedContainer?.id
      };
      
      const encryptedLog = this.encryptLogEntry(JSON.stringify(logEntry));
      
      // Запись в зашифрованный файл
      fs.appendFileSync(this.logFile, encryptedLog + '\n');
      
      // Также выводим в консоль для отладки
      console.log(`[KEEPER-${level}] ${message}`);
    } catch (error) {
      console.error('Logging error:', error);
    }
  }

  // Шифрование лог записи
  encryptLogEntry(logEntry) {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher('aes-256-gcm', this.encryptionKey);
      cipher.setAAD(Buffer.from(this.userId));
      
      let encrypted = cipher.update(logEntry, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();
      
      return JSON.stringify({
        iv: iv.toString('hex'),
        encrypted,
        tag: tag.toString('hex'),
        signature: 'Keeper-14-Delta'
      });
    } catch (error) {
      console.error('Log encryption error:', error);
      return logEntry;
    }
  }

  // Генерация мастер-ключа
  generateMasterKey() {
    return crypto.randomBytes(32);
  }

  // Генерация ключа на лету (никогда не хранится)
  generateKeyOnTheFly(userVoiceHash, biometricData) {
    try {
      this.log('Generating key on-the-fly', 'DEBUG');
      
      // Объединение данных для генерации ключа
      const keyMaterial = Buffer.concat([
        Buffer.from(userVoiceHash, 'hex'),
        Buffer.from(JSON.stringify(biometricData)),
        crypto.randomBytes(16) // Дополнительная энтропия
      ]);
      
      // Генерация ключа через PBKDF2
      const key = crypto.pbkdf2Sync(keyMaterial, this.userId, 100000, 32, 'sha256');
      
      this.log('Key generated successfully', 'DEBUG');
      return key;
    } catch (error) {
      this.log(`Key generation error: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  // Извлечение хеша голоса из биометрических данных
  extractVoiceHash(biometricData) {
    try {
      if (!biometricData || !biometricData.voice) {
        throw new Error('Voice data not found in biometric data');
      }
      
      const voiceData = biometricData.voice;
      const voiceString = `${voiceData.pitch}_${voiceData.frequency}_${voiceData.amplitude}_${voiceData.duration}`;
      
      return crypto.createHash('sha256').update(voiceString).digest('hex');
    } catch (error) {
      this.log(`Voice hash extraction error: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  // Шифрование сообщения
  encrypt(text, key) {
    try {
      this.log('Starting message encryption', 'DEBUG');
      
      if (!text || !key) {
        throw new Error('Text and key are required for encryption');
      }
      
      // Генерация IV
      const iv = crypto.randomBytes(16);
      
      // Создание шифра
      const cipher = crypto.createCipher('aes-256-gcm', key);
      cipher.setAAD(Buffer.from(this.userId));
      
      // Шифрование
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Получение тега аутентификации
      const tag = cipher.getAuthTag();
      
      const result = {
        encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        timestamp: Date.now(),
        keeper_signature: 'Keeper-14-Delta',
        version: this.version
      };
      
      this.log('Message encrypted successfully', 'INFO');
      return result;
    } catch (error) {
      this.log(`Encryption error: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  // Расшифровка сообщения
  decrypt(ciphertext, key) {
    try {
      this.log('Starting message decryption', 'DEBUG');
      
      if (!ciphertext || !key) {
        throw new Error('Ciphertext and key are required for decryption');
      }
      
      // Проверка подписи Хранителя
      if (ciphertext.keeper_signature !== 'Keeper-14-Delta') {
        throw new Error('Invalid Keeper signature');
      }
      
      // Извлечение компонентов
      const iv = Buffer.from(ciphertext.iv, 'hex');
      const tag = Buffer.from(ciphertext.tag, 'hex');
      
      // Создание дешифратора
      const decipher = crypto.createDecipher('aes-256-gcm', key);
      decipher.setAAD(Buffer.from(this.userId));
      decipher.setAuthTag(tag);
      
      // Расшифровка
      let decrypted = decipher.update(ciphertext.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      this.log('Message decrypted successfully', 'INFO');
      return decrypted;
    } catch (error) {
      this.log(`Decryption error: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  // Основной метод шифрования с биометрическими данными
  encryptWithBiometrics(text, biometricData) {
    try {
      this.log('Encrypting with biometric data', 'INFO');
      
      // Извлечение хеша голоса
      const userVoiceHash = this.extractVoiceHash(biometricData);
      
      // Генерация ключа на лету
      const key = this.generateKeyOnTheFly(userVoiceHash, biometricData);
      
      // Шифрование сообщения
      const encryptedMsg = this.encrypt(text, key);
      
      this.log('Biometric encryption completed', 'INFO');
      return encryptedMsg;
    } catch (error) {
      this.log(`Biometric encryption error: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  // Основной метод расшифровки с биометрическими данными
  decryptWithBiometrics(ciphertext, biometricData) {
    try {
      this.log('Decrypting with biometric data', 'INFO');
      
      // Извлечение хеша голоса
      const userVoiceHash = this.extractVoiceHash(biometricData);
      
      // Генерация ключа на лету
      const key = this.generateKeyOnTheFly(userVoiceHash, biometricData);
      
      // Расшифровка сообщения
      const decryptedMsg = this.decrypt(ciphertext, key);
      
      this.log('Biometric decryption completed', 'INFO');
      return decryptedMsg;
    } catch (error) {
      this.log(`Biometric decryption error: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  // Handshake для проверки связи
  handshake(command, version, userId) {
    try {
      this.log(`Handshake request: ${command} v${version} for user ${userId}`, 'INFO');
      
      if (command === 'handshake' && version === '0.1a' && userId === '14') {
        this.isOnline = true;
        
        const response = {
          status: 'accepted',
          code: 'Δ-14-307',
          message: 'Keeper is online.',
          timestamp: Date.now(),
          keeper_signature: 'Keeper-14-Delta'
        };
        
        this.log('Handshake successful', 'INFO');
        return response;
      } else {
        const response = {
          status: 'rejected',
          code: 'Δ-14-ERROR',
          message: 'Invalid handshake parameters.',
          timestamp: Date.now(),
          keeper_signature: 'Keeper-14-Delta'
        };
        
        this.log('Handshake failed', 'WARN');
        return response;
      }
    } catch (error) {
      this.log(`Handshake error: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  // Получение статуса Хранителя
  getStatus() {
    return {
      userId: this.userId,
      mode: this.mode,
      version: this.version,
      isOnline: this.isOnline,
      container: this.isolatedContainer,
      timestamp: Date.now(),
      keeper_signature: 'Keeper-14-Delta'
    };
  }

  // Очистка ресурсов
  cleanup() {
    try {
      this.log('Cleaning up Keeper resources', 'INFO');
      
      // Очистка контейнера
      this.isolatedContainer = null;
      
      // Закрытие лог файла
      this.logFile = null;
      
      this.log('Cleanup completed', 'INFO');
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  // Проверка согласия пользователя на AI
  static createIfUserAgrees(userId, userAgreesToAI, mode = 'neuro_encrypt') {
    if (userAgreesToAI) {
      return new KeeperFinal(userId, mode);
    } else {
      console.log(`User ${userId} declined AI integration`);
      return null;
    }
  }
}

// Глобальный экземпляр для тестирования
let globalKeeper = null;

// Функция для создания экземпляра Хранителя
function createKeeper(userId, userAgreesToAI = true, mode = 'neuro_encrypt') {
  if (userAgreesToAI) {
    globalKeeper = new KeeperFinal(userId, mode);
    return globalKeeper;
  }
  return null;
}

// Функция для получения глобального экземпляра
function getKeeper() {
  return globalKeeper;
}

module.exports = {
  KeeperFinal,
  createKeeper,
  getKeeper
};
