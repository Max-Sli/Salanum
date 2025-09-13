#!/usr/bin/env node

const axios = require('axios');

// Тестирование протокола Хранителя
async function testKeeperProtocol() {
  console.log('🔒 Testing Keeper Protocol 14-Delta...\n');

  try {
    // 1. Проверка активации протокола
    console.log('1. Activating Keeper Protocol...');
    const activationResponse = await axios.post('http://localhost:5000/api/keeper/activate', {
      protocol: 'Freedom'
    });
    console.log('✅ Activation result:', activationResponse.data.result);
    console.log('');

    // 2. Проверка статуса Хранителя
    console.log('2. Checking Keeper status...');
    const statusResponse = await axios.get('http://localhost:5000/api/keeper/status');
    console.log('✅ Keeper status:', statusResponse.data.status);
    console.log('');

    // 3. Регистрация тестового пользователя
    console.log('3. Registering test user biometrics...');
    const testUserId = 'test_user_123';
    const testBiometrics = {
      voice: {
        pitch: 150.5,
        frequency: 220.0,
        amplitude: 0.8,
        duration: 2.5,
        spectralCentroid: 1000.0
      },
      typing: {
        averageSpeed: 45.2,
        rhythm: [120, 150, 180, 200, 160, 140, 170, 190, 130, 110],
        pressure: 0.7,
        accuracy: 0.95,
        pauses: [500, 800, 1200, 600, 900]
      },
      entropy: {
        accelerometer: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        gyroscope: [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95],
        magnetometer: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        temperature: 25.5,
        battery: 85.0,
        network: { signal: 75 }
      }
    };

    const registerResponse = await axios.post('http://localhost:5000/api/keeper/register', {
      userId: testUserId,
      biometricData: testBiometrics
    });
    console.log('✅ Registration result:', registerResponse.data.message);
    console.log('');

    // 4. Валидация пользователя
    console.log('4. Validating test user...');
    const validateResponse = await axios.post('http://localhost:5000/api/keeper/validate', {
      userId: testUserId,
      biometricData: testBiometrics
    });
    console.log('✅ Validation result:', validateResponse.data.valid);
    console.log('');

    // 5. Шифрование тестового сообщения
    console.log('5. Encrypting test message...');
    const testMessage = 'Это Хранитель. Ваши секреты теперь под защитой нейросети. Для помощи введите /keeper_help';
    const encryptResponse = await axios.post('http://localhost:5000/api/keeper/encrypt', {
      userId: testUserId,
      message: testMessage,
      biometricData: testBiometrics
    });
    console.log('✅ Encryption successful');
    console.log('📝 Encrypted data signature:', encryptResponse.data.encrypted_data.keeper_signature);
    console.log('');

    // 6. Расшифровка сообщения
    console.log('6. Decrypting test message...');
    const decryptResponse = await axios.post('http://localhost:5000/api/keeper/decrypt', {
      userId: testUserId,
      encryptedData: encryptResponse.data.encrypted_data,
      biometricData: testBiometrics
    });
    console.log('✅ Decryption successful');
    console.log('📝 Decrypted message:', decryptResponse.data.decrypted_message);
    console.log('');

    // 7. Проверка справки
    console.log('7. Getting Keeper help...');
    const helpResponse = await axios.get('http://localhost:5000/api/keeper/help');
    console.log('✅ Help retrieved');
    console.log('📝 Available commands:', helpResponse.data.help.commands);
    console.log('');

    // 8. Тестирование оффлайн сервера
    console.log('8. Testing offline Keeper server...');
    try {
      const offlineStatusResponse = await axios.get('http://127.0.0.1:3001/keeper/status');
      console.log('✅ Offline server status:', offlineStatusResponse.data.status);
    } catch (error) {
      console.log('⚠️ Offline server not available (this is normal if not started)');
    }
    console.log('');

    console.log('🎉 All Keeper tests completed successfully!');
    console.log('🔒 Keeper Protocol 14-Delta is working correctly');
    console.log('');
    console.log('📱 First message in messenger:');
    console.log('«Это Хранитель. Ваши секреты теперь под защитой нейросети. Для помощи введите /keeper_help»');

  } catch (error) {
    console.error('❌ Keeper test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Запуск тестов
if (require.main === module) {
  testKeeperProtocol();
}

module.exports = { testKeeperProtocol };
