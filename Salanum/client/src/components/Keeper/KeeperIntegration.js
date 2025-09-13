import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Shield, Brain, Lock, Eye, EyeOff, Mic, Keyboard, Cpu } from 'lucide-react';
import axios from 'axios';

const KeeperContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  margin: 1rem 0;
  border: 1px solid ${props => props.theme.colors.border};
`;

const KeeperHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const KeeperIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textInverse};
`;

const KeeperInfo = styled.div`
  flex: 1;
`;

const KeeperTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const KeeperSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const KeeperStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.active ? props.theme.colors.successLight : props.theme.colors.errorLight};
  color: ${props => props.active ? props.theme.colors.success : props.theme.colors.error};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const KeeperControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const KeeperButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.active ? props.theme.colors.primaryLight : props.theme.colors.background};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.surfaceHover};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BiometricSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const BiometricTitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const BiometricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const BiometricCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const BiometricIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
`;

const BiometricInfo = styled.div`
  flex: 1;
`;

const BiometricName = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text};
`;

const BiometricStatus = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textSecondary};
`;

const KeeperMessage = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.primaryLight};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  text-align: center;
`;

const KeeperIntegration = ({ userId, onKeeperToggle }) => {
  const [keeperActive, setKeeperActive] = useState(false);
  const [keeperStatus, setKeeperStatus] = useState(null);
  const [biometricData, setBiometricData] = useState({
    voice: { collected: false, quality: 0 },
    typing: { collected: false, quality: 0 },
    entropy: { collected: false, quality: 0 }
  });
  const [isCollecting, setIsCollecting] = useState(false);

  useEffect(() => {
    checkKeeperStatus();
    loadBiometricData();
  }, [userId]);

  const checkKeeperStatus = async () => {
    try {
      const response = await axios.get('/api/keeper/status');
      setKeeperStatus(response.data.status);
      setKeeperActive(response.data.status.activated);
    } catch (error) {
      console.error('Error checking Keeper status:', error);
    }
  };

  const loadBiometricData = async () => {
    try {
      // Загрузка биометрических данных пользователя
      // В реальном приложении это будет через API
      const mockData = {
        voice: { collected: true, quality: 85 },
        typing: { collected: true, quality: 92 },
        entropy: { collected: true, quality: 78 }
      };
      setBiometricData(mockData);
    } catch (error) {
      console.error('Error loading biometric data:', error);
    }
  };

  const toggleKeeper = async () => {
    try {
      setIsCollecting(true);
      
      if (!keeperActive) {
        // Активация Хранителя
        await activateKeeper();
      } else {
        // Деактивация Хранителя
        await deactivateKeeper();
      }
      
      setKeeperActive(!keeperActive);
      onKeeperToggle && onKeeperToggle(!keeperActive);
    } catch (error) {
      console.error('Error toggling Keeper:', error);
    } finally {
      setIsCollecting(false);
    }
  };

  const activateKeeper = async () => {
    try {
      // Сбор биометрических данных
      const biometrics = await collectBiometricData();
      
      // Регистрация в Хранителе
      await axios.post('/api/keeper/register', {
        userId,
        biometricData: biometrics
      });
      
      // Активация протокола
      await axios.post('/api/keeper/activate', {
        protocol: 'Freedom'
      });
      
      console.log('Keeper activated successfully');
    } catch (error) {
      console.error('Error activating Keeper:', error);
      throw error;
    }
  };

  const deactivateKeeper = async () => {
    try {
      // Деактивация Хранителя
      console.log('Keeper deactivated');
    } catch (error) {
      console.error('Error deactivating Keeper:', error);
      throw error;
    }
  };

  const collectBiometricData = async () => {
    try {
      const biometrics = {
        voice: await collectVoiceData(),
        typing: await collectTypingData(),
        entropy: await collectDeviceEntropy()
      };
      
      return biometrics;
    } catch (error) {
      console.error('Error collecting biometric data:', error);
      return null;
    }
  };

  const collectVoiceData = async () => {
    try {
      // В реальном приложении здесь будет запись голоса
      return {
        pitch: Math.random() * 100,
        frequency: Math.random() * 1000,
        amplitude: Math.random() * 100,
        duration: Math.random() * 10,
        spectralCentroid: Math.random() * 100
      };
    } catch (error) {
      console.error('Error collecting voice data:', error);
      return null;
    }
  };

  const collectTypingData = async () => {
    try {
      // В реальном приложении здесь будет анализ печати
      return {
        averageSpeed: Math.random() * 100,
        rhythm: Array.from({ length: 10 }, () => Math.random() * 1000),
        pressure: Math.random() * 100,
        accuracy: Math.random() * 100,
        pauses: Array.from({ length: 5 }, () => Math.random() * 2000)
      };
    } catch (error) {
      console.error('Error collecting typing data:', error);
      return null;
    }
  };

  const collectDeviceEntropy = async () => {
    try {
      // В реальном приложении здесь будет сбор данных с датчиков
      return {
        accelerometer: Array.from({ length: 10 }, () => Math.random() * 100),
        gyroscope: Array.from({ length: 10 }, () => Math.random() * 100),
        magnetometer: Array.from({ length: 10 }, () => Math.random() * 100),
        temperature: Math.random() * 50,
        battery: Math.random() * 100,
        network: { signal: Math.random() * 100 }
      };
    } catch (error) {
      console.error('Error collecting device entropy:', error);
      return null;
    }
  };

  const getBiometricQuality = (type) => {
    return biometricData[type]?.quality || 0;
  };

  const getBiometricStatus = (type) => {
    return biometricData[type]?.collected ? 'Собрано' : 'Не собрано';
  };

  return (
    <KeeperContainer>
      <KeeperHeader>
        <KeeperIcon>
          <Shield size={24} />
        </KeeperIcon>
        <KeeperInfo>
          <KeeperTitle>Хранитель (Keeper)</KeeperTitle>
          <KeeperSubtitle>Нейросетевая защита Protocol 14-Delta</KeeperSubtitle>
        </KeeperInfo>
        <KeeperStatus active={keeperActive}>
          {keeperActive ? 'Активен' : 'Неактивен'}
        </KeeperStatus>
      </KeeperHeader>

      <KeeperControls>
        <KeeperButton
          active={keeperActive}
          onClick={toggleKeeper}
          disabled={isCollecting}
        >
          {keeperActive ? <EyeOff size={16} /> : <Eye size={16} />}
          {keeperActive ? 'Деактивировать' : 'Активировать'}
        </KeeperButton>
        
        <KeeperButton
          onClick={checkKeeperStatus}
          disabled={isCollecting}
        >
          <Brain size={16} />
          Статус
        </KeeperButton>
      </KeeperControls>

      {keeperActive && (
        <BiometricSection>
          <BiometricTitle>Биометрические данные</BiometricTitle>
          <BiometricGrid>
            <BiometricCard>
              <BiometricIcon>
                <Mic size={16} />
              </BiometricIcon>
              <BiometricInfo>
                <BiometricName>Голос</BiometricName>
                <BiometricStatus>
                  {getBiometricStatus('voice')} • Качество: {getBiometricQuality('voice')}%
                </BiometricStatus>
              </BiometricInfo>
            </BiometricCard>
            
            <BiometricCard>
              <BiometricIcon>
                <Keyboard size={16} />
              </BiometricIcon>
              <BiometricInfo>
                <BiometricName>Печать</BiometricName>
                <BiometricStatus>
                  {getBiometricStatus('typing')} • Качество: {getBiometricQuality('typing')}%
                </BiometricStatus>
              </BiometricInfo>
            </BiometricCard>
            
            <BiometricCard>
              <BiometricIcon>
                <Cpu size={16} />
              </BiometricIcon>
              <BiometricInfo>
                <BiometricName>Энтропия</BiometricName>
                <BiometricStatus>
                  {getBiometricStatus('entropy')} • Качество: {getBiometricQuality('entropy')}%
                </BiometricStatus>
              </BiometricInfo>
            </BiometricCard>
          </BiometricGrid>
        </BiometricSection>
      )}

      {keeperActive && (
        <KeeperMessage>
          🔒 Хранитель активен. Ваши секреты защищены нейросетью.
          <br />
          Для помощи введите /keeper_help
        </KeeperMessage>
      )}
    </KeeperContainer>
  );
};

export default KeeperIntegration;
