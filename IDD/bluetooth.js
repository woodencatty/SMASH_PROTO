var bleno = require('bleno'); // Bluetooth pheriphal 모듈
var fs = require('fs'); //파일 로드를 위한 함수


//ID : P0001
let advertiseName = 'P0001';
let serviceUuids = ['fff0']

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
          value: 'IDD' // static value, must be of type Buffer or string if set		
        })
      ],
      onReadRequest: function (offset, callback) {
        var data = new Buffer('Readtest');
        callback(data);
      },
      onSubscribe: function (maxValueSize, updateValueCallback) {
        fs.readFile('./steps.log', 'utf8', function (err, data) {
          //저장한 활동량 로그에서 데이터를 읽어 전송한다.
          var sending = new Buffer(data);
          updateValueCallback(sending);
          console.log('send data');
        });
      },
      onUnsubscribe: function () {
        console.log('onUnsubscribe')
      }
    })
  ]
});

module.exports = {
  //Advertising 함수
  startAdvertising: () => {
    bleno.on('stateChange', function (state) {
      console.log('on -> stateChange: ' + state);

      bleno.setServices(primaryService);

      if (state === 'poweredOn') {
        bleno.startAdvertising(advertiseName, serviceUuids, (error) => {
          console.log(error);
        });
      } else {
        bleno.stopAdvertising();
      }
    });

    bleno.on('accept', (clientAddress) => {
      console.log('connected:' + clientAddress);
    });

    bleno.on('disconnect', (clientAddress) => {
      console.log('disconnected:' + clientAddress);
    });

    bleno.on('rssiUpdate', (rssi) => {
      console.log('rssi update to : ' + rssi);
    });
  },

  setName: (deviceName)=>{
    advertiseName = deviceName;
  }
}