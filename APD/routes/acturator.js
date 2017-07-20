const gpio = require('wiring-pi');                   //Wiring-pi 모듈
const sleep = require('sleep');

const ledR = 27;
const ledG = 28;
const ledB = 29;
const piezo = 25;

gpio.wiringPiSetup();                                //wiring-pi 초기화
gpio.pinMode(ledR, gpio.OUTPUT);
gpio.pinMode(ledG, gpio.OUTPUT);
gpio.pinMode(ledB, gpio.OUTPUT);
gpio.pinMode(piezo, gpio.OUTPUT);


module.exports = {

    led_powerOn: function () {
        gpio.digitalWrite(ledR, 1);
        setTimeout(function () {
            setTimeout(function () {
                setTimeout(function () {
                    gpio.digitalWrite(ledB, 0);
                }, 500);
                gpio.digitalWrite(ledG, 0);
                gpio.digitalWrite(ledB, 1);
            }, 500);
            gpio.digitalWrite(ledR, 0);
            gpio.digitalWrite(ledG, 1);
        }, 500);
    },
    piezo_powerOn: function () {
        for (var i = 0; i < 20; i++) {
            gpio.digitalWrite(piezo, 1);
            setTimeout(function () { gpio.digitalWrite(piezo, 0); }, 70);
        }
        setTimeout(function () {
            for (var i = 0; i < 20; i++) {
                gpio.digitalWrite(piezo, 1);
                setTimeout(function () { gpio.digitalWrite(piezo, 0); }, 50);
            }
            setTimeout(function () {
                for (var i = 0; i < 20; i++) {
                    gpio.digitalWrite(piezo, 1);
                    setTimeout(function () { gpio.digitalWrite(piezo, 0); }, 30);
                }
                setTimeout(function () {
                    for (var i = 0; i < 20; i++) {
                        gpio.digitalWrite(piezo, 1);
                        setTimeout(function () { gpio.digitalWrite(piezo, 0); }, 10);
                    }
                }, 500);
            }, 500);
        }, 500);

    },

    led_sensorActive: function () {
         gpio.digitalWrite(ledB, 1);
            setTimeout(function () { gpio.digitalWrite(ledB, 0); }, 1000);
    },

    led_normal: function () {
         gpio.digitalWrite(ledG, 1);
            setTimeout(function () { gpio.digitalWrite(ledG, 0); }, 1000);
    }

}


while (1) {
    for (var i = 0; i < 20; i++) {
        gpio.digitalWrite(piezo, 1);
        gpio.digitalWrite(piezo, 0);
        sleep.msleep(10);
    }
    gpio.digitalWrite(ledR, 1);
    sleep.msleep(500);
    gpio.digitalWrite(ledR, 0);
    gpio.digitalWrite(ledG, 1);
    sleep.msleep(500);

    gpio.digitalWrite(ledG, 0);
    gpio.digitalWrite(ledB, 1);
    sleep.msleep(500);
    gpio.digitalWrite(ledB, 0);
}
