const crypto = require('crypto');

class BiometricCollector {
  constructor() {
    this.collectedData = new Map();
    this.isCollecting = false;
  }

  // Сбор голосовых данных
  collectVoiceData(audioBuffer, userId) {
    try {
      if (!audioBuffer || !userId) {
        throw new Error('Audio buffer and user ID are required');
      }

      // Анализ аудио данных
      const voiceFeatures = this.analyzeAudio(audioBuffer);
      
      // Сохранение данных
      if (!this.collectedData.has(userId)) {
        this.collectedData.set(userId, {});
      }
      
      this.collectedData.get(userId).voice = {
        pitch: voiceFeatures.pitch,
        frequency: voiceFeatures.frequency,
        amplitude: voiceFeatures.amplitude,
        duration: voiceFeatures.duration,
        spectralCentroid: voiceFeatures.spectralCentroid,
        timestamp: Date.now()
      };

      return voiceFeatures;
    } catch (error) {
      console.error('Voice data collection error:', error);
      return null;
    }
  }

  // Анализ аудио данных
  analyzeAudio(audioBuffer) {
    try {
      // Простой анализ аудио (в реальности будет более сложный)
      const buffer = Buffer.isBuffer(audioBuffer) ? audioBuffer : Buffer.from(audioBuffer);
      
      // Расчет основных характеристик
      let sum = 0;
      let max = 0;
      let min = 0;
      
      for (let i = 0; i < buffer.length; i++) {
        const value = buffer[i];
        sum += value;
        max = Math.max(max, value);
        min = Math.min(min, value);
      }
      
      const average = sum / buffer.length;
      const amplitude = (max - min) / 2;
      
      // Расчет частоты (упрощенный)
      const frequency = this.calculateFrequency(buffer);
      
      // Расчет высоты тона (упрощенный)
      const pitch = this.calculatePitch(buffer);
      
      // Спектральный центроид
      const spectralCentroid = this.calculateSpectralCentroid(buffer);
      
      return {
        pitch: pitch,
        frequency: frequency,
        amplitude: amplitude,
        duration: buffer.length / 44100, // Предполагаем 44.1kHz
        spectralCentroid: spectralCentroid
      };
    } catch (error) {
      console.error('Audio analysis error:', error);
      return {
        pitch: 0,
        frequency: 0,
        amplitude: 0,
        duration: 0,
        spectralCentroid: 0
      };
    }
  }

  // Расчет частоты
  calculateFrequency(buffer) {
    try {
      // Упрощенный расчет частоты
      let zeroCrossings = 0;
      for (let i = 1; i < buffer.length; i++) {
        if ((buffer[i] >= 128) !== (buffer[i-1] >= 128)) {
          zeroCrossings++;
        }
      }
      
      return zeroCrossings / 2; // Частота в Гц
    } catch (error) {
      return 0;
    }
  }

  // Расчет высоты тона
  calculatePitch(buffer) {
    try {
      // Упрощенный расчет высоты тона
      const frequency = this.calculateFrequency(buffer);
      return Math.log2(frequency / 440) * 12; // В полутонах от A4
    } catch (error) {
      return 0;
    }
  }

  // Расчет спектрального центроида
  calculateSpectralCentroid(buffer) {
    try {
      // Упрощенный расчет спектрального центроида
      let weightedSum = 0;
      let magnitudeSum = 0;
      
      for (let i = 0; i < buffer.length; i++) {
        const magnitude = Math.abs(buffer[i]);
        weightedSum += i * magnitude;
        magnitudeSum += magnitude;
      }
      
      return magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;
    } catch (error) {
      return 0;
    }
  }

  // Сбор данных о паттернах печати
  collectTypingData(typingEvents, userId) {
    try {
      if (!typingEvents || !userId) {
        throw new Error('Typing events and user ID are required');
      }

      // Анализ паттернов печати
      const typingFeatures = this.analyzeTyping(typingEvents);
      
      // Сохранение данных
      if (!this.collectedData.has(userId)) {
        this.collectedData.set(userId, {});
      }
      
      this.collectedData.get(userId).typing = {
        averageSpeed: typingFeatures.averageSpeed,
        rhythm: typingFeatures.rhythm,
        pressure: typingFeatures.pressure,
        accuracy: typingFeatures.accuracy,
        pauses: typingFeatures.pauses,
        timestamp: Date.now()
      };

      return typingFeatures;
    } catch (error) {
      console.error('Typing data collection error:', error);
      return null;
    }
  }

  // Анализ паттернов печати
  analyzeTyping(typingEvents) {
    try {
      if (!Array.isArray(typingEvents) || typingEvents.length === 0) {
        return {
          averageSpeed: 0,
          rhythm: [],
          pressure: 0,
          accuracy: 0,
          pauses: []
        };
      }

      // Расчет скорости печати
      const totalTime = typingEvents[typingEvents.length - 1].timestamp - typingEvents[0].timestamp;
      const averageSpeed = typingEvents.length / (totalTime / 1000); // символов в секунду

      // Анализ ритма
      const rhythm = [];
      for (let i = 1; i < typingEvents.length; i++) {
        const interval = typingEvents[i].timestamp - typingEvents[i-1].timestamp;
        rhythm.push(interval);
      }

      // Анализ пауз
      const pauses = rhythm.filter(interval => interval > 1000); // паузы больше 1 секунды

      // Расчет точности (упрощенный)
      const accuracy = this.calculateTypingAccuracy(typingEvents);

      // Расчет давления (если доступно)
      const pressure = this.calculateTypingPressure(typingEvents);

      return {
        averageSpeed: averageSpeed,
        rhythm: rhythm,
        pressure: pressure,
        accuracy: accuracy,
        pauses: pauses
      };
    } catch (error) {
      console.error('Typing analysis error:', error);
      return {
        averageSpeed: 0,
        rhythm: [],
        pressure: 0,
        accuracy: 0,
        pauses: []
      };
    }
  }

  // Расчет точности печати
  calculateTypingAccuracy(typingEvents) {
    try {
      let correctChars = 0;
      let totalChars = typingEvents.length;

      // Упрощенный расчет точности
      for (const event of typingEvents) {
        if (event.type === 'keydown' && !event.isError) {
          correctChars++;
        }
      }

      return totalChars > 0 ? correctChars / totalChars : 0;
    } catch (error) {
      return 0;
    }
  }

  // Расчет давления при печати
  calculateTypingPressure(typingEvents) {
    try {
      let totalPressure = 0;
      let pressureCount = 0;

      for (const event of typingEvents) {
        if (event.pressure !== undefined) {
          totalPressure += event.pressure;
          pressureCount++;
        }
      }

      return pressureCount > 0 ? totalPressure / pressureCount : 0;
    } catch (error) {
      return 0;
    }
  }

  // Сбор данных об энтропии устройства
  collectDeviceEntropy(deviceData, userId) {
    try {
      if (!deviceData || !userId) {
        throw new Error('Device data and user ID are required');
      }

      // Анализ энтропии устройства
      const entropyFeatures = this.analyzeDeviceEntropy(deviceData);
      
      // Сохранение данных
      if (!this.collectedData.has(userId)) {
        this.collectedData.set(userId, {});
      }
      
      this.collectedData.get(userId).entropy = {
        accelerometer: entropyFeatures.accelerometer,
        gyroscope: entropyFeatures.gyroscope,
        magnetometer: entropyFeatures.magnetometer,
        temperature: entropyFeatures.temperature,
        battery: entropyFeatures.battery,
        network: entropyFeatures.network,
        timestamp: Date.now()
      };

      return entropyFeatures;
    } catch (error) {
      console.error('Device entropy collection error:', error);
      return null;
    }
  }

  // Анализ энтропии устройства
  analyzeDeviceEntropy(deviceData) {
    try {
      return {
        accelerometer: deviceData.accelerometer || [],
        gyroscope: deviceData.gyroscope || [],
        magnetometer: deviceData.magnetometer || [],
        temperature: deviceData.temperature || 0,
        battery: deviceData.battery || 0,
        network: deviceData.network || {}
      };
    } catch (error) {
      console.error('Device entropy analysis error:', error);
      return {
        accelerometer: [],
        gyroscope: [],
        magnetometer: [],
        temperature: 0,
        battery: 0,
        network: {}
      };
    }
  }

  // Получение всех собранных данных пользователя
  getUserBiometricData(userId) {
    try {
      return this.collectedData.get(userId) || null;
    } catch (error) {
      console.error('Get user biometric data error:', error);
      return null;
    }
  }

  // Очистка старых данных
  cleanup() {
    try {
      const currentTime = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 часа

      for (const [userId, data] of this.collectedData) {
        if (data.voice && currentTime - data.voice.timestamp > maxAge) {
          delete data.voice;
        }
        if (data.typing && currentTime - data.typing.timestamp > maxAge) {
          delete data.typing;
        }
        if (data.entropy && currentTime - data.entropy.timestamp > maxAge) {
          delete data.entropy;
        }

        // Удаляем пользователя если нет данных
        if (!data.voice && !data.typing && !data.entropy) {
          this.collectedData.delete(userId);
        }
      }

      console.log('Biometric data cleanup completed');
    } catch (error) {
      console.error('Biometric data cleanup error:', error);
    }
  }

  // Получение статистики
  getStats() {
    try {
      let totalUsers = this.collectedData.size;
      let usersWithVoice = 0;
      let usersWithTyping = 0;
      let usersWithEntropy = 0;

      for (const [userId, data] of this.collectedData) {
        if (data.voice) usersWithVoice++;
        if (data.typing) usersWithTyping++;
        if (data.entropy) usersWithEntropy++;
      }

      return {
        totalUsers,
        usersWithVoice,
        usersWithTyping,
        usersWithEntropy,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Get biometric stats error:', error);
      return {
        totalUsers: 0,
        usersWithVoice: 0,
        usersWithTyping: 0,
        usersWithEntropy: 0,
        timestamp: Date.now()
      };
    }
  }
}

const biometricCollector = new BiometricCollector();

module.exports = {
  biometricCollector,
  BiometricCollector
};
