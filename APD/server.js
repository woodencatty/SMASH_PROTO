var sensor = require('/home/pi/SMASH_Project/source/test/SMASH_PROTO/APD/sensor.js')

setTimeout(function(){
  sensor.getTemp();
}, 10000);
