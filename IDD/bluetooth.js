var bleno = require('bleno');
var util = require('util');

var Move = require('./calculator.js');


var Characteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;
var PrimaryService = bleno.PrimaryService;

var Value;

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

  this.changeInterval = setInterval(function () {
    MoveCallback = function (MoveValue) {
      Value = MoveValue;
    }

    //Move.getMoveValue(MoveCallback)

    Value = 12;

    var data = new Buffer(4);
    data.writeUInt8(Value, 0);
    console.log('IDDCharacteristic update value: ' + Value);
    updateValueCallback(data);

  }.bind(this), 500);
};

IDDCharacteristic.prototype.onUnsubscribe = function () {
  console.log('IDDCharacteristic unsubscribe');

  if (this.changeInterval) {
    clearInterval(this.changeInterval);
    this.changeInterval = null;
  }
};

IDDCharacteristic.prototype.onReadRequest = function (offset, callback) {

   MoveCallback = function (MoveValue) {
      Value = MoveValue;
    }

    //Move.getMoveValue(MoveCallback)

  Value = 12.1;
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
