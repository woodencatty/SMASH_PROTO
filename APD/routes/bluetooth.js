// Connect to Thermometer Service 0xBBB0
// and display notification for temperature changes
var noble = require('noble');

var count = 0;


module.exports.startScan = function () {

noble.on('discover', function(peripheral) {
  peripheral.connect(function(error) {
    console.log('connected to peripheral: ' + peripheral.uuid);
    peripheral.discoverServices(['bbb0'], function(error, services) {
      var IDDService = services[0];
      console.log('discoveredIDD service');

      IDDService.discoverCharacteristics(['bbb1'], function(error, characteristics) {
        var IDDCharacteristic = characteristics[0];
        console.log('discovered IDD Level characteristic');

      });
    });
  });
});

};



module.exports.getID = function (callback) {
  console.log('getting ID')

        IDDCharacteristic.on('data', function(data, isNotification) {
          console.log('Data : ', data.readUInt8(0));
          callback(data.readUInt8(0));

        });

        IDDCharacteristic.read(function(error) {
          console.log('Reading ID');
        });
};


module.exports.getAccelValue = function (callback) {
  console.log('subscribe')

        IDDCharacteristic.on('data', function(data, isNotification) {
          console.log('Data : ', data.readUInt8(0));
          callback(data.readUInt8(0));
        });

        // to enable notify
        IDDCharacteristic.subscribe(function(error) {
          console.log('Accel value notification on');
        });

        
};
