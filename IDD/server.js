var sensor = require('./sensor.js')

sensor.getAccel(function(acceleration){
    console.log('real'+acceleration);
});