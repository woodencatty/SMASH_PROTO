// Thermometer Service 0xBBB0
var bleno = require('bleno');
var util = require('util');

var move = require('./calculator.js')


var Characteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;
var PrimaryService = bleno.PrimaryService;

var value = 10.11;

this.valueInterval = setInterval(function () {
  MoveCallback = function (MoveValue) {
      value = MoveValue;
    }

       move.getMoveValue(MoveCallback);
       console.log('changed to :' + value);

  }.bind(this), 2000);

var IDDCharacteristic = function () {
  IDDCharacteristic.super_.call(this, {
    uuid: 'bbb1',
    properties: ['read', 'notify'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'IDD Device'
      })]
  });
};
util.inherits(IDDCharacteristic, Characteristic);

IDDCharacteristic.prototype.onSubscribe = function (maxValueSize, updateValueCallback) {
  console.log('IDDCharacteristic subscribe');

  this.changeInterval = setInterval(function () {
          var data = new Buffer(4);
          data.writeFloatLE(value, 0);
          
          console.log('sending : ' + value);
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
          var data = new Buffer(4);
          data.writeFloatLE(value, 0);
    callback(Characteristic.RESULT_SUCCESS, data);
};

var IDDService = new PrimaryService({
  uuid: 'bbb0',
  characteristics: [
    new IDDCharacteristic()
  ]
});

module.exports.AdvertisingDevice = function () {
bleno.on('stateChange', function (state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('IDD', [IDDService.uuid]);
  } else {
    bleno.stopAdvertising();
  }
});
};
bleno.on('advertisingStart', function (error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([IDDService]);
  }
});
