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
        var advertisement = peripheral.advertisement;
 console.log(peripheral.advertisement + '\n' +peripheral.address + '\n' +advertisement.localName + '\n' + advertisement.manufacturerData + '\n' +advertisement.serviceData + '\n\n\n'); 
 if(peripheral.advertisement == '201333558'){
         noble.stopScanning();
         console.log('jobs done');
 }
});