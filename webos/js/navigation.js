// DPAD Navigation System for LG webOS
var Navigation = (function() {
    var focusableElements = [];
    var currentFocusIndex = 0;
    var channelInputBuffer = '';
    var channelInputTimeout = null;
    var CHANNEL_INPUT_DELAY = 2500;
    
    function init() {
        registerKeys();
        document.addEventListener('keydown', handleKeyDown);
        updateFocusableElements();
        if (focusableElements.length > 0) setFocus(0);
        console.log('Navigation initialized');
    }
    
    function updateFocusableElements() {
        focusableElements = Array.from(document.querySelectorAll('[data-focusable="true"]'));
        focusableElements.forEach(function(el, index) { el.setAttribute('data-focus-index', index); });
    }
    
    function setFocus(index) {
        if (index < 0 || index >= focusableElements.length) return;
        focusableElements.forEach(function(el) { el.classList.remove('focused'); });
        currentFocusIndex = index;
        var element = focusableElements[currentFocusIndex];
        element.classList.add('focused');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function handleKeyDown(event) {
        var keyCode = event.keyCode;
        
        if (isNumericKey(keyCode)) {
            handleNumericInput(getNumberFromKey(keyCode));
            event.preventDefault();
            return;
        }
        
        switch (keyCode) {
            case TVKeys.UP: navigateUp(); break;
            case TVKeys.DOWN: navigateDown(); break;
            case TVKeys.LEFT: navigateLeft(); break;
            case TVKeys.RIGHT: navigateRight(); break;
            case TVKeys.ENTER: selectCurrent(); break;
            case TVKeys.BACK: handleBack(); break;
            case TVKeys.CHANNEL_UP: changeChannel(1); break;
            case TVKeys.CHANNEL_DOWN: changeChannel(-1); break;
            case TVKeys.EXIT: handleExit(); break;
        }
        event.preventDefault();
    }
    
    function navigateUp() {
        var currentEl = focusableElements[currentFocusIndex];
        var currentRect = currentEl.getBoundingClientRect();
        var bestIndex = -1, bestDistance = Infinity;
        
        focusableElements.forEach(function(el, index) {
            if (index === currentFocusIndex) return;
            var rect = el.getBoundingClientRect();
            if (rect.bottom <= currentRect.top) {
                var distance = Math.abs(rect.left - currentRect.left) + (currentRect.top - rect.bottom);
                if (distance < bestDistance) { bestDistance = distance; bestIndex = index; }
            }
        });
        if (bestIndex >= 0) setFocus(bestIndex);
    }
    
    function navigateDown() {
        var currentEl = focusableElements[currentFocusIndex];
        var currentRect = currentEl.getBoundingClientRect();
        var bestIndex = -1, bestDistance = Infinity;
        
        focusableElements.forEach(function(el, index) {
            if (index === currentFocusIndex) return;
            var rect = el.getBoundingClientRect();
            if (rect.top >= currentRect.bottom) {
                var distance = Math.abs(rect.left - currentRect.left) + (rect.top - currentRect.bottom);
                if (distance < bestDistance) { bestDistance = distance; bestIndex = index; }
            }
        });
        if (bestIndex >= 0) setFocus(bestIndex);
    }
    
    function navigateLeft() { if (currentFocusIndex > 0) setFocus(currentFocusIndex - 1); }
    function navigateRight() { if (currentFocusIndex < focusableElements.length - 1) setFocus(currentFocusIndex + 1); }
    function selectCurrent() { var element = focusableElements[currentFocusIndex]; if (element) element.click(); }
    function handleBack() { if (window.App && typeof window.App.goBack === 'function') window.App.goBack(); else history.back(); }
    function handleExit() { try { webOS.platformBack(); } catch (e) { console.log('Exit not available'); } }
    
    function handleNumericInput(number) {
        if (channelInputTimeout) clearTimeout(channelInputTimeout);
        channelInputBuffer += number.toString();
        showChannelOverlay(channelInputBuffer);
        channelInputTimeout = setTimeout(function() { confirmChannelInput(); }, CHANNEL_INPUT_DELAY);
    }
    
    function showChannelOverlay(channelNumber) {
        var overlay = document.getElementById('channel-overlay');
        if (!overlay) { overlay = document.createElement('div'); overlay.id = 'channel-overlay'; overlay.className = 'channel-overlay'; document.body.appendChild(overlay); }
        overlay.innerHTML = '<div class="channel-number">' + channelNumber + '</div><div class="channel-hint">Aguardando...</div>';
        overlay.classList.add('visible');
    }
    
    function hideChannelOverlay() { var overlay = document.getElementById('channel-overlay'); if (overlay) overlay.classList.remove('visible'); }
    
    function confirmChannelInput() {
        var channelNumber = parseInt(channelInputBuffer, 10);
        channelInputBuffer = '';
        if (channelNumber > 0) goToChannel(channelNumber);
        hideChannelOverlay();
    }
    
    function goToChannel(channelNumber) { console.log('Going to channel:', channelNumber); if (window.App && typeof window.App.goToChannel === 'function') window.App.goToChannel(channelNumber); }
    function changeChannel(direction) { if (window.App && typeof window.App.changeChannel === 'function') window.App.changeChannel(direction); }
    
    return { init: init, updateFocusableElements: updateFocusableElements, setFocus: setFocus, goToChannel: goToChannel };
})();
