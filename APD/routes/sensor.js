const gpio = require('wiring-pi');

const temp = require('node-dht-sensor');

const McpAdc = require('mcp-adc');

var usonic = require('mmm-usonic');


const DHT22 = 22;                    //wPi GPIO 7
const ultraTRIG = 22;               //wPi GPIO 22
const ultraECHO = 27;               //wPi GPIO 27

var adc = new McpAdc.Mcp3208();
var adcAudio = 0;                  //ADC Channel 0
var adcEnv = 1;                  //ADC Channel 1
var adcLight = 2;                  //ADC Channel 1


usonic.init(function (error) {
    if (error) {
        console.log('ERROR : Distance sensor Failed');
    } else {
                console.log('Distance sensor initialized');
    var sensor = usonic.createSensor(ultraECHO, ultraTRIG, 450);
    }
});

module.exports.getTemp = function (callback) {
    temp.read(22, DHT22, function (err, temperature, humidity) {
        if (!err) {
            console.log("temp :" + temperature.toFixed(1) + "C");
            callback(temperature.toFixed(1));
        }else {console.log("Error detected");}
    });
};

module.exports.getHumi = function (callback) {
    temp.read(22, DHT22, function (err, temperature, humidity) {
        if (!err) {
            console.log("humidity : " + humidity.toFixed(1) + "%");
            callback(humidity.toFixed(1));
        }else {console.log("Error detected");}
    });
};

module.exports.getDist = function (callback) {
       var sensor = usonic.createSensor(ultraECHO, ultraTRIG, 450);
       var distance = sensor();
       console.log(distance);
       callback(distance);
};

module.exports.getAdcAudio = function (callback) {
    adc.readRawValue(adcAudio, function (value) {
        console.log("Audio :\t" + value);
        callback(value);
    });

};

module.exports.getAdcEnv = function (callback) {
    adc.readRawValue(adcEnv, function (value) {
        console.log("Env:\t" + value);
        callback(value);

    });
};

module.exports.getAdcLight = function (callback) {

    adc.readRawValue(adcLight, function (value) {
        console.log("Light:\t" + value);
        callback(value);

    });
};