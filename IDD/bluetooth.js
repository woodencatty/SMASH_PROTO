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
    properties: ['read'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'IDD Device'
      })]
  });
};
util.inherits(IDDCharacteristic, Characteristic);

IDDCharacteristic.prototype.onReadRequest = function (offset, callback) {
  var result = 10.10;
    console.log('Sensor ' + temperatureSensorId + ' :', result);
    var data = new Buffer(4);
    data.writeFloatLE(result, 0);
    callback(Characteristic.RESULT_SUCCESS, data);
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
    bleno.startAdvertising('P0001', [IDDService.uuid]);
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

bleno.on('accept', (clientAddress)=>{
    console.log('conntected to '+ clientAddress);
});

bleno.on('disconnect', (clientAddress)=>{
        console.log('disconnect to '+ clientAddress);

});