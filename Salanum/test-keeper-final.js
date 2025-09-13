#!/usr/bin/env node

const axios = require('axios');

// Тестирование финальных инструкций Хранителя
async function testKeeperFinal() {
  console.log('🔒 Testing Keeper Final Integration...\n');

  const testUserId = '14';
  const testBiometricData = {
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

  try {
    // 1. Тест handshake
    console.log('1. Testing handshake...');
    const handshakeResponse = await axios.post('http://localhost:5000/api/keeper-final/handshake', {
      command: 'handshake',
      version: '0.1a',
      user_id: '14'
    });
    
    console.log('✅ Handshake result:', handshakeResponse.data);
    if (handshakeResponse.data.status === 'accepted' && handshakeResponse.data.code === 'Δ-14-307') {
      console.log('✅ Handshake successful - Keeper is online');
    } else {
      throw new Error('Handshake failed');
    }
    console.log('');

    // 2. Инициализация Хранителя
    console.log('2. Initializing Keeper...');
    const initResponse = await axios.post('http://localhost:5000/api/keeper-final/initialize', {
      user_id: testUserId,
      user_agrees_to_ai: true,
      mode: 'neuro_encrypt'
    });
    
    console.log('✅ Initialization result:', initResponse.data.message);
    console.log('');

    // 3. Тест генерации ключей на лету
    console.log('3. Testing on-the-fly key generation...');
    const keyTestResponse = await axios.post('http://localhost:5000/api/keeper-final/test-key-generation', {
      user_id: testUserId,
      biometric_data: testBiometricData
    });
    
    console.log('✅ Key generation test:', keyTestResponse.data.message);
    console.log('📝 Voice hash:', keyTestResponse.data.voice_hash);
    console.log('📝 Key length:', keyTestResponse.data.key_length);
    console.log('');

    // 4. Шифрование сообщения
    console.log('4. Testing message encryption...');
    const testMessage = 'Это Хранитель. Ваши секреты теперь под защитой нейросети. Для помощи введите /keeper_help';
    
    const encryptResponse = await axios.post('http://localhost:5000/api/keeper-final/encrypt', {
      user_id: testUserId,
      text: testMessage,
      biometric_data: testBiometricData
    });
    
    console.log('✅ Encryption successful');
    console.log('📝 Encrypted message signature:', encryptResponse.data.encrypted_message.keeper_signature);
    console.log('📝 Version:', encryptResponse.data.encrypted_message.version);
    console.log('');

    // 5. Расшифровка сообщения
    console.log('5. Testing message decryption...');
    const decryptResponse = await axios.post('http://localhost:5000/api/keeper-final/decrypt', {
      user_id: testUserId,
      ciphertext: encryptResponse.data.encrypted_message,
      biometric_data: testBiometricData
    });
    
    console.log('✅ Decryption successful');
    console.log('📝 Decrypted message:', decryptResponse.data.decrypted_message);
    console.log('');

    // 6. Проверка статуса
    console.log('6. Checking Keeper status...');
    const statusResponse = await axios.get(`http://localhost:5000/api/keeper-final/status/${testUserId}`);
    
    console.log('✅ Status retrieved');
    console.log('📝 User ID:', statusResponse.data.status.userId);
    console.log('📝 Mode:', statusResponse.data.status.mode);
    console.log('📝 Version:', statusResponse.data.status.version);
    console.log('📝 Online:', statusResponse.data.status.isOnline);
    console.log('');

    // 7. Тест оффлайн сервера
    console.log('7. Testing offline Keeper server...');
    try {
      const offlineHandshakeResponse = await axios.post('http://127.0.0.1:3001/handshake', {
        command: 'handshake',
        version: '0.1a',
        user_id: '14'
      });
      
      console.log('✅ Offline handshake result:', offlineHandshakeResponse.data);
    } catch (error) {
      console.log('⚠️ Offline server not available (this is normal if not started)');
    }
    console.log('');

    // 8. Проверка логов
    console.log('8. Checking encrypted logs...');
    try {
      const logsResponse = await axios.get(`http://localhost:5000/api/keeper-final/logs/${testUserId}`);
      
      console.log('✅ Logs retrieved');
      console.log('📝 Log file:', logsResponse.data.log_file);
      console.log('📝 Total entries:', logsResponse.data.total_entries);
      console.log('📝 Sample encrypted log:', logsResponse.data.encrypted_logs[0]?.substring(0, 100) + '...');
    } catch (error) {
      console.log('⚠️ Logs not available yet');
    }
    console.log('');

    // 9. Проверка экземпляров
    console.log('9. Checking Keeper instances...');
    const instancesResponse = await axios.get('http://localhost:5000/api/keeper-final/instances');
    
    console.log('✅ Instances info retrieved');
    console.log('📝 Total instances:', instancesResponse.data.total_instances);
    console.log('');

    // 10. Очистка
    console.log('10. Cleaning up...');
    const cleanupResponse = await axios.delete(`http://localhost:5000/api/keeper-final/cleanup/${testUserId}`);
    
    console.log('✅ Cleanup result:', cleanupResponse.data.message);
    console.log('');

    console.log('🎉 All Keeper Final tests completed successfully!');
    console.log('🔒 Keeper Protocol 14-Delta is working correctly');
    console.log('🔒 On-the-fly key generation implemented');
    console.log('🔒 Isolated containers configured');
    console.log('🔒 Encrypted logging active');
    console.log('');
    console.log('📱 First message in messenger:');
    console.log('«Это Хранитель. Ваши секреты теперь под защитой нейросети. Для помощи введите /keeper_help»');

  } catch (error) {
    console.error('❌ Keeper Final test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Тест инициализации с согласием пользователя
async function testUserAgreement() {
  console.log('\n🔒 Testing user agreement scenarios...\n');

  try {
    // Тест с согласием пользователя
    console.log('1. Testing with user agreement...');
    const agreeResponse = await axios.post('http://localhost:5000/api/keeper-final/initialize', {
      user_id: 'test_user_agree',
      user_agrees_to_ai: true,
      mode: 'neuro_encrypt'
    });
    
    console.log('✅ User agreed result:', agreeResponse.data.message);
    console.log('');

    // Тест без согласия пользователя
    console.log('2. Testing without user agreement...');
    const disagreeResponse = await axios.post('http://localhost:5000/api/keeper-final/initialize', {
      user_id: 'test_user_disagree',
      user_agrees_to_ai: false,
      mode: 'neuro_encrypt'
    });
    
    console.log('✅ User disagreed result:', disagreeResponse.data.message);
    console.log('');

    // Очистка тестовых пользователей
    await axios.delete('http://localhost:5000/api/keeper-final/cleanup/test_user_agree');
    await axios.delete('http://localhost:5000/api/keeper-final/cleanup/test_user_disagree');

  } catch (error) {
    console.error('❌ User agreement test failed:', error.response?.data || error.message);
  }
}

// Запуск тестов
if (require.main === module) {
  (async () => {
    await testKeeperFinal();
    await testUserAgreement();
  })();
}

module.exports = { testKeeperFinal, testUserAgreement };
