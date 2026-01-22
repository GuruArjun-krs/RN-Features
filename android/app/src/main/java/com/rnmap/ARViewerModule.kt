package com.rnmap

import android.content.Context
import android.content.Intent
import android.net.Uri
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

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
}
