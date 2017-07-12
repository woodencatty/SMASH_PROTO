// Thermometer Service 0xBBB0
var bleno = require('bleno');
var util = require('util');

var Characteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;
var PrimaryService = bleno.PrimaryService;

var temperatureSensorId;
var lastTemp;

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

    sensor.temperature(temperatureSensorId, function (err, result) {
      if (err) {
        console.log('Can not get temperature from sensor', err);
      } else {
        console.log('Sensor ' + temperatureSensorId + ' :', result);
        if (result != lastTemp) {
          lastTemp = result;
          var data = new Buffer(4);
          data.writeFloatLE(result, 0);

          console.log('IDDCharacteristic update value: ' + result);
          updateValueCallback(data);
        }
      }
    });
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
  sensor.temperature(temperatureSensorId, function (err, result) {
    console.log('Sensor ' + temperatureSensorId + ' :', result);
    var data = new Buffer(4);
    data.writeFloatLE(result, 0);
    callback(Characteristic.RESULT_SUCCESS, data);
  });
};

var IDDService = new PrimaryService({
  uuid: 'bbb0',
  characteristics: [
    new IDDCharacteristic()
  ]
});

bleno.on('stateChange', function (state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('IDD', [IDDService.uuid]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function (error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([IDDService]);
  }
});
