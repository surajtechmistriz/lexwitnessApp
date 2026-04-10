import React, { useEffect } from "react"
import AppNavigator from "./src/navigation/AppNavigator"
import {AuthProvider} from './src/context/AuthContext'
import NoInternetPopup from "./src/modal/NoInternetPopup"
import SplashScreen from 'react-native-splash-screen';
export default function App() {
  useEffect(()=>{

    SplashScreen.hide()
  },[])
  return(
    <AuthProvider>

    <AppNavigator/>

      <NoInternetPopup />
    </AuthProvider>
  )
}