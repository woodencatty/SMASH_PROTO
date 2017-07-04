const gpio = require('wiring-pi');
const sleep = require('sleep');
const temp = require('node-dht-sensor');
const microt = require('microtime-nodejs');
const McpAdc = require('mcp-adc');

var sensor = require('./sensor.js');

const DHT22 = 22;                    //wPi GPIO 7
const PIEZO = 17;                   //wPi GPIO 17
const ultraTRIG = 17;               //wPi GPIO 22
const ultraECHO = 27;               //wPi GPIO 27

var adc = new McpAdc.Mcp3208();
var adcAudio = 0;                  //ADC Channel 0
var adcEnv = 1;                  //ADC Channel 1
var adcLight = 2;                  //ADC Channel 1


module.exports.getTemp = function() {
    console.log('get');
    temp.read(22, DHT22, function (err, temperature, humidity) {
        if (!err) {
            console.log("temp :" + temperature.toFixed(1) + "C");
            output_temp = temperature.toFixed(1);
        }
    });
};


module.exports = {
  getHumi: function() {
    temp.read(22, DHT22, function (err, temperature, humidity) {
        if (!err) {
            console.log("humidity : " + humidity.toFixed(1) + "%");
            output_humi = humidity.toFixed(1);
        }
    });
},
    getDist: function () {
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
},

    getAdcAudio:function () {
    adc.readRawValue(adcAudio, function (value) {
        console.log("Audio :\t" + value);
        output_sound = value;
    });
},

    getAdcEnv: function () {
    adc.readRawValue(addEnv, function (value) {
        console.log("Env:\t" + value);
        output_sound = value;
    });
},

    getAdcLight: function () {
    adc.readRawValue(adcLight, function (value) {
        console.log("Light:\t" + value);
        output_light = value;
    });
}
};



    gpio.wiringPiSetup();
    gpio.pinMode(ultraTRIG, gpio.OUTPUT);
    gpio.pinMode(ultraECHO, gpio.INPUT);

