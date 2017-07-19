const bluetooth = require('./bluetooth.js') // Bluetooth 모듈 import
const move = require('./calculator.js')   //운동량 측정 모듈 import

const fs = require('fs');

require('date-utils');

let dateTime = new Date();


this.valueInterval = setInterval(function () {
  move.setWalkCount();

  //console.log('Walk count : ' + move.WalkCount);
}.bind(this), 200);

this.loggingInterval = setInterval(function () {
  WalkCallback = function (WalkCount) {
    fs.open('./log.txt', 'w', function (err, fd) {
      if (err) throw err;
      var buf = new Buffer(WalkCount + 'Steps Walked.       ' + dateTime.toFormat('YYYY-MM-DD HH24:MI:SS'));
      fs.write(fd, buf, 0, buf.length, null, function (err, written, buffer) {
        if (err) throw err;
        console.log(err, written, buffer);
        fs.close(fd, function () {
          console.log('Done');
        });
      });
    });
  }
  move.getWalkCount(WalkCallback);
}.bind(this), 5000);


bluetooth.AdvertisingDevice('P0001', 10); //Bluetooth 탐색 모듈 실행 