var Accel = require('./sensor.js');


var AccelX;
var AccelY;
var AccelZ;

var MoveValue

var Value

module.exports.getMoveValue = function (callback) {

    AccelCallback = function (x, y, z) {
        AccelX = Math.ceil(x);
        AccelY = Math.ceil(y);
        AccelZ = Math.ceil(z);
    }

    Accel.getAccel(AccelCallback);

    if(AccelX < 0){ AccelX = AccelX * -1;}
    if(AccelY < 0){ AccelY = AccelY * -1;}
    if(AccelZ < 0){ AccelZ = AccelZ * -1;}

    MoveValue = (AccelX + AccelY + AccelZ) * 3;
    
    comsole.log(MoveValue);

    callback(MoveValue);


};

   MoveCallback = function (MoveValue) {
      Value = MoveValue;
    }

    Move.getMoveValue(MoveCallback)

    console.log(Value);