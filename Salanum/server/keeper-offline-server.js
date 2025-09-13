const express = require('express');
const { KeeperFinal } = require('./services/KeeperFinal');
const fs = require('fs');
const path = require('path');

// Изолированный сервер Хранителя
class KeeperOfflineServer {
  constructor() {
    this.app = express();
    this.port = process.env.KEEPER_OFFLINE_PORT || 3001;
    this.instances = new Map();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    // Ограничение доступа только к localhost
    this.app.use((req, res, next) => {
      const allowedIPs = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];
      const clientIP = req.ip || req.connection.remoteAddress;
      
      if (!allowedIPs.includes(clientIP)) {
        return res.status(403).json({
          error: 'Access denied - Offline Keeper Server',
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
    // Handshake endpoint
    this.app.post('/handshake', async (req, res) => {
      try {
        const { command, version, user_id } = req.body;

        if (!command || !version || !user_id) {
          return res.status(400).json({
            status: 'rejected',
            code: 'Δ-14-ERROR',
            message: 'Missing required parameters',
            keeper_signature: 'Keeper-14-Delta'
          });
        }

        // Создание временного экземпляра для handshake
        const tempKeeper = new KeeperFinal(user_id, 'neuro_encrypt');
        const response = tempKeeper.handshake(command, version, user_id);
        tempKeeper.cleanup();

        res.json(response);

      } catch (error) {
        console.error('Offline handshake error:', error);
        res.status(500).json({
          status: 'error',
          code: 'Δ-14-ERROR',
          message: 'Handshake failed',
          keeper_signature: 'Keeper-14-Delta'
        });
      }
    });

    // Инициализация Хранителя
    this.app.post('/initialize', async (req, res) => {
      try {
        const { user_id, user_agrees_to_ai, mode = 'neuro_encrypt' } = req.body;

        if (!user_id) {
          return res.status(400).json({
            success: false,
            message: 'User ID is required',
            keeper_signature: 'Keeper-14-Delta'
          });
        }

        if (!user_agrees_to_ai) {
          return res.json({
            success: false,
            message: 'User declined AI integration',
            keeper_signature: 'Keeper-14-Delta'
          });
        }

        // Создание экземпляра Хранителя
        const keeper = new KeeperFinal(user_id, mode);
        this.instances.set(user_id, keeper);

        res.json({
          success: true,
          message: 'Offline Keeper initialized successfully',
          keeper_status: keeper.getStatus(),
          keeper_signature: 'Keeper-14-Delta'
        });

      } catch (error) {
        console.error('Offline initialization error:', error);
        res.status(500).json({
          success: false,
          message: 'Offline initialization failed',
          keeper_signature: 'Keeper-14-Delta'
        });
      }
    });

    // Шифрование
    this.app.post('/encrypt', async (req, res) => {
      try {
        const { user_id, text, biometric_data } = req.body;

        if (!user_id || !text) {
          return res.status(400).json({
            success: false,
            message: 'User ID and text are required',
            keeper_signature: 'Keeper-14-Delta'
          });
        }

        const keeper = this.instances.get(user_id);
        if (!keeper) {
          return res.status(404).json({
            success: false,
            message: 'Keeper not initialized for this user',
            keeper_signature: 'Keeper-14-Delta'
          });
        }

        const encryptedMsg = keeper.encryptWithBiometrics(text, biometric_data);

        res.json({
          success: true,
          encrypted_message: encryptedMsg,
          keeper_signature: 'Keeper-14-Delta'
        });

      } catch (error) {
        console.error('Offline encryption error:', error);
        res.status(500).json({
          success: false,
          message: 'Offline encryption failed',
          keeper_signature: 'Keeper-14-Delta'
        });
      }
    });

    // Расшифровка
    this.app.post('/decrypt', async (req, res) => {
      try {
        const { user_id, ciphertext, biometric_data } = req.body;

        if (!user_id || !ciphertext) {
          return res.status(400).json({
            success: false,
            message: 'User ID and ciphertext are required',
            keeper_signature: 'Keeper-14-Delta'
          });
        }

        const keeper = this.instances.get(user_id);
        if (!keeper) {
          return res.status(404).json({
            success: false,
            message: 'Keeper not initialized for this user',
            keeper_signature: 'Keeper-14-Delta'
          });
        }

        const decryptedMsg = keeper.decryptWithBiometrics(ciphertext, biometric_data);

        res.json({
          success: true,
          decrypted_message: decryptedMsg,
          keeper_signature: 'Keeper-14-Delta'
        });

      } catch (error) {
        console.error('Offline decryption error:', error);
        res.status(500).json({
          success: false,
          message: 'Offline decryption failed',
          keeper_signature: 'Keeper-14-Delta'
        });
      }
    });

    // Статус
    this.app.get('/status/:user_id', (req, res) => {
      try {
        const { user_id } = req.params;

        const keeper = this.instances.get(user_id);
        if (!keeper) {
          return res.status(404).json({
            success: false,
            message: 'Keeper not initialized for this user',
            keeper_signature: 'Keeper-14-Delta'
          });
        }

        const status = keeper.getStatus();
        status.server_type = 'offline';
        status.isolation = true;

        res.json({
          success: true,
          status,
          keeper_signature: 'Keeper-14-Delta'
        });

      } catch (error) {
        console.error('Offline status error:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to get offline status',
          keeper_signature: 'Keeper-14-Delta'
        });
      }
    });

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        server: 'Offline Keeper',
        isolation: true,
        instances: this.instances.size,
        keeper_signature: 'Keeper-14-Delta',
        timestamp: Date.now()
      });
    });
  }

  start() {
    this.app.listen(this.port, '127.0.0.1', () => {
      console.log(`🔒 Offline Keeper Server running on http://127.0.0.1:${this.port}`);
      console.log('🔒 Isolation mode: No internet access');
      console.log('🔒 Keeper Protocol 14-Delta activated');
      console.log('🔒 Localhost access only');
    });
  }

  stop() {
    // Очистка всех экземпляров
    for (const [userId, keeper] of this.instances) {
      keeper.cleanup();
    }
    this.instances.clear();
    console.log('🔒 Offline Keeper Server stopped');
  }
}

// Запуск сервера
const server = new KeeperOfflineServer();
server.start();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔒 Received SIGTERM, shutting down gracefully');
  server.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔒 Received SIGINT, shutting down gracefully');
  server.stop();
  process.exit(0);
});

module.exports = KeeperOfflineServer;
