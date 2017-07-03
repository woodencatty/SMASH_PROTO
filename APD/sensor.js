const gpio = require('wiring-pi');
const sleep = require('sleep');
const temp = require('node-dht-sensor');
const microt = require('microtime-nodejs');
const McpAdc = require('mcp-adc');

const DHT22 = 22;                    //wPi GPIO 7
const PIEZO = 17;                   //wPi GPIO 17
const ultraTRIG = 17;               //wPi GPIO 22
const ultraECHO = 27;               //wPi GPIO 27

var adc = new McpAdc.Mcp3208();
var adcAudio = 0;                  //ADC Channel 0
var adcEnv = 1;                  //ADC Channel 1
var adcLight = 2;                  //ADC Channel 1




//---------------------------------측정함수----------------------------------------------
function measureTmp() {
    temp.read(22, DHT22, function (err, temperature, humidity) {
        if (!err) {
            console.log("temp :" + temperature.toFixed(1) + "C");
            output_temp = temperature.toFixed(1);
        }
    });
}

function measureHum() {
    temp.read(22, DHT22, function (err, temperature, humidity) {
        if (!err) {
            console.log("humidity : " + humidity.toFixed(1) + "%");
            output_humi = humidity.toFixed(1);
        }
    });
}

function measureDist() {
    var distance = 0;
    var pulse = 0;
    while (1) {
        gpio.digitalWrite(ultraTRIG, 0);
        sleep.msleep(2);
        gpio.digitalWrite(ultraTRIG, 1);
        sleep.msleep(20);
        gpio.digitalWrite(ultraTRIG, 0);

        while (gpio.digitalRead(ultraECHO) == 0);
        var startTime = microt.now();
        while (gpio.digitalRead(ultraECHO) == 1);
        var travelTime = microt.now();
        distance = (travelTime - startTime) / 58;
        output_dist = distance;
        if (distance < 90) {
            console.log("Someone's approach");
            beep(1000);
        }
        sleep.msleep(300);
    }
}

function measureSound() {
    adc.readRawValue(adcSound, function (value) {
        console.log("Sound:\t" + value);
        output_sound = value;
    });
}

function measureLight() {
    adc.readRawValue(adcLight, function (value) {
        console.log("Light:\t" + value);
        output_light = value;
    });
}

function measureFire() {
    adc.readRawValue(adcFire, function (value) {
        console.log("Fire:\t" + value);
        output_fire = value;
    });
}

function measureGas() {
    adc.readRawValue(adcGas, function (value) {
        console.log("Gas:\t" + value);
        output_gas = value;
    });
}

function measurejoystick() {
    adc.readRawValue(adcJoyX, function (value) {
        console.log("adcJoyX:\t" + value);
        output_joyX = value;
    });
    adc.readRawValue(adcRain, function (value) {
        console.log("adcRain:\t" + value);
        output_joyY = value;
    });
}