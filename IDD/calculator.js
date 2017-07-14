const Accel = require('./sensor.js');   //가속도 센서 모듈 import

//센서의 X, Y, Z값을 받아온다.
var AccelX;
var AccelY;
var AccelZ;

//변환하여 저장할 값.
var MoveValue
var Value

//센서값 콜백함수 정의
AccelCallback = function (x, y, z) {
    AccelX = Math.ceil(x);
    AccelY = Math.ceil(y);
    AccelZ = Math.ceil(z);
}

//운동량 측정 모듈화
module.exports.getMoveValue = function (callback) {

    //가속도값 받아옴.
    Accel.getAccel(AccelCallback);

    //가속도값을 운동량으로 변환 (임시)
    if(AccelX < 0){ AccelX = AccelX * -1;}
    if(AccelY < 0){ AccelY = AccelY * -1;}
    if(AccelZ < 0){ AccelZ = AccelZ * -1;}

    MoveValue = (AccelX + AccelY + AccelZ) * 3;
    if(MoveValue < 1){MoveValue = 5;}    

    //변환한 운동량을 반환
    callback(MoveValue);
};