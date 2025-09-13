import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Linking,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { BlurView } from 'react-native-blur';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useBluetooth } from '../contexts/BluetoothContext';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

const ShareAppScreen = ({ navigation }) => {
  const { shareAppViaBluetooth, discoveredDevices, connectedDevices } = useBluetooth();
  const { theme } = useTheme();
  
  const [selectedMethod, setSelectedMethod] = useState('bluetooth');
  const [isSharing, setIsSharing] = useState(false);
  const [shareData, setShareData] = useState({
    appName: 'Solana Messenger',
    version: '1.0.0',
    description: 'Децентрализованный мессенджер с AI защитой и Bluetooth P2P передачей',
    features: [
      '🤖 AI маскировка сообщений в реальном времени',
      '🔗 Интеграция с Solana блокчейном',
      '📱 Bluetooth P2P передача приложения',
      '🔐 End-to-end шифрование',
      '🌐 Mesh networking',
      '💬 Real-time мессенджер',
      '💰 Встроенный криптокошелек'
    ],
    qrData: 'https://solana-messenger.app/download',
    downloadUrl: 'https://solana-messenger.app/download'
  });

  const styles = createStyles(theme);

  const shareMethods = [
    {
      id: 'bluetooth',
      title: 'Bluetooth P2P',
      description: 'Передача через Bluetooth напрямую',
      icon: 'bluetooth',
      color: theme.colors.primary
    },
    {
      id: 'qr',
      title: 'QR код',
      description: 'Покажите QR код для скачивания',
      icon: 'qr-code',
      color: theme.colors.secondary
    },
    {
      id: 'link',
      title: 'Ссылка',
      description: 'Поделитесь ссылкой на приложение',
      icon: 'link',
      color: theme.colors.accent
    },
    {
      id: 'mesh',
      title: 'Mesh сеть',
      description: 'Распространение через mesh сеть',
      icon: 'account-tree',
      color: theme.colors.success
    }
  ];

  const handleBluetoothShare = async () => {
    if (discoveredDevices.length === 0 && connectedDevices.length === 0) {
      Alert.alert(
        'Нет устройств',
        'Сначала найдите и подключитесь к устройствам через Bluetooth',
        [
          { text: 'OK' },
          { text: 'Перейти к Bluetooth', onPress: () => navigation.navigate('Bluetooth') }
        ]
      );
      return;
    }

    setIsSharing(true);
    
    try {
      // Share to all connected devices
      for (const deviceId of connectedDevices) {
        await shareAppViaBluetooth(deviceId, 'ble');
      }
      
      Alert.alert('Успех', 'Приложение отправлено через Bluetooth');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось отправить приложение');
    } finally {
      setIsSharing(false);
    }
  };

  const handleQRShare = () => {
    Alert.alert(
      'QR код',
      'Покажите этот QR код другим пользователям для скачивания приложения',
      [{ text: 'OK' }]
    );
  };

  const handleLinkShare = async () => {
    try {
      await Share.share({
        message: `Скачайте Solana Messenger - децентрализованный мессенджер с AI защитой!\n\n${shareData.downloadUrl}`,
        url: shareData.downloadUrl,
        title: shareData.appName
      });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось поделиться ссылкой');
    }
  };

  const handleMeshShare = () => {
    Alert.alert(
      'Mesh сеть',
      'Функция mesh сети будет доступна при подключении к нескольким устройствам',
      [{ text: 'OK' }]
    );
  };

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    
    switch (methodId) {
      case 'bluetooth':
        handleBluetoothShare();
        break;
      case 'qr':
        handleQRShare();
        break;
      case 'link':
        handleLinkShare();
        break;
      case 'mesh':
        handleMeshShare();
        break;
    }
  };

  const renderMethodCard = (method) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.methodCard,
        selectedMethod === method.id && styles.methodCardSelected
      ]}
      onPress={() => handleMethodSelect(method.id)}
      disabled={isSharing}
    >
      <View style={[styles.methodIcon, { backgroundColor: method.color }]}>
        <Icon name={method.icon} size={24} color={theme.colors.textInverse} />
      </View>
      <View style={styles.methodContent}>
        <Text style={styles.methodTitle}>{method.title}</Text>
        <Text style={styles.methodDescription}>{method.description}</Text>
      </View>
      {isSharing && selectedMethod === method.id && (
        <ActivityIndicator size="small" color={method.color} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.appIcon}>
          <Icon name="chat" size={32} color={theme.colors.textInverse} />
        </View>
        <View style={styles.appInfo}>
          <Text style={styles.appName}>{shareData.appName}</Text>
          <Text style={styles.appVersion}>v{shareData.version}</Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.descriptionSection}>
        <Text style={styles.description}>{shareData.description}</Text>
      </View>

      {/* Features */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Возможности</Text>
        {shareData.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Share Methods */}
      <View style={styles.methodsSection}>
        <Text style={styles.sectionTitle}>Способы передачи</Text>
        {shareMethods.map(renderMethodCard)}
      </View>

      {/* QR Code */}
      {selectedMethod === 'qr' && (
        <View style={styles.qrSection}>
          <Text style={styles.sectionTitle}>QR код для скачивания</Text>
          <View style={styles.qrContainer}>
            <QRCode
              value={shareData.qrData}
              size={width * 0.6}
              color={theme.colors.text}
              backgroundColor={theme.colors.background}
            />
          </View>
          <Text style={styles.qrText}>
            Отсканируйте QR код для скачивания приложения
          </Text>
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructionsSection}>
        <Text style={styles.sectionTitle}>Инструкции по установке</Text>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>1</Text>
          <Text style={styles.instructionText}>
            Получите APK файл через Bluetooth или скачайте по ссылке
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>2</Text>
          <Text style={styles.instructionText}>
            Разрешите установку из неизвестных источников в настройках
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>3</Text>
          <Text style={styles.instructionText}>
            Установите приложение и создайте аккаунт
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>4</Text>
          <Text style={styles.instructionText}>
            Настройте Bluetooth для P2P передачи
          </Text>
        </View>
      </View>

      {/* Security Notice */}
      <View style={styles.securitySection}>
        <Icon name="security" size={24} color={theme.colors.warning} />
        <View style={styles.securityContent}>
          <Text style={styles.securityTitle}>Безопасность</Text>
          <Text style={styles.securityText}>
            Приложение передается через зашифрованный Bluetooth канал. 
            Все сообщения защищены end-to-end шифрованием и AI маскировкой.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  appVersion: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  descriptionSection: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  featuresSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  featureItem: {
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  methodsSection: {
    padding: 20,
    paddingTop: 0,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  methodCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  qrSection: {
    padding: 20,
    paddingTop: 0,
    alignItems: 'center',
  },
  qrContainer: {
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 16,
  },
  qrText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  instructionsSection: {
    padding: 20,
    paddingTop: 0,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    color: theme.colors.textInverse,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  securitySection: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: theme.colors.warningLight,
    margin: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.warning,
  },
  securityContent: {
    flex: 1,
    marginLeft: 12,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.warning,
    marginBottom: 4,
  },
  securityText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
});

export default ShareAppScreen;
