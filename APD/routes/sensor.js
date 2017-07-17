const gpio = require('wiring-pi');                   //Wiring-pi 모듈
const sleep = require('sleep');                      //근접센서 작동에 필요한 모듈(일시중단 모듈)
const temp = require('node-dht-sensor');             //온습도센서 모듈
const microt = require('microtime-nodejs');          //근접센서 작동에 필요한 모듈(시간 측정 모듈)
const McpAdc = require('mcp-adc');                   //ADC모듈

const sensor = require('./sensor.js')

const DHT22 = 22;                                    //온습도센서 핀번호(물리적 핀 22번)
const ultraTRIG = 0;                                 //근접센서 트리거 핀번호(wiring-pi 0번)
const ultraECHO = 2;                                 //근접센서 에코 핀번호(wiring-pi 0번)

const adc = new McpAdc.Mcp3208();                    //ADC 초기화
const adcAudio = 0;                                    //ADC Channel 0
const adcEnv = 1;                                      //ADC Channel 1
const adcLight = 2;                                    //ADC Channel 2


//각 센서값을 받을 변수 정의
module.exports = {
 distance : 2.0,
 temperature : 2.0,
 humidity : 2.0,
 audio : 2.0,
 envelope : 2.0,
 light : 2.0,

 getDHT22 : function () {
    temp.read(22, DHT22, (err, temp, humi) => {
        if (!err) {
            this.temperature = temp.toFixed(1);
            this.humidity = humi.toFixed(1);

        } else { console.log("Error detected in DHT22 sensor"); }
    });
},

//거리측정 함수화
 getDist : function() {
    let pulse = 0;
    gpio.digitalWrite(ultraTRIG, 0);
    sleep.msleep(2);
    gpio.digitalWrite(ultraTRIG, 1);
    sleep.msleep(20);
    gpio.digitalWrite(ultraTRIG, 0);
    while (gpio.digitalRead(ultraECHO) == 0);
    let startTime = microt.now();
    while (gpio.digitalRead(ultraECHO) == 1);
    let travelTime = microt.now();
    this.distance = (travelTime - startTime) / 58;
},

//소음측정 함수화
 getAdcAudio : function() {
    adc.readRawValue(adcAudio, (value) => {
        this.audio = value;
    });
},

//(대략적)소음측정 함수화
 getAdcEnv : function() {
    adc.readRawValue(adcEnv, (value) => {
        this.envelope = value;
    });
},

//조도측정 함수화
 getAdcLight : function() {
    adc.readRawValue(adcLight, (value) => {
        this.light = value;
    });
}
}

gpio.wiringPiSetup();                                //wiring-pi 초기화
gpio.pinMode(ultraTRIG, gpio.OUTPUT);                // 근접센서 트리거핀 초기화
gpio.pinMode(ultraECHO, gpio.INPUT);                 // 근접센서 에코핀 초기화

//온습도측정 함수화


//센서 측정 Interval 시작 모듈
module.exports.startSense = function () {

};

//센서 측정 Interval 중단 모듈
module.exports.stopSense = function () {

  if (this.SensorInterval) {
    clearInterval(this.SensorInterval);
    this.SensorInterval = null;
  }

};