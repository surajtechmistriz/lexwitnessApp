import 'react-native-gesture-handler';

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
  const wasOffline = useRef(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const isConnected = state.isConnected;

      // internet lost
      if (!isConnected) {
        wasOffline.current = true;

        Toast.show({
          type: 'error',
          text1: 'No Internet',
          text2: 'Connection lost',
        });
      }

      // internet back
      if (isConnected && wasOffline.current) {
        wasOffline.current = false;

        Toast.show({
          type: 'success',
          text1: 'Internet Connected',
          text2: 'Refreshing app...',
        });

        // OPTIONAL REFRESH ACTIONS HERE
        // dispatch(fetchHomeData())
        // dispatch(fetchMagazines())

        // OPTIONAL NAVIGATION RESET
        // navigationRef.reset({
        //   index: 0,
        //   routes: [{ name: 'HomeTab' }],
        // });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <AppInitializer>
            <AppNavigator />

            {/* <NoInternetPopup /> */}

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