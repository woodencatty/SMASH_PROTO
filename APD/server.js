var sensor = require('../APD/sensor.js')

setTimeout(function(){
  sensor.getTemp();
}, 2000);
