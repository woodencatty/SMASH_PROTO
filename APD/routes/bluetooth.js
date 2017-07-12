// Connect to Thermometer Service 0xBBB0
// and display notification for temperature changes
var noble = require('noble');

var count = 0;

const serviceUUID = '52e840b0-66a2-11e7-907b-a6006ad3dba0'; // default: [] => all
const characteristicUUID = '49991a70-66a2-11e7-907b-a6006ad3dba0'; // default: [] => all

var IDDService = null;
var IDDCharacteristic = null;
  console.log('its on');

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    //
    // Once the BLE radio has been powered on, it is possible
    // to begin scanning for services. Pass an empty array to
    // scan for all services (uses more time and power).
    //
    console.log('scanning...');
    noble.startScanning();
  }
  else {
    noble.stopScanning();
  }
})

noble.on('discover', function (peripheral) {
  
      console.log('connected to peripheral: ' + peripheral.advertisement.localName);
    peripheral.connect(function (error) {

      peripheral.discoverServices([serviceUUID], function (err, services) {
        services.forEach(function (service) {
          //
          // This must be the service we were looking for.
          //
          console.log('found service:', service.uuid);
          if(service.uuid == serviceUUID){
            IDDService = service
            console.log('connected to' + service.uuid)
          }

          IDDService.discoverCharacteristics([], function (err, characteristics) {
            characteristics.forEach(function (characteristic) {
              //
              // Loop through each characteristic and match them to the
              // UUIDs that we know about.
              //
              console.log('found characteristic:', characteristic.uuid);
              if (characteristic.uuid == characteristicUUID) {
                IDDCharacteristic = characteristic;
                console.log('connected to' + characteristic.uuid)
              }
            });
            
IDDCharacteristic.on('data', function (data, isNotification) {
  console.log('IDD level is now: ', data.readUInt8(0));
});

// to enable notify
IDDCharacteristic.subscribe(function (error) {
  console.log('battery level notification on');
});

          });
        });
      });
    });
});

