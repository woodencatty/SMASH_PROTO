//APD

var noble = require('noble');

console.log('noble');

noble.on('stateChange', function(state) {
console.log('..is on');


  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});


noble.on('scanStart', function() {
  console.log('on -> scanStart');
});

noble.on('scanStop', function() {
  console.log('on -> scanStop');
});


noble.on('discover', function(peripheral) {
  console.log('on -> discover: ' + peripheral);

  noble.stopScanning();

  peripheral.on('connect', function() {
    console.log('on -> connect');
    this.updateRssi();
  });

  peripheral.on('disconnect', function() {
    console.log('on -> disconnect');
  });

  peripheral.on('rssiUpdate', function(rssi) {
   // console.log('on -> RSSI update ' + rssi);
    this.discoverServices();
  });

  peripheral.on('servicesDiscover', function(services) {
  //  console.log('on -> peripheral services discovered ' + services);

    var serviceIndex = 0;

    services[serviceIndex].on('includedServicesDiscover', function(includedServiceUuids) {
     // console.log('on -> service included services discovered ' + includedServiceUuids);
      this.discoverCharacteristics();
    });

    services[serviceIndex].on('characteristicsDiscover', function(characteristics) {
     // console.log('on -> service characteristics discovered ' + characteristics);

      var characteristicIndex = 2;

      characteristics[characteristicIndex].on('read', function(data, isNotification) {
        console.log('on -> characteristic read ' + data + ' ' + isNotification);
        console.log(data.toString('utf8'));

        peripheral.disconnect();
      });

      characteristics[characteristicIndex].read();
    });

    
    services[serviceIndex].discoverIncludedServices();
  });

  peripheral.connect();
});