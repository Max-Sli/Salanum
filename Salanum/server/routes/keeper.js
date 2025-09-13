const express = require('express');
const { keeperService } = require('../services/KeeperService');
const router = express.Router();

// Валидация пользователя через Хранителя
router.post('/validate', async (req, res) => {
  try {
    const { userId, biometricData, message } = req.body;

    if (!userId || !biometricData) {
      return res.status(400).json({ 
        message: 'User ID and biometric data are required',
        keeper_signature: 'Keeper-14-Delta'
      });
    }

    // Валидация пользователя через биометрические данные
    const isValid = keeperService.validateUser(userId, biometricData);

    if (isValid) {
      res.json({
        valid: true,
        message: 'User validated by Keeper',
        keeper_signature: 'Keeper-14-Delta',
        timestamp: Date.now()
      });
    } else {
      res.status(401).json({
        valid: false,
        message: 'User validation failed',
        keeper_signature: 'Keeper-14-Delta',
        timestamp: Date.now()
      });
    }

  } catch (error) {
    console.error('Keeper validation error:', error);
    res.status(500).json({
      error: 'Keeper validation failed',
      keeper_signature: 'Keeper-14-Delta'
    });
  }
});

// Регистрация биометрических данных пользователя
router.post('/register', async (req, res) => {
  try {
    const { userId, biometricData } = req.body;

    if (!userId || !biometricData) {
      return res.status(400).json({ 
        message: 'User ID and biometric data are required',
        keeper_signature: 'Keeper-14-Delta'
      });
    }

    // Генерация нейро-ключа
    const neuroKey = keeperService.generateNeuroKey(userId, biometricData);

    if (neuroKey) {
      res.json({
        success: true,
        message: 'Biometric data registered with Keeper',
        keeper_signature: 'Keeper-14-Delta',
        timestamp: Date.now()
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to register biometric data',
        keeper_signature: 'Keeper-14-Delta'
      });
    }

  } catch (error) {
    console.error('Keeper registration error:', error);
    res.status(500).json({
      error: 'Keeper registration failed',
      keeper_signature: 'Keeper-14-Delta'
    });
  }
});

// Шифрование сообщения через Хранителя
router.post('/encrypt', async (req, res) => {
  try {
    const { userId, message, biometricData } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ 
        message: 'User ID and message are required',
        keeper_signature: 'Keeper-14-Delta'
      });
    }

    // Обновление биометрических данных если предоставлены
    if (biometricData) {
      keeperService.generateNeuroKey(userId, biometricData);
    }

    // Шифрование сообщения
    const encryptedData = keeperService.keeper_encrypt(message, userId);

    res.json({
      success: true,
      encrypted_data: encryptedData,
      keeper_signature: 'Keeper-14-Delta',
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Keeper encryption error:', error);
    res.status(500).json({
      error: 'Keeper encryption failed',
      keeper_signature: 'Keeper-14-Delta'
    });
  }
});

// Расшифровка сообщения через Хранителя
router.post('/decrypt', async (req, res) => {
  try {
    const { userId, encryptedData, biometricData } = req.body;

    if (!userId || !encryptedData) {
      return res.status(400).json({ 
        message: 'User ID and encrypted data are required',
        keeper_signature: 'Keeper-14-Delta'
      });
    }

    // Обновление биометрических данных если предоставлены
    if (biometricData) {
      keeperService.generateNeuroKey(userId, biometricData);
    }

    // Расшифровка сообщения
    const decryptedMessage = keeperService.keeper_decrypt(encryptedData, userId);

    res.json({
      success: true,
      decrypted_message: decryptedMessage,
      keeper_signature: 'Keeper-14-Delta',
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Keeper decryption error:', error);
    res.status(500).json({
      error: 'Keeper decryption failed',
      keeper_signature: 'Keeper-14-Delta'
    });
  }
});

// Получение статуса Хранителя
router.get('/status', (req, res) => {
  try {
    const status = keeperService.getStatus();
    
    res.json({
      status,
      keeper_signature: 'Keeper-14-Delta',
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Keeper status error:', error);
    res.status(500).json({
      error: 'Failed to get Keeper status',
      keeper_signature: 'Keeper-14-Delta'
    });
  }
});

// Обновление весов нейросети
router.post('/update-weights', (req, res) => {
  try {
    keeperService.updateWeights();
    
    res.json({
      success: true,
      message: 'Keeper neural weights updated',
      keeper_signature: 'Keeper-14-Delta',
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Keeper weights update error:', error);
    res.status(500).json({
      error: 'Failed to update Keeper weights',
      keeper_signature: 'Keeper-14-Delta'
    });
  }
});

// Очистка старых данных
router.post('/cleanup', (req, res) => {
  try {
    keeperService.cleanup();
    
    res.json({
      success: true,
      message: 'Keeper cleanup completed',
      keeper_signature: 'Keeper-14-Delta',
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Keeper cleanup error:', error);
    res.status(500).json({
      error: 'Failed to cleanup Keeper data',
      keeper_signature: 'Keeper-14-Delta'
    });
  }
});

// Активация протокола Хранителя
router.post('/activate', (req, res) => {
  try {
    const { protocol } = req.body;
    
    const result = keeperService.activateProtocol(protocol);
    
    res.json({
      result,
      keeper_signature: 'Keeper-14-Delta',
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Keeper activation error:', error);
    res.status(500).json({
      error: 'Failed to activate Keeper protocol',
      keeper_signature: 'Keeper-14-Delta'
    });
  }
});

// Получение справки по Хранителю
router.get('/help', (req, res) => {
  try {
    const help = {
      commands: [
        '/keeper_help - Показать эту справку',
        '/keeper_status - Статус Хранителя',
        '/keeper_register - Регистрация биометрических данных',
        '/keeper_validate - Валидация пользователя',
        '/keeper_encrypt - Шифрование через Хранителя',
        '/keeper_decrypt - Расшифровка через Хранителя'
      ],
      features: [
        'Нейро-ключи на основе голоса',
        'Анализ паттернов печати',
        'Энтропия устройств',
        'Оффлайн режим работы',
        'Автоматическое обновление весов'
      ],
      security: [
        'End-to-end шифрование',
        'Биометрическая аутентификация',
        'Нейросетевая защита',
        'Оффлайн хранение данных'
      ]
    };
    
    res.json({
      help,
      keeper_signature: 'Keeper-14-Delta',
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Keeper help error:', error);
    res.status(500).json({
      error: 'Failed to get Keeper help',
      keeper_signature: 'Keeper-14-Delta'
    });
  }
});

module.exports = router;
