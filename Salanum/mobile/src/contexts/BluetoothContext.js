import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import bluetoothService from '../services/BluetoothService';

const BluetoothContext = createContext();

export const useBluetooth = () => {
  const context = useContext(BluetoothContext);
  if (!context) {
    throw new Error('useBluetooth must be used within a BluetoothProvider');
  }
  return context;
};

export const BluetoothProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [pairedDevices, setPairedDevices] = useState([]);
  const [meshNetwork, setMeshNetwork] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    initializeBluetooth();
    setupEventListeners();

    return () => {
      cleanup();
    };
  }, []);

  const initializeBluetooth = async () => {
    try {
      const success = await bluetoothService.initialize();
      setIsEnabled(success);
      
      if (success) {
        await loadPairedDevices();
      }
    } catch (error) {
      console.error('Bluetooth initialization error:', error);
      Alert.alert('Ошибка', 'Не удалось инициализировать Bluetooth');
    }
  };

  const setupEventListeners = () => {
    // Listen for discovered devices
    const discoveryInterval = setInterval(async () => {
      if (isScanning) {
        const devices = bluetoothService.getDiscoveredDevices();
        setDiscoveredDevices(devices);
      }
    }, 1000);

    // Listen for connection changes
    const connectionInterval = setInterval(() => {
      const connected = bluetoothService.getConnectedDevices();
      setConnectedDevices(connected);
    }, 1000);

    return () => {
      clearInterval(discoveryInterval);
      clearInterval(connectionInterval);
    };
  };

  const loadPairedDevices = async () => {
    try {
      const devices = await bluetoothService.getPairedDevices();
      setPairedDevices(devices);
    } catch (error) {
      console.error('Error loading paired devices:', error);
    }
  };

  const startScanning = async () => {
    try {
      const success = await bluetoothService.startDiscovery();
      setIsScanning(success);
      return success;
    } catch (error) {
      console.error('Error starting scan:', error);
      Alert.alert('Ошибка', 'Не удалось начать поиск устройств');
      return false;
    }
  };

  const stopScanning = async () => {
    try {
      await bluetoothService.stopDiscovery();
      setIsScanning(false);
    } catch (error) {
      console.error('Error stopping scan:', error);
    }
  };

  const connectToDevice = async (deviceId, deviceType = 'ble') => {
    try {
      const success = await bluetoothService.connectToDevice(deviceId, deviceType);
      if (success) {
        Alert.alert('Успех', 'Устройство подключено');
        await loadPairedDevices();
      } else {
        Alert.alert('Ошибка', 'Не удалось подключиться к устройству');
      }
      return success;
    } catch (error) {
      console.error('Error connecting to device:', error);
      Alert.alert('Ошибка', 'Ошибка подключения к устройству');
      return false;
    }
  };

  const disconnectFromDevice = async (deviceId, deviceType = 'ble') => {
    try {
      const success = await bluetoothService.disconnectFromDevice(deviceId, deviceType);
      if (success) {
        Alert.alert('Успех', 'Устройство отключено');
        await loadPairedDevices();
      }
      return success;
    } catch (error) {
      console.error('Error disconnecting from device:', error);
      return false;
    }
  };

  const sendMessage = async (deviceId, message, deviceType = 'ble') => {
    try {
      const success = await bluetoothService.sendMessage(deviceId, message, deviceType);
      if (success) {
        // Add message to local messages
        const newMessage = {
          id: Date.now().toString(),
          content: message,
          timestamp: Date.now(),
          type: 'sent',
          deviceId
        };
        setMessages(prev => [...prev, newMessage]);
      }
      return success;
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Ошибка', 'Не удалось отправить сообщение');
      return false;
    }
  };

  const sendAppPackage = async (deviceId, appData, deviceType = 'ble') => {
    try {
      const success = await bluetoothService.sendAppData(deviceId, appData, deviceType);
      if (success) {
        Alert.alert('Успех', 'Приложение отправлено');
      } else {
        Alert.alert('Ошибка', 'Не удалось отправить приложение');
      }
      return success;
    } catch (error) {
      console.error('Error sending app package:', error);
      Alert.alert('Ошибка', 'Ошибка отправки приложения');
      return false;
    }
  };

  const createMeshNetwork = async () => {
    try {
      const network = await bluetoothService.createMeshNetwork();
      if (network) {
        setMeshNetwork(network);
        Alert.alert('Успех', 'Mesh сеть создана');
      }
      return network;
    } catch (error) {
      console.error('Error creating mesh network:', error);
      Alert.alert('Ошибка', 'Не удалось создать mesh сеть');
      return null;
    }
  };

  const broadcastToMesh = async (message) => {
    try {
      const success = await bluetoothService.broadcastToMesh(message);
      if (success) {
        Alert.alert('Успех', 'Сообщение отправлено в mesh сеть');
      }
      return success;
    } catch (error) {
      console.error('Error broadcasting to mesh:', error);
      Alert.alert('Ошибка', 'Не удалось отправить сообщение в mesh сеть');
      return false;
    }
  };

  const shareAppViaBluetooth = async (deviceId, deviceType = 'ble') => {
    try {
      const appPackage = {
        name: 'Solana Messenger',
        version: '1.0.0',
        description: 'Децентрализованный мессенджер с AI защитой',
        apkUrl: 'file:///android_asset/app.apk', // В реальном приложении это будет путь к APK
        iconUrl: 'file:///android_asset/icon.png',
        features: [
          'AI маскировка сообщений',
          'Solana блокчейн интеграция',
          'Bluetooth P2P передача',
          'End-to-end шифрование'
        ],
        installInstructions: [
          '1. Получите APK файл',
          '2. Разрешите установку из неизвестных источников',
          '3. Установите приложение',
          '4. Создайте аккаунт'
        ]
      };

      const success = await sendAppPackage(deviceId, appPackage, deviceType);
      return success;
    } catch (error) {
      console.error('Error sharing app via Bluetooth:', error);
      return false;
    }
  };

  const cleanup = () => {
    bluetoothService.cleanup();
  };

  const value = {
    // State
    isEnabled,
    isScanning,
    discoveredDevices,
    connectedDevices,
    pairedDevices,
    meshNetwork,
    messages,
    
    // Actions
    startScanning,
    stopScanning,
    connectToDevice,
    disconnectFromDevice,
    sendMessage,
    sendAppPackage,
    createMeshNetwork,
    broadcastToMesh,
    shareAppViaBluetooth,
    loadPairedDevices
  };

  return (
    <BluetoothContext.Provider value={value}>
      {children}
    </BluetoothContext.Provider>
  );
};
