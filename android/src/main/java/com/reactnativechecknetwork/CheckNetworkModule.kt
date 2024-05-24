package com.reactnativechecknetwork

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class CheckNetworkModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  private val onNetworkChangeEventName = "onNetworkChange"
  private val manager = NetworkReachabilityManager()
  private var isReachable = false

  override fun getName(): String {
    return "CheckNetwork"
  }



  @ReactMethod
  fun startListen(promise: Promise) {
    manager.startListening(reactApplicationContext)
    manager.listener = {
      reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        ?.emit(onNetworkChangeEventName, Arguments.createMap().apply {
          this.putBoolean("isReachable", it)
        })
      isReachable = it
      promise.resolve(it)
    }
  }

  @ReactMethod
  fun stopListen(promise: Promise) {
    manager.stop(reactApplicationContext)
    promise.resolve(null)
  }

  @ReactMethod
  fun isReachable(promise: Promise) {
    promise.resolve(isReachable)
  }
}
