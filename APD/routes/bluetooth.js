// Connect to Thermometer Service 0xBBB0
// and display notification for temperature changes
var noble = require('noble');

var count = 0;

noble.on('stateChange', function (state) {

var serviceUUIDs = ["bbb0"]; // default: [] => all
var allowDuplicates = false; // default: false

  if (state === 'poweredOn') {
    noble.startScanning(); // particular UUID's
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  if(peripheral.uuid == 'bbb0'){
  peripheral.connect(function(error) {
    console.log('connected to peripheral: ' + peripheral.uuid);
    peripheral.discoverServices(['bbb0'], function(error, services) {
      var IDDService = services[0];
      console.log('discoveredIDD service');

      IDDService.discoverCharacteristics(['bbb1'], function(error, characteristics) {
        var IDDCharacteristic = characteristics[0];
        console.log('discovered IDD Level characteristic');

        IDDCharacteristic.on('data', function(data, isNotification) {
          console.log('IDD level is now: ', data.readUInt8(0));
        });

        // to enable notify
        IDDCharacteristic.subscribe(function(error) {
          console.log('battery level notification on');
        });
        
      });
    });
  });
}else {console.log(peripheral.name + '  sorry, not you.');}
});