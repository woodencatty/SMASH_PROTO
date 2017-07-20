const gpio = require('wiring-pi');                   //Wiring-pi 모듈

const ledR = 29;                                  
const ledG = 28;                               
const ledB = 27;                               


gpio.wiringPiSetup();                                //wiring-pi 초기화
gpio.pinMode(ledR, gpio.OUTPUT);               
gpio.pinMode(ledG, gpio.OUTPUT);                 
gpio.pinMode(ledB, gpio.OUTPUT);

while(1){
     gpio.digitalWrite(ledR, 1);
        sleep.msleep(500);
    gpio.digitalWrite(ledR, 0);
}