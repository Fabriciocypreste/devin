// HLS Player for LG webOS
var Player = (function() {
    var videoElement = null;
    var currentUrl = '';
    var isPlaying = false;
    
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
    
    function play(url) {
        if (!videoElement) init();
        currentUrl = url;
        if (url.includes('.m3u8')) playHLS(url);
        else playDirect(url);
    }
    
    function playHLS(url) {
        videoElement.src = url;
        videoElement.play().catch(function(e) {
            console.error('HLS playback error:', e);
            showError('Erro ao reproduzir stream');
        });
    }
    
    function playDirect(url) {
        videoElement.src = url;
        videoElement.play().catch(function(e) {
            console.error('Playback error:', e);
            showError('Erro ao reproduzir video');
        });
    }
    
    function pause() { if (videoElement) videoElement.pause(); }
    function resume() { if (videoElement) videoElement.play(); }
    function stop() { if (videoElement) { videoElement.pause(); videoElement.src = ''; isPlaying = false; } }
    function seek(seconds) { if (videoElement) videoElement.currentTime += seconds; }
    function getCurrentTime() { return videoElement ? videoElement.currentTime : 0; }
    function getDuration() { return videoElement ? videoElement.duration : 0; }
    
    function handleError(e) { console.error('Video error:', e); showError('Erro de reproducao'); }
    function handleEnded() { isPlaying = false; if (window.App && typeof window.App.onVideoEnded === 'function') window.App.onVideoEnded(); }
    function handlePlaying() { isPlaying = true; hideError(); }
    function handlePause() { isPlaying = false; }
    
    function showError(message) {
        var errorEl = document.getElementById('player-error');
        if (!errorEl) { errorEl = document.createElement('div'); errorEl.id = 'player-error'; errorEl.className = 'player-error'; document.body.appendChild(errorEl); }
        errorEl.textContent = message; errorEl.classList.add('visible');
    }
    
    function hideError() { var errorEl = document.getElementById('player-error'); if (errorEl) errorEl.classList.remove('visible'); }
    
    function toggleFullscreen() {
        if (videoElement) {
            if (document.fullscreenElement) document.exitFullscreen();
            else videoElement.requestFullscreen();
        }
    }
    
    return { init: init, play: play, pause: pause, resume: resume, stop: stop, seek: seek, getCurrentTime: getCurrentTime, getDuration: getDuration, toggleFullscreen: toggleFullscreen, isPlaying: function() { return isPlaying; } };
})();
