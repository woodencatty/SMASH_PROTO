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

noble.on('discover', function (peripheral) {
  console.log('Discovered', peripheral.advertisement.localName, peripheral.address);
  connectAndSetUp(peripheral);
  // TODO should stop scanning otherwise we connect to ALL the thermometers
});

function connectAndSetUp(peripheral) {

  peripheral.connect(function (error) {
    var serviceUUIDs = ['bbb0'];
    var characteristicUUIDs = ['bbb1'];

    peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, onServicesAndCharacteristicsDiscovered);
  });

}

function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {

  var IDDCharacteristic = characteristics[0];

  console.log(characteristics);

  IDDCharacteristic.on('data', function (data, isNotification) {
    var Accel = data.readFloatLE(0);
    console.log('Accel is', Accel.toFixed(1));
  count ++;
  /*  if(count > 10){
      IDDCharacteristic.unsubscribe();
    }*/
  });
 
  IDDCharacteristic.subscribe(); // ignore callback
  IDDCharacteristic.read();      // ignore callback
}
