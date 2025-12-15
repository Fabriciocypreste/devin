// HLS Player for Smart TVs
var Player = (function() {
    var videoElement = null;
    var currentUrl = '';
    var isPlaying = false;
    
    // Initialize player
    function init() {
        videoElement = document.getElementById('video-player');
        if (!videoElement) {
            videoElement = document.createElement('video');
            videoElement.id = 'video-player';
            videoElement.className = 'video-player';
            videoElement.setAttribute('autoplay', 'true');
            videoElement.setAttribute('playsinline', 'true');
            document.body.appendChild(videoElement);
        }
        
        videoElement.addEventListener('error', handleError);
        videoElement.addEventListener('ended', handleEnded);
        videoElement.addEventListener('playing', handlePlaying);
        videoElement.addEventListener('pause', handlePause);
        
        console.log('Player initialized');
    }
    
    // Play stream URL
    function play(url) {
        if (!videoElement) init();
        
        currentUrl = url;
        
        // Check if HLS stream
        if (url.includes('.m3u8')) {
            playHLS(url);
        } else {
            playDirect(url);
        }
    }
    
    // Play HLS stream
    function playHLS(url) {
        // Samsung Tizen has native HLS support
        videoElement.src = url;
        videoElement.play().catch(function(e) {
            console.error('HLS playback error:', e);
            showError('Erro ao reproduzir stream');
        });
    }
    
    // Play direct URL
    function playDirect(url) {
        videoElement.src = url;
        videoElement.play().catch(function(e) {
            console.error('Playback error:', e);
            showError('Erro ao reproduzir video');
        });
    }
    
    // Pause playback
    function pause() {
        if (videoElement) {
            videoElement.pause();
        }
    }
    
    // Resume playback
    function resume() {
        if (videoElement) {
            videoElement.play();
        }
    }
    
    // Stop playback
    function stop() {
        if (videoElement) {
            videoElement.pause();
            videoElement.src = '';
            isPlaying = false;
        }
    }
    
    // Seek to position
    function seek(seconds) {
        if (videoElement) {
            videoElement.currentTime += seconds;
        }
    }
    
    // Get current time
    function getCurrentTime() {
        return videoElement ? videoElement.currentTime : 0;
    }
    
    // Get duration
    function getDuration() {
        return videoElement ? videoElement.duration : 0;
    }
    
    // Handle error
    function handleError(e) {
        console.error('Video error:', e);
        showError('Erro de reproducao');
    }
    
    // Handle ended
    function handleEnded() {
        isPlaying = false;
        if (window.App && typeof window.App.onVideoEnded === 'function') {
            window.App.onVideoEnded();
        }
    }
    
    // Handle playing
    function handlePlaying() {
        isPlaying = true;
        hideError();
    }
    
    // Handle pause
    function handlePause() {
        isPlaying = false;
    }
    
    // Show error message
    function showError(message) {
        var errorEl = document.getElementById('player-error');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.id = 'player-error';
            errorEl.className = 'player-error';
            document.body.appendChild(errorEl);
        }
        errorEl.textContent = message;
        errorEl.classList.add('visible');
    }
    
    // Hide error message
    function hideError() {
        var errorEl = document.getElementById('player-error');
        if (errorEl) {
            errorEl.classList.remove('visible');
        }
    }
    
    // Toggle fullscreen
    function toggleFullscreen() {
        if (videoElement) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoElement.requestFullscreen();
            }
        }
    }
    
    return {
        init: init,
        play: play,
        pause: pause,
        resume: resume,
        stop: stop,
        seek: seek,
        getCurrentTime: getCurrentTime,
        getDuration: getDuration,
        toggleFullscreen: toggleFullscreen,
        isPlaying: function() { return isPlaying; }
    };
})();
