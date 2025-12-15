package com.redflix.tv

import android.net.Uri
import android.os.Bundle
import android.view.KeyEvent
import android.view.View
import android.widget.TextView
import androidx.fragment.app.FragmentActivity
import androidx.media3.common.MediaItem
import androidx.media3.common.PlaybackException
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.hls.HlsMediaSource
import androidx.media3.datasource.DefaultHttpDataSource
import androidx.media3.ui.PlayerView
import com.redflix.tv.utils.ChannelInputHandler

class PlayerActivity : FragmentActivity() {
    
    companion object {
        const val EXTRA_STREAM_URL = "stream_url"
        const val EXTRA_CHANNEL_NUMBER = "channel_number"
        const val EXTRA_CONTENT_ID = "content_id"
    }
    
    private lateinit var player: ExoPlayer
    private lateinit var playerView: PlayerView
    private lateinit var channelOverlay: View
    private lateinit var channelNumberText: TextView
    private lateinit var channelNameText: TextView
    private lateinit var channelInputHandler: ChannelInputHandler
    
    private var currentChannelNumber: Int = 0
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_player)
        
        playerView = findViewById(R.id.player_view)
        channelOverlay = findViewById(R.id.channel_overlay)
        channelNumberText = findViewById(R.id.channel_number_text)
        channelNameText = findViewById(R.id.channel_name_text)
        
        initializePlayer()
        
        channelInputHandler = ChannelInputHandler(this) { channelNumber ->
            changeToChannel(channelNumber)
        }
        
        handleIntent()
    }
    
    private fun initializePlayer() {
        player = ExoPlayer.Builder(this).build()
        playerView.player = player
        
        player.addListener(object : Player.Listener {
            override fun onPlayerError(error: PlaybackException) {
                showError("Erro ao reproduzir: ${error.message}")
            }
            
            override fun onPlaybackStateChanged(playbackState: Int) {
                if (playbackState == Player.STATE_ENDED) {
                    onVideoEnded()
                }
            }
        })
    }
    
    private fun handleIntent() {
        val streamUrl = intent.getStringExtra(EXTRA_STREAM_URL)
        val channelNumber = intent.getIntExtra(EXTRA_CHANNEL_NUMBER, 0)
        val contentId = intent.getIntExtra(EXTRA_CONTENT_ID, 0)
        
        when {
            streamUrl != null -> playStream(streamUrl)
            channelNumber > 0 -> changeToChannel(channelNumber)
            contentId > 0 -> loadAndPlayContent(contentId)
        }
    }
    
    private fun playStream(url: String) {
        val dataSourceFactory = DefaultHttpDataSource.Factory()
        
        val mediaItem = MediaItem.fromUri(Uri.parse(url))
        
        if (url.contains(".m3u8")) {
            val hlsMediaSource = HlsMediaSource.Factory(dataSourceFactory)
                .createMediaSource(mediaItem)
            player.setMediaSource(hlsMediaSource)
        } else {
            player.setMediaItem(mediaItem)
        }
        
        player.prepare()
        player.play()
    }
    
    private fun changeToChannel(channelNumber: Int) {
        currentChannelNumber = channelNumber
        showChannelInfo(channelNumber, "Canal $channelNumber")
        // TODO: Load channel URL from API and play
    }
    
    private fun loadAndPlayContent(contentId: Int) {
        // TODO: Load content URL from API and play
    }
    
    private fun showChannelInfo(number: Int, name: String) {
        channelNumberText.text = number.toString()
        channelNameText.text = name
        channelOverlay.visibility = View.VISIBLE
        
        channelOverlay.postDelayed({
            channelOverlay.visibility = View.GONE
        }, 3000)
    }
    
    private fun showError(message: String) {
        // Show error toast or dialog
    }
    
    private fun onVideoEnded() {
        if (currentChannelNumber > 0) {
            changeToChannel(currentChannelNumber + 1)
        } else {
            finish()
        }
    }
    
    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        when (keyCode) {
            KeyEvent.KEYCODE_CHANNEL_UP -> {
                if (currentChannelNumber > 0) {
                    changeToChannel(currentChannelNumber + 1)
                }
                return true
            }
            KeyEvent.KEYCODE_CHANNEL_DOWN -> {
                if (currentChannelNumber > 1) {
                    changeToChannel(currentChannelNumber - 1)
                }
                return true
            }
            KeyEvent.KEYCODE_BACK -> {
                finish()
                return true
            }
        }
        
        if (channelInputHandler.handleKeyDown(keyCode)) {
            return true
        }
        
        return super.onKeyDown(keyCode, event)
    }
    
    override fun onPause() {
        super.onPause()
        player.pause()
    }
    
    override fun onResume() {
        super.onResume()
        player.play()
    }
    
    override fun onDestroy() {
        super.onDestroy()
        player.release()
    }
}
