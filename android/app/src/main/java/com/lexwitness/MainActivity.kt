package com.lexwitness

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
SplashScreen.show(this) 
    super.onCreate(savedInstanceState)
  }

  override fun getMainComponentName(): String {
    return "lexwitness"
  }

  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return DefaultReactActivityDelegate(
      this,
      getMainComponentName(),
      fabricEnabled
    )
  }
}