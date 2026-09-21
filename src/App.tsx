import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

// import { store } from '../redux/store';
// import AppInitializer from '../redux/AppInitializer';
// import AppNavigator from '../navigation/AppNavigator';
// import NoInternetPopup from '../modal/NoInternetPopup';
import Toast from 'react-native-toast-message';

// import { toastConfig } from '../config/toastConfig'; // we will create this
import NoInternetPopup from './modal/NoInternetPopup';
import AppNavigator from './navigation/AppNavigator';
import AppInitializer from './redux/AppInitializer';
import { toastConfig } from '../src/config/toastConfig';
import { store } from './redux/store';

const AppRoot = () => {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
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
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
};

export default AppRoot;