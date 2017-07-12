// Connect to Thermometer Service 0xBBB0
// and display notification for temperature changes
var noble = require('noble');

var count = 0;

const serviceUUID = '52e840b0-66a2-11e7-907b-a6006ad3dba0'; // default: [] => all
const characteristicUUID = '49991a70-66a2-11e7-907b-a6006ad3dba0'; // default: [] => all

var IDDService = null;
var IDDCharacteristic = null;

noble.on('stateChange', function (state) {

  if (state === 'poweredOn') {
  console.log('sacnning..');
    noble.startScanning(); // particular UUID's
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function (peripheral) {

  if (peripheral.advertisement.localName == 'IDD') {
    noble.stopScanning();
    peripheral.connect(function (error) {
      console.log('connected to peripheral: ' + peripheral.advertisement);

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
  } else { console.log(peripheral.advertisement.localName + '  sorry, not you.' + peripheral.uuid); }
});

