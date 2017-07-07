var bleno = require('bleno');
var util = require('util');

var Move = require('./calculator.js');


var Characteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;
var PrimaryService = bleno.PrimaryService;

var Value;


  this.ValueInterval = setInterval(function () {
    MoveCallback = function (MoveValue) {
      Value = MoveValue;
    }

    Move.getMoveValue(MoveCallback)


  }.bind(this), 500);

var IDDCharacteristic = function () {
  IDDCharacteristic.super_.call(this, {
    uuid: 'bbb1',
    properties: ['read', 'notify'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'IDD'
      })]
  });
};
util.inherits(IDDCharacteristic, Characteristic);

IDDCharacteristic.prototype.onSubscribe = function (maxValueSize, updateValueCallback) {
  console.log('IDDCharacteristic subscribe');
setTimeout(function(){
 this.SubsInterval = setInterval(function () {

    var data = new Buffer(4);
    data.writeUInt8(Value, 0);
    console.log('IDDCharacteristic update value: ' + Value);
    updateValueCallback(data);

  }.bind(this), 500);
}, 2000);
};

IDDCharacteristic.prototype.onUnsubscribe = function () {
  console.log('IDDCharacteristic unsubscribe');

  if (this.ValueInterval) {
    clearInterval(this.ValueInterval);
    this.ValueInterval = null;
  }

    if (this.SubsInterval) {
    clearInterval(this.SubsInterval);
    this.SubsInterval = null;
  }
};

IDDCharacteristic.prototype.onReadRequest = function (offset, callback) {

   MoveCallback = function (MoveValue) {
      Value = MoveValue;
    }

    Move.getMoveValue(MoveCallback)

  Value = 10;
  var data = new Buffer(4);
  data.writeUInt8(Value, 0);

  callback(Characteristic.RESULT_SUCCESS, Value);
};

var thermometerService = new PrimaryService({
  uuid: 'bbb0',
  characteristics: [
    new IDDCharacteristic()
  ]
});

bleno.on('stateChange', function (state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('IDD', [thermometerService.uuid]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function (error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([thermometerService]);
  }
});
