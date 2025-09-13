import React, { useEffect, useState } from 'react';
import { StatusBar, Platform, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Context Providers
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { BluetoothProvider } from './src/contexts/BluetoothContext';
import { MeshProvider } from './src/contexts/MeshContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import WalletScreen from './src/screens/WalletScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import BluetoothScreen from './src/screens/BluetoothScreen';
import ShareAppScreen from './src/screens/ShareAppScreen';

// Services
import { requestPermissions } from './src/services/PermissionService';
import { initializeBluetooth } from './src/services/BluetoothService';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
function MainTabs() {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Chats') {
            iconName = 'chat';
          } else if (route.name === 'Wallet') {
            iconName = 'account-balance-wallet';
          } else if (route.name === 'Bluetooth') {
            iconName = 'bluetooth';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Главная' }}
      />
      <Tab.Screen 
        name="Chats" 
        component={ChatScreen}
        options={{ title: 'Чаты' }}
      />
      <Tab.Screen 
        name="Wallet" 
        component={WalletScreen}
        options={{ title: 'Кошелек' }}
      />
      <Tab.Screen 
        name="Bluetooth" 
        component={BluetoothScreen}
        options={{ title: 'Bluetooth' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Настройки' }}
      />
    </Tab.Navigator>
  );
}

// Main App Navigator
function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen 
              name="ShareApp" 
              component={ShareAppScreen}
              options={{ 
                headerShown: true,
                title: 'Поделиться приложением',
                headerBackTitle: 'Назад'
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Main App Component
export default function App() {
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Request necessary permissions
      const granted = await requestPermissions();
      setPermissionsGranted(granted);

      if (granted) {
        // Initialize Bluetooth
        await initializeBluetooth();
      }
    } catch (error) {
      console.error('App initialization error:', error);
      Toast.show({
        type: 'error',
        text1: 'Ошибка инициализации',
        text2: 'Не удалось запустить приложение',
      });
    }
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <BluetoothProvider>
            <MeshProvider>
              <StatusBar 
                barStyle="light-content" 
                backgroundColor="#000000" 
              />
              <AppNavigator />
              <Toast />
            </MeshProvider>
          </BluetoothProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
