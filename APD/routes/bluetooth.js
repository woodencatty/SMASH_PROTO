var noble = require('noble');

console.log('bluetooth module OK');

const serviceUUIDs = ['bbb0'];
const characteristicUUIDs = ['bbb1'];


var IDDCharacteristic = null;
var value = 0;

module.exports.searchIDD = function () {
  console.log('scan start');
  noble.startScanning(['bbb0', 'B6FD7210-32D4-4427-ACA7-99DF89E10380']);
  noble.on('scanStart', function (state) {
    console.log(noble.state);
    console.log('really finding now');
  });

  noble.on('discover', function (peripheral) {
    console.log('Discovered', peripheral.advertisement.localName, peripheral.address);
    connectAndSetUp(peripheral);
    value = peripheral.advertisement.localName;
  });

  /*
  function connectAndSetUp(peripheral) {
    peripheral.connect(function (error) {
     // peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, onServicesAndCharacteristicsDiscovered);
    });

  }*/

  function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {
    console.log('find service');
    IDDCharacteristic = characteristics[0];
    IDDCharacteristic.on('data', function (data, isNotification) {
      var celsius = data.readFloatLE(0);
      value = celsius.toFixed(1);
      console.log('Temperature is', celsius.toFixed(1));
    });
    IDDCharacteristic.subscribe(); // ignore callback
    IDDCharacteristic.read();      // ignore callback
  }
};

module.exports.Getdata = function (callback) {
  callback(value);
};

