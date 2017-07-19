const noble = require('noble');                     //bluetooth 수신부(Central) 모듈

console.log('bluetooth module OK');


const serviceUUIDs = ['bbb0'];                      //환자 식별기기의 bluetooth 서비스 uuid
const characteristicUUIDs = ['bbb1'];               //환자 식별기기의 데이터 전송 서비스 uuid

let IDDCharacteristic = null;                       //블루투스 서비스 객체 저장


let ID = 'noname';
let try_count = 0;
let step_count = 0;


    function connectAndSetUp(peripheral) {
      peripheral.connect(function (error) {
       peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, onServicesAndCharacteristicsDiscovered);
      });
    }
  
    function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {
      console.log('find service');
      console.log(characteristics);
      IDDCharacteristic = characteristics[0];
      IDDCharacteristic.on('data', function (data, isNotification) {
        console.log(data, isNotification);
       // let value = data.readFloatLE(0);
       // step_count = value.toFixed(1);
       // console.log('Temperature is', value.toFixed(1));
      });
      IDDCharacteristic.subscribe(); // ignore callback
      IDDCharacteristic.read();      // ignore callback
    }

module.exports = {
  //IDD 기기 탐색 기능 모듈화2
  startSearch: function () {
    this.try_count++;
    console.log(noble.state);                                                  //noble 모듈의 상태(noble.status)가 'poweredOn'상태여야만 탐색이 가능하다.
    console.log('Start scanning..');
    noble.startScanning(['bbb0', 'B6FD7210-32D4-4427-ACA7-99DF89E10380']);     //bbb0(서비스 uuid)를 탐색함. 뒤는 bbb0의 128bit형태의 uuid
    noble.on('scanStart', function (state) {
      console.log(noble.state);                                                //탐색을 정말 수행하고 있는지에 대한 로그
    });

    //기기 탐색 완료시 수행되는 함수. 기기 이름을 value에 저장함.
    noble.on('discover', function (peripheral) {
      console.log('Discovered', peripheral.advertisement.localName, peripheral.address);
      ID = peripheral.advertisement.localName;

      // 데이터 전달
      connectAndSetUp(peripheral);
    });

    
  },
  stopSearch: function () {
    noble.stopScanning();
  },

  getSearchedID: function(callback){
      callback(ID);
  },

  getTryCount: function(callback){
      callback(try_count);
  },

  getStepCount: function(callback){
    callback(ID, step_count);
  }

}
