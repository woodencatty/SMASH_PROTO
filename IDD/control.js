const bluetooth = require('./bluetooth.js') // Bluetooth 모듈 import

const move = require('./calculator.js')   //운동량 측정 모듈 import


this.valueInterval = setInterval(function () {
  move.getMoveValue(); 

}.bind(this), 200);

//bluetooth.AdvertisingDevice('P0001', move.MoveValue); //Bluetooth 탐색 모듈 실행 