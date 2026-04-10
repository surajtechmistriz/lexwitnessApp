package com.lexwitness

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen // Import the library

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "lexwitness"

  override fun onCreate(savedInstanceState: Bundle?) {
    // 1. Show the splash screen library
    
    // 2. IMPORTANT: Switch from SplashTheme back to AppTheme
    setTheme(R.style.AppTheme) 
    
    super.onCreate(savedInstanceState)
  }

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}