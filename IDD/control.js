const bluetooth = require('./bluetooth.js') // Bluetooth 모듈 import
const move = require('./calculator.js')   //운동량 측정 모듈 import

const fs = require('fs');


this.valueInterval = setInterval(function () {
  move.getMoveValue(); 
  console.log('Walk count : ' + move.WalkCount);
}.bind(this), 200);



this.loggingInterval = setInterval(function () {
  fs.open('./log.txt', 'a+', function(err, fd) {
  if(err) throw err;
  var buf = new Buffer('bbbbb\n');
  fs.write(fd, buf, 0, buf.length, null, function(err, written, buffer) {
    if(err) throw err;
    console.log(err, written, buffer);
    fs.close(fd, function() {
      console.log('Done');
    });
  });
});
}.bind(this), 5000);


//bluetooth.AdvertisingDevice('P0001', move.MoveValue); //Bluetooth 탐색 모듈 실행 