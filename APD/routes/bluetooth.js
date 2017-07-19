
const noble = require('noble');



let ID = 'noname';
let try_count = 0;
let step_count = 0;
 



noble.on('discover', function (peripheral) {
  console.log('Discovered', peripheral.advertisement.localName, peripheral.address);
   ID = peripheral.advertisement.localName;
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

  var temperatureCharacteristic = characteristics[0];

  temperatureCharacteristic.on('data', function (data, isNotification) {
    var celsius = data.readFloatLE(0);
    var fahrenheit = (celsius * 1.8 + 32.0).toFixed(1);
    console.log('Temperature is', celsius.toFixed(1) + '°C', fahrenheit + '°F');
  });

 // temperatureCharacteristic.subscribe(); // ignore callback
 
      console.log('read');
  temperatureCharacteristic.read();      // ignore callback
}


  noble.on('stateChange', function (state) {
  if (state === 'poweredOn') {
          this.try_count++;
    noble.startScanning(['bbb0', 'B6FD7210-32D4-4427-ACA7-99DF89E10380']);
  } else {
    noble.stopScanning();
  }
});

module.exports = {
  startSearch: function () {
  noble.on('stateChange', function (state) {
  if (state === 'poweredOn') {
          this.try_count++;
    noble.startScanning(['bbb0', 'B6FD7210-32D4-4427-ACA7-99DF89E10380']);
  } else {
    noble.stopScanning();
  }
});
},

  stopSearch: function () {
    noble.stopScanning();
  },

  getSearchedID: function(callback){
      callback(ID);
  },

  getTryCount: function(callback){
      callback(try_count);
  },

  getStepCount: function(callback){
    callback(ID, step_count);
  }



}