import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';

import AppNavigator from './navigation/AppNavigator';
import AppInitializer from './store/AppInitializer';
import { store } from './store/store';
import NoInternetPopup from './components/common/NoInternetPopup';
import { ToastContainer } from './config/toastConfig';

const AppRoot = () => {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AppInitializer>
            <AppNavigator />
            <NoInternetPopup />
            <ToastContainer />
          </AppInitializer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
};

export default AppRoot;
