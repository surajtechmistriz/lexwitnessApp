import 'react-native-gesture-handler'; //  MUST be first

import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';

import NoInternetPopup from './src/modal/NoInternetPopup';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppInitializer from './src/redux/AppInitializer';
// import SplashScreen from 'react-native-splash-screen';

export default function App() {
  // useEffect(() => {
  //   SplashScreen.hide();
  // }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <AppInitializer>
            <AppNavigator />

            {/* Global Popup */}
            <NoInternetPopup />
          </AppInitializer>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
