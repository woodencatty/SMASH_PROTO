const gpio = require('wiring-pi');                   //Wiring-pi 모듈
const sleep = require('sleep');                      //근접센서 작동에 필요한 모듈(일시중단 모듈)
const temp = require('node-dht-sensor');             //온습도센서 모듈
const microt = require('microtime-nodejs');          //근접센서 작동에 필요한 모듈(시간 측정 모듈)
const McpAdc = require('mcp-adc');                   //ADC모듈

const DHT22 = 22;                                    //온습도센서 핀번호(물리적 핀 22번)
const ultraTRIG = 0;                                 //근접센서 트리거 핀번호(wiring-pi 0번)
const ultraECHO = 2;                                 //근접센서 에코 핀번호(wiring-pi 0번)

const adc = new McpAdc.Mcp3208();                    //ADC 초기화
var adcAudio = 0;                                    //ADC Channel 0
var adcEnv = 1;                                      //ADC Channel 1
var adcLight = 2;                                    //ADC Channel 2


gpio.wiringPiSetup();                                //wiring-pi 초기화
gpio.pinMode(ultraTRIG, gpio.OUTPUT);                // 근접센서 트리거핀 초기화
gpio.pinMode(ultraECHO, gpio.INPUT);                 // 근접센서 에코핀 초기화

//온도측정 모듈화
module.exports.getTemp = function (callback) {
    temp.read(22, DHT22, function (err, temperature, humidity) {
        if (!err) {
            callback(temperature.toFixed(1));
        }else {console.log("Error detected in Temperature sensor");}
    });
};

//습도측정 모듈화
module.exports.getHumi = function (callback) {
    temp.read(22, DHT22, function (err, temperature, humidity) {
        if (!err) {
            callback(humidity.toFixed(1));
        }else {console.log("Error detected in Humidity sensor");}
    });
};

//거리측정 모듈화
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
         callback(distance);

};

//소음측정 모듈화
module.exports.getAdcAudio = function (callback) {
    adc.readRawValue(adcAudio, function (value) {
        callback(value);
    });
};

//(대략적)소음측정 모듈화
module.exports.getAdcEnv = function (callback) {
    adc.readRawValue(adcEnv, function (value) {
        callback(value);
    });
};

//조도측정 모듈화
module.exports.getAdcLight = function (callback) {

    adc.readRawValue(adcLight, function (value) {
        callback(value);
    });
};