const express = require('express');
const router = express.Router();

const sensor = require('./sensor.js')
const bluetooth = require('./bluetooth.js')

var distance = 0;
var temperature = 0;
var humidity = 0;
var audio = 0;
var enviorment = 0;
var light = 0;

    DistCallback = function (DistValue) {
      distance = DistValue;
    }

    TempCallback = function (TempValue) {
      temperature = TempValue;
    }

    HumiCallback = function (HumiValue) {
      humidity = HumiValue;
    }

    AudCallback = function (AudioValue) {
      audio = AudioValue;
    }

    EnvCallback = function (EnvValue) {
      enviorment = EnvValue;
    }

    LightCallback = function (LightValue) {
      light = LightValue;
    }
    
  console.log("device enable");
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("device enable");
 
   sensor.getDist(DistCallback); 


sensor.getTemp(TempCallback);
sensor.getHumi(HumiCallback);
    sensor.getAdcAudio(AudCallback);
    sensor.getAdcEnv(EnvCallback);
    sensor.getAdcLight(LightCallback);

console.log(distance);
console.log(temperature);
console.log(humidity);
console.log(audio);
console.log(enviorment);
console.log(light);

    res.render('index', { title: '대기화면' });
  
  if(distance > 50){
    res.redirect('/identify');
  }
});


router.get('/identify', function(req, res, next) {
  res.render('identify', { title: '인식화면' });

});

module.exports = router;


/*

  this.SensorInterval = setInterval(function () {

  }.bind(this), 500);

  */