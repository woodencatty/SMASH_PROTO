// Button Service 0xFFE0
var bleno = require('bleno');
var util = require('util');

var IDDCharacteristic = function () {
  IDDCharacteristic.super_.call(this, {
    uuid: 'ffe1',
    properties: ['notify'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'Button'
      })
    ]
  });
};
util.inherits(IDDCharacteristic, bleno.Characteristic);

IDDCharacteristic.prototype.onSubscribe = function (maxValueSize, updateValueCallback) {
  console.log('IDDCharacteristic subscribe');

    value = 1;
    var data = new Buffer(1);
    data[0] = value;
    updateValueCallback(data);
};

var buttonService = new bleno.PrimaryService({
  uuid: 'ffe0',
  characteristics: [
    new IDDCharacteristic()
  ]
});

bleno.on('stateChange', function (state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('Button', [buttonService.uuid]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function (error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([buttonService]);
  }
});
