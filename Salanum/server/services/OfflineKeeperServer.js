const express = require('express');
const { keeperService } = require('./KeeperService');
const fs = require('fs');
const path = require('path');

class OfflineKeeperServer {
  constructor() {
    this.app = express();
    this.port = 3001; // Отдельный порт для оффлайн сервера
    this.isOffline = true;
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    // Отключение всех сетевых интерфейсов кроме localhost
    this.app.use((req, res, next) => {
      // Проверка что запрос идет только с localhost
      if (req.ip !== '127.0.0.1' && req.ip !== '::1' && req.ip !== '::ffff:127.0.0.1') {
        return res.status(403).json({ 
          error: 'Offline Keeper Server - Access denied',
          keeper_signature: 'Keeper-14-Delta'
        });
      }
      next();
    });

    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Логирование всех запросов
    this.app.use((req, res, next) => {
      console.log(`[OFFLINE KEEPER] ${req.method} ${req.path} from ${req.ip}`);
      next();
    });
  }

  setupRoutes() {
    // Основной endpoint для валидации
    this.app.post('/keeper/validate', async (req, res) => {
      try {
        const { userId, biometricData } = req.body;

        if (!userId || !biometricData) {
          return res.status(400).json({ 
            message: 'User ID and biometric data are required',
            keeper_signature: 'Keeper-14-Delta',
            server: 'offline'
          });
        }

        const isValid = keeperService.validateUser(userId, biometricData);

        res.json({
          valid: isValid,
          message: isValid ? 'User validated by Offline Keeper' : 'User validation failed',
          keeper_signature: 'Keeper-14-Delta',
          server: 'offline',
          timestamp: Date.now()
        });

      } catch (error) {
        console.error('Offline Keeper validation error:', error);
        res.status(500).json({
          error: 'Offline Keeper validation failed',
          keeper_signature: 'Keeper-14-Delta',
          server: 'offline'
        });
      }
    });

    // Шифрование через оффлайн Хранителя
    this.app.post('/keeper/encrypt', async (req, res) => {
      try {
        const { userId, message, biometricData } = req.body;

        if (!userId || !message) {
          return res.status(400).json({ 
            message: 'User ID and message are required',
            keeper_signature: 'Keeper-14-Delta',
            server: 'offline'
          });
        }

        // Обновление биометрических данных
        if (biometricData) {
          keeperService.generateNeuroKey(userId, biometricData);
        }

        const encryptedData = keeperService.keeper_encrypt(message, userId);

        res.json({
          success: true,
          encrypted_data: encryptedData,
          keeper_signature: 'Keeper-14-Delta',
          server: 'offline',
          timestamp: Date.now()
        });

      } catch (error) {
        console.error('Offline Keeper encryption error:', error);
        res.status(500).json({
          error: 'Offline Keeper encryption failed',
          keeper_signature: 'Keeper-14-Delta',
          server: 'offline'
        });
      }
    });

    // Расшифровка через оффлайн Хранителя
    this.app.post('/keeper/decrypt', async (req, res) => {
      try {
        const { userId, encryptedData, biometricData } = req.body;

        if (!userId || !encryptedData) {
          return res.status(400).json({ 
            message: 'User ID and encrypted data are required',
            keeper_signature: 'Keeper-14-Delta',
            server: 'offline'
          });
        }

        // Обновление биометрических данных
        if (biometricData) {
          keeperService.generateNeuroKey(userId, biometricData);
        }

        const decryptedMessage = keeperService.keeper_decrypt(encryptedData, userId);

        res.json({
          success: true,
          decrypted_message: decryptedMessage,
          keeper_signature: 'Keeper-14-Delta',
          server: 'offline',
          timestamp: Date.now()
        });

      } catch (error) {
        console.error('Offline Keeper decryption error:', error);
        res.status(500).json({
          error: 'Offline Keeper decryption failed',
          keeper_signature: 'Keeper-14-Delta',
          server: 'offline'
        });
      }
    });

    // Статус оффлайн сервера
    this.app.get('/keeper/status', (req, res) => {
      try {
        const status = keeperService.getStatus();
        status.offlineMode = true;
        status.serverType = 'offline';
        
        res.json({
          status,
          keeper_signature: 'Keeper-14-Delta',
          server: 'offline',
          timestamp: Date.now()
        });

      } catch (error) {
        console.error('Offline Keeper status error:', error);
        res.status(500).json({
          error: 'Failed to get Offline Keeper status',
          keeper_signature: 'Keeper-14-Delta',
          server: 'offline'
        });
      }
    });

    // Обновление весов нейросети
    this.app.post('/keeper/update-weights', (req, res) => {
      try {
        keeperService.updateWeights();
        
        res.json({
          success: true,
          message: 'Offline Keeper neural weights updated',
          keeper_signature: 'Keeper-14-Delta',
          server: 'offline',
          timestamp: Date.now()
        });

      } catch (error) {
        console.error('Offline Keeper weights update error:', error);
        res.status(500).json({
          error: 'Failed to update Offline Keeper weights',
          keeper_signature: 'Keeper-14-Delta',
          server: 'offline'
        });
      }
    });

    // Резервное копирование данных
    this.app.post('/keeper/backup', (req, res) => {
      try {
        const backupData = {
          neuralWeights: Array.from(keeperService.neuralWeights.entries()),
          userBiometrics: Array.from(keeperService.userBiometrics.entries()),
          timestamp: Date.now(),
          keeper_signature: 'Keeper-14-Delta'
        };

        const backupPath = path.join(__dirname, '../data/keeper_backup.json');
        fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

        res.json({
          success: true,
          message: 'Offline Keeper backup created',
          backup_path: backupPath,
          keeper_signature: 'Keeper-14-Delta',
          server: 'offline',
          timestamp: Date.now()
        });

      } catch (error) {
        console.error('Offline Keeper backup error:', error);
        res.status(500).json({
          error: 'Failed to create Offline Keeper backup',
          keeper_signature: 'Keeper-14-Delta',
          server: 'offline'
        });
      }
    });

    // Восстановление из резервной копии
    this.app.post('/keeper/restore', (req, res) => {
      try {
        const { backupPath } = req.body;

        if (!backupPath) {
          return res.status(400).json({ 
            message: 'Backup path is required',
            keeper_signature: 'Keeper-14-Delta',
            server: 'offline'
          });
        }

        const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

        // Восстановление данных
        keeperService.neuralWeights = new Map(backupData.neuralWeights);
        keeperService.userBiometrics = new Map(backupData.userBiometrics);

        res.json({
          success: true,
          message: 'Offline Keeper data restored',
          keeper_signature: 'Keeper-14-Delta',
          server: 'offline',
          timestamp: Date.now()
        });

      } catch (error) {
        console.error('Offline Keeper restore error:', error);
        res.status(500).json({
          error: 'Failed to restore Offline Keeper data',
          keeper_signature: 'Keeper-14-Delta',
          server: 'offline'
        });
      }
    });

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        server: 'Offline Keeper',
        keeper_signature: 'Keeper-14-Delta',
        timestamp: Date.now()
      });
    });
  }

  start() {
    this.app.listen(this.port, '127.0.0.1', () => {
      console.log(`🔒 Offline Keeper Server running on http://127.0.0.1:${this.port}`);
      console.log('🔒 Offline mode: No internet access');
      console.log('🔒 Keeper Protocol 14-Delta activated');
    });
  }

  stop() {
    console.log('🔒 Offline Keeper Server stopped');
  }
}

module.exports = OfflineKeeperServer;
