const gpio = require('wiring-pi');                   //Wiring-pi 모듈
const sleep = require('sleep');                      

const ledR = 29;                                  
const ledG = 28;                               
const ledB = 27;                               
const piezo = 25;

gpio.wiringPiSetup();                                //wiring-pi 초기화
gpio.pinMode(ledR, gpio.OUTPUT);               
gpio.pinMode(ledG, gpio.OUTPUT);                 
gpio.pinMode(ledB, gpio.OUTPUT);
gpio.pinMode(piezo, gpio.OUTPUT);

/*
module.exports = {

powerOn: function(){
*/
while(1){
    for(var i=0; i<20; i++){
     gpio.digitalWrite(piezo, 1);
    gpio.digitalWrite(piezo, 0);
    sleep.msleep(10);
}
     gpio.digitalWrite(ledR, 1);
        sleep.msleep(500);
    gpio.digitalWrite(ledR, 0);
    gpio.digitalWrite(ledG, 1);
            sleep.msleep(500);

    gpio.digitalWrite(ledG, 0);
    gpio.digitalWrite(ledB, 1);
            sleep.msleep(500);
    gpio.digitalWrite(ledB, 0);
}

//}}