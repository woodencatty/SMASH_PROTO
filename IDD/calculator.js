const Accel = require('./sensor.js');   //가속도 센서 모듈 import

//센서의 X, Y, Z값을 받아온다.

console.log('calculating..');
//변환하여 저장할 값.

module.exports = {
 MoveValue: 0.0,

getMoveValue: function(){

    Accel.getAccel();

 let AccelX = Accel.AccelX*Accel.AccelX;
 let AccelY = Accel.AccelY*Accel.AccelY;
 let AccelZ = Accel.AccelZ*Accel.AccelZ;

    this.MoveValue = Math.sqrt(AccelX + AccelY + AccelZ);
    console.log(this.MoveValue + '      x:'+AccelX+ '      y:'+AccelY+ '      z:'+AccelZ);

}

}

//운동량 측정 모듈화