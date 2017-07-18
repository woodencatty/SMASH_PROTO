const Accel = require('./sensor.js');   //가속도 센서 모듈 import

//센서의 X, Y, Z값을 받아온다.

//센서값 콜백함수 정의
AccelCallback = function (x, y, z) {
    AccelX = Math.ceil(x*10);
    AccelY = Math.ceil(y*10);
    AccelZ = Math.ceil(z*10);
}


//변환하여 저장할 값.

module.exports = {
 AccelX: 0.0,
 AccelY: 0.0,
 AccelZ: 0.0,
 MoveValue: 0.0,


getMoveValue: function(){

    //가속도값 받아옴.
    Accel.getAccel(AccelCallback);

    AccelX = AccelX*AccelX;
    AccelY = AccelY*AccelY;
    AccelZ = AccelZ*AccelZ;

    MoveValue = Math.sqrt(AccelX + AccelY + AccelZ);
    console.log(MoveValue + '      x:'+AccelX+ '      y:'+AccelY+ '      z:'+AccelZ);
}

}

//운동량 측정 모듈화
startGetValue = function () {

this.valueInterval = setInterval(function () {
  getMoveValue(); 

  }.bind(this), 500);
};