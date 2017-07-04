//APD
var async = require('async');
var noble = require('noble');

var peripheralIdOrAddress = process.argv[2];

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
    console.log('searching');
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
 console.log('peripheral with ID ' + peripheral.id + ' found'); 
});