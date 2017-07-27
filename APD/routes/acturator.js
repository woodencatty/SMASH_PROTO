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

    //전원 인가시 작동 LED
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

        //전원 인가시 작동음
    },
    piezo_powerOn: () => {
        gpio.softToneWrite(piezo, 262);
        setTimeout(() => {
            gpio.softToneWrite(piezo, 393);
            setTimeout(() => {
                gpio.softToneWrite(piezo, 525);
                setTimeout(() => {
                    gpio.softToneWrite(piezo, 700);
                    setTimeout(() => {
                        gpio.softToneWrite(piezo, 990);
                        setTimeout(() => {
                            gpio.softToneStop(piezo);
                        }, 200);
                    }, 200);
                }, 200);
            }, 200);
        }, 200);
    },

    //센서 측정시 작동 LED
    led_sensorActive: () => {
        gpio.digitalWrite(ledB, 1);
        setTimeout(() => { gpio.digitalWrite(ledB, 0); }, 10);
    },

    //환자 식별시 작동 LED
    led_detectActivity: () => {
        gpio.digitalWrite(ledR, 1);
        setTimeout(() => { gpio.digitalWrite(ledR, 0); }, 1000);
    },

    //환자 식별시 작동음
    piezo_detectActivity: () => {
        gpio.softToneWrite(piezo, 525);
        setTimeout(() => {
            gpio.softToneWrite(piezo, 990);
            setTimeout(() => {
                gpio.softToneStop(piezo);
            }, 200);
        }, 200);
    },

    //평상시 작동 LED
    led_normal: () => {
        gpio.digitalWrite(ledG, 1);
        setTimeout(() => { gpio.digitalWrite(ledG, 0); }, 10);
    }

}
