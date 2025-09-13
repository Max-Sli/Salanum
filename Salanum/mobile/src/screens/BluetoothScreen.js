import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Switch,
  TextInput,
  Modal,
  ActivityIndicator
} from 'react-native';
import { useBluetooth } from '../contexts/BluetoothContext';
import { useTheme } from '../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BlurView } from 'react-native-blur';

const BluetoothScreen = () => {
  const {
    isEnabled,
    isScanning,
    discoveredDevices,
    connectedDevices,
    pairedDevices,
    meshNetwork,
    startScanning,
    stopScanning,
    connectToDevice,
    disconnectFromDevice,
    shareAppViaBluetooth,
    createMeshNetwork,
    broadcastToMesh
  } = useBluetooth();

  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [meshMessage, setMeshMessage] = useState('');
  const [showMeshModal, setShowMeshModal] = useState(false);

  const styles = createStyles(theme);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh logic here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleDevicePress = (device) => {
    Alert.alert(
      'Устройство',
      `Имя: ${device.name || 'Неизвестно'}\nАдрес: ${device.id || device.address}`,
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Подключиться', onPress: () => connectToDevice(device.id || device.address) },
        { text: 'Поделиться приложением', onPress: () => {
          setSelectedDevice(device);
          setShowShareModal(true);
        }}
      ]
    );
  };

  const handleShareApp = async () => {
    if (selectedDevice) {
      const success = await shareAppViaBluetooth(
        selectedDevice.id || selectedDevice.address,
        'ble'
      );
      if (success) {
        setShowShareModal(false);
        setSelectedDevice(null);
      }
    }
  };

  const handleCreateMesh = async () => {
    const network = await createMeshNetwork();
    if (network) {
      setShowMeshModal(true);
    }
  };

  const handleMeshBroadcast = async () => {
    if (meshMessage.trim()) {
      await broadcastToMesh(meshMessage);
      setMeshMessage('');
      setShowMeshModal(false);
    }
  };

  const renderDeviceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => handleDevicePress(item)}
    >
      <View style={styles.deviceInfo}>
        <Icon 
          name="bluetooth" 
          size={24} 
          color={connectedDevices.includes(item.id || item.address) ? theme.colors.success : theme.colors.textSecondary} 
        />
        <View style={styles.deviceDetails}>
          <Text style={styles.deviceName}>
            {item.name || 'Неизвестное устройство'}
          </Text>
          <Text style={styles.deviceAddress}>
            {item.id || item.address}
          </Text>
        </View>
      </View>
      <View style={styles.deviceStatus}>
        {connectedDevices.includes(item.id || item.address) ? (
          <Icon name="check-circle" size={20} color={theme.colors.success} />
        ) : (
          <Icon name="radio-button-unchecked" size={20} color={theme.colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = (title) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.statusRow}>
          <Icon 
            name="bluetooth" 
            size={24} 
            color={isEnabled ? theme.colors.primary : theme.colors.textSecondary} 
          />
          <Text style={styles.statusText}>
            Bluetooth {isEnabled ? 'включен' : 'выключен'}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.scanButton, isScanning && styles.scanButtonActive]}
          onPress={isScanning ? stopScanning : startScanning}
          disabled={!isEnabled}
        >
          <Icon 
            name={isScanning ? "stop" : "search"} 
            size={20} 
            color={theme.colors.textInverse} 
          />
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Остановить' : 'Поиск'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mesh Network Section */}
      {meshNetwork && (
        <View style={styles.meshSection}>
          <View style={styles.meshHeader}>
            <Icon name="account-tree" size={20} color={theme.colors.primary} />
            <Text style={styles.meshTitle}>Mesh Сеть</Text>
          </View>
          <Text style={styles.meshInfo}>
            ID: {meshNetwork.networkId}
          </Text>
          <Text style={styles.meshInfo}>
            Узлов: {connectedDevices.length}
          </Text>
          <TouchableOpacity
            style={styles.meshButton}
            onPress={() => setShowMeshModal(true)}
          >
            <Text style={styles.meshButtonText}>Отправить в сеть</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Device Lists */}
      <FlatList
        data={[
          ...discoveredDevices,
          ...pairedDevices.filter(device => 
            !discoveredDevices.some(d => d.id === device.id || d.address === device.address)
          )
        ]}
        keyExtractor={(item) => item.id || item.address}
        renderItem={renderDeviceItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="bluetooth-disabled" size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>
              {isScanning ? 'Поиск устройств...' : 'Устройства не найдены'}
            </Text>
            {!isEnabled && (
              <Text style={styles.emptySubtext}>
                Включите Bluetooth для поиска устройств
              </Text>
            )}
          </View>
        }
        ListHeaderComponent={
          <View>
            {discoveredDevices.length > 0 && renderSectionHeader('Найденные устройства')}
            {pairedDevices.length > 0 && renderSectionHeader('Сопряженные устройства')}
          </View>
        }
      />

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCreateMesh}
          disabled={connectedDevices.length < 2}
        >
          <Icon name="account-tree" size={20} color={theme.colors.primary} />
          <Text style={styles.actionButtonText}>Создать Mesh</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowShareModal(true)}
        >
          <Icon name="share" size={20} color={theme.colors.primary} />
          <Text style={styles.actionButtonText}>Поделиться</Text>
        </TouchableOpacity>
      </View>

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShareModal(false)}
      >
        <BlurView style={styles.modalOverlay} blurType="dark" blurAmount={10}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Поделиться приложением</Text>
            <Text style={styles.modalText}>
              Выберите устройство для отправки приложения Solana Messenger
            </Text>
            
            <FlatList
              data={discoveredDevices.concat(pairedDevices)}
              keyExtractor={(item) => item.id || item.address}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalDeviceItem}
                  onPress={() => {
                    setSelectedDevice(item);
                    handleShareApp();
                  }}
                >
                  <Text style={styles.modalDeviceName}>
                    {item.name || 'Неизвестное устройство'}
                  </Text>
                  <Text style={styles.modalDeviceAddress}>
                    {item.id || item.address}
                  </Text>
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={styles.modalCloseText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      {/* Mesh Broadcast Modal */}
      <Modal
        visible={showMeshModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMeshModal(false)}
      >
        <BlurView style={styles.modalOverlay} blurType="dark" blurAmount={10}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Отправить в Mesh сеть</Text>
            
            <TextInput
              style={styles.meshInput}
              placeholder="Введите сообщение..."
              value={meshMessage}
              onChangeText={setMeshMessage}
              multiline
              maxLength={280}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowMeshModal(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Отмена</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleMeshBroadcast}
                disabled={!meshMessage.trim()}
              >
                <Text style={styles.modalButtonPrimaryText}>Отправить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
  },
  scanButtonActive: {
    backgroundColor: theme.colors.error,
  },
  scanButtonText: {
    color: theme.colors.textInverse,
    fontWeight: '500',
  },
  meshSection: {
    margin: 16,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  meshHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  meshTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  meshInfo: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  meshButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  meshButtonText: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.surface,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  deviceAddress: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  deviceStatus: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    marginTop: 8,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 20,
  },
  modalDeviceItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalDeviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  modalDeviceAddress: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  meshInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  modalButtonSecondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalButtonPrimaryText: {
    color: theme.colors.textInverse,
    fontWeight: '500',
  },
  modalButtonSecondaryText: {
    color: theme.colors.text,
    fontWeight: '500',
  },
});

export default BluetoothScreen;
