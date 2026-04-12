import 'react-native-gesture-handler'; // 👈 MUST be first

import React, { useEffect } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from './src/context/AuthContext';
import NoInternetPopup from "./src/modal/NoInternetPopup";
import SplashScreen from 'react-native-splash-screen';

export default function App() {

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          
          <AppNavigator />
          
          {/* Global Popup */}
          <NoInternetPopup />

        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}