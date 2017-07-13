const express = require('express');
const router = express.Router();

const sensor = require('./sensor.js')
const bluetooth = require('./bluetooth.js')
const http = require('./httpReq.js')

const noble = require('noble');

var distance;
var temperature;
var humidity;
var audio;
var enviorment;
var light;

var ID = 'undefined';
var name;
/*
const exec = require('child_process').exec,
    xinput, browser;

xinput = exec('xinput --set-prop 7 114 0 -1 1 1 0 0 0 0 1',
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});

browser = exec('chromium-browser --kiosk --no-sandbox',
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});*/
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

  NameCallback = function (nameValue) {
    name = nameValue;
  }
  
this.SensorInterval = setInterval(function () {
  sensor.getTemp(TempCallback);
  sensor.getHumi(HumiCallback); 
  sensor.getAdcAudio(AudCallback);
  sensor.getAdcEnv(EnvCallback);
  sensor.getAdcLight(LightCallback);
}.bind(this), 10000);


this.DistanceInterval = setInterval(function () {
  sensor.getDist(DistCallback);
}.bind(this), 1000);

/* GET home page. */
router.get('/main', function (req, res, next) {
  console.log("Directed to Main Page");

if(distance < 50){

  if (this.DistanceInterval) {
    clearInterval(this.DistanceInterval);
    this.DistanceInterval = null;
  }

  res.redirect('/try')
  console.log('\t' + distance);
}else{
  res.render('index', { title: '대기화면', temp: temperature, humi: humidity, audio: audio, env: enviorment, light: light, distance: distance });
}
});

router.get('/try', function (req, res, next) {
    console.log("Directed to try Page");
  res.render('try');
});

router.get('/identify', function (req, res, next) {
    console.log("Directed to identify Page");
res.render('identify');
});



router.get('/welcome', function (req, res, next) {
      console.log("Directed to welcome Page");

bluetooth.searchIDD();

  setTimeout(function(){
    bluetooth.Getdata(IDCallback)
      console.log('get value! : ' + ID);
      
if(ID == 'undefined'){
	    console.log('user not found')
}else{http.reqName(ID, NameCallback);
      }
      setTimeout(function(){
    res.render('welcome', { name: name});
      }, 500);
  }, 2000);

});


router.get('/exercise1', function (req, res, next) {
  res.render('exercise');
});

module.exports = router;

