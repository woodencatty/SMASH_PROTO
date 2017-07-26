const express = require('express');
const router = express.Router();

//센서모듈, bluetooth모듈, http모듈 import
const sensor = require('./sensor.js')

const http = require('./httpReq.js');

const acturator = require('./acturator.js');

//noble의 상태를 poweredOn으로 변경하기 위한 조치

const session = require('./session.js');


var bluetooth = require('./bluetooth.js');

var exec = require('child_process').exec,
  child;


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
//acturator.piezo_powerOn();


function startSense() {
  this.SensorInterval = setInterval(() => {
    sensor.senseDHT22();
    sensor.senseAdcAudio();
    sensor.senseAdcEnv();
    sensor.senseAdcLight();
    sensor.senseDist();
    acturator.led_sensorActive();

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
  SensorDataCallback = (distance, temperature, humidity, audio, envelope, light) => {

    if (distance < 50) {
      acturator.led_detectActivity();
      acturator.piezo_detectActivity();

      stopSense();
      console.log('\t' + distance);
      res.redirect('/try');
    } else {
      res.render('index', { title: '대기화면', temp: temperature, humi: humidity });
    }
  }

  sensor.getData(SensorDataCallback);

});

//운동 권유 화면 
router.get('/try', (req, res, next) => {
  console.log("Directed to try Page");
  res.render('try');
});

//환자 인식 화면
router.get('/identify', (req, res, next) => {
  console.log("Directed to identify Page");

  if (bluetooth.try_count > 10) {
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
  bluetooth.startScanning();
  //탐색이 종료될 즈음 생성된 값을 받아와 http요청을 전송하고, 이름을 받아 welcome화면을 표시한다.
  setTimeout(() => {

    IDDDataCallback = (ID, step_data) => {
      if (ID == 'noname') {
        console.log('user not found')
        res.redirect('/identify');
      } else {
        console.log(ID);
        console.log(step_data);
        http.requestUserInfo(ID);
      }
      setTimeout(() => {
        SessionCallback = (name, age, height, weight, exercise, gender) => {
          session.setupSession(name, age, height, weight, exercise, gender);
          res.render('welcome', { name: name });
        }
        http.getInfo(SessionCallback);
      }, 200);
    }
    /* StepCallback = function(ID, Steps){
       http.http_putInfo(ID, Steps);
     }*/
    bluetooth.getIDDData(IDDDataCallback);
    console.log("gettingID");


    //bluetooth.getStepCount(StepCallback);
  }, 5000);

});



//환영 화면
router.get('/uploadSteps', (req, res, next) => {

  this.thisInterval = setInterval(() => {
    console.log('do something');
    child = exec("sudo NOBLE_MULTI_ROLE=1 node dataLoader.js", function (error, stdout, stderr) {
      if (stdout != "") {
        console.log('done!');
        res.redirect('/done');
      }
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);

      session.setStepsData(stdout);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  }, 5000);

});


router.get('/exercise', (req, res, next) => {

  ExerciseCallback = (exercise) => {
    res.render(exercise[0]);
  }
  session.getExercise(ExerciseCallback);
});

router.get('/exercise_done', (req, res, next) => {
  session.clearExercise();
  res.redirect('/exercise');
});

router.get('/done', (req, res, next) => {
  startSense();

  DoneCallback = (name) => {
    res.render('done', { name: name });
  }
  session.getName(DoneCallback);
});


router.get('/exercise_try', (req, res, next) => {

  ExerciseCallback = (exercise) => {
    http.requestExercise(exercise);
    setTimeout(() => {
      ExerciseDataCallback = (image, count, comment) => {
        res.render('exercise', { image: image, count: count, comment: comment });
      }
      http.getExercise(ExerciseDataCallback);
    }, 500);
  }
  session.getExercise(ExerciseCallback);
});


module.exports = router;

