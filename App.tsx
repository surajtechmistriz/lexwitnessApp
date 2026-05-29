import 'react-native-gesture-handler';
import 'react-native-reanimated';

import React, { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';

import NoInternetPopup from './src/modal/NoInternetPopup';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppInitializer from './src/redux/AppInitializer';

import Toast, {
  BaseToast,
  ErrorToast,
} from 'react-native-toast-message';

import NetInfo from '@react-native-community/netinfo';
import { enableScreens } from 'react-native-screens';

enableScreens(true);

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#16a34a',
        backgroundColor: '#f0fff4',
        borderRadius: 10,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: '700',
        color: '#1f2937',
      }}
      text2Style={{
        fontSize: 12,
        color: '#4b5563',
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#c9060a',
        backgroundColor: '#fff1f1',
        borderRadius: 10,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: '700',
        color: '#333333',
      }}
      text2Style={{
        fontSize: 12,
        color: '#555555',
      }}
    />
  ),

  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#c9060a',
        backgroundColor: '#fff7f7',
        borderRadius: 10,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: '700',
        color: '#333333',
      }}
      text2Style={{
        fontSize: 12,
        color: '#666666',
      }}
    />
  ),
};

export default function App() {
 
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <AppInitializer>
            <AppNavigator />

           <NoInternetPopup />

            <Toast
              position="top"
              topOffset={60}
              visibilityTime={3000}
              config={toastConfig}
            />
          </AppInitializer>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}