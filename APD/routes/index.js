const express = require('express');
const router = express.Router();

//센서모듈, bluetooth모듈, http모듈 import
const sensor = require('./sensor.js')
      sensor.startSense();


//const bluetooth = require('./bluetooth.js');
const http = require('./httpReq.js');

const bluetooth_classtest = require('./bluetooth_classtest.js');


var ble = new Bluetooth('whatte', 10, 10, 10);
console.log(ble.height);

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


//블루투스 콜백


//대기화면. 센서값 갱신을 위해 2초에 한번씩 갱신한다.
router.get('/main',(req, res, next) =>{
  console.log("Directed to Main Page");

//거리가 50cm 이하일 경우 try페이지로 전환하고, 아닐 경우 대기화면을 표시
if(sensor.distance < 50){
  sensor.stopSense();
  console.log('\t' + sensor.distance);
  res.redirect('/try')
}else{
  res.render('index', { title: '대기화면', temp: sensor.temperature, humi: sensor.humidity, audio: sensor.audio, env: sensor.envelope, light: sensor.light, distance: sensor.distance });
}
});

//운동 권유 화면 
router.get('/try',(req, res, next)=> {
    console.log("Directed to try Page");
  res.render('try');
});

//환자 인식 화면
router.get('/identify',(req, res, next)=> {
    console.log("Directed to identify Page");
res.render('identify');
});


//환영 화면
router.get('/welcome',(req, res, next) =>{
      console.log("Directed to welcome Page");

//식별기기 탐색을 시작한다.
bluetooth_classtest.searchIDD();

//탐색이 종료될 즈음 생성된 값을 받아와 http요청을 전송하고, 이름을 받아 welcome화면을 표시한다.
  setTimeout(function(){
      console.log('get value! : ' + bluetooth.ID);
      
if(ID == 'undefined'){
	    console.log('user not found')
}else{http.reqName(bluetooth.ID);
      }
      setTimeout(function(){
    res.render('welcome', { name: http.name});
      }, 500);
  }, 2000);

});

//운동 3(gif)

router.get('/exercise1', (req, res, next)=> {
  res.render('exercise1');
});

router.get('/exercise2',(req, res, next) =>{
  res.render('exercise2');
});

router.get('/exercise3',(req, res, next) =>{
  res.render('exercise3');
});


router.get('/done', (req, res, next) => {
  res.render('done');
});


module.exports = router;

