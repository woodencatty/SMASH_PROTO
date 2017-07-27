const express = require('express');
const router = express.Router();

//센서모듈, bluetooth모듈, http모듈 import
const sensor = require('./sensor.js')

const http = require('./httpReq.js');

const acturator = require('./acturator.js');

//noble의 상태를 poweredOn으로 변경하기 위한 조치

const session = require('./session.js');


var bluetooth = require('./bluetooth.js');


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
    sensor.senseDHT22();
    sensor.senseAdcAudio();
    sensor.senseAdcEnv();
    sensor.senseAdcLight();
    acturator.led_sensorActive();
    //console.log(sensor.distance, sensor.temperature, sensor.humidity, sensor.audio);
  }, 300000);  //값 확인을 위해 간격 짧게 잡음.
}

this.DistanceInterval = setInterval(() => {
  sensor.senseDist();

}, 1000);  //값 확인을 위해 간격 짧게 잡음.


this.statusInterval = setInterval(() => {
  acturator.led_normal();
}, 1200);


function stopSense() {
  if (this.SensorInterval) {
    clearInterval(this.SensorInterval);
    this.SensorInterval = null;
  }
}

startSense();
//대기화면. 센서값 갱신을 위해 2초에 한번씩 갱신한다.


router.get('/main_not_opened', (req, res, next) => {
  http.requestIsOpened('APD0001');
  setTimeout(() => {
    getOpenStatusCallback = (is_opened) => {
      if (is_opened == true) {
        res.redirect('/main');
      } else {
        console.log("Directed to Main Page");
        //거리가 50cm 이하일 경우 try페이지로 전환하고, 아닐 경우 대기화면을 표시
        SensorDataCallback = (distance, temperature, humidity, audio, envelope, light) => {
          res.render('index_not_opened', { title: '대기화면', temp: temperature, humi: humidity });
        }
        sensor.getData(SensorDataCallback);
      }
    }
    http.getIsOpened(getOpenStatusCallback)
  }, 50);
});


router.get('/main', (req, res, next) => {
  http.requestIsOpened('APD0001');
  setTimeout(() => {
    getOpenStatusCallback = (is_opened) => {
      if (is_opened == false) {
        res.redirect('/main_not_opened');
      } else {
        console.log("Directed to Main Page");
        //거리가 50cm 이하일 경우 try페이지로 전환하고, 아닐 경우 대기화면을 표시
        SensorDataCallback = (distance, temperature, humidity, audio, envelope, light) => {

          if (distance < 50) {
            acturator.led_detectActivity();
            acturator.piezo_detectActivity();
            stopSense();
            console.log('dtected : \t' + distance);
            res.redirect('/try');
          } else {
            res.render('index', { title: '대기화면', temp: temperature, humi: humidity });
          }
        }
        sensor.getData(SensorDataCallback);
      }
    }
    http.getIsOpened(getOpenStatusCallback)
  }, 50);

});


//운동 권유 화면 
router.get('/try', (req, res, next) => {
  console.log("Directed to try Page");
  res.render('try');
});

//환자 인식 화면
router.get('/identify', (req, res, next) => {
  console.log("Directed to identify Page");
  TryCallback = function (try_count) {
    //재시도 횟수를 체크하며, 3회 이상 시 인식 실패 화면을 보여준다.
    if (try_count > 3) {
      res.render('failed');
    } else {
      res.render('identify', { retry: try_count });
    }
  }
  bluetooth.getTryCount(TryCallback);
});

//환영 화면
router.get('/welcome', (req, res, next) => {
  console.log("Directed to welcome Page");
  bluetooth.startScanning();

  setTimeout(() => {
    //탐색이 종료될 즈음 bluetooth 모듈에서 값을 받아와 http요청을 전송하고, 이름을 받아 welcome화면을 표시한다.
    IDDDataCallback = (ID, steps, step_date) => {
      //데이터를 못받았을 시 재시도를 수행한다.
      if (ID == 'noname') {
        console.log('user not found');
        res.redirect('/identify');
        //데이터 수락시 ID를 이용하여 환자 이름을 받아오고, 서버에 활동량 데이터를 전송한다.
      } else {
        console.log('identify patient : ' + ID);
        //console.log('data got : ' + step_data);
        http.requestUserInfo(ID);
        //http.UserStepSubmit(ID, steps, step_date);
      }
      setTimeout(() => {
        //서버에서 받아온 데이터를 이용하여 환자 세션을 설정한다.
        SessionCallback = (ID, name, age, height, weight, exercise, gender) => {
          session.setupSession(ID, name, age, height, weight, exercise, gender);
          res.render('welcome', { name: name });
        }
        http.getInfo(SessionCallback);
      }, 200);
    }
    bluetooth.getIDDData(IDDDataCallback);
    console.log("gettingIDD Data");
  }, 5000);

});

//운동 프로그램 진행 화면
router.get('/exercise', (req, res, next) => {

  //세션에서 환자에게 할당된 운동 프로그램을 가져온다.
  ExerciseCallback = (exercise) => {
    //운동 프로그램이 없다면 운동을 종료한다.
    if (exercise == 'done') {
      GetNameCallback = (name) => {
        res.render('done', { name: name });
      }
      session.getName(GetNameCallback);
    } else {
      //운동 프로그램 ID를 이용하여 서버에 운동 프로그램 정보를 받아온다.
      http.requestExercise(exercise[0]);
      setTimeout(() => {
        ExerciseDataCallback = (image, count, comment, title) => {
          //받아온 정보를 이용하여 화면에 운동 이미지와 운동 프로그램 내용을 출력하여 진행한다.
          res.render('exercise', { image: image, count: count, comment: comment, title: title });
        }
        http.getExercise(ExerciseDataCallback);
      }, 500);
    }
  }
  session.getExercise(ExerciseCallback);
});

//운동 프로그램 완료시 작동 로직.(운동 프로그램 하나 완료)
router.get('/exercise_done', (req, res, next) => {
  //환자 세션에서 운동 프로그램을 하나 빼고, 서버에 완료한 운동 프로그램 ID를 전송한다.
  PauseExerciseCallback = (exercise) => {
    NameCallback = (ID) => {
      http.UserExerciseSubmit(ID, exercise[0]);
      setTimeout(() => { session.clearExercise(); }, 500);
    }
    session.getID(NameCallback);
  }
  session.getExercise(PauseExerciseCallback);
  res.redirect('/exercise');
});

//일시정지 메뉴를 표시한다.
router.get('/pause', (req, res, next) => {
  res.render('pause');
});

//중단 메뉴를 표시한다.
router.get('/pause_end', (req, res, next) => {
  res.render('pause_end');
});

//메인 화면으로 가기 위한 경유지. 세션을 초기화한다.
router.get('/return2main', (req, res, next) => {
  startSense();
  bluetooth.resetBLE();
  session.clearSession();
  res.redirect('/main');
});

//업데이트 파일 전송시 수행하는 모듈.
app.use(express.bodyParser());
router.post('/SWserver/metadata/APDUpdate', (req, res, next) => {


  const exec = require('child_process').exec,
    patch;

  fs.readFile(req.files.uploadFile.path, (error, data) => {
    var filePath = __dirname + "\\files\\" + req.files.uploadFile.name;
    fs.writeFile(filePath, data, (error) => {
      if (error) {
        throw err;
      } else {
        patch = exec('sudo' + req.files.uploadFile.name,
          function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
              console.log('exec error: ' + error);
            }
          });
      }
    })
  })

});


module.exports = router;

