const express = require('express');
const router = express.Router();

const sensor = require('./sensor.js')
const bluetooth = require('./bluetooth.js')

var noble = require('noble');

var distance = 0;
var temperature = 0;
var humidity = 0;
var audio = 0;
var enviorment = 0;
var light = 0;

var ID;

//sensor callback

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

//bluetooth callback

  IDCallback = function (IDValue) {
    ID = IDValue;
  }

  
this.SensorInterval = setInterval(function () {
  sensor.getTemp(TempCallback);
  sensor.getHumi(HumiCallback); 
  sensor.getAdcAudio(AudCallback);
  sensor.getAdcEnv(EnvCallback);
  sensor.getAdcLight(LightCallback);
}.bind(this), 1000);


this.DistanceInterval = setInterval(function () {
  sensor.getDist(DistCallback);
}.bind(this), 500);
/* GET home page. */
router.get('/main', function (req, res, next) {
  console.log("Directed to Main Page");

if(distance < 50){
  res.redirect('/try')
  console.log('\t' + distance);
}else{
  res.render('index', { title: '대기화면', temp: temperature, humi: humidity, audio: audio, env: enviorment, light: light });
}
});

router.get('/try', function (req, res, next) {
    console.log("Directed to try Page");
  res.render('try');
});

router.get('/identify', function (req, res, next) {
    console.log("Directed to identify Page");

bluetooth.searchIDD();
  setTimeout(function(){
    bluetooth.Getdata(IDCallback)
      console.log('get value! : ' + ID);
    res.render('identify', { name: ID});
  }, 5000);
  
});


router.get('/welcome', function (req, res, next) {
      console.log("Directed to welcome Page");
      console.log(ID);

  var name = '김환자';
  res.render('welcome', { name: name});
});


router.get('/exercise', function (req, res, next) {
  res.render('exercise');
});

module.exports = router;

