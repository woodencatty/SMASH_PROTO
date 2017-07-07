// Connect to Thermometer Service 0xBBB0
// and display notification for temperature changes
var noble = require('noble');

var count = 0;
noble.on('stateChange', function (state) {
  if (state === 'poweredOn') {
    noble.startScanning(['bbb0', 'B6FD7210-32D4-4427-ACA7-99DF89E10380']);
  } else {
    noble.stopScanning();
  }
});

/*noble.on('discover', function (peripheral) {
  console.log('Discovered', peripheral.advertisement.localName, peripheral.address);
  connectAndSetUp(peripheral);
  // TODO should stop scanning otherwise we connect to ALL the thermometers
});

function connectAndSetUp(peripheral) {

  console.log('setting up');
  peripheral.connect(function (error) {
      console.log('connect');
    var serviceUUIDs = ['bbb0'];
    var characteristicUUIDs = ['bbb1'];

    peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, onServicesAndCharacteristicsDiscovered);
  });

}

function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {
  console.log('service discover');

  var IDDCharacteristic = characteristics[0];

  console.log(characteristics);

  IDDCharacteristic.on('data', function (data, isNotification) {
    console.log('reading..');
    var Accel = data.readFloatLE(0);
    console.log('Accel is', Accel.toFixed(1));
    count++;
      if(count > 10){
        IDDCharacteristic.unsubscribe();
      }
  });

  IDDCharacteristic.subscribe(); // ignore callback
  IDDCharacteristic.read();      // ignore callback

}
*/


noble.on('discover', function(peripheral) {
  peripheral.connect(function(error) {
    console.log('connected to peripheral: ' + peripheral.uuid);
    peripheral.discoverServices(['bbb0'], function(error, services) {
      var batteryService = services[0];
      console.log('discoveredIDD service');

      batteryService.discoverCharacteristics(['bbb1'], function(error, characteristics) {
        var batteryLevelCharacteristic = characteristics[0];
        console.log('discovered IDD Level characteristic');

        batteryLevelCharacteristic.on('data', function(data, isNotification) {
          console.log('IDD level is now: ', data.readFloatLE(0) + '%');
        });

        // to enable notify
        batteryLevelCharacteristic.subscribe(function(error) {
          console.log('battery level notification on');
        });
      });
    });
  });
});