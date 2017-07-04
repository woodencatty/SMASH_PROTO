var bleno = require('bleno');
var util = require('util');

var Characteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;
var PrimaryService = bleno.PrimaryService;

var temperatureSensorId;
var lastTemp;

var TemperatureCharacteristic = function () {
  TemperatureCharacteristic.super_.call(this, {
    uuid: 'bbb1',
    properties: ['read', 'notify'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'Temperature'
      })]
  });
};
util.inherits(TemperatureCharacteristic, Characteristic);

TemperatureCharacteristic.prototype.onSubscribe = function (maxValueSize, updateValueCallback) {
  console.log('TemperatureCharacteristic subscribe');

  this.changeInterval = setInterval(function () {

        result = 14.21;
          var data = new Buffer(4);
          data.writeFloatLE(result, 0);

          console.log('TemperatureCharacteristic update value: ' + result);
          updateValueCallback(data);
          result++;
  }.bind(this), 2000);
};

TemperatureCharacteristic.prototype.onUnsubscribe = function () {
  console.log('TemperatureCharacteristic unsubscribe');

  if (this.changeInterval) {
    clearInterval(this.changeInterval);
    this.changeInterval = null;
  }
};

TemperatureCharacteristic.prototype.onReadRequest = function (offset, callback) {
   result = 14.21;
    var data = new Buffer(4);
    data.writeFloatLE(result, 0);
    callback(Characteristic.RESULT_SUCCESS, data);
};

var thermometerService = new PrimaryService({
  uuid: 'bbb0',
  characteristics: [
    new TemperatureCharacteristic()
  ]
});

bleno.on('stateChange', function (state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('Thermometer', [thermometerService.uuid]);
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
