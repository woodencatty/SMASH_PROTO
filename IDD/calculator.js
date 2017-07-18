const Accel = require('./sensor.js');   //가속도 센서 모듈 import

//센서의 X, Y, Z값을 받아온다.

console.log('calculating..');
//변환하여 저장할 값.

module.exports = {
 AccelX: 0.0,
 AccelY: 0.0,
 AccelZ: 0.0,
 MoveValue: 0.0,

getMoveValue: function(){


//센서값 콜백함수 정의
AccelCallback = function (x, y, z) {
    this.AccelX = Math.ceil(x*10);
    this.AccelY = Math.ceil(y*10);
    this.AccelZ = Math.ceil(z*10);
}

    //가속도값 받아옴.
    Accel.getAccel(AccelCallback);

    this.AccelX = this.AccelX*this.AccelX;
    this.AccelY = this.AccelY*this.AccelY;
    this.AccelZ = this.AccelZ*this.AccelZ;

    MoveValue = Math.sqrt(this.AccelX + this.AccelY + this.AccelZ);
    console.log(MoveValue + '      x:'+this.AccelX+ '      y:'+this.AccelY+ '      z:'+this.AccelZ);
}

}

//운동량 측정 모듈화