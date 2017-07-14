const bleno = require('bleno');           //Bluetooth 수신부(peripheral) 모듈
const util = require('util');             //유틸리티 모듈. inherits함수를 사용하기 위함.

const move = require('./calculator.js')   //운동량 측정 모듈 import

//bluetooth 구성 변수들 정의
var Characteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;
var PrimaryService = bleno.PrimaryService;

//센서값, ID값 초기화
var value = 10.11;
var ID = 'P0001'

//주기적으로 운동량값을 저장함(임시)
this.valueInterval = setInterval(function () {
  MoveCallback = function (MoveValue) {
      value = MoveValue;
    }

       move.getMoveValue(MoveCallback);
       console.log('changed to :' + value);

  }.bind(this), 2000);

//bluetooth 상세 서비스 객체 정의
var IDDCharacteristic = function () {
  IDDCharacteristic.super_.call(this, {
    uuid: 'bbb1',
    properties: ['read', 'notify'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'IDD Device'
      })]
  });
};
util.inherits(IDDCharacteristic, Characteristic);

//Bluetooth 서비스 객체 정의
var IDDService = new PrimaryService({
  uuid: 'bbb0',
  characteristics: [
    new IDDCharacteristic()
  ]
});

//Bluetooth Central모듈에서 Subscribe 요청을 보냈을 때의 경우
IDDCharacteristic.prototype.onSubscribe = function (maxValueSize, updateValueCallback) {
  console.log('IDDCharacteristic subscribe');

//주기적으로 데이터를 전송함.
  this.changeInterval = setInterval(function () {
          var data = new Buffer(4);
          data.writeFloatLE(value, 0);
          
          console.log('sending : ' + value);
          updateValueCallback(data);

  }.bind(this), 500);
};

//Bluetooth Central모듈에서 unSubscribe 요청을 보냈을 때의 경우
IDDCharacteristic.prototype.onUnsubscribe = function () {
  console.log('IDDCharacteristic unsubscribe');

//데이터 전송 주기를 해제함.
  if (this.changeInterval) {
    clearInterval(this.changeInterval);
    this.changeInterval = null;
  }
};

//Bluetooth Central모듈에서 Read 요청을 보냈을 때의 경우
IDDCharacteristic.prototype.onReadRequest = function (offset, callback) {
    //데이터 전송
          var data = new Buffer(4);
          data.writeFloatLE(value, 0);
    callback(Characteristic.RESULT_SUCCESS, data);
};

//Bluetooth 탐색 기능 실행 모듈화.
module.exports.AdvertisingDevice = function () {
bleno.on('stateChange', function (state) {
  console.log('on -> stateChange: ' + state);
  if (state === 'poweredOn') {
    bleno.startAdvertising(ID, [IDDService.uuid]);
  } else {
    bleno.stopAdvertising();
  }
});
};
bleno.on('advertisingStart', function (error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
  if (!error) {
    bleno.setServices([IDDService]);
  }
});
