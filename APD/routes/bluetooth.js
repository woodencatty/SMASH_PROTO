// Connect to Thermometer Service 0xBBB0
// and display notification for temperature changes
var noble = require('noble');

var count = 0;

const serviceUUID = '13333333333333333333333333333337'; // default: [] => all
const characteristicUUID = '13333333333333333333333333330001'; // default: [] => all

var IDDService = null;
var IDDCharacteristic = null;
console.log('its on');

noble.on('stateChange', function (state) {
  if (state === 'poweredOn') {
    //
    // Once the BLE radio has been powered on, it is possible
    // to begin scanning for services. Pass an empty array to
    // scan for all services (uses more time and power).
    //
    console.log('scanning...');
    noble.startScanning([serviceUUID], false);
  } else {
    noble.stopScanning();
  }
})
noble.on('discover', function (peripheral) {
  console.log('find peripheral: ' + peripheral);
  peripheral.connect(function (err) {
    console.log('connect to peripheral: ' + peripheral);
    
    peripheral.discoverSomeServicesAndCharacteristics([], [], function (err, services, characteristics) {
      console.log('services find: ' + services);
          console.log('services find: ' + characteristics);

  });
    
    
    /*peripheral.discoverServices([serviceUUID], function (err, services) {
      console.log('services find: ' + services);
      services.discoverCharacteristics([], function (err, characteristics) {
        console.log('this characteristics: ' + characteristics);
      });
    });*/



  });
});

/*
          services.discoverCharacteristics([characteristicUUID], function (err, characteristics) {
                          console.log('this characteristics: ' + characteristics);
               characteristics.on('read', function(data, isNotification) {
            console.log('Our pizza is ready!');
              var result = data.readUInt8(0);
              console.log(result);
          });
            });
            */