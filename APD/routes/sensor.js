const gpio = require('wiring-pi');
const sleep = require('sleep');
const temp = require('node-dht-sensor');
const microt = require('microtime-nodejs');
const McpAdc = require('mcp-adc');

const DHT22 = 22;                    //wPi GPIO 7
const ultraTRIG = 0;               //wPi GPIO 0
const ultraECHO = 2;               //wPi GPIO 2

var adc = new McpAdc.Mcp3208();
var adcAudio = 0;                  //ADC Channel 0
var adcEnv = 1;                  //ADC Channel 1
var adcLight = 2;                  //ADC Channel 2


gpio.wiringPiSetup();
gpio.pinMode(ultraTRIG, gpio.OUTPUT);
gpio.pinMode(ultraECHO, gpio.INPUT);

module.exports.getTemp = function (callback) {
    temp.read(22, DHT22, function (err, temperature, humidity) {
        if (!err) {
         //   console.log("temp :" + temperature.toFixed(1) + "C");
            callback(temperature.toFixed(1));
        }else {console.log("Error detected in Temperature sensor");}
    });
};

module.exports.getHumi = function (callback) {
    temp.read(22, DHT22, function (err, temperature, humidity) {
        if (!err) {
        //    console.log("humidity : " + humidity.toFixed(1) + "%");
            callback(humidity.toFixed(1));
        }else {console.log("Error detected in Humidity sensor");}
    });
};

module.exports.getDist = function (callback) {
    var distance = 0;
    var pulse = 0;
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
     //   console.log("Distance:\t" + distance);
         callback(distance);

};

module.exports.getAdcAudio = function (callback) {
    adc.readRawValue(adcAudio, function (value) {
     //   console.log("Audio :\t" + value);
        callback(value);
    });

};

module.exports.getAdcEnv = function (callback) {
    adc.readRawValue(adcEnv, function (value) {
     //   console.log("Env:\t" + value);
        callback(value);

    });
};

module.exports.getAdcLight = function (callback) {

    adc.readRawValue(adcLight, function (value) {
    //    console.log("Light:\t" + value);
        callback(value);

    });
};