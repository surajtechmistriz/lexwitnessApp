import React from "react"
import AppNavigator from "./src/navigation/AppNavigator"
import {AuthProvider} from './src/context/AuthContext'
import NoInternetPopup from "./src/modal/NoInternetPopup"

export default function App() {
  return(
    <AuthProvider>

    <AppNavigator/>

      <NoInternetPopup />
    </AuthProvider>
  )
}