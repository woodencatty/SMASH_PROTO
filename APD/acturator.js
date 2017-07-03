const sleep = require('sleep');



//---------------------------------스피커----------------------------------------------

function beep(time) {
    for (var i = 0; i < time; i++) {
        gpio.digitalWrite(PIEZO, 1);
        sleep.msleep(500);
        gpio.digitalWrite(PIEZO, 0);
        sleep.msleep(500);
    };

};
