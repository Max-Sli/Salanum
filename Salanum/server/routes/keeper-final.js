const express = require('express');
const { KeeperFinal, createKeeper, getKeeper } = require('../services/KeeperFinal');
const router = express.Router();

// Глобальное хранилище экземпляров Хранителя
const keeperInstances = new Map();

// Handshake endpoint для проверки связи
router.post('/handshake', async (req, res) => {
  try {
    const { command, version, user_id } = req.body;

    if (!command || !version || !user_id) {
      return res.status(400).json({
        status: 'rejected',
        code: 'Δ-14-ERROR',
        message: 'Missing required parameters: command, version, user_id',
        keeper_signature: 'Keeper-14-Delta'
      });
    }

    // Создание временного экземпляра для handshake
    const tempKeeper = new KeeperFinal(user_id, 'neuro_encrypt');
    const response = tempKeeper.handshake(command, version, user_id);
    
    // Очистка временного экземпляра
    tempKeeper.cleanup();

    res.json(response);

  } catch (error) {
    console.error('Handshake error:', error);
    res.status(500).json({
      status: 'error',
      code: 'Δ-14-ERROR',
      message: 'Handshake failed',
      keeper_signature: 'Keeper-14-Delta'
    });
  }
});

// Инициализация Хранителя
router.post('/initialize', async (req, res) => {
  try {
    const { user_id, user_agrees_to_ai, mode = 'neuro_encrypt' } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
        keeper_signature: 'Keeper-14-Delta'
      });
    }

    // Проверка согласия пользователя на AI
    if (!user_agrees_to_ai) {
      return res.json({
        success: false,
        message: 'User declined AI integration',
        keeper_signature: 'Keeper-14-Delta'
      });
    }

    // Создание экземпляра Хранителя
    const keeper = createKeeper(user_id, user_agrees_to_ai, mode);
    
    if (keeper) {
      // Сохранение экземпляра
      keeperInstances.set(user_id, keeper);
      
      res.json({
        success: true,
        message: 'Keeper initialized successfully',
        keeper_status: keeper.getStatus(),
        keeper_signature: 'Keeper-14-Delta'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to initialize Keeper',
        keeper_signature: 'Keeper-14-Delta'
      });
    }

  } catch (error) {
    console.error('Keeper initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Keeper initialization failed',
      keeper_signature: 'Keeper-14-Delta'
    });
  }
});

// Шифрование сообщения
router.post('/encrypt', async (req, res) => {
  try {
    const { user_id, text, biometric_data } = req.body;

    if (!user_id || !text) {
      return res.status(400).json({
        success: false,
        message: 'User ID and text are required',
        keeper_signature: 'Keeper-14-Delta'
      });
    }

    // Получение экземпляра Хранителя
    const keeper = keeperInstances.get(user_id);
    if (!keeper) {
      return res.status(404).json({
        success: false,
        message: 'Keeper not initialized for this user',
        keeper_signature: 'Keeper-14-Delta'
      });
    }

    // Шифрование с биометрическими данными
    const encryptedMsg = keeper.encryptWithBiometrics(text, biometric_data);

    res.json({
      success: true,
      encrypted_message: encryptedMsg,
      keeper_signature: 'Keeper-14-Delta'
    });

  } catch (error) {
    console.error('Keeper encryption error:', error);
    res.status(500).json({
      success: false,
      message: 'Encryption failed',
      keeper_signature: 'Keeper-14-Delta'
    });
  }
});

// Расшифровка сообщения
router.post('/decrypt', async (req, res) => {
  try {
    const { user_id, ciphertext, biometric_data } = req.body;

    if (!user_id || !ciphertext) {
      return res.status(400).json({
        success: false,
        message: 'User ID and ciphertext are required',
        keeper_signature: 'Keeper-14-Delta'
      });
    }

    // Получение экземпляра Хранителя
    const keeper = keeperInstances.get(user_id);
    if (!keeper) {
      return res.status(404).json({
        success: false,
        message: 'Keeper not initialized for this user',
        keeper_signature: 'Keeper-14-Delta'
      });
    }

    // Расшифровка с биометрическими данными
    const decryptedMsg = keeper.decryptWithBiometrics(ciphertext, biometric_data);

    res.json({
      success: true,
      decrypted_message: decryptedMsg,
      keeper_signature: 'Keeper-14-Delta'
    });

  } catch (error) {
    console.error('Keeper decryption error:', error);
    res.status(500).json({
      success: false,
      message: 'Decryption failed',
      keeper_signature: 'Keeper-14-Delta'
    });
  }
});

// Получение статуса Хранителя
router.get('/status/:user_id', (req, res) => {
  try {
    const { user_id } = req.params;

    const keeper = keeperInstances.get(user_id);
    if (!keeper) {
      return res.status(404).json({
        success: false,
        message: 'Keeper not initialized for this user',
        keeper_signature: 'Keeper-14-Delta'
      });
    }

    const status = keeper.getStatus();

    res.json({
      success: true,
      status,
      keeper_signature: 'Keeper-14-Delta'
    });

  } catch (error) {
    console.error('Keeper status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get Keeper status',
      keeper_signature: 'Keeper-14-Delta'
    });
  }
});

// Тестирование генерации ключей на лету
router.post('/test-key-generation', async (req, res) => {
  try {
    const { user_id, biometric_data } = req.body;

    if (!user_id || !biometric_data) {
      return res.status(400).json({
        success: false,
        message: 'User ID and biometric data are required',
        keeper_signature: 'Keeper-14-Delta'
      });
    }

    // Создание временного экземпляра для тестирования
    const tempKeeper = new KeeperFinal(user_id, 'neuro_encrypt');
    
    // Извлечение хеша голоса
    const userVoiceHash = tempKeeper.extractVoiceHash(biometric_data);
    
    // Генерация ключа на лету
    const key = tempKeeper.generateKeyOnTheFly(userVoiceHash, biometric_data);
    
    // Очистка временного экземпляра
    tempKeeper.cleanup();

    res.json({
      success: true,
      voice_hash: userVoiceHash,
      key_generated: true,
      key_length: key.length,
      message: 'Key generated on-the-fly successfully',
      keeper_signature: 'Keeper-14-Delta'
    });

  } catch (error) {
    console.error('Key generation test error:', error);
    res.status(500).json({
      success: false,
      message: 'Key generation test failed',
      keeper_signature: 'Keeper-14-Delta'
    });
  }
});

// Получение зашифрованных логов
router.get('/logs/:user_id', (req, res) => {
  try {
    const { user_id } = req.params;
    const fs = require('fs');
    const path = require('path');

    const logFile = path.join(__dirname, '../logs', `keeper_${user_id}.keeper_log`);
    
    if (!fs.existsSync(logFile)) {
      return res.status(404).json({
        success: false,
        message: 'Log file not found',
        keeper_signature: 'Keeper-14-Delta'
      });
    }

    // Чтение зашифрованного лог файла
    const encryptedLogs = fs.readFileSync(logFile, 'utf8');
    const logLines = encryptedLogs.split('\n').filter(line => line.trim());

    res.json({
      success: true,
      log_file: `keeper_${user_id}.keeper_log`,
      encrypted_logs: logLines,
      total_entries: logLines.length,
      keeper_signature: 'Keeper-14-Delta'
    });

  } catch (error) {
    console.error('Log retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve logs',
      keeper_signature: 'Keeper-14-Delta'
    });
  }
});

// Очистка экземпляра Хранителя
router.delete('/cleanup/:user_id', (req, res) => {
  try {
    const { user_id } = req.params;

    const keeper = keeperInstances.get(user_id);
    if (!keeper) {
      return res.status(404).json({
        success: false,
        message: 'Keeper not found for this user',
        keeper_signature: 'Keeper-14-Delta'
      });
    }

    // Очистка ресурсов
    keeper.cleanup();
    
    // Удаление из хранилища
    keeperInstances.delete(user_id);

    res.json({
      success: true,
      message: 'Keeper cleaned up successfully',
      keeper_signature: 'Keeper-14-Delta'
    });

  } catch (error) {
    console.error('Keeper cleanup error:', error);
    res.status(500).json({
      success: false,
      message: 'Cleanup failed',
      keeper_signature: 'Keeper-14-Delta'
    });
  }
});

// Получение информации о всех экземплярах
router.get('/instances', (req, res) => {
  try {
    const instances = Array.from(keeperInstances.entries()).map(([userId, keeper]) => ({
      user_id: userId,
      status: keeper.getStatus()
    }));

    res.json({
      success: true,
      total_instances: instances.length,
      instances,
      keeper_signature: 'Keeper-14-Delta'
    });

  } catch (error) {
    console.error('Instances info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get instances info',
      keeper_signature: 'Keeper-14-Delta'
    });
  }
});

module.exports = router;
