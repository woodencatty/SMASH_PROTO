var bluetooth = require('./bluetooth.js') // Bluetooth 모듈 import
const move = require('./calculator.js')   //운동량 측정 모듈 import
const acturator = require('./acturator.js');

const fs = require('fs');

require('date-utils');

let dateTime = new Date();

acturator.led_powerOn();
acturator.piezo_powerOn();

this.statusInterval = setInterval(() => {
  acturator.led_normal();
}, 1000);

function moveInterval(AccelInterval) {
  this.valueInterval = setInterval(() => {
    move.setWalkCount();
    acturator.led_sensorActive();
  }, AccelInterval);
}

function initialize() {
  fs.readFile('./config', 'utf8', function (err, data) {
    //저장한 활동량 로그에서 데이터를 읽어 전송한다.
    var config = JSON.parse(data);
    moveInterval(config.AccelInterval);
    loggingInterval(config.loggingInterval);

  });
}


function loggingInterval(loggingInterval) {

  //5초에 한번 걸음 수를 업데이트하여 로그에 저장함.
  this.loggingInterval = setInterval(() => {
    WalkCallback = function (WalkCount) {
      fs.open('./steps.log', 'w+', function (err, fd) {
        if (err) throw err;
        var buf = new Buffer(WalkCount + ',' + dateTime.toFormat('YYYY,MM,DD,HH24,MI,SS') + '\n');
        console.log(WalkCount + ',' + dateTime.toFormat('YYYY,MM,DD,HH24,MI,SS') + '\n');
        fs.write(fd, buf, 0, buf.length, null, function (err, written, buffer) {
          if (err) throw err;
          fs.close(fd, () => {
          });
        });
      });
      //bluetooth.SetStepValue(WalkCount);
    }
    move.getWalkCount(WalkCallback);
    acturator.led_dataSaved();
  }, loggingInterval);
}

            bluetooth.startAdvertising(); //Bluetooth 탐색 모듈 실행 
