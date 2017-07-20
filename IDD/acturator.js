const gpio = require('wiring-pi');                   //Wiring-pi 모듈
const sleep = require('sleep');                      

const test = require('./acturator.js');                      


const ledR = 29;                                  
const ledG = 28;                               
const ledB = 27;                               
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
        for (var i = 0; i < 1000; i++) {
        gpio.digitalWrite(piezo, 1);
        gpio.digitalWrite(piezo, 0);
        sleep.usleep(500);
    }
     for (var i = 0; i < 1000; i++) {
        gpio.digitalWrite(piezo, 1);
        gpio.digitalWrite(piezo, 0);
        sleep.usleep(300);
    }
     for (var i = 0; i < 1000; i++) {
        gpio.digitalWrite(piezo, 1);
        gpio.digitalWrite(piezo, 0);
        sleep.usleep(100);
    }

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
