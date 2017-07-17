const bluetooth = require('./bluetooth.js') // Bluetooth 모듈 import

const move = require('./calculator.js')   //운동량 측정 모듈 import

move.startGetValue();
bluetooth.AdvertisingDevice('P0001', move.MoveValue); //Bluetooth 탐색 모듈 실행