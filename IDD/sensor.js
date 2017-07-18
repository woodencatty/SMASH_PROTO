const ADXL345 = require('adxl345-sensor');  //가속도 센서 모듈
const adxl345 = new ADXL345();              //가속도 센서 정의

// 가속도 센서 초기화
adxl345.init()
  .then(() => {
    console.log('ADXL345 initialization succeeded');
  })
  .catch((err) => console.error(`ADXL345 initialization failed: ${err} `));

//가속도값 측정 모듈화
module.exports.getAccel = function (callback) {
  adxl345.getAcceleration(true) // true for g-force units, else false for m/s²
    .then((acceleration) => {
      console.log(acceleration.x, acceleration.y, acceleration.z);
      //가속도값(X, Y, Z) 반환
      callback(acceleration.x, acceleration.y, acceleration.z);
    })  
    .catch((err) => {
      console.log(`ADXL345 read error: ${err}`);
    });

};