const noble = require('noble');                     //bluetooth 수신부(Central) 모듈

console.log('bluetooth module OK');


const serviceUUIDs = ['bbb0'];                      //환자 식별기기의 bluetooth 서비스 uuid
const characteristicUUIDs = ['bbb1'];               //환자 식별기기의 데이터 전송 서비스 uuid

let IDDCharacteristic = null;                       //블루투스 서비스 객체 저장

module.exports = {
 ID : '',

//IDD 기기 탐색 기능 모듈화
 searchIDD : function () {
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

    // 데이터 전달은 기능에 맞춰 재 개편 예정..
    //connectAndSetUp(peripheral);
  });

  /*
  function connectAndSetUp(peripheral) {
    peripheral.connect(function (error) {
     // peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, onServicesAndCharacteristicsDiscovered);
    });

  }

  function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {
    console.log('find service');
    IDDCharacteristic = characteristics[0];
    IDDCharacteristic.on('data', function (data, isNotification) {
      let celsius = data.readFloatLE(0);
      value = celsius.toFixed(1);
      console.log('Temperature is', celsius.toFixed(1));
    });
    IDDCharacteristic.subscribe(); // ignore callback
    IDDCharacteristic.read();      // ignore callback
  }*/
}
}
