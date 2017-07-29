var bleno = require('bleno'); // Bluetooth pheriphal 모듈
var fs = require('fs'); //파일 로드를 위한 함수

const acturator = require('./acturator.js');


let name = 'P0001';
let serviceUuids = ['fff0']


module.exports = {
  //Advertising 함수
  startAdvertising: (deviceName,  bluetoothDescription, WalkDataFileName, fileFormat) => {
var PrimaryService = bleno.PrimaryService;
var Characteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var primaryService = new PrimaryService({
  uuid: 'fff0', // or 'fff0' for 16-bit
  characteristics: [
    new Characteristic({
      uuid: 'fff1', // or 'fff1' for 16-bit
      properties: ['notify'], // can be a combination of 'read', 'write', 'writeWithoutResponse', 'notify', 'indicate'  
      descriptor: [
        new Descriptor({
          uuid: '2901',
          value: bluetoothDescription // static value, must be of type Buffer or string if set		
        })
      ],
      onReadRequest: function (offset, callback) {
        var data = new Buffer(' ');
        callback(data);
      },
      onSubscribe: function (maxValueSize, updateValueCallback) {
        fs.readFile(WalkDataFileName, fileFormat, function (err, data) {
          //저장한 활동량 로그에서 데이터를 읽어 전송한다.
          var sending = new Buffer(data);
          updateValueCallback(sending);
        });
      },
      onUnsubscribe: function () {
      }
    })
  ]
});

    bleno.on('stateChange', function (state) {
      bleno.setServices(primaryService);
      if (state === 'poweredOn') {
        bleno.startAdvertising(deviceName, serviceUuids, (error) => {
        });
      } else {
        bleno.stopAdvertising();
      }
    });
    bleno.on('accept', (clientAddress) => {
     acturator.piezo_connected();
     acturator.led_connected();
    });
    bleno.on('disconnect', (clientAddress) => {
    });
    bleno.on('rssiUpdate', (rssi) => {
    });
  }
}