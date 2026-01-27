package com.rnmap

import android.content.Intent
import android.net.Uri
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.ar.core.ArCoreApk

class ARViewerModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ARViewerModule"
    }

    @ReactMethod
    fun displayInAR(url: String) {
        val intentUri = Uri.parse("https://arvr.google.com/scene-viewer/1.1")
            .buildUpon()
            .appendQueryParameter("file", url)
            .appendQueryParameter("mode", "ar_only")
            .build()

        val sceneViewerIntent = Intent(Intent.ACTION_VIEW).apply {
            data = intentUri
            setPackage("com.google.ar.core")
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }

        reactContext.startActivity(sceneViewerIntent)
    }

    @ReactMethod
    fun isARSupportedOnDevice(callback: Callback) {
        try {
            val availability =
                ArCoreApk.getInstance().checkAvailability(reactContext)

            when {
                availability.isSupported -> callback.invoke("SUPPORTED")
                availability.isTransient -> callback.invoke("TRANSIENT")
                else -> callback.invoke("UNAVAILABLE")
            }
        } catch (e: Exception) {
            callback.invoke("UNAVAILABLE")
        }
    }
}
