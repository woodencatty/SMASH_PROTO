//IDD


var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var EchoCharacteristic = require('./characteristic.js');

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('IDD', ['bc00']);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));



  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: 'bc00',
        characteristics: [
          new EchoCharacteristic()
        ]
      })
    ]);
  }
});