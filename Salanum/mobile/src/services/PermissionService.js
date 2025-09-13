import { 
  PermissionsAndroid, 
  Platform, 
  Alert,
  Linking,
  Settings
} from 'react-native';

export const requestPermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.MODIFY_AUDIO_SETTINGS,
        PermissionsAndroid.PERMISSIONS.INTERNET,
        PermissionsAndroid.PERMISSIONS.ACCESS_NETWORK_STATE,
        PermissionsAndroid.PERMISSIONS.WAKE_LOCK,
        PermissionsAndroid.PERMISSIONS.VIBRATE,
        PermissionsAndroid.PERMISSIONS.USE_FINGERPRINT,
        PermissionsAndroid.PERMISSIONS.USE_BIOMETRIC
      ];

      // Request permissions in batches
      const results = await PermissionsAndroid.requestMultiple(permissions);
      
      // Check if all critical permissions are granted
      const criticalPermissions = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ];

      const criticalGranted = criticalPermissions.every(
        permission => results[permission] === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!criticalGranted) {
        Alert.alert(
          'Необходимые разрешения',
          'Для работы приложения необходимы разрешения на Bluetooth и местоположение. Пожалуйста, предоставьте их в настройках.',
          [
            { text: 'Отмена', style: 'cancel' },
            { 
              text: 'Настройки', 
              onPress: () => Settings.openSettings() 
            }
          ]
        );
        return false;
      }

      return true;
    } else {
      // iOS permissions are handled differently
      return true;
    }
  } catch (error) {
    console.error('Permission request error:', error);
    return false;
  }
};

export const requestBluetoothPermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      const bluetoothPermissions = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE
      ];

      const results = await PermissionsAndroid.requestMultiple(bluetoothPermissions);
      
      return bluetoothPermissions.every(
        permission => results[permission] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  } catch (error) {
    console.error('Bluetooth permission request error:', error);
    return false;
  }
};

export const requestLocationPermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      const locationPermissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      ];

      const results = await PermissionsAndroid.requestMultiple(locationPermissions);
      
      return locationPermissions.every(
        permission => results[permission] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  } catch (error) {
    console.error('Location permission request error:', error);
    return false;
  }
};

export const requestStoragePermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      const storagePermissions = [
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      ];

      const results = await PermissionsAndroid.requestMultiple(storagePermissions);
      
      return storagePermissions.every(
        permission => results[permission] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  } catch (error) {
    console.error('Storage permission request error:', error);
    return false;
  }
};

export const requestCameraPermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  } catch (error) {
    console.error('Camera permission request error:', error);
    return false;
  }
};

export const requestMicrophonePermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      const microphonePermissions = [
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.MODIFY_AUDIO_SETTINGS
      ];

      const results = await PermissionsAndroid.requestMultiple(microphonePermissions);
      
      return microphonePermissions.every(
        permission => results[permission] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  } catch (error) {
    console.error('Microphone permission request error:', error);
    return false;
  }
};

export const checkPermissionStatus = async (permission) => {
  try {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.check(permission);
      return result;
    }
    return true;
  } catch (error) {
    console.error('Permission check error:', error);
    return false;
  }
};

export const openAppSettings = () => {
  Settings.openSettings();
};

export const openBluetoothSettings = () => {
  if (Platform.OS === 'android') {
    Linking.openSettings();
  }
};

export const showPermissionExplanation = (permission, onGrant) => {
  const explanations = {
    [PermissionsAndroid.PERMISSIONS.BLUETOOTH]: {
      title: 'Bluetooth',
      message: 'Приложению необходим доступ к Bluetooth для P2P передачи сообщений и файлов между устройствами.'
    },
    [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]: {
      title: 'Местоположение',
      message: 'Bluetooth сканирование требует разрешения на местоположение для поиска ближайших устройств.'
    },
    [PermissionsAndroid.PERMISSIONS.CAMERA]: {
      title: 'Камера',
      message: 'Камера используется для сканирования QR кодов и создания фото для профиля.'
    },
    [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO]: {
      title: 'Микрофон',
      message: 'Микрофон необходим для голосовых сообщений и звонков.'
    },
    [PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]: {
      title: 'Хранилище',
      message: 'Доступ к хранилищу нужен для сохранения файлов и резервных копий.'
    }
  };

  const explanation = explanations[permission];
  if (explanation) {
    Alert.alert(
      explanation.title,
      explanation.message,
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Разрешить', onPress: onGrant }
      ]
    );
  }
};
