const express = require('express');
const router = express.Router();

//센서모듈, bluetooth모듈, http모듈 import
const sensor = require('./sensor.js')

const bluetooth = require('./bluetooth.js');
const http = require('./httpReq.js');

const acturator = require('./acturator.js');

//noble의 상태를 poweredOn으로 변경하기 위한 조치
const noble = require('noble');
noble.state = 'poweredOn';

const session = require('./session.js');

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


acturator.led_powerOn();
acturator.piezo_powerOn();


function startSense() {
  this.SensorInterval = setInterval(() => {
    sensor.getDHT22();
    sensor.getAdcAudio();
    sensor.getAdcEnv();
    sensor.getAdcLight();
    sensor.getDist();
    acturator.led_sensorActive();
    acturator.piezo_dataSaved();

    //console.log(sensor.distance, sensor.temperature, sensor.humidity, sensor.audio);
  }, 1000);  //값 확인을 위해 간격 짧게 잡음.
}


this.statusInterval = setInterval(() => {
  acturator.led_normal();
  //console.log('Walk count : ' + move.WalkCount);
}, 1200);


function stopSense() {
  if (this.SensorInterval) {
    clearInterval(this.SensorInterval);
    this.SensorInterval = null;
  }
}

startSense();
//대기화면. 센서값 갱신을 위해 2초에 한번씩 갱신한다.
router.get('/main', (req, res, next) => {
  console.log("Directed to Main Page");

  //거리가 50cm 이하일 경우 try페이지로 전환하고, 아닐 경우 대기화면을 표시
  if (sensor.distance < 50) {
    acturator.led_detectActivity();
    stopSense();
    console.log('\t' + sensor.distance);
    res.redirect('/try');
  } else {
    res.render('index', { title: '대기화면', temp: sensor.temperature, humi: sensor.humidity });
  }
});

//운동 권유 화면 
router.get('/try', (req, res, next) => {
  console.log("Directed to try Page");
  res.render('try');
});

//환자 인식 화면
router.get('/identify', (req, res, next) => {
  console.log("Directed to identify Page");
  if (bluetooth.try_count > 3) {
    res.render('failed');
  } else {
    TryCallback = function (try_count) {
      res.render('identify', { retry: try_count });
    }
    bluetooth.getTryCount(TryCallback);
  }
});

//환영 화면
router.get('/welcome', (req, res, next) => {
  console.log("Directed to welcome Page");

  //식별기기 탐색을 시작한다.
  bluetooth.startSearch();
  //탐색이 종료될 즈음 생성된 값을 받아와 http요청을 전송하고, 이름을 받아 welcome화면을 표시한다.
  setTimeout(() => {

    IDCallback = (ID) => {
      if (ID == 'noname') {
        bluetooth.stopSearch();
        console.log('user not found')
        res.redirect('/identify');
      } else {
        http.http_getInfo(ID);
      }
      setTimeout(() => {
        bluetooth.stopSearch();
        SessionCallback = (name, age, height, weight, exercise, gender) => {
          session.setupSession(name, age, height, weight, exercise, gender);
          res.render('welcome', { name: name });
        }
        http.getInfo(SessionCallback);
      }, 500);
    }

    /* StepCallback = function(ID, Steps){
       http.http_putInfo(ID, Steps);
     }*/
    bluetooth.getSearchedID(IDCallback);
    //bluetooth.getStepCount(StepCallback);
  }, 2000);
});

router.get('/exercise', (req, res, next) => {
  ExerciseCallback = (exercise) => {

    let nextExercise = '/' + exercise[1];
    res.render(exercise[0]);
  }
  session.getExercise(ExerciseCallback);
});

router.get('/exercise_done', (req, res, next) => {
  session.clearExercise();
  res.redirect('/exercise');
});

router.get('/done', (req, res, next) => {
  res.render('done');
});


module.exports = router;

