const express = require('express');
const router = express.Router();

//센서모듈, bluetooth모듈, http모듈 import
const sensor = require('./sensor.js')
const bluetooth = require('./bluetooth.js')
const http = require('./httpReq.js')

//noble의 상태를 poweredOn으로 변경하기 위한 조치
const noble = require('noble');

//각 센서값을 받을 변수 정의
var distance;
var temperature;
var humidity;
var audio;
var enviorment;
var light;

//환자 식별기기 ID값과 이름값을 받을 변수
var ID = 'undefined';
var name;

//터치 센서 보정과 브라우저 자동 실행 코드. 테스트중엔 사용하지 않음.
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


//각 센서 콜백

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

//블루투스 콜백

  IDCallback = function (IDValue) {
    ID = IDValue;
  }

//HTTP 콜백
  NameCallback = function (nameValue) {
    name = nameValue;
  }
  

//센서 측정 Interval
this.SensorInterval = setInterval(function () {
  sensor.getTemp(TempCallback);
  sensor.getHumi(HumiCallback); 
  sensor.getAdcAudio(AudCallback);
  sensor.getAdcEnv(EnvCallback);
  sensor.getAdcLight(LightCallback);
}.bind(this), 5000);  //값 확인을 위해 간격 짧게 잡음.


//거리 측정 Interval
this.DistanceInterval = setInterval(function () {
  sensor.getDist(DistCallback);
}.bind(this), 1000);

//대기화면. 센서값 갱신을 위해 2초에 한번씩 갱신한다.
router.get('/main', function (req, res, next) {
  console.log("Directed to Main Page");

//거리가 50cm 이하일 경우 try페이지로 전환하고, 아닐 경우 대기화면을 표시
if(distance < 50){

//센서 측정을 중단한다. 리소스 사용 최소화..
  if (this.SensorInterval) {
    clearInterval(this.SensorInterval);
    this.SensorInterval = null;
  }

  res.redirect('/try')
  console.log('\t' + distance);
}else{
  res.render('index', { title: '대기화면', temp: temperature, humi: humidity, audio: audio, env: enviorment, light: light, distance: distance });
}
});

//운동 권유 화면 
router.get('/try', function (req, res, next) {
    console.log("Directed to try Page");

  res.render('try');
});

//환자 인식 화면
router.get('/identify', function (req, res, next) {
    console.log("Directed to identify Page");
res.render('identify');
});


//환영 화면
router.get('/welcome', function (req, res, next) {
      console.log("Directed to welcome Page");

//식별기기 탐색을 시작한다.
bluetooth.searchIDD();

//탐색이 종료될 즈음 생성된 값을 받아와 http요청을 전송하고, 이름을 받아 welcome화면을 표시한다.
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

//운동 3(gif)
router.get('/exercise3', function (req, res, next) {
  res.render('exercise3');
});


router.get('/done', function (req, res, next) {
  res.render('done');
});


module.exports = router;

