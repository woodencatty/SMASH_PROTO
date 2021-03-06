const express = require('express');
const router = express.Router();

const fs = require('fs');

//센서모듈, bluetooth모듈, SWserver모듈 import
const sensor = require('./sensor.js')

const SWserver = require('./SWserverReq.js');

const acturator = require('./acturator.js');

//noble의 상태를 poweredOn으로 변경하기 위한 조치

const session = require('./session.js');
var bluetooth = require('./bluetooth.js');
const { exec } = require('child_process');

const winston = require('winston');


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

function stopSense() {
   winston.log('debug', "stop Sensing");

  if (this.SensorInterval) {
    clearInterval(this.SensorInterval);
    this.SensorInterval = null;
  }
}


function initialize() {

  session.clearSession();
  bluetooth.resetBLE();
  SWserver.clearSWserver();

      winston.log('info', "Device Initialized");
  fs.readFile('./config', 'utf8', function (err, data) {
      winston.log('debug', "config file read");

    //저장한 활동량 로그에서 데이터를 읽어 전송한다.
    var config = JSON.parse(data);

    session.setupSettings(config.serverIP, config.port, config.deviceName, config.version);

    sensor.setInterval(config.dhtinterval, config.distinterval,config.distanceMax, config.distanceDetect, config.audiointerval, config.envinterval, config.lgtinterval, config.ledinterval);

    SWserver.setIP(config.SWserverIPv4,config.port);

    bluetooth.setParameter(config.IDDdeviceName, config.serviceUuids,config.characteristicsUuids,config.dataFileFormat);
     winston.level = config.loglevel;


this.statusInterval = setInterval(() => {

  acturator.led_normal();
}, config.ledinterval);


  });
}

//대기화면. 센서값 갱신을 위해 2초에 한번씩 갱신한다.
initialize();

router.get('/main_not_opened', (req, res, next) => {
        winston.log('info', "routed to /main_not_opened");

let poster = '/images/SCAN_20170717_120222551.jpg'
  let sunny = '/images/세부소스/날씨/맑음.png'

 DeviceNameCallback = (DeviceName) => {
  SWserver.requestIsOpened(DeviceName);
  setTimeout(() => {
    getOpenStatusCallback = (is_opened) => {
      if (is_opened) {
         winston.log('debug', "turn to Opened");
        res.redirect('/main');
      } else {
        SensorDataCallback = (patientDetected, temperature, humidity, audio, envelope, light) => {
           winston.log('debug', "render page");
          res.render('index_not_opened', { title: '대기화면', temp: temperature, humi: humidity,  poster:poster, sunny1:sunny, sunny:sunny});
        }
        sensor.getData(SensorDataCallback);
      }
    }
    SWserver.getIsOpened(getOpenStatusCallback)
  }, 50);
 }
  session.getDeviceName(DeviceNameCallback)
});


router.get('/main', (req, res, next) => {
          winston.log('info', "routed to /main");

  let poster = '/images/SCAN_20170717_120222551.jpg'
  let sunny = '/images/세부소스/날씨/맑음.png'

 DeviceNameCallback = (DeviceName) => {
  SWserver.requestIsOpened(DeviceName);
  setTimeout(() => {
    getOpenStatusCallback = (is_opened) => {
      if (!is_opened) {
         winston.log('debug', "turn to not Opened");
        res.redirect('/main_not_opened');
      } else {
        //거리가 50cm 이하일 경우 try페이지로 전환하고, 아닐 경우 대기화면을 표시
        SensorDataCallback = (patientDetected, temperature, humidity, audio, envelope, light) => {
          if (patientDetected) {
            acturator.led_detectActivity();
            acturator.piezo_detectActivity();
            stopSense();
            res.redirect('/try');
          } else { winston.log('debug', "render page");
            res.render('index', { title: '대기화면', temp: temperature, humi: humidity,  poster:poster, sunny1:sunny, sunny:sunny});
          }
        }
        sensor.getData(SensorDataCallback);
      }
    }
    SWserver.getIsOpened(getOpenStatusCallback)
  }, 50);
 }
  session.getDeviceName(DeviceNameCallback)

});


//운동 권유 화면 
router.get('/try', (req, res, next) => {
  winston.log('info', "routed to /try");
   let back = '/images/세부소스/버튼/뒤로-업.png';
  let foward = '/images/세부소스/버튼/앞으로-업.png';
  res.render('try',  {back:back, foward:foward});
});
//환자 인식 화면
router.get('/identify', (req, res, next) => {
  winston.log('info', "routed to /identify");
  TryCallback = function (try_count) {
    //재시도 횟수를 체크하며, 3회 이상 시 인식 실패 화면을 보여준다.
    if (try_count > 3) {
      res.render('failed');
      winston.log('error', "Failed on Searching IDD");

    } else {
      res.render('identify', { retry: try_count });
    }
  }
  bluetooth.getTryCount(TryCallback);
});

//환영 화면
router.get('/welcome', (req, res, next) => {
  winston.log('info', "routed to /welcome");
   let back = '/images/세부소스/버튼/뒤로-업.png';

  let foward = '/images/세부소스/버튼/앞으로-업.png';

  bluetooth.SearchNconnect();

  setTimeout(() => {
    //탐색이 종료될 즈음 bluetooth 모듈에서 값을 받아와 SWserver요청을 전송하고, 이름을 받아 welcome화면을 표시한다.
    IDDDataCallback = (ID, steps, step_date) => {
      //데이터를 못받았을 시 재시도를 수행한다.
      if (ID == 'noname') {
        winston.log('error', "Failed on connect IDD");

        res.redirect('/identify');
        //데이터 수락시 ID를 이용하여 환자 이름을 받아오고, 서버에 활동량 데이터를 전송한다.
      } else {
        SWserver.requestUserInfo(ID);
        SWserver.UserStepSubmit(ID, steps, step_date);
      }
      setTimeout(() => {
        acturator.led_dataSaved();
        //서버에서 받아온 데이터를 이용하여 환자 세션을 설정한다.
        SessionCallback = (ID, name, age, height, weight, exercise, gender, exercise_done, stepcount) => {
          if (name == '') {
            winston.log('error', "SW Server Error : Couldn't get data");

            res.render('error');
          }
           winston.log('debug', "Session setup && page render");

          session.setupUser(ID, name, age, height, weight, exercise, gender, exercise_done, stepcount);
          res.render('welcome', { name: name , exercise_done: exercise_done, stepcount: stepcount, back:back, foward:foward});
        }
        SWserver.getInfo(SessionCallback);
      }, 200);
    }
    bluetooth.getIDDData(IDDDataCallback);
  }, 5000);

});

//운동 프로그램 진행 화면
router.get('/exercise', (req, res, next) => {
  winston.log('info', "routed to /exercise");
  let pause = '/images/세부소스/버튼/일시정지-업.png';
  //세션에서 환자에게 할당된 운동 프로그램을 가져온다.
  ExerciseCallback = (exercise) => {
    //운동 프로그램이 없다면 운동을 종료한다.
    if (exercise.id == 'done') {
      GetNameCallback = (name) => {
        res.render('done', { name: name });
      }
      session.getName(GetNameCallback);
    } else {
       winston.log('debug', "exercise page render");

          //받아온 정보를 이용하여 화면에 운동 이미지와 운동 프로그램 내용을 출력하여 진행한다.
          res.render('exercise', {image:exercise.imagefile, count:exercise.count, comment:exercise.comment, title:exercise.title, pause:pause });
    }
  }
  session.getExercise(ExerciseCallback);
});

//운동 프로그램 완료시 작동 로직.(운동 프로그램 하나 완료)
router.get('/exercise_done', (req, res, next) => {
  winston.log('info', "routed to /exercise_done");
  //환자 세션에서 운동 프로그램을 하나 빼고, 서버에 완료한 운동 프로그램 ID를 전송한다.
  PauseExerciseCallback = (exercise) => {
    NameCallback = (ID) => {
       winston.log('debug', "remove exercise_done");
      SWserver.UserExerciseSubmit(ID, exercise.id);
      session.clearExercise(); 
    }
    session.getID(NameCallback);
  }
  session.getExercise(PauseExerciseCallback);
  res.redirect('/exercise');
});

//일시정지 메뉴를 표시한다.
router.get('/pause', (req, res, next) => {
  winston.log('info', "routed to /pause");
  let pause = '/images/세부소스/버튼/뒤로-업.png';
  let back = '/images/세부소스/버튼/일시정지-업.png';
  res.render('pause', {pause:pause, back:back});
});

//중단 메뉴를 표시한다.
router.get('/pause_end', (req, res, next) => {
  winston.log('info', "routed to /pause_end");
  res.render('pause_end');
});

//메인 화면으로 가기 위한 경유지. 세션을 초기화한다.
router.get('/return2main', (req, res, next) => {
  winston.log('info', "routed to /return2main");
  initialize();
  res.redirect('/main');
});

//업데이트 파일 전송시 수행하는 모듈.
router.post('/swserver/metadata/apdupdate', (req, res, next) => {
  winston.log('info', "update file recieved");
  fs.readFile(req.files.uploadFile.path, (error, data) => {
    var filePath = __dirname + "\\files\\" + req.files.uploadFile.name;
    fs.writeFile(filePath, data, (error) => {
      if (error) {
        throw err;
      } else {
        exec('sudo ./' + req.files.uploadFile.name, (error, stdout, stderr) => {
          if (error) {
            winston.log('error', `exec error: ${error}`);

            console.error();
            return;
          }
          winston.log('info', `update stdout: ${stdout}`);
          winston.log('info', `update stderr: ${stderr}`);
        });
      }
    })
  })

});


module.exports = router;

