var noble = require('noble');

noble.on('stateChange', function (state) {
  if (state === 'poweredOn') {
    noble.startScanning(['ffe0']);
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function (peripheral) {
  //console.log(peripheral);
  connectAndSetUp(peripheral);
});

function connectAndSetUp(peripheral) {

  peripheral.connect(function (error) {

    var serviceUUIDs = ['ffe0'];
    var characteristicUUIDs = ['ffe1']; // buttonStatus characteristic

    peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, onServicesAndCharacteristicsDiscovered);
  });

  // attach disconnect handler
  peripheral.on('disconnect', onDisconnect);
}

function onDisconnect() {
  console.log('Peripheral disconnected!');
}

function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {

  if (error) {
    console.log('Error discovering services and characteristics ' + error);
    return;
  }

  var buttonStatusCharacteristic = characteristics[0];

  buttonStatusCharacteristic.on('data', function (data, isNotification) {
   
      console.log(data);
     
  });
  buttonStatusCharacteristic.subscribe(function (err) {
    if (err) {
      console.log('Error subscribing to button notifications', err);
    } else {
      console.log('Subscribed for button notifications');
    }
  });

}