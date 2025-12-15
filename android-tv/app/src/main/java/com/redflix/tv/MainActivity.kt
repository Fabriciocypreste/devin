package com.redflix.tv

import android.content.Intent
import android.os.Bundle
import android.view.KeyEvent
import androidx.fragment.app.FragmentActivity
import com.redflix.tv.fragments.MainFragment
import com.redflix.tv.utils.ChannelInputHandler

class MainActivity : FragmentActivity() {
    
    private lateinit var channelInputHandler: ChannelInputHandler
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        channelInputHandler = ChannelInputHandler(this) { channelNumber ->
            navigateToChannel(channelNumber)
        }
        
        if (savedInstanceState == null) {
            supportFragmentManager.beginTransaction()
                .replace(R.id.main_fragment_container, MainFragment())
                .commit()
        }
        
        handleIntent(intent)
    }
    
    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        intent?.let { handleIntent(it) }
    }
    
    private fun handleIntent(intent: Intent) {
        val action = intent.action
        val data = intent.data
        
        when {
            action == Intent.ACTION_VIEW && data?.scheme == "redflix" -> {
                when (data.host) {
                    "channel" -> {
                        val channelNumber = data.pathSegments.firstOrNull()?.toIntOrNull()
                        channelNumber?.let { navigateToChannel(it) }
                    }
                    "play" -> {
                        val contentId = data.pathSegments.firstOrNull()?.toIntOrNull()
                        contentId?.let { playContent(it) }
                    }
                }
            }
        }
    }
    
    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (channelInputHandler.handleKeyDown(keyCode)) {
            return true
        }
        return super.onKeyDown(keyCode, event)
    }
    
    fun navigateToChannel(channelNumber: Int) {
        val intent = Intent(this, PlayerActivity::class.java).apply {
            putExtra(PlayerActivity.EXTRA_CHANNEL_NUMBER, channelNumber)
        }
        startActivity(intent)
    }
    
    fun playContent(contentId: Int) {
        val intent = Intent(this, PlayerActivity::class.java).apply {
            putExtra(PlayerActivity.EXTRA_CONTENT_ID, contentId)
        }
        startActivity(intent)
    }
}
