const ADXL345 = require('adxl345-sensor');
const adxl345 = new ADXL345(); // defaults to i2cBusNo 1, i2cAddress 0x53


// Initialize the ADXL345 accelerometer
//
adxl345.init()
  .then(() => {
    console.log('ADXL345 initialization succeeded');
  })
  .catch((err) => console.error(`ADXL345 initialization failed: ${err} `));



// Read ADXL345 three-axis acceleration, repeat
//
const getAcceleration = () => {

};

module.exports.getAccel = function (callback) {

  adxl345.getAcceleration(true) // true for g-force units, else false for m/s²
    .then((acceleration) => {
      // console.log(acceleration);

      callback(acceleration.x, acceleration.y, acceleration.z);
    })
    .catch((err) => {
      console.log(`ADXL345 read error: ${err}`);
    });

};