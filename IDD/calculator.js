const Accel = require('./sensor.js');   //가속도 센서 모듈 import

//센서의 X, Y, Z값을 받아온다.

console.log('calculating..');
//변환하여 저장할 값.

module.exports = {
 MoveValue: 0.0,

getMoveValue: function(){

    Accel.getAccel();

 let AccelX_1 = Accel.AccelX;
 let AccelY_1 = Accel.AccelY;
 let AccelZ_1 = Accel.AccelZ;

setTimeout(function () {
 Accel.getAccel();
 let AccelX_2 = Accel.AccelX;
 let AccelY_2 = Accel.AccelY;
 let AccelZ_2 = Accel.AccelZ;

 let changeX = Math.abs(AccelX_1) - Math.abs(AccelX_2);
 let changeY = Math.abs(AccelY_1) - Math.abs(AccelY_2);
 let changeZ = Math.abs(AccelZ_1) - Math.abs(AccelZ_2);
 
 let speed = (changeX+changeY+changeZ) * 10000
 console.log(speed);
}, 10);

}

}

//운동량 측정 모듈화