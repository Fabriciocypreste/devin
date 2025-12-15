// LG webOS TV Key Codes
var TVKeys = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    ENTER: 13,
    BACK: 461,
    
    RED: 403,
    GREEN: 404,
    YELLOW: 405,
    BLUE: 406,
    
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
    
    PLAY: 415,
    PAUSE: 19,
    STOP: 413,
    REWIND: 412,
    FAST_FORWARD: 417,
    
    CHANNEL_UP: 33,
    CHANNEL_DOWN: 34,
    
    INFO: 457,
    EXIT: 1001
};

function registerKeys() {
    console.log('webOS TV keys registered');
}

function isNumericKey(keyCode) {
    return keyCode >= TVKeys.NUM_0 && keyCode <= TVKeys.NUM_9;
}

function getNumberFromKey(keyCode) {
    return keyCode - TVKeys.NUM_0;
}
