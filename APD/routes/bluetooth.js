
const noble = require('noble');



let ID = 'noname';
let try_count = 0;
let step_count = 0;





function connectAndSetUp(peripheral) {

  peripheral.connect(function (error) {
    var serviceUUIDs = ['bbb0'];
    var characteristicUUIDs = ['bbb1'];

    // peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, onServicesAndCharacteristicsDiscovered);
  });

}

function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {

  var IDDCharacteristic = characteristics[0];

  IDDCharacteristic.on('data', function (data, isNotification) {
    var celsius = data.readFloatLE(0);
    var fahrenheit = (celsius * 1.8 + 32.0).toFixed(1);
    console.log('Temperature is', celsius.toFixed(1) + '°C', fahrenheit + '°F');
  });

  // IDDCharacteristic.subscribe(); // ignore callback

  console.log('read');

  this.SensorInterval = setInterval(() => {
    IDDCharacteristic.read();      // ignore callback
  }, 1000);  //값 확인을 위해 간격 짧게 잡음.
}


module.exports = {
  startSearch: () => {
    noble.on('stateChange', function (state) {
      if (state === 'poweredOn') {
        console.log('scanning');
        this.try_count++;
        noble.startScanning(['bbb0', 'B6FD7210-32D4-4427-ACA7-99DF89E10380']);
      } else {
        noble.stopScanning();
      }
    });
  
noble.on('discover', function (peripheral) {
  console.log('Discovered', peripheral.advertisement.localName, peripheral.address);
  ID = peripheral.advertisement.localName;
  //connectAndSetUp(peripheral);
  // TODO should stop scanning otherwise we connect to ALL the thermometers
});

},

  stopSearch: () => {
    noble.stopScanning();
  },

  getSearchedID: (callback) => {
    callback(ID);
  },

  getTryCount: (callback) => {
    callback(try_count);
  },

  getStepCount: (callback) => {
    callback(ID, step_count);
  }

}