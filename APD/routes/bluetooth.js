var noble = require('noble');

  console.log('bluetooth module OK');

  const serviceUUIDs = ['bbb0'];
  const characteristicUUIDs = ['bbb1'];

  
 var IDDCharacteristic = null;
 var Value = 0;

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
});
function connectAndSetUp(peripheral) {
  peripheral.connect(function (error) {

    peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, onServicesAndCharacteristicsDiscovered);
/*
    setTimeout(function(){
      peripheral.disconnect();
      console.log('disconnected');
  }, 20000)
*/  

});

}

function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {
    console.log('find service');
  IDDCharacteristic = characteristics[0];

  IDDCharacteristic.on('data', function (data, isNotification) {
    var celsius = data.readFloatLE(0);
    Value = celsius;
    console.log('Temperature is', celsius.toFixed(1));
   //IDDperipheral.disconnect();
    
    
    /*setTimeout(function(){
    callback(celsius.toFixed(1));
  }, 1000)
*/  

});

  IDDCharacteristic.subscribe(); // ignore callback
  IDDCharacteristic.read();      // ignore callback

  }
/*noble.on('stateChange', function (state) {
  if (state === 'poweredOn') {
      console.log('scanning now..');
    noble.startScanning(['bbb0', 'B6FD7210-32D4-4427-ACA7-99DF89E10380']);
  } else {
    noble.stopScanning();
  }
});*/
};

module.exports.Getdata = function () {


};

