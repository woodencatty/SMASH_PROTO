var bluetooth = require('./bluetooth.js') // Bluetooth 모듈 import
const move = require('./calculator.js')   //운동량 측정 모듈 import
const acturator = require('./acturator.js');

const fs = require('fs');

const winston = require('winston');

require('date-utils');

let dateTime = new Date();

acturator.led_powerOn();
acturator.piezo_powerOn();


function moveInterval(AccelInterval, walkThreadhold, forceSenseTime) {
  this.valueInterval = setInterval(() => {
    move.setWalkCount(walkThreadhold, forceSenseTime);
  }, AccelInterval);
}

function initialize() {
             winston.log('debug', "IDD initialized");
  fs.readFile('./config', 'utf8', function (err, data) {
    //저장한 활동량 로그에서 데이터를 읽어 전송한다.
    var config = JSON.parse(data);

this.statusInterval = setInterval(() => {
  acturator.led_normal();
}, config.ledStatusInterval);

    moveInterval(config.AccelInterval, config.walkThreadhold, config.forceSenseTime);
    loggingInterval(config.loggingInterval, config.WalkDataFileName, config.fsOption);
    console.log(config.loggingInterval);
     winston.level = config.loglevel;
    bluetooth.startAdvertising(config.deviceName, config.bluetoothDescription, config.WalkDataFileName, config.fileFormat); //Bluetooth 탐색 모듈 실행 
  });
}

initialize();
function loggingInterval(loggingInterval, filename,fsOption) {
  //5초에 한번 걸음 수를 업데이트하여 로그에 저장함.
  this.loggingInterval = setInterval(() => {
            acturator.led_dataSaved();

    WalkCallback = function (WalkCount) {
      fs.open(filename, fsOption, function (err, fd) {
        if (err) throw err;
        var buf = new Buffer(WalkCount + ',' + dateTime.toFormat('YYYY,MM,DD,HH24,MI,SS') + '\n');
           winston.log('debug', WalkCount + ',' + dateTime.toFormat('YYYY,MM,DD,HH24,MI,SS') + '\n');

        fs.write(fd, buf, 0, buf.length, null, function (err, written, buffer) {
          if (err) throw err;
          fs.close(fd, () => {
          });
        });
      });
      //bluetooth.SetStepValue(WalkCount);
    }
    //move.getWalkCount(WalkCallback);
  }, loggingInterval);
}

initialize();
