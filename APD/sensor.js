const gpio = require('wiring-pi');
const sleep = require('sleep');
const temp = require('node-dht-sensor');
const microt = require('microtime-nodejs');
const McpAdc = require('mcp-adc');

var sensor = require('./sensor.js');

const DHT22 = 22;                    //wPi GPIO 7
const ultraTRIG = 17;               //wPi GPIO 22
const ultraECHO = 27;               //wPi GPIO 27

var adc = new McpAdc.Mcp3208();
var adcAudio = 0;                  //ADC Channel 0
var adcEnv = 1;                  //ADC Channel 1
var adcLight = 2;                  //ADC Channel 1


gpio.wiringPiSetup();
gpio.pinMode(ultraTRIG, gpio.OUTPUT);
gpio.pinMode(ultraECHO, gpio.INPUT);

module.exports.getTemp = function () {
    temp.read(22, DHT22, function (err, temperature, humidity) {
        if (!err) {
            console.log("temp :" + temperature.toFixed(1) + "C");
        }
    });
};

module.exports.getHumi = function () {
    temp.read(22, DHT22, function (err, temperature, humidity) {
        if (!err) {
            console.log("humidity : " + humidity.toFixed(1) + "%");
        }
    });
};

module.exports.getDist = function () {
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
        console.log("Distance:\t" + distance);

        sleep.msleep(300);
    }

};

module.exports.getAdcAudio = function () {
    adc.readRawValue(adcAudio, function (value) {
        console.log("Audio :\t" + value);
    });

};

module.exports.getAdcEnv = function () {
    adc.readRawValue(adcEnv, function (value) {
        console.log("Env:\t" + value);
    });
};

module.exports.getAdcLight = function () {

    adc.readRawValue(adcLight, function (value) {
        console.log("Light:\t" + value);
    });
};

sensor.getTemp();
sensor.getHumi();
sensor.getAdcAudio();
sensor.getAdcEnv();
sensor.getAdcLight();