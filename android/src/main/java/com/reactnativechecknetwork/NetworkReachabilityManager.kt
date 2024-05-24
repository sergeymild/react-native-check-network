package com.reactnativechecknetwork

import android.content.Context
import android.net.*
import android.os.Build


typealias Listener = (isOffline: Boolean) -> Unit

class NetworkReachabilityManager: ConnectivityManager.NetworkCallback() {
  var listener: Listener? = null

  fun startListening(context: Context) {
    val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
      connectivityManager.registerDefaultNetworkCallback(this)
      connectivityManager.isDefaultNetworkActive
    } else {
      val request = NetworkRequest.Builder()
        .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET).build()
      connectivityManager.registerNetworkCallback(request, this)
    }
  }

  fun stop(context: Context) {
    val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    try {
      connectivityManager.unregisterNetworkCallback(this)
    } catch (e: Exception) {
      /* no-op */
    }
  }


  override fun onAvailable(network: Network) {
    listener?.invoke(true)
  }

  override fun onLost(network: Network) {
    listener?.invoke(false)
  }
}