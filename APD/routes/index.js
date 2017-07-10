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
/*
  this.SensorInterval = setInterval(function () {

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
    
    sensor.getDist(DistCallback);
    sensor.getTemp(TempCallback);
    sensor.getHumi(HumiCallback);
    sensor.getAdcAudio(AudCallback);
    sensor.getAdcEnv(EnvCallback);
    sensor.getAdcLight(LightCallback);

  }.bind(this), 500);
*/
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("device enable");
    res.render('index', { title: 'Express' });
  
  if(distance > 50){
    res.redirect('/identify');
  }
});


router.get('/identify', function(req, res, next) {
  res.render('index', { title: 'Express' });

});

module.exports = router;
