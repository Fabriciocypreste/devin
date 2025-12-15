package com.redflix.tv.utils

import android.content.Context
import android.os.Handler
import android.os.Looper
import android.view.KeyEvent
import android.view.LayoutInflater
import android.view.View
import android.widget.TextView
import android.widget.PopupWindow
import com.redflix.tv.R

class ChannelInputHandler(
    private val context: Context,
    private val onChannelSelected: (Int) -> Unit
) {
    private var channelBuffer = StringBuilder()
    private val handler = Handler(Looper.getMainLooper())
    private var timeoutRunnable: Runnable? = null
    private var overlayPopup: PopupWindow? = null
    
    companion object {
        private const val INPUT_TIMEOUT_MS = 2500L
    }
    
    fun handleKeyDown(keyCode: Int): Boolean {
        val digit = getDigitFromKeyCode(keyCode)
        
        if (digit != null) {
            appendDigit(digit)
            return true
        }
        
        return false
    }
    
    private fun getDigitFromKeyCode(keyCode: Int): Int? {
        return when (keyCode) {
            KeyEvent.KEYCODE_0, KeyEvent.KEYCODE_NUMPAD_0 -> 0
            KeyEvent.KEYCODE_1, KeyEvent.KEYCODE_NUMPAD_1 -> 1
            KeyEvent.KEYCODE_2, KeyEvent.KEYCODE_NUMPAD_2 -> 2
            KeyEvent.KEYCODE_3, KeyEvent.KEYCODE_NUMPAD_3 -> 3
            KeyEvent.KEYCODE_4, KeyEvent.KEYCODE_NUMPAD_4 -> 4
            KeyEvent.KEYCODE_5, KeyEvent.KEYCODE_NUMPAD_5 -> 5
            KeyEvent.KEYCODE_6, KeyEvent.KEYCODE_NUMPAD_6 -> 6
            KeyEvent.KEYCODE_7, KeyEvent.KEYCODE_NUMPAD_7 -> 7
            KeyEvent.KEYCODE_8, KeyEvent.KEYCODE_NUMPAD_8 -> 8
            KeyEvent.KEYCODE_9, KeyEvent.KEYCODE_NUMPAD_9 -> 9
            else -> null
        }
    }
    
    private fun appendDigit(digit: Int) {
        timeoutRunnable?.let { handler.removeCallbacks(it) }
        
        channelBuffer.append(digit)
        showOverlay(channelBuffer.toString())
        
        timeoutRunnable = Runnable {
            confirmChannel()
        }
        handler.postDelayed(timeoutRunnable!!, INPUT_TIMEOUT_MS)
    }
    
    private fun showOverlay(channelNumber: String) {
        // Show channel number overlay
        // This would typically be handled by the Activity
    }
    
    private fun hideOverlay() {
        overlayPopup?.dismiss()
        overlayPopup = null
    }
    
    private fun confirmChannel() {
        val channelNumber = channelBuffer.toString().toIntOrNull()
        channelBuffer.clear()
        hideOverlay()
        
        if (channelNumber != null && channelNumber > 0) {
            onChannelSelected(channelNumber)
        }
    }
    
    fun clear() {
        timeoutRunnable?.let { handler.removeCallbacks(it) }
        channelBuffer.clear()
        hideOverlay()
    }
}
