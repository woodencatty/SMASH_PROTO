//APD

var noble = require('noble');
var IDDUuid = '0011';
var IDDCharacteristic = '00110001';


noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    //
    // Once the BLE radio has been powered on, it is possible
    // to begin scanning for services. Pass an empty array to
    // scan for all services (uses more time and power).
    //
    console.log('scanning...');
    noble.startScanning([IDDUuid], false);
  }
  else {
    noble.stopScanning();
  }
})

var IDDService = null;
var IDDCharacteristic = null
noble.on('discover', function(peripheral) {
  // we found a peripheral, stop scanning
  noble.stopScanning();
  //
  // The advertisment data contains a name, power level (if available),
  // certain advertised service uuids, as well as manufacturer data,
  // which could be formatted as an iBeacon.
  //
  console.log('found peripheral:', peripheral.advertisement);
  //
  // Once the peripheral has been discovered, then connect to it.
  //
  peripheral.connect(function(err) {
    //
    // Once the peripheral has been connected, then discover the
    // services and characteristics of interest.
    //
    peripheral.discoverServices([IDDUuid], function(err, services) {
      services.forEach(function(service) {
        //
        // This must be the service we were looking for.
        //
        console.log('found service:', service.uuid);

        //
        // So, discover its characteristics.
        //
        service.discoverCharacteristics([], function(err, characteristics) {

          characteristics.forEach(function(characteristic) {
            //
            // Loop through each characteristic and match them to the
            // UUIDs that we know about.
            //
            console.log('found characteristic:', characteristic.uuid);
            IDDCharacteristic = characteristic;
          })

          //
          // Check to see if we found all of our characteristics.
          //

            //
            // We did, so bake a pizza!
            //
            getData();
          
        })
      })
    })
  })
})

function getData() {
          IDDCharacteristic.on('read', function(data, isNotification) {
            console.log(data);
          });
}