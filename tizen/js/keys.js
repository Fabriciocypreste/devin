// Samsung Tizen TV Key Codes
var TVKeys = {
    // Navigation keys
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    ENTER: 13,
    BACK: 10009,
    
    // Color keys
    RED: 403,
    GREEN: 404,
    YELLOW: 405,
    BLUE: 406,
    
    // Numeric keys
    NUM_0: 48,
    NUM_1: 49,
    NUM_2: 50,
    NUM_3: 51,
    NUM_4: 52,
    NUM_5: 53,
    NUM_6: 54,
    NUM_7: 55,
    NUM_8: 56,
    NUM_9: 57,
    
    // Media keys
    PLAY: 415,
    PAUSE: 19,
    STOP: 413,
    REWIND: 412,
    FAST_FORWARD: 417,
    
    // Channel keys
    CHANNEL_UP: 427,
    CHANNEL_DOWN: 428,
    
    // Volume keys
    VOLUME_UP: 447,
    VOLUME_DOWN: 448,
    MUTE: 449,
    
    // Info key
    INFO: 457,
    
    // Exit key
    EXIT: 10182
};

// Register keys with Tizen TV
function registerKeys() {
    try {
        var supportedKeys = tizen.tvinputdevice.getSupportedKeys();
        var keysToRegister = [
            'ColorF0Red', 'ColorF1Green', 'ColorF2Yellow', 'ColorF3Blue',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'MediaPlay', 'MediaPause', 'MediaStop', 'MediaRewind', 'MediaFastForward',
            'ChannelUp', 'ChannelDown', 'VolumeUp', 'VolumeDown', 'VolumeMute',
            'Info', 'Exit'
        ];
        
        keysToRegister.forEach(function(keyName) {
            try {
                tizen.tvinputdevice.registerKey(keyName);
            } catch (e) {
                console.log('Could not register key: ' + keyName);
            }
        });
        
        console.log('TV keys registered successfully');
    } catch (e) {
        console.log('Error registering TV keys:', e);
    }
}

// Check if key is numeric
function isNumericKey(keyCode) {
    return keyCode >= TVKeys.NUM_0 && keyCode <= TVKeys.NUM_9;
}

// Get number from key code
function getNumberFromKey(keyCode) {
    return keyCode - TVKeys.NUM_0;
}
