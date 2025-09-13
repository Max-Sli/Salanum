import { 
  PermissionsAndroid, 
  Platform, 
  Alert,
  NativeModules,
  NativeEventEmitter
} from 'react-native';
import BluetoothClassic from 'react-native-bluetooth-classic';
import BleManager from 'react-native-ble-manager';
import { requestPermissions } from './PermissionService';

class BluetoothService {
  constructor() {
    this.isEnabled = false;
    this.isScanning = false;
    this.connectedDevices = new Set();
    this.discoveredDevices = new Map();
    this.messageQueue = new Map();
    this.eventEmitter = new NativeEventEmitter(NativeModules.BluetoothClassic);
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Bluetooth Classic events
    this.eventEmitter.addListener('bluetoothEnabled', () => {
      this.isEnabled = true;
      console.log('Bluetooth enabled');
    });

    this.eventEmitter.addListener('bluetoothDisabled', () => {
      this.isEnabled = false;
      console.log('Bluetooth disabled');
    });

    this.eventEmitter.addListener('deviceConnected', (device) => {
      this.connectedDevices.add(device.address);
      console.log('Device connected:', device.name);
    });

    this.eventEmitter.addListener('deviceDisconnected', (device) => {
      this.connectedDevices.delete(device.address);
      console.log('Device disconnected:', device.name);
    });

    this.eventEmitter.addListener('dataReceived', (data) => {
      this.handleReceivedData(data);
    });

    // BLE events
    BleManager.addListener('BleManagerDiscoverPeripheral', (peripheral) => {
      this.discoveredDevices.set(peripheral.id, peripheral);
    });

    BleManager.addListener('BleManagerConnectPeripheral', (peripheral) => {
      this.connectedDevices.add(peripheral.id);
      console.log('BLE device connected:', peripheral.name);
    });

    BleManager.addListener('BleManagerDisconnectPeripheral', (peripheral) => {
      this.connectedDevices.delete(peripheral.id);
      console.log('BLE device disconnected:', peripheral.name);
    });
  }

  async initialize() {
    try {
      // Request permissions
      const granted = await requestPermissions();
      if (!granted) {
        throw new Error('Bluetooth permissions not granted');
      }

      // Initialize BLE Manager
      await BleManager.start({ showAlert: false });

      // Check if Bluetooth is enabled
      const enabled = await this.isBluetoothEnabled();
      if (!enabled) {
        await this.requestBluetoothEnable();
      }

      this.isEnabled = true;
      return true;
    } catch (error) {
      console.error('Bluetooth initialization error:', error);
      return false;
    }
  }

  async isBluetoothEnabled() {
    try {
      if (Platform.OS === 'android') {
        return await BluetoothClassic.isBluetoothEnabled();
      } else {
        return await BleManager.checkState();
      }
    } catch (error) {
      console.error('Error checking Bluetooth state:', error);
      return false;
    }
  }

  async requestBluetoothEnable() {
    return new Promise((resolve) => {
      Alert.alert(
        'Bluetooth',
        'Для работы приложения необходимо включить Bluetooth',
        [
          {
            text: 'Отмена',
            onPress: () => resolve(false),
            style: 'cancel',
          },
          {
            text: 'Включить',
            onPress: async () => {
              try {
                if (Platform.OS === 'android') {
                  await BluetoothClassic.requestBluetoothEnabled();
                }
                resolve(true);
              } catch (error) {
                console.error('Error enabling Bluetooth:', error);
                resolve(false);
              }
            },
          },
        ]
      );
    });
  }

  async startDiscovery() {
    try {
      if (this.isScanning) {
        return;
      }

      this.isScanning = true;
      this.discoveredDevices.clear();

      // Start BLE scan
      await BleManager.scan([], 30, true);

      // Start Bluetooth Classic discovery
      if (Platform.OS === 'android') {
        await BluetoothClassic.startDiscovery();
      }

      console.log('Bluetooth discovery started');
      return true;
    } catch (error) {
      console.error('Error starting discovery:', error);
      this.isScanning = false;
      return false;
    }
  }

  async stopDiscovery() {
    try {
      if (!this.isScanning) {
        return;
      }

      // Stop BLE scan
      await BleManager.stopScan();

      // Stop Bluetooth Classic discovery
      if (Platform.OS === 'android') {
        await BluetoothClassic.cancelDiscovery();
      }

      this.isScanning = false;
      console.log('Bluetooth discovery stopped');
    } catch (error) {
      console.error('Error stopping discovery:', error);
    }
  }

  async connectToDevice(deviceId, deviceType = 'ble') {
    try {
      if (deviceType === 'ble') {
        await BleManager.connect(deviceId);
        return true;
      } else {
        // Bluetooth Classic connection
        const connected = await BluetoothClassic.connectToDevice(deviceId);
        return connected;
      }
    } catch (error) {
      console.error('Error connecting to device:', error);
      return false;
    }
  }

  async disconnectFromDevice(deviceId, deviceType = 'ble') {
    try {
      if (deviceType === 'ble') {
        await BleManager.disconnect(deviceId);
      } else {
        await BluetoothClassic.disconnectFromDevice(deviceId);
      }
      
      this.connectedDevices.delete(deviceId);
      return true;
    } catch (error) {
      console.error('Error disconnecting from device:', error);
      return false;
    }
  }

  async sendMessage(deviceId, message, deviceType = 'ble') {
    try {
      const messageData = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        content: message,
        type: 'message'
      };

      const serializedMessage = JSON.stringify(messageData);

      if (deviceType === 'ble') {
        // Send via BLE
        await BleManager.write(deviceId, 'FFE0', 'FFE1', serializedMessage);
      } else {
        // Send via Bluetooth Classic
        await BluetoothClassic.writeToDevice(deviceId, serializedMessage);
      }

      console.log('Message sent to device:', deviceId);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  async sendAppData(deviceId, appData, deviceType = 'ble') {
    try {
      const appPackage = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: 'app_package',
        data: appData,
        version: '1.0.0'
      };

      const serializedPackage = JSON.stringify(appPackage);

      if (deviceType === 'ble') {
        await BleManager.write(deviceId, 'FFE0', 'FFE1', serializedPackage);
      } else {
        await BluetoothClassic.writeToDevice(deviceId, serializedPackage);
      }

      console.log('App data sent to device:', deviceId);
      return true;
    } catch (error) {
      console.error('Error sending app data:', error);
      return false;
    }
  }

  handleReceivedData(data) {
    try {
      const parsedData = JSON.parse(data);
      
      switch (parsedData.type) {
        case 'message':
          this.handleReceivedMessage(parsedData);
          break;
        case 'app_package':
          this.handleReceivedAppPackage(parsedData);
          break;
        case 'mesh_update':
          this.handleMeshUpdate(parsedData);
          break;
        default:
          console.log('Unknown data type received:', parsedData.type);
      }
    } catch (error) {
      console.error('Error parsing received data:', error);
    }
  }

  handleReceivedMessage(messageData) {
    // Emit event for message received
    this.eventEmitter.emit('messageReceived', messageData);
  }

  handleReceivedAppPackage(appPackage) {
    // Emit event for app package received
    this.eventEmitter.emit('appPackageReceived', appPackage);
  }

  handleMeshUpdate(meshData) {
    // Emit event for mesh network update
    this.eventEmitter.emit('meshUpdate', meshData);
  }

  getDiscoveredDevices() {
    return Array.from(this.discoveredDevices.values());
  }

  getConnectedDevices() {
    return Array.from(this.connectedDevices);
  }

  async getPairedDevices() {
    try {
      if (Platform.OS === 'android') {
        return await BluetoothClassic.getBondedDevices();
      } else {
        return await BleManager.getConnectedPeripherals([]);
      }
    } catch (error) {
      console.error('Error getting paired devices:', error);
      return [];
    }
  }

  async createMeshNetwork() {
    try {
      // Create a mesh network for P2P communication
      const meshConfig = {
        networkId: `mesh_${Date.now()}`,
        maxNodes: 10,
        encryption: true,
        protocol: 'bluetooth_mesh'
      };

      // Start mesh network
      await this.startMeshNetwork(meshConfig);
      
      return meshConfig;
    } catch (error) {
      console.error('Error creating mesh network:', error);
      return null;
    }
  }

  async startMeshNetwork(config) {
    try {
      // Implementation for mesh network
      console.log('Starting mesh network with config:', config);
      
      // This would integrate with a mesh networking library
      // For now, we'll simulate the mesh network
      return true;
    } catch (error) {
      console.error('Error starting mesh network:', error);
      return false;
    }
  }

  async broadcastToMesh(message) {
    try {
      const meshMessage = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: 'mesh_broadcast',
        content: message,
        hops: 0,
        maxHops: 5
      };

      // Broadcast to all connected devices
      for (const deviceId of this.connectedDevices) {
        await this.sendMessage(deviceId, JSON.stringify(meshMessage));
      }

      return true;
    } catch (error) {
      console.error('Error broadcasting to mesh:', error);
      return false;
    }
  }

  cleanup() {
    this.eventEmitter.removeAllListeners();
    this.stopDiscovery();
    this.connectedDevices.clear();
    this.discoveredDevices.clear();
  }
}

export const bluetoothService = new BluetoothService();
export default bluetoothService;
