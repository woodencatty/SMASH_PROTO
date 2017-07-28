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
let distance = 0.0;
let temperature =  0.0;
let humidity =  0.0;
let audio =  0.0;
let envelope =  0.0;
let light =  0.0;

let patientDetected = false;
let detectCount = 0;

let dhtinterval = 0;
let distinterval = 0;
let audiointerval = 0;
let envinterval = 0;
let lgtinterval = 0;


    
  this.DHT22Interval = setInterval(() => {
  temp.read(22, DHT22, (err, temp, humi) => {
            if (!err) {
                temperature = temp.toFixed(1);
                humidity = humi.toFixed(1);

            } else { console.log("Error detected in DHT22 sensor"); }
        });
}, dhtinterval);


  this.distanceInterval = setInterval(() => {
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
        distance = (travelTime - startTime) / 58;

        if(distance < 50){
            detectCount++;
            if(detectCount > 7){
                patientDetected = true;
            }
        }else {detectCount = 0;
            patientDetected = false;}

}, distinterval);

  this.audioInterval = setInterval(() => {

        adc.readRawValue(adcAudio, (value) => {
            audio = value;
        });
},audiointerval);


  this.envelopeInterval = setInterval(() => {

        adc.readRawValue(adcEnv, (value) => {
            envelope = value;
        });
}, envinterval);


  this.lightInterval = setInterval(() => {

        adc.readRawValue(adcLight, (value) => {
            light = value;
        });
}, lgtinterval);




module.exports = {

    setInterval:(_dhtinterval, _distinterval, _audiointerval, _envinterval, _lgtinterval)=>{
dhtinterval = _dhtinterval;
distinterval = _distinterval;
audiointerval = _audiointerval;
envinterval = _envinterval;
lgtinterval = _lgtinterval;
    },

    getData: (callback) => {
        callback(patientDetected, temperature, humidity, audio, envelope, light);
    },

    getDistanceData: (callback) => {
        callback(distance)
    }
}

gpio.wiringPiSetup();                                //wiring-pi 초기화
gpio.pinMode(ultraTRIG, gpio.OUTPUT);                // 근접센서 트리거핀 초기화
gpio.pinMode(ultraECHO, gpio.INPUT);                 // 근접센서 에코핀 초기화
