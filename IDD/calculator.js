var Accel = require('./sensor.js');

var Move = require('./calculator.js');


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


    console.log(AccelX);
    console.log(AccelY);
    console.log(AccelZ);


    if(AccelX < 0){ AccelX = AccelX * -1;}
    if(AccelY < 0){ AccelY = AccelY * -1;}
    if(AccelZ < 0){ AccelZ = AccelZ * -1;}

    MoveValue = (AccelX + AccelY + AccelZ) * 3;
    
    console.log(MoveValue);

    callback(MoveValue);


};

   MoveCallback = function (MoveValue) {
      Value = MoveValue;
    }
this.changeInterval = setInterval(function () {
    Move.getMoveValue(MoveCallback)

    console.log(Value);
     }.bind(this), 500);