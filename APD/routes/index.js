const express = require('express');
const router = express.Router();

//센서모듈, bluetooth모듈, http모듈 import
const sensor = require('./sensor.js')

const bluetooth = require('./bluetooth.js');
const http = require('./httpReq.js');

//noble의 상태를 poweredOn으로 변경하기 위한 조치
const noble = require('noble');
noble.state = 'poweredOn';

//환자 식별기기 ID값과 이름값을 받을 변수

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


function startSense() {
  this.SensorInterval = setInterval(() => {
    sensor.getDHT22();
    sensor.getAdcAudio();
    sensor.getAdcEnv();
    sensor.getAdcLight();
    sensor.getDist();
    console.log(sensor.distance, sensor.temperature, sensor.humidity, sensor.audio);
  }, 1000);  //값 확인을 위해 간격 짧게 잡음.
}

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
  if(bluetooth.try_count > 3){
  res.render('failed');
}else {
    res.render('identify', { retry: bluetooth.try_count});
}
});

//환영 화면
router.get('/welcome', (req, res, next) => {
  console.log("Directed to welcome Page");

  //식별기기 탐색을 시작한다.
  bluetooth.searchIDD();
  //탐색이 종료될 즈음 생성된 값을 받아와 http요청을 전송하고, 이름을 받아 welcome화면을 표시한다.
  setTimeout(function () {
    console.log('get value! : ' + bluetooth.ID);

    if (ID == 'noname') {
      console.log('user not found')
          res.redirect('/identify');
    } else {
      http.reqName(bluetooth.ID);
    }
    setTimeout(function () {
      res.render('welcome', { name: http.name });
    }, 500);
  }, 2000);

});


router.get('/exercise1', (req, res, next) => {
  let nextExercise = '/exercise2'
  res.render('exercise1', { nextExercise: nextExercise });
});

router.get('/exercise2', (req, res, next) => {
  let nextExercise = '/exercise3'

  res.render('exercise2', { nextExercise: nextExercise });
});

router.get('/exercise3', (req, res, next) => {
  let nextExercise = '/main'
  res.render('exercise3', { nextExercise: nextExercise });
});


router.get('/done', (req, res, next) => {
  res.render('done');
});


module.exports = router;

