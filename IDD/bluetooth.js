//IDD

var util = require('util');

var bleno = require('bleno');


var BlenoPrimaryService = bleno.PrimaryService;
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

console.log('bleno');

var StaticReadOnlyCharacteristic = function() {
  StaticReadOnlyCharacteristic.super_.call(this, {
    uuid: '00111',
    properties: ['read'],
    value: new Buffer('MyAccelvalue'),
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'Specify Patient'
      })
    ]
  });
};
util.inherits(StaticReadOnlyCharacteristic, BlenoCharacteristic);

function SampleService() {
  SampleService.super_.call(this, {
    uuid: '0011',
    characteristics: [
      new StaticReadOnlyCharacteristic()
    ]
  });
}
util.inherits(SampleService, BlenoPrimaryService);

bleno.on('stateChange', function(state) {
    console.log('...is on');

  console.log('on -> stateChange: ' + state + ', address = ' + bleno.address);

  if (state === 'poweredOn') {
    bleno.startAdvertising('test', ['0011']);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('accept', function(clientAddress) {
  console.log('on -> accept, client: ' + clientAddress);

  bleno.updateRssi();
});

bleno.on('disconnect', function(clientAddress) {
  console.log('on -> disconnect, client: ' + clientAddress);
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new SampleService()
    ]);
  }
});

bleno.on('advertisingStop', function() {
  console.log('on -> advertisingStop');
});

bleno.on('servicesSet', function(error) {
  console.log('on -> servicesSet: ' + (error ? 'error ' + error : 'success'));
});