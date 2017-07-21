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

gpio.softToneCreate(piezo);

module.exports = {

    led_powerOn: () => {
        gpio.digitalWrite(ledR, 1);
        setTimeout(() => {
            setTimeout(() => {
                setTimeout(() => {
                    gpio.digitalWrite(ledB, 0);
                    gpio.digitalWrite(ledG, 1);
                }, 50);
                gpio.digitalWrite(ledG, 0);
                gpio.digitalWrite(ledB, 1);
            }, 50);
            gpio.digitalWrite(ledR, 0);
            gpio.digitalWrite(ledG, 1);
        }, 50);


    },
    piezo_powerOn: () => {
        gpio.softToneWrite(piezo, 500);
        setTimeout(() => {
            gpio.softToneWrite(piezo, 700);
            setTimeout(() => {
                gpio.softToneWrite(piezo, 500);
                setTimeout(() => {
                    gpio.softToneWrite(piezo, 900);
                    setTimeout(() => {
                        gpio.softToneWrite(piezo, 500);
                        setTimeout(() => {
                            gpio.softToneStop(piezo);
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    },

    led_sensorActive: () => {
        gpio.digitalWrite(ledB, 1);
        setTimeout(() => { gpio.digitalWrite(ledB, 0); }, 10);
    },
    piezo_dataSaved: () => {
        gpio.softToneWrite(piezo, 700);
        setTimeout(() => {
            gpio.softToneWrite(piezo, 70);
            setTimeout(() => {
                gpio.softToneStop(piezo);
            }, 50);
        }, 50);
    },

    led_detectActivity: () => {
        gpio.digitalWrite(ledR, 1);
        setTimeout(() => { gpio.digitalWrite(ledR, 0); }, 1000);
    },

    piezo_detectActivity: () => {
        gpio.softToneWrite(piezo, 50);
        setTimeout(() => {
            gpio.softToneWrite(piezo, 70);
            setTimeout(() => {
                gpio.softToneStop(piezo);
            }, 50);
        }, 50);
    },

    led_normal: () => {
        gpio.digitalWrite(ledG, 1);
        setTimeout(() => { gpio.digitalWrite(ledG, 0); }, 10);
    }

}
