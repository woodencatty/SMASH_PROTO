var bleno = require('bleno');
var util = require('util');

var Accel = require('./sensor.js');


var Characteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;
var PrimaryService = bleno.PrimaryService;

var result;

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
AccelCallback = function(value){
    result = value;
  }

    Accel.getAccel(AccelCallback);
  
          var data = new Buffer(4);
          data.writeFloatLE(result, 0);

          console.log('IDDCharacteristic update value: ' + result);
          updateValueCallback(data);
  
  }.bind(this), 2000);
};

IDDCharacteristic.prototype.onUnsubscribe = function () {
  console.log('IDDCharacteristic unsubscribe');

  if (this.changeInterval) {
    clearInterval(this.changeInterval);
    this.changeInterval = null;
  }
};

IDDCharacteristic.prototype.onReadRequest = function (offset, callback) {

   result = 10.11;
          var data = new Buffer(4);
          data.writeFloatLE(result, 0);
    callback(Characteristic.RESULT_SUCCESS, data);
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
